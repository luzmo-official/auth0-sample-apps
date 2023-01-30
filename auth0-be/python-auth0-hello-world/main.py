from cumulio.cumulio import Cumulio
from dotenv import load_dotenv
from flask import Flask
from flask import jsonify
from flask import request
import os
import jwt
from flask_cors import CORS
import json
from six.moves.urllib.request import urlopen
from functools import wraps

from flask import Flask, request, jsonify, _request_ctx_stack
from flask_cors import cross_origin
from jose import jwt

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

# Error handler
class AuthError(Exception):
    def __init__(self, error, status_code):
        self.error = error
        self.status_code = status_code

@app.errorhandler(AuthError)
def handle_auth_error(ex):
    response = jsonify(ex.error)
    response.status_code = ex.status_code
    return response

# Format error response and append status code
def get_token_auth_header():
  """Obtains the Access Token from the Authorization Header
  """
  auth = request.headers.get("Authorization", None)
  if not auth:
      raise AuthError({"code": "authorization_header_missing",
                      "description":
                          "Authorization header is expected"}, 401)

  parts = auth.split()

  if parts[0].lower() != "bearer":
      raise AuthError({"code": "invalid_header",
                      "description":
                          "Authorization header must start with"
                          " Bearer"}, 401)
  elif len(parts) == 1:
      raise AuthError({"code": "invalid_header",
                      "description": "Token not found"}, 401)
  elif len(parts) > 2:
      raise AuthError({"code": "invalid_header",
                      "description":
                          "Authorization header must be"
                          " Bearer token"}, 401)

  token = parts[1]
  return token

def requires_auth(f):
  """Determines if the Access Token is valid
  """
  @wraps(f)
  def decorated(*args, **kwargs):
      token = get_token_auth_header()
      jsonurl = urlopen("https://"+os.getenv("AUTH_DOMAIN")+"/.well-known/jwks.json")
      jwks = json.loads(jsonurl.read())
      unverified_header = jwt.get_unverified_header(token)
      rsa_key = {}
      for key in jwks["keys"]:
          if key["kid"] == unverified_header["kid"]:
              rsa_key = {
                  "kty": key["kty"],
                  "kid": key["kid"],
                  "use": key["use"],
                  "n": key["n"],
                  "e": key["e"]
              }
      if rsa_key:
          try:
              payload = jwt.decode(
                  token,
                  rsa_key,
                  algorithms=["RS256"],
                  audience=os.getenv("AUTH_AUDIENCE"),
                  issuer="https://"+os.getenv("AUTH_DOMAIN")+"/"
              )
          except jwt.ExpiredSignatureError:
              raise AuthError({"code": "token_expired",
                              "description": "token is expired"}, 401)
          except jwt.JWTClaimsError:
              raise AuthError({"code": "invalid_claims",
                              "description":
                                  "incorrect claims,"
                                  "please check the audience and issuer"}, 401)
          except Exception:
              raise AuthError({"code": "invalid_header",
                              "description":
                                  "Unable to parse authentication"
                                  " token."}, 401)

          _request_ctx_stack.top.request.current_user = payload
          return f(*args, **kwargs)
      raise AuthError({"code": "invalid_header",
                      "description": "Unable to find appropriate key"}, 401)
  return decorated


@app.route("/", methods=["POST"])
@requires_auth
def hello_world():
  properties["username"] = request.current_user["sub"] or os.getenv("USER_USERNAME")
  properties["name"] = request.json['name'] or os.getenv("USER_NAME")
  properties["email"] = request.json['email'] or os.getenv("USER_EMAIL")
  properties["suborganization"] = request.current_user["https://cumulio/suborganization"] or properties["suborganization"]
  metadata["brand"] = request.current_user["https://cumulio/brand"]
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