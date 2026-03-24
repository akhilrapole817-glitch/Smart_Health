from rest_framework import generics, viewsets, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.contrib.auth.models import User
from .models import Medicine
from .serializers import (
    UserSerializer, ChangePasswordSerializer, 
    PasswordResetRequestSerializer, PasswordResetConfirmSerializer,
    MedicineSerializer
)
from datetime import date

class HomeView(APIView):
    permission_classes = [AllowAny]
    def get(self, request):
        return Response({"message": "Welcome to Smart Health Assistant"})

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = [AllowAny]
    serializer_class = UserSerializer

class ChangePasswordView(APIView):
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        serializer = ChangePasswordSerializer(data=request.data)
        if serializer.is_valid():
            user = request.user
            if not user.check_password(serializer.data.get("old_password")):
                return Response({"old_password": ["Wrong password."]}, status=status.HTTP_400_BAD_REQUEST)
            user.set_password(serializer.data.get("new_password"))
            user.save()
            return Response({"message": "Password updated successfully."})
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class RequestPasswordResetView(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request):
        serializer = PasswordResetRequestSerializer(data=request.data)
        if serializer.is_valid():
            # In a real app, send an email with a token here.
            return Response({"message": "Password reset token sent to email (simulated).", "token": "dummy-token-123"})
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class PasswordResetConfirmView(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request):
        serializer = PasswordResetConfirmSerializer(data=request.data)
        if serializer.is_valid():
            # In a real app, verify the token here.
            if serializer.data.get("token") != "dummy-token-123":
                 return Response({"error": "Invalid token"}, status=status.HTTP_400_BAD_REQUEST)
            # Would normally lookup user by token
            return Response({"message": "Password reset successful."})
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class MedicineViewSet(viewsets.ModelViewSet):
    serializer_class = MedicineSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Medicine.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class ReminderView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        today = date.today()
        medicines = Medicine.objects.filter(
            user=request.user, 
            start_date__lte=today
        ).exclude(end_date__lt=today)
        
        reminders = []
        for medicine in medicines:
            reminders.append({
                "medicine": medicine.name,
                "dosage": medicine.dosage,
                "schedule": medicine.schedule,
                "requires_food": medicine.requires_food,
                "message": f"Time to take {medicine.name} ({medicine.dosage}) - Schedule: {medicine.schedule}"
            })
        
        return Response({"reminders": reminders})

class CheckFoodView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        food = request.data.get("food", "").lower()
        if not food:
            return Response({"error": "Food is required"}, status=status.HTTP_400_BAD_REQUEST)
        
        medicines = Medicine.objects.filter(user=request.user)
        med_names = [m.name.lower() for m in medicines]
        
        # Rule-based MVP
        if "grapefruit" in food and any("statin" in m for m in med_names):
             return Response({
                 "food": food,
                 "status": "unsafe",
                 "explanation": "Grapefruit can block the action of enzymes needed to break down statins, leading to toxicity."
             })
             
        if "alcohol" in food and any(med in ["metronidazole", "acetaminophen"] for med in med_names):
             return Response({
                 "food": food,
                 "status": "unsafe",
                 "explanation": "Alcohol combined with certain medicines can cause severe liver damage or nausea."
             })

        return Response({
            "food": food,
            "status": "safe",
            "explanation": "No known interactions with your current medicines."
        })

class CheckSymptomsView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        symptom = request.data.get("symptom", "").lower()
        if not symptom:
             return Response({"error": "Symptom is required"}, status=status.HTTP_400_BAD_REQUEST)
             
        medicines = Medicine.objects.filter(user=request.user)
        med_names = [m.name.lower() for m in medicines]
        
        response_data = {
            "symptom": symptom,
            "safe_options": [],
            "warnings": [],
            "alternative_suggestions": []
        }
        
        if "headache" in symptom:
            response_data["alternative_suggestions"] = ["Rest in a dark, quiet room", "Stay hydrated", "Apply a cold compress to your forehead or neck", "Gentle neck massage"]
            if any("nsaid" in m or "ibuprofen" in m for m in med_names):
                response_data["warnings"].append("You are already taking an NSAID. Do not take more without consulting a doctor.")
            else:
                response_data["safe_options"].append("Acetaminophen (if no liver issues)")
                
        elif "nausea" in symptom:
            response_data["alternative_suggestions"] = ["Drink clear ice-cold drinks", "Eat light, bland foods (like saltine crackers or plain bread)", "Avoid fried, greasy, or sweet foods", "Ginger tea or ginger candies"]
            if any("antibiotic" in m for m in med_names):
                response_data["warnings"].append("Your antibiotic might be causing nausea. Ensure you take it with food if allowed.")
        else:
             response_data["alternative_suggestions"] = ["Rest", "Stay hydrated with water or electrolyte fluids", "Monitor your symptoms closely"]
             response_data["safe_options"].append("Consult a healthcare provider for specific advice based on your full medical history.")
             
        return Response(response_data)
