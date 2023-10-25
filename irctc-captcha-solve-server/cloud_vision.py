import os
import base64
from PIL import Image
from io import BytesIO


def detect_text(path):
    """Detects text in the file."""
    from google.cloud import vision

    client = vision.ImageAnnotatorClient()
    with open(path, "rb") as image_file:
        content = image_file.read()
    image = vision.Image(content=content)
    response = client.text_detection(image=image)
    texts = response.text_annotations
    # print(texts, "<----------")
    for text in texts:
        print(text.description)
        return text.description.replace(" ", "")
    if response.error.message:
        raise Exception(
            "{}\nFor more info on error messages, check: "
            "https://cloud.google.com/apis/design/errors".format(response.error.message)
        )
    if not texts:
        print("AaBb@")


def writeBase64AsImage(base64_data):
    try:
        image_bytes = base64.b64decode(base64_data[22:])
        image = Image.open(BytesIO(image_bytes))
        file_path = "captcha.png"
        image.save(file_path)
        return detect_text("captcha.png")
    except Exception as e:
        print(str(e))
