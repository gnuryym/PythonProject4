import collections.abc
import collections
collections.Iterable = collections.abc.Iterable

from flask import Flask, request, jsonify, send_from_directory
import json, os
from flask_cors import CORS

app = Flask(__name__, static_folder="static")
CORS(app)

DATA_FILE = "data.json"

def load_data():
    if not os.path.exists(DATA_FILE):
        return {"users": []}
    with open(DATA_FILE, "r", encoding="utf-8") as f:
        return json.load(f)

def save_data(data):
    with open(DATA_FILE, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

@app.route("/")
def index():
    return send_from_directory("static", "index.html")

@app.route("/user")
def user_page():
    return send_from_directory("static", "user.html")

@app.route("/register", methods=["POST"])
def register():
    data = load_data()
    req = request.json

    for u in data["users"]:
        if u["login"] == req["login"]:
            return {"error": "User exists"}, 400

    data["users"].append({
        "login": req["login"],
        "password": req["password"],
        "portfolio": req["portfolio"],
        "favorites": [],
        "messages": []
    })
    save_data(data)
    return {"ok": True}

@app.route("/login", methods=["POST"])
def login():
    data = load_data()
    req = request.json

    for u in data["users"]:
        if u["login"] == req["login"] and u["password"] == req["password"]:
            return {"ok": True, "login": u["login"]}
    return {"error": "Wrong credentials"}, 400

@app.route("/profiles")
def profiles():
    data = load_data()
    return jsonify([
        {"login": u["login"], "portfolio": u["portfolio"]}
        for u in data["users"]
    ])

@app.route("/favorite", methods=["POST"])
def favorite():
    data = load_data()
    req = request.json

    for u in data["users"]:
        if u["login"] == req["user"]:
            if req["target"] not in u["favorites"]:
                u["favorites"].append(req["target"])
            save_data(data)
            return {"ok": True}
    return {"error": "User not found"}, 400

if __name__ == "__main__":
    app.run(debug=True)
