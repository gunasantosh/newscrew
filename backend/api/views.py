from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.exceptions import ValidationError
from newsletter.crew import start_crew
from .serializers import UserSerializer, NewsletterSerializer, SubscriptionSerializer
from .models import Newsletter, Subscription
from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from django.conf import settings
from django.db.models import OuterRef, Subquery, Max

from .models import Newsletter
import os
import datetime
import markdown
from django.template.loader import render_to_string
from django.shortcuts import get_object_or_404
from django.core.mail import send_mail, EmailMultiAlternatives
from django.template.loader import render_to_string
from django.utils.html import strip_tags

from django.utils.dateparse import parse_datetime

from django.utils.http import urlsafe_base64_decode
from rest_framework.permissions import AllowAny
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes, force_str
from rest_framework import status

OUTPUTS_DIR = os.path.join(settings.BASE_DIR, 'output')


# ==================================================================================================================================
################################################ Authentication Views ##############################################################


class RegisterAPIView(APIView):
    
    def post(self, request):
        serializer = UserSerializer(data=request.data)

        if serializer.is_valid():
            if User.objects.filter(username=request.data['username']).exists():
                return Response({'username': ['This username is already taken.']}, status=400)
            
            if User.objects.filter(email=request.data['email']).exists():
                return Response({'email': ['This email is already registered.']}, status=400)

            user = serializer.save()
            user.set_password(request.data['password'])  # Hashes password correctly
            user.save()
            
            token, _ = Token.objects.get_or_create(user=user)  # Ensures one token per user
            
            return Response({'token': token.key, "user": serializer.data}, status=201)
        
        return Response(serializer.errors, status=400)

class LoginAPIView(APIView):
    
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')


        if not username or not password:
            return Response({'message': 'Both Username and password are REQUIRED'}, status=400)

        user = User.objects.filter(username=username).first()

        if not user:
            return Response({'message': 'User not found'}, status=400)

        if not user.check_password(password):
            return Response({'message': 'Incorrect Password. try again'}, status=400)

        token, _ = Token.objects.get_or_create(user=user)

        return Response({'token': token.key, 'user': UserSerializer(user).data}, status=200)


class PasswordResetRequestView(APIView):
    def post(self, request):
        email = request.data.get("email")
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({"error": "User with this email does not exist"}, status=status.HTTP_404_NOT_FOUND)

        uid = urlsafe_base64_encode(force_bytes(user.pk))
        token = default_token_generator.make_token(user)
        reset_link = f"http://localhost:5173/reset-password/{uid}/{token}"  # Change frontend URL accordingly

        send_mail(
            "Password Reset Request",
            f"Click the link to reset your password: {reset_link}",
            "newscrew247@gmail.com",
            [email],
            fail_silently=False,
        )

        return Response({"message": "Password reset link sent to email"}, status=status.HTTP_200_OK)


class PasswordResetConfirmView(APIView):
    permission_classes = [AllowAny]

    def post(self, request, uidb64, token):
        try:
            uid = force_str(urlsafe_base64_decode(uidb64))
            user = User.objects.get(pk=uid)
        except (User.DoesNotExist, ValueError, TypeError):
            return Response({"error": "Invalid token or user does not exist"}, status=status.HTTP_400_BAD_REQUEST)

        if not default_token_generator.check_token(user, token):
            return Response({"error": "Invalid or expired token"}, status=status.HTTP_400_BAD_REQUEST)

        new_password = request.data.get("password")
        if not new_password:
            return Response({"error": "Password is required"}, status=status.HTTP_400_BAD_REQUEST)

        user.set_password(new_password)
        user.save()

        return Response({"message": "Password successfully reset"}, status=status.HTTP_200_OK)



# ==================================================================================================================================
################################################ User Profile Views ################################################################


# update use settings i.e topic
class UserSettingAPIView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        """Fetch the user's current topic"""
        user_email = request.user.email

        try:
            user_subscription = Subscription.objects.get(email=user_email)
            topic_filename = f"{user_subscription.topic.replace(' ', '_')}.md"
            total_topic_newsletters = Newsletter.objects.filter(filename=topic_filename).count()
            return Response({"topic": user_subscription.topic, 'total_articles': total_topic_newsletters}, status=200)
        except Subscription.DoesNotExist:
            return Response({"message": "No subscribed topic found."}, status=404)

    def post(self, request):
        """Update the user's topic"""
        user_email = request.user.email
        new_topic = request.data.get("topic")

        if not new_topic:
            return Response({"error": "No topic provided"}, status=400)

        # Update or create the subscription entry
        subscription, created = Subscription.objects.update_or_create(
            email=user_email,
            defaults={"topic": new_topic}
        )

        return Response({"message": "Topic updated successfully"}, status=200)



