import argparse
import numpy as np
from PIL import Image
import io
import base64
import easyocr


reader = easyocr.Reader(["en"], model_storage_directory="./EasyOCR")


def extract_text_from_image(base64_image):
    # Convert the base64 image to bytes
    image_bytes = base64.b64decode(base64_image[22:])
    # Create a BytesIO object from the image bytes
    image_buffer = io.BytesIO(image_bytes)
    # Open the image using PIL (Python Imaging Library)
    image = Image.open(image_buffer)
    # Convert the image to grayscale (optional but can improve OCR accuracy)
    image = image.convert("L")

    # Convert PIL image to OpenCV format
    open_cv_image = np.array(image)

    result = reader.readtext(open_cv_image, detail=0)
    if result:
        return result[0].replace(" ", "")
    else:
        return "ABCDEF"


if __name__ == "__main__":
    parser = argparse.ArgumentParser(
        description="Extract text from a base64 encoded image."
    )
    parser.add_argument(
        "image",
        type=str,
        nargs="?",
        default="",
        help="Base64 encoded image",
    )
    args = parser.parse_args()

    if args.image == "":
        print("No base-64 String provided")
    else:
        extracted_text = extract_text_from_image(args.image)
        print(extracted_text)
