
from galleries.models import FaceEmbedding
from galleries.services.face_embeddings import extract_face_embeddings


def process_gallery_image_faces(gallery_image):
    faces = extract_face_embeddings(gallery_image.image.path)

    for face in faces:
        FaceEmbedding.objects.create(
            # user=gallery_image.gallery.user,
            gallery=gallery_image.gallery,
            gallery_image=gallery_image,
            embedding=face["embedding"],
            bbox=face["bbox"],
            confidence=face["confidence"],
        )
