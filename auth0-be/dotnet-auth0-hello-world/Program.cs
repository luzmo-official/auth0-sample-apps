using CumulioAPI;
using System.Dynamic;
using dotenv.net;
using Newtonsoft.Json;
using JWT.Builder;
using Newtonsoft.Json.Linq;
using Microsoft.AspNetCore.Authentication.JwtBearer;

DotEnv.Load();
var envVars = DotEnv.Read();

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddCors(options => {
    options.AddDefaultPolicy(policy => policy
    .AllowAnyHeader()
    .AllowAnyMethod()
    .AllowAnyOrigin());
})
.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
.AddJwtBearer(options => {
  options.Authority = "https://" + envVars["AUTH_DOMAIN"] + "/";
  options.Audience = envVars["AUTH_AUDIENCE"];
});
var app = builder.Build();

app.UseCors();
app.UseAuthentication();

if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
}

dynamic decodeToken(String authorizationString) {
  String authorizationToken = authorizationString.Split(" ")[1];
  dynamic decodedToken = JwtBuilder.Create()
    .DoNotVerifySignature()
    .Decode(authorizationToken);
  return JObject.Parse(decodedToken);
}

app.MapPost("/", async (User user, HttpRequest httpRequest) => {
  Cumulio client = new Cumulio(envVars["CUMUL_KEY"], envVars["CUMUL_TOKEN"], envVars["API_URL"]);
  dynamic properties = new ExpandoObject();
 
  properties.integration_id = envVars["INTEGRATION_ID"];
  properties.type = "sso";
  properties.expiry = "24 hours";
  properties.inactivity_interval = "1 year";
  // Sub claim is mapped by middleware to http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier
  properties.username = httpRequest.HttpContext.User.FindFirst("http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier").Value ?? envVars["USER_USERNAME"];
  properties.name = user.name ?? envVars["USER_NAME"];
  properties.email = user.email ?? envVars["USER_EMAIL"];
  properties.suborganization = httpRequest.HttpContext.User.FindFirst("https://cumulio/suborganization").Value ?? envVars["USER_SUBORGANIZATION"];
  properties.role = "viewer";
  properties.metadata = new ExpandoObject();
  string[] brand = { httpRequest.HttpContext.User.FindFirst("https://cumulio/brand").Value };
  properties.metadata.brand = brand;

  dynamic authorization = client.create("authorization", properties);
  dynamic authResp = new ExpandoObject();

  authResp.key = authorization.id;
  authResp.token = authorization.token;
  authResp.status = "success";

  return JsonConvert.SerializeObject(authResp);
});

app.Run();
