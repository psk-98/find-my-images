from django.contrib.auth.models import AbstractUser
from django.db import models


# Create your models here.
class User(AbstractUser):
    class Role(models.TextChoices):
        ADMIN = "ADMIN", "admin"
        OWNER = "OWNER", "Owner"
        USER = "USER", "User"

    role = models.CharField(max_length=10, choices=Role.choices, default=Role.USER)
