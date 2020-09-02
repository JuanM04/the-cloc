from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import os.path

app = Flask(__name__)
app.config.from_object({"DEBUG": False})
CORS(app)

settings_file = "data/settings.json"


@app.route("/", methods=["GET"])
def get_settings():
    with open(settings_file, "r") as f:
        data = json.load(f)
        return jsonify(data)


@app.route("/", methods=["POST"])
def update_settings():
    with open(settings_file, "r+") as f:
        new_data = json.loads(request.data.decode("utf-8"))
        data = json.load(f)

        for key in new_data.keys():
            data[key] = new_data[key]

        f.seek(0)
        json.dump(data, f, indent=4)
        f.truncate()
        return jsonify(new_data)


if __name__ == "__main__":
    if not os.path.exists("data"):
        os.makedirs("data")

    if not os.path.isfile(settings_file):
        with open(settings_file, "w") as f:
            json.dump(
                {
                    "bedtime": (23, 0),
                    "wakeup": (8, 0),
                    "days": ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"],
                    "musicURI": "spotify:playlist:63TxrfKHsWjf8mPDNl5UM7",
                    "playTime": 10,
                    "volume": 30,
                    "spotify": None,
                },
                f,
                indent=4,
            )
    app.run(host="thecloc.local")
