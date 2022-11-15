using CumulioAPI;
using System.Dynamic;
using dotenv.net;
using System;
using Newtonsoft.Json;

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

app.MapGet("/", (HttpRequest httpRequest) => {
  Cumulio client = new Cumulio(envVars["CUMUL_KEY"], envVars["CUMUL_TOKEN"], envVars["API_URL"]);
  dynamic properties = new ExpandoObject();
  properties.integration_id = envVars["INTEGRATION_ID"];
  properties.type = "sso";
  properties.expiry = "24 hours";
  properties.inactivity_interval = "1 year";
  properties.username = httpRequest.Query["username"].ToString() ?? envVars["USER_USERNAME"];
  properties.name = httpRequest.Query["name"].ToString() ?? envVars["USER_NAME"];
  properties.email = httpRequest.Query["email"].ToString() ?? envVars["USER_EMAIL"];
  properties.suborganization = envVars["USER_SUBORGANIZATION"];
  properties.role = "viewer";
  properties.metadata = new ExpandoObject();
  properties.metadata.brand = httpRequest.Query["brand"];

  dynamic authorization = client.create("authorization", properties);
  dynamic authResp = new ExpandoObject();
  Console.WriteLine(authResp);
  authResp.key = authorization.id;
  authResp.token = authorization.token;
  authResp.status = "success";

  return JsonConvert.SerializeObject(authResp);
});

app.Run();