# View user Profile
class UserProfileView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user  # Retrieved from the token

        return Response({
            "id": user.id,
            "email": user.email,
            "first_name": user.first_name,
            "last_name": user.last_name,
            "username": user.username,
            "is_staff": user.is_staff,
            "date_joined": user.date_joined,
        })



# ==================================================================================================================================
################################################ Newsletter Views ##################################################################


# Generate Newsletters
class NewsAPIView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response({'message': 'News API View Endpoint'}, status=200)
    
    def post(self, request):
        topic = request.data.get('topic')

        if not topic:
            raise ValidationError('Topic not provided')

        try:
            # Log before calling the run function
            print(f"Calling run with topic: {topic}")
            result = start_crew(topic)  
            print(f"Result from run: {type(result)}")

            return Response({'message': f'Newsletter generated for topic: {topic}'}, status=200)
        except Exception as e:
            print(f"Error: {str(e)}")
            raise ValidationError(f"Error in processing: {str(e)}")


# Upload Newsletters from output folder to Database
class UploadNewslettersAPIView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if not os.path.exists(OUTPUTS_DIR):
            return Response({"error": "Outputs folder not found"}, status=404)

        newsletters = []

        for filename in os.listdir(OUTPUTS_DIR):
            if filename.endswith(".md"):
                file_path = os.path.join(OUTPUTS_DIR, filename)
                
                with open(file_path, "r", encoding="utf-8") as file:
                    content = file.read()

                file_modified_time = os.path.getmtime(file_path)
                formatted_date = datetime.datetime.fromtimestamp(file_modified_time)

                # Check if newsletter already exists before saving
                newsletter_exists = Newsletter.objects.filter(filename=filename, created_at=formatted_date).exists()

                if not newsletter_exists:
                    serializer = NewsletterSerializer(data={
                        "filename": filename,
                        "content": content,
                        "created_at": formatted_date
                    })

                    if serializer.is_valid():
                        serializer.save()  # Create a new record
                        newsletters.append(serializer.data)
                    else:
                        return Response(serializer.errors, status=400)

        return Response({"newsletters": newsletters}, status=200)


# ==================================================================================================================================
################################################ fetch Views ##################################################################

# Fetch Topics from Database
class FetchTopicsAPIView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # Fetch unique topics from the Newsletter model
        topics = Newsletter.objects.values_list("filename", flat=True).distinct()

        if not topics:
            return Response({"error": "No topics found"}, status=404)

        return Response({"topics": list(topics)}, status=200)

# Fetch Newsletters by Topic
# url: http://localhost:5173/newsletters/<topic_name>/
class GetTopicNewslettersAPIView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request, topic_name):
        newsletters = Newsletter.objects.filter(filename=topic_name).order_by('-created_at')

        if not newsletters.exists():
            return Response({"error": "No newsletters found for this topic"}, status=404)

        serializer = NewsletterSerializer(newsletters, many=True)
        return Response({"newsletters": serializer.data}, status=200)

# Fetch Newsletters by User
class UserNewslettersAPIView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # Get the authenticated user's email
        user_email = request.user.email

        # Fetch the single topic the user is subscribed to (assuming one topic per user)
        try:
            subscribed_topic = Subscription.objects.get(email=user_email).topic
        except Subscription.DoesNotExist:
            return Response({"message": "No subscribed topic found."}, status=404)

        # Convert topic name to filename format
        topic_filename = f"{subscribed_topic.replace(' ', '_')}.md"

        # Fetch newsletters related to the user's subscribed topic
        newsletters = Newsletter.objects.filter(filename=topic_filename).order_by('-created_at')

        if not newsletters.exists():
            return Response({"message": "No newsletters found for this topic."}, status=404)

        # Serialize the newsletters
        serializer = NewsletterSerializer(newsletters, many=True)

        return Response({"Usernewsletters": serializer.data}, status=200)


# ==================================================================================================================================
################################################ Email Views #######################################################################

class SendLatestNewsletterAPIView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            latest_newsletter = Newsletter.objects.latest('created_at')
        except Newsletter.DoesNotExist:
            return Response({"error": "No newsletters found"}, status=404)

        recipient_list = list(Subscription.objects.values_list('email', flat=True))

        if not recipient_list:
            return Response({"error": "No subscribed users found"}, status=400)

        # Convert Markdown to HTML
        newsletter_html = markdown.markdown(latest_newsletter.content)
        text_content = strip_tags(newsletter_html).strip()  # Extract plain text

        subject = "NewsCrew Weekly Newsletter"

        # Render HTML email template
        html_content = render_to_string("newsletter_email_template.html", {
            "newsletter_content": newsletter_html
        })

        # Create an email object
        email = EmailMultiAlternatives(
            subject=subject,
            body=text_content,  # Plain text version
            from_email=settings.EMAIL_HOST_USER,
            to=[settings.EMAIL_HOST_USER],  # Set your own email in 'To' to avoid exposure
            bcc=recipient_list,  # Hides recipients
        )
        email.attach_alternative(html_content, "text/html")  # Attach HTML version
        email.send()

        return Response({
            "message": "Latest newsletter sent successfully!",
            "sent_count": len(recipient_list)
        }, status=200)


