from cumulio.cumulio import Cumulio
from dotenv import load_dotenv
from flask import Flask
from flask import jsonify
from flask import request
import os
import jwt
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

load_dotenv()

client = Cumulio(os.getenv("CUMUL_KEY"), os.getenv("CUMUL_TOKEN"), os.getenv("API_URL"))

properties = {}
properties["integration_id"] = os.getenv("INTEGRATION_ID")
properties["type"] = "sso"
properties["expiry"] = "24 hours"
properties["inactivity_interval"] = "10 minutes"
properties["username"] = os.getenv("USER_USERNAME")
properties["name"] = os.getenv("USER_NAME")
properties["email"] = os.getenv("USER_EMAIL")
properties["suborganization"] = "< user suborganization >"
properties["role"] = "viewer"

metadata = {}


@app.route("/")
def hello_world():
  authToken = request.headers.get("Authorization").split(" ")[1]
  payload = jwt.decode(authToken, options={"verify_signature": False})

  properties["username"] = payload.get("name") or os.getenv("USER_USERNAME")
  properties["name"] = payload.get("name") or os.getenv("USER_NAME")
  properties["email"] = payload.get("email") or os.getenv("USER_EMAIL")
  properties["suborganization"] = payload.get("username") or properties["suborganization"]
  metadata["brand"] = payload.get("https://cumulio/brand")
  properties["metadata"] = metadata
  # jwt.decode(request.args.get("token"))
  # Use the token to fill in information.
  authorization = client.create("authorization", properties)
  authResponse = {}
  authResponse["status"] = "success"
  authResponse["key"] = authorization["id"]
  authResponse["token"] = authorization["token"]

  return jsonify(authResponse)

if __name__ == "__main__":
  app.run(host='0.0.0.0', port=4001)