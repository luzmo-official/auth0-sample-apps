using CumulioAPI;
using System.Dynamic;
using dotenv.net;
using System;
using Newtonsoft.Json;
using JWT;
using JWT.Builder;
using JWT.Serializers;
using JWT.Algorithms;
using Newtonsoft.Json.Converters;
using Newtonsoft.Json.Linq;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddCors(options => {
    options.AddDefaultPolicy(policy => policy
    .AllowAnyHeader()
    .AllowAnyMethod()
    .AllowAnyOrigin());
});
var app = builder.Build();
DotEnv.Load();
var envVars = DotEnv.Read();

app.UseCors();

dynamic decodeToken(String authorizationString) {
  String authorizationToken = authorizationString.Split(" ")[1];
  dynamic decodedToken = JwtBuilder.Create()
    .DoNotVerifySignature()
    .Decode(authorizationToken);
  return JObject.Parse(decodedToken);
}

app.MapGet("/", (HttpRequest httpRequest) => {
  Cumulio client = new Cumulio(envVars["CUMUL_KEY"], envVars["CUMUL_TOKEN"], envVars["API_URL"]);
  // decode token, fetch from headers.
  dynamic decodedToken = decodeToken(httpRequest.Headers["Authorization"]);
  dynamic properties = new ExpandoObject();
 
  properties.integration_id = envVars["INTEGRATION_ID"];
  properties.type = "sso";
  properties.expiry = "24 hours";
  properties.inactivity_interval = "1 year";
  properties.username = decodedToken["name"] ?? envVars["USER_USERNAME"];
  properties.name = decodedToken["name"] ?? envVars["USER_NAME"];
  properties.email = decodedToken["email"] ?? envVars["USER_EMAIL"];
  properties.suborganization = envVars["USER_SUBORGANIZATION"];
  properties.role = "viewer";
  properties.metadata = new ExpandoObject();
  properties.metadata.brand = decodedToken["https://cumulio/brand"];

  dynamic authorization = client.create("authorization", properties);
  dynamic authResp = new ExpandoObject();

  authResp.key = authorization.id;
  authResp.token = authorization.token;
  authResp.status = "success";

  return JsonConvert.SerializeObject(authResp);
});

app.Run();
