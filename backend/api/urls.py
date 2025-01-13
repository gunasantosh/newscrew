from django.urls import path
from api.views import NewsAPIView, RegisterAPIView, LoginAPIView


urlpatterns = [
    path("news-gen/", NewsAPIView.as_view(), name="news-gen"),
    path("signup/", RegisterAPIView.as_view(), name="signup"),
    path("login/", LoginAPIView.as_view(), name="login"),
]
