from rest_framework import serializers

from gallery.models import Gallery, GalleryImage


class GalleryImageSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()

    class Meta:
        model = GalleryImage
        fields = [
            "id",
            "image",
            "image_url",
            "order",
            "created_at",
        ]
        read_only_fields = [
            "id",
            "image_url",
            "created_at",
        ]

    def get_image_url(self, obj):
        request = self.context.get("request")

        if obj.image and request:
            return request.build_absolute_uri(obj.image.url)

        if obj.image:
            return obj.image.url

        return None


class GallerySerializer(serializers.ModelSerializer):
    class Meta:
        model = Gallery
        fields = [
            "uid",
            "name",
            "user",
            "updated_at",
        ]
        read_only_fields = ["uid"]


class GalleryCreateSerializer(serializers.ModelSerializer):
    images = serializers.ListField(
        child=serializers.ImageField(),
        write_only=True,
        required=False,
    )

    class Meta:
        model = Gallery
        fields = [
            "uid",
            "title",
            "description",
            "images",
            "created_at",
        ]
        read_only_fields = ["uid", "created_at"]

    def create(self, validated_data):
        images = validated_data.pop("images", [])

        request = self.context["request"]

        gallery = Gallery.objects.create(
            user=request.user,
            **validated_data,
        )

        for index, image in enumerate(images):
            GalleryImage.objects.create(
                gallery=gallery,
                image=image,
                order=index,
            )
