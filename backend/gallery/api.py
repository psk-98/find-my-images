# galleries/views.py

from rest_framework import generics, permissions
from rest_framework.parsers import FormParser, MultiPartParser

from .models import Gallery
from .serializers import GalleryCreateSerializer, GallerySerializer


class GalleryListCreateView(generics.ListCreateAPIView):
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def get_queryset(self):
        return Gallery.objects.filter(user=self.request.user).order_by("-created_at")

    def get_serializer_class(self):
        if self.request.method == "POST":
            return GalleryCreateSerializer

        return GallerySerializer

    def perform_create(self, serializer):
        serializer.save()
