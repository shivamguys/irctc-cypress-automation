from flask import Flask, request
import os
import sys
import json
import subprocess

app = Flask(__name__)


@app.route("/getCaptchaToText")
def getCaptchaToText():
    base64_image = request.args.get("base64_image")
    proc = subprocess.Popen(
        [
            "python3",
            os.getcwd() + "/captcha.py",
            json.dumps(base64_image[22:]),
        ],
        stdout=subprocess.PIPE,
        stderr=subprocess.STDOUT,
    )
    captcha_value = proc.communicate()[0]
    return captcha_value


# main driver function
if __name__ == "__main__":
    app.run()
