from django.db import models
from django.contrib.auth.models import User

class Task(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="tasks")

    title = models.CharField(max_length=200)
    course = models.CharField(max_length=100)  # v1: string course name/code
    due_date = models.DateField()

    percent_complete = models.PositiveSmallIntegerField(default=0)

    status = models.CharField(
        max_length=20,
        choices=[
            ("pending", "Pending"),
            ("completed", "Completed"),
        ],
        default="pending",
    )

    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
    
        if self.percent_complete >= 100:
            self.percent_complete = 100
            self.status = "completed"
        else:
            if self.status == "completed" and self.percent_complete < 100:
                self.status = "pending"
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title
