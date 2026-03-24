from django.db import models
from django.contrib.auth.models import User

class Medicine(models.Model):
    SCHEDULE_CHOICES = [
        ('morning', 'Morning'),
        ('evening', 'Evening'),
        ('custom', 'Custom'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='medicines')
    name = models.CharField(max_length=255)
    dosage = models.CharField(max_length=100)
    schedule = models.CharField(max_length=50, choices=SCHEDULE_CHOICES)
    start_date = models.DateField()
    end_date = models.DateField(null=True, blank=True)
    requires_food = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.name} - {self.dosage}"