# Send Newsletter by Filename
class SendNewsletterAPIView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        filename = request.data.get('filename')

        if not filename:
            return Response({"error": "Filename is required"}, status=400)

        # ✅ Fetch recipients correctly from Subscription model
        recipient_list = list(Subscription.objects.values_list('email', flat=True))

        if not recipient_list:
            return Response({"error": "No recipients found"}, status=400)

        try:
            # ✅ Fetch the latest newsletter with the given filename
            newsletter = Newsletter.objects.filter(filename=filename).latest('created_at')
        except Newsletter.DoesNotExist:
            return Response({"error": "Newsletter not found"}, status=404)

        # ✅ Convert markdown content to HTML
        html_content = markdown.markdown(newsletter.content)
        text_content = strip_tags(html_content)  # Plain text version

        subject = f"Newsletter: {newsletter.filename.replace('.md', '')}"

        # ✅ Send email
        send_mail(
            subject,
            text_content,
            settings.EMAIL_HOST_USER,
            recipient_list,
            html_message=html_content,
        )

        return Response({"message": "Newsletter sent successfully!", "sent_to": recipient_list}, status=200)
    

# ==================================================================================================================================
################################################ Dashboard Views ####################################################################

# Sends dashboard data
class DashboardAPIView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        total_newsletters = Newsletter.objects.count()
        total_subscriptions = Subscription.objects.count()
        all_users_table = User.objects.all().values('username', 'email', 'date_joined', 'last_login')
        all_subs_table = Subscription.objects.all().values('email', 'topic')
        articles = Newsletter.objects.all().values('filename','content','created_at')

        return Response({
            "total_newsletters": total_newsletters,
            "total_subscriptions": total_subscriptions,
            "all_users": all_users_table,
            "all_subscriptions": all_subs_table,
            "articles": articles
        }, status=200)
    

    def delete(self, request, filename):
        """
        Delete a specific article using filename and created_at timestamp.
        """
        created_at_str = request.query_params.get("created_at")  # Get created_at from request
        if not created_at_str:
            return Response({"error": "created_at timestamp is required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            created_at = parse_datetime(created_at_str)  # Convert string to datetime
            if created_at is None:
                raise ValueError("Invalid datetime format")
        except ValueError:
            return Response({"error": "Invalid created_at format. Use ISO 8601 format."}, status=status.HTTP_400_BAD_REQUEST)

        article = get_object_or_404(Newsletter, filename=filename, created_at=created_at)  # Fetch unique article
        article.delete()  # Delete it

        return Response({"message": "Article deleted successfully"}, status=status.HTTP_204_NO_CONTENT)

    

# ==================================================================================================================================
################################################ Misc Views ########################################################################


class RenderNewsletterAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, filename):
        newsletter = get_object_or_404(Newsletter, filename=filename)
        
        # Convert markdown to HTML
        html_content = markdown.markdown(newsletter.content)

        return Response({"html_content": html_content}, status=200)



class LandingPageNewslettersAPIView(APIView):

    def get(self, request):
        # Subquery to fetch the latest `created_at` for each topic
        latest_dates = (
            Newsletter.objects.filter(filename=OuterRef('filename'))
            .order_by('-created_at')  # Sort in descending order (latest first)
            .values('created_at')[:1]  # Pick the first (latest) entry
        )

        # Query the latest newsletters per topic
        latest_newsletters = Newsletter.objects.filter(created_at=Subquery(latest_dates))

        serializer = NewsletterSerializer(latest_newsletters, many=True)
        return Response({"latest_newsletters": serializer.data}, status=200)


class SubscriptionAPIView(APIView):
    def post(self, request):
        serializer = SubscriptionSerializer(data=request.data)

        if serializer.is_valid():
            email = serializer.validated_data['email']
            topic = serializer.validated_data['topic']

            if Subscription.objects.filter(email=email).exists():
                return Response({'message': 'Email already subscribed'}, status=400)

            serializer.save()
            return Response({'message': f'Subscribed successfully with {email} & {topic}'}, status=201)
        
        return Response(serializer.errors, status=400)
    



