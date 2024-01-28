from cloud_vision import writeBase64AsImage
import sys
import warnings

warnings.filterwarnings("ignore")

if __name__ == "__main__":
    image_argv = sys.argv[1]
    image_argv = image_argv.replace(" ", "+")
    image_base = "data:image/jpg;base64," + image_argv
    writeBase64AsImage(image_base)
