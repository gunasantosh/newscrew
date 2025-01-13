from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.exceptions import ValidationError
from newsletter.crew import start_crew
from .serializers import UserSerializer
from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated

class RegisterAPIView(APIView):
    
    def post(self, request):
        serializer = UserSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save()
            user = User.objects.get(username=request.data['username'])
            user.set_password(request.data['password'])
            user.save()
            token = Token.objects.create(user=user)
            return Response({'token': token.key, "user":serializer.data }, status=201)
        
        return Response(serializer.errors, status=400)

class LoginAPIView(APIView):
    
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')


        if not username or not password:
            raise ValidationError('Username and password required')

        user = User.objects.filter(username=username).first()

        if not user:
            raise ValidationError('User not found')

        if not user.check_password(password):
            raise ValidationError('Incorrect password')

        token, _ = Token.objects.get_or_create(user=user)

        return Response({'token': token.key, 'user': UserSerializer(user).data}, status=200)

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




# def kickoff_crew(job_id: str, topic: str):
#     print(f"Running crew for job: {job_id} with topic: {topic}")

# class RunCrewAPIView(APIView):
    
#     def post(self, request):
#         data = request.data

#         if not data:
#             raise ValidationError('No data provided')
        
#         job_id = str(uuid4())
#         topic = data.get('topic')

#         thread = Thread(target=kickoff_crew, args=(job_id, topic))
#         thread.start()

#         return Response({'job_id': job_id}, status=200)
    

    
    