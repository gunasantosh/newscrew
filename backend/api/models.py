from django.db import models
import datetime

class Newsletter(models.Model):
    filename = models.CharField(max_length=255)  # Topic name
    content = models.TextField()  # Stores large markdown content
    created_at = models.DateTimeField()  # Auto-generates timestamp

    class Meta:
        unique_together = ('filename', 'created_at')  # Prevents duplicate newsletters
        indexes = [
            models.Index(fields=['filename', 'created_at'])  # Optimized for fast queries
        ]

    def __str__(self):
        return f"{self.filename} - {self.created_at.strftime('%Y-%m-%d %H:%M:%S')}"  # Readable format


class Subscription(models.Model):
    email = models.EmailField()  # Allows multiple topic subscriptions per email
    topic = models.CharField(max_length=255)

    class Meta:
        unique_together = ('email', 'topic')  # Prevents duplicate subscriptions
        indexes = [
            models.Index(fields=['email', 'topic'])  # Faster lookup
        ]

    def __str__(self):
        return f"{self.email} subscribed to {self.topic}"
