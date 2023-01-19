/*
 * This Java source file was generated by the Gradle 'init' task.
 */
package cumul.hello.world;

import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.net.URL;
import java.net.URLDecoder;
import java.security.interfaces.RSAPrivateKey;
import java.security.interfaces.RSAPublicKey;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.concurrent.TimeUnit;

import com.auth0.jwk.JwkException;
import com.auth0.jwk.JwkProvider;
import com.auth0.jwk.JwkProviderBuilder;
import com.auth0.jwt.interfaces.RSAKeyProvider;
import fi.iki.elonen.NanoHTTPD;
import io.github.cdimascio.dotenv.Dotenv;
import io.cumul.sdk.Cumulio;
import org.json.JSONObject;

import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.interfaces.Claim;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.google.common.collect.ImmutableMap;
// import com.auth0;
// import com.auth0.jw;
import com.auth0.jwk.Jwk;

public class App extends NanoHTTPD {

    static private Dotenv dotenv;
    
    public App() throws IOException {
        super(4001);
        start(NanoHTTPD.SOCKET_READ_TIMEOUT, false);
        System.out.println("\nRunning! Point your browsers to http://localhost:4001/ \n");
    }

    public static void main(String[] args) {
        try {
            dotenv = Dotenv
                .configure()
                .directory("../")
                .systemProperties()
                .load();
            System.out.println(dotenv.get("CUMUL_KEY"));
            new App();
        } catch (IOException ioe) {
            System.err.println("Couldn't start server:\n" + ioe);
        }
    }

    @Override
    public Response serve(IHTTPSession session) {
        try {
            if (session.getMethod() == Method.OPTIONS) {
                System.out.println("Handle Options");
                // Handle OPTIONS request here.
                Response response = newFixedLengthResponse(Response.Status.OK, MIME_PLAINTEXT ,"success");
                response.addHeader("Access-Control-Allow-Origin", "*");
                response.addHeader("Access-Control-Allow-Headers", "*");
                response.addHeader("Content-Type", "application/json");
                return response;
            }
            System.out.println("HandlePOST");

            Map<String, String> headers = session.getHeaders();
            JWTVerifier verifier = JWT.require(getAlgorithm()).build();
            DecodedJWT jwtToken = verifier.verify(headers.get("authorization").split(" ")[1]);

            final HashMap<String, String> map = new HashMap<>();
            session.parseBody(map);
            JSONObject postData = new JSONObject(map.get("postData"));


            // Setup connection
            Cumulio client = new Cumulio(dotenv.get("CUMUL_KEY"), dotenv.get("CUMUL_TOKEN"), dotenv.get("API_URL"));
            ImmutableMap metadata = ImmutableMap.builder().put("brand", jwtToken.getClaim("https://cumulio/brand").asString()).build();
            // On page requests of pages containing embedded dashboards, request an "authorization"
            JSONObject authorization = client.create("authorization", ImmutableMap.builder()
                .put("type", "sso")
                .put("expiry", "24 hours")
                .put("inactivity_interval", "10 minutes")
                .put("username", postData.get("username") != null ? postData.get("username") : dotenv.get("USER_USERNAME"))
                .put("name", postData.get("name") != null ? postData.get("name") : dotenv.get("USER_NAME"))
                .put("email", postData.get("email") != null ? postData.get("email") : dotenv.get("USER_EMAIL"))
                .put("suborganization", postData.get("suborganization") != null ? postData.get("suborganization") : dotenv.get("USER_SUBORGANIZATION"))
                .put("integration_id", dotenv.get("INTEGRATION_ID"))
                .put("role", "viewer")
                .put("metadata", metadata)
                .build()
            );
            JSONObject authResponse = new JSONObject();
            authResponse.put("status", "success");
            authResponse.put("key", authorization.getString("id"));
            authResponse.put("token", authorization.getString("token"));

            Response response = newFixedLengthResponse(
                authResponse.toString()
            );
            response.addHeader("Access-Control-Allow-Origin", "*");
            response.addHeader("Access-Control-Allow-Headers", "*");
            response.addHeader("Content-Type", "application/json");
            response.addHeader("Access-Control-Allow-Origin", "*");
            return response;
        } catch(Exception e) {
            System.out.println(e);
            JSONObject authResponse = new JSONObject();
            authResponse.put("status", "failed");
            Response resp = newFixedLengthResponse(authResponse.toString());
            resp.addHeader("Content-Type", "application/json");
            return resp;
        }

    }

    private static Map<String, Claim> getUserOjbect(String authorizationToken) {
        String authToken = authorizationToken.split(" ")[1];
        DecodedJWT authUser = JWT.decode(authToken);
        System.out.println("AuthUser" + authUser.getClaims().get("nickname"));
        return authUser.getClaims();
    } 

    private static Map<String, String> splitQuery(String query) throws UnsupportedEncodingException {
        Map<String, String> query_pairs = new LinkedHashMap<String, String>();
        String[] pairs = query.split("&");
        for (String pair : pairs) {
            int idx = pair.indexOf("=");
            query_pairs.put(URLDecoder.decode(pair.substring(0, idx), "UTF-8"), URLDecoder.decode(pair.substring(idx + 1), "UTF-8"));
        }
        return query_pairs;
    }

     private static Algorithm getAlgorithm() {
         JwkProvider provider = new JwkProviderBuilder("https://" + dotenv.get("AUTH_DOMAIN") + "/")
         .cached(10, 24, TimeUnit.HOURS)
         .rateLimited(10, 1, TimeUnit.MINUTES)
         .build();

         RSAKeyProvider keyProvider = new RSAKeyProvider() {
             @Override
             public RSAPublicKey getPublicKeyById(String kid) {
                 try {
                     return (RSAPublicKey) provider.get(kid).getPublicKey();
                 } catch (JwkException e) {
                     throw new RuntimeException(e);
                 }
             }

             @Override
             public RSAPrivateKey getPrivateKey() {
                 return null;
             }

             @Override
             public String getPrivateKeyId() {
                 return null;
             }
         };

         Algorithm algorithm = Algorithm.RSA256(keyProvider);
         return algorithm;
     }
}
