from django.urls import path
from api.views import NewsAPIView, RegisterAPIView, LoginAPIView, FetchNewslettersAPIView, GetTopicNewslettersAPIView, RenderNewsletterAPIView, SendNewsletterAPIView, LatestNewslettersAPIView, SubscriptionAPIView


urlpatterns = [
    path("news-gen/", NewsAPIView.as_view(), name="news-gen"),
    path("signup/", RegisterAPIView.as_view(), name="signup"),
    path("login/", LoginAPIView.as_view(), name="login"),
    path('fetch-newsletters/', FetchNewslettersAPIView.as_view(), name='fetch-newsletters'),
    path('newsletters/<str:topic_name>/', GetTopicNewslettersAPIView.as_view(), name='get-topic-newsletters'),
    path('render-newsletter/<str:filename>/', RenderNewsletterAPIView.as_view(), name='render-newsletter'),
    path('send-newsletter/', SendNewsletterAPIView.as_view(), name='send-newsletter'),
    path('latest-newsletters/', LatestNewslettersAPIView.as_view(), name='latest-newsletters'),
    path('subscribe/', SubscriptionAPIView.as_view(), name='subscribe'),

]
