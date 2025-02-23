from django.urls import path
from api.views import (
    NewsAPIView, RegisterAPIView, LoginAPIView, FetchTopicsAPIView, 
    FetchNewslettersAPIView, LatestNewsletterAPIView, GetTopicNewslettersAPIView,
    RenderNewsletterAPIView, SendNewsletterAPIView, SubscriptionAPIView, DashboardAPIView,LatestNewslettersAPIView,
    UserNewslettersAPIView, UserSettingAPIView, PasswordResetRequestView, PasswordResetConfirmView,
    UserProfileView
)

urlpatterns = [
    path("news-gen/", NewsAPIView.as_view(), name="news-gen"),
    path("signup/", RegisterAPIView.as_view(), name="signup"),
    path("login/", LoginAPIView.as_view(), name="login"),
    path("fetch-newsletters/", FetchNewslettersAPIView.as_view(), name="fetch-newsletters"),
    path("newsletters/<str:topic_name>/", GetTopicNewslettersAPIView.as_view(), name="get-topic-newsletters"),
    path("render-newsletter/<str:filename>/", RenderNewsletterAPIView.as_view(), name="render-newsletter"),
    path("send-newsletter/", SendNewsletterAPIView.as_view(), name="send-newsletter"),
    path("latest-newsletter/", LatestNewsletterAPIView.as_view(), name="latest-newsletter"),
    path('latest-newsletters/', LatestNewslettersAPIView.as_view(), name='latest-newsletters'),
    path("subscribe/", SubscriptionAPIView.as_view(), name="subscribe"),
    path("dashboard/", DashboardAPIView.as_view(), name="dashboard"),
    path("fetch-topics/", FetchTopicsAPIView.as_view(), name="fetch-topics"),
    path("fetch-articles/", UserNewslettersAPIView.as_view(), name="fetch-articles"),
    path('update_user_topic/', UserSettingAPIView.as_view(), name='update_user_topic'),

    path('password-reset/', PasswordResetRequestView.as_view(), name='password-reset-request'),
    path('password-reset-confirm/<uidb64>/<token>/', PasswordResetConfirmView.as_view(), name='password-reset-confirm'),

    path('user/profile/', UserProfileView.as_view(), name='user-profile'),
]
