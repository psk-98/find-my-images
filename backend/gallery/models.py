from uuid import uuid4

from django.conf import settings
from django.db import models
from pgvector.django import VectorField,HnswIndex


# Create your models here.
class Gallery(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="galleries",
    )
    uid = models.UUIDField(
        default=uuid4,
        unique=True,
        editable=False,
        db_index=True,
    )
    name = models.CharField(max_length=200)
    description = models.TextField(blank=True, max_length=1000)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name


class GalleryImage(models.Model):
    uid = models.UUIDField(default=uuid4, unique=True, editable=False, db_index=True)
    gallery = models.ForeignKey(
        Gallery, on_delete=models.CASCADE, related_name="gallery_images"
    )
    image = models.ImageField(upload_to="uploads/gallery")
    order = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.image.name


class FaceEmbedding(models.Model):
    gallery = models.ForeignKey(
        Gallery,
        on_delete=models.CASCADE,
        related_name="face_embeddings",
    )
    gallery_image = models.ForeignKey(
        GalleryImage,
        on_delete=models.CASCADE,
        related_name="face_embeddings",
    )
    embedding = VectorField(dimensions=128)
    bbox = models.JSONField(default=dict, blank=True)
    confidence = models.FloatField(default=0)
    model_name = models.CharField(max_length=100, default="opencv-sface")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        indexes = [
            HnswIndex(
                name="face_embedding_hnsw_idx",
                fields=["embedding"],
                m=16,
                ef_construction=64,
                opclasses=["vector_cosine_ops"],
            )
        ]
