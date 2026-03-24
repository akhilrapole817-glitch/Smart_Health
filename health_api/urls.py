from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework.authtoken.views import obtain_auth_token
from .views import (
    RegisterView, ChangePasswordView, RequestPasswordResetView, PasswordResetConfirmView,
    MedicineViewSet, ReminderView, CheckFoodView, CheckSymptomsView
)

router = DefaultRouter()
router.register(r'medicines', MedicineViewSet, basename='medicine')

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('auth/', obtain_auth_token, name='login'),
    path('change-password/', ChangePasswordView.as_view(), name='change_password'),
    path('request-password-reset/', RequestPasswordResetView.as_view(), name='request_password_reset'),
    path('password-reset-confirm/', PasswordResetConfirmView.as_view(), name='password_reset_confirm'),
    path('', include(router.urls)),
    path('reminders/', ReminderView.as_view(), name='reminders'),
    path('check-food/', CheckFoodView.as_view(), name='check_food'),
    path('check-symptoms/', CheckSymptomsView.as_view(), name='check_symptoms'),
]
