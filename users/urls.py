from django.urls import path

from users.api import (
    ChangePasswordView,
    ForgotPassword,
    RegisterView,
    ResetPasswordView,
)

urlpatterns = [
    path("register/", RegisterView.as_view(), name="register"),
    path("forgot-password/", ForgotPassword.as_view(), name="forgot-password"),
    path("reset-password/", ResetPasswordView.as_view(), name="reset-password"),
    path("change-password", ChangePasswordView.as_view(), name="change-password"),
]
