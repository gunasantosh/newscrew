from django.db import models

class Newsletter(models.Model):
    filename = models.CharField(max_length=255)  # Topic name
    content = models.TextField()  # Stores large markdown content
    created_at = models.DateTimeField()  # Stores the timestamp of generation

    class Meta:
        unique_together = ('filename', 'created_at')  # Enforces uniqueness on (filename, created_at)
        indexes = [
            models.Index(fields=['filename', 'created_at'])  # Optimized for fast queries
        ]

    def __str__(self):
        return f"{self.filename} - {self.created_at}"

class Subscription(models.Model):
    email = models.EmailField(unique=True)
    topic = models.CharField(max_length=255)