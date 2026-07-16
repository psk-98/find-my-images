from pathlib import Path

import cv2
import numpy as np
from django.conf import settings


BASE_DIR = Path(settings.BASE_DIR)

DETECTOR_MODEL = BASE_DIR / "models" / "face_detection_yunet_2023mar.onnx"
RECOGNIZER_MODEL = BASE_DIR / "models" / "face_recognition_sface_2021dec.onnx"


def normalize_vector(vector: np.ndarray) -> list[float]:
    vector = vector.flatten().astype("float32")
    norm = np.linalg.norm(vector)

    if norm == 0:
        return vector.tolist()

    return (vector / norm).tolist()


def extract_face_embeddings(image_path: str) -> list[dict]:
    image = cv2.imread(image_path)

    if image is None:
        raise ValueError("Could not read image.")

    height, width = image.shape[:2]

    detector = cv2.FaceDetectorYN_create(
        str(DETECTOR_MODEL),
        "",
        (width, height),
        score_threshold=0.8,
        nms_threshold=0.3,
        top_k=5000,
    )

    recognizer = cv2.FaceRecognizerSF_create(
        str(RECOGNIZER_MODEL),
        "",
    )

    _, faces = detector.detect(image)

    if faces is None:
        return []

    results = []

    for face in faces:
        aligned_face = recognizer.alignCrop(image, face)
        embedding = recognizer.feature(aligned_face)

        x, y, w, h = face[:4]
        confidence = float(face[-1])

        results.append(
            {
                "embedding": normalize_vector(embedding),
                "bbox": {
                    "x": float(x),
                    "y": float(y),
                    "width": float(w),
                    "height": float(h),
                },
                "confidence": confidence,
            }
        )

    return results
