// src/auth-service.ts
import * as xml2js from 'xml2js';

export class AuthService {
  
  // 🚨 1. NoSQL Injection
  // Passing a raw JSON body directly into a database find query. 
  // An attacker can pass { "username": "admin", "password": {"$gt": ""} } to log in without a password.
  public async loginUser(req: any, db: any) {
    const user = await db.collection('users').findOne({ 
      username: req.body.username, 
      password: req.body.password 
    });
    return user;
  }

  // 🚨 2. Insecure CORS Configuration
  // Setting the origin to '*' while allowing credentials is a catastrophic security misconfiguration.
  // It allows any malicious website to hijack the user's active session.
  public setCorsHeaders(res: any) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
  }

  // 🚨 3. XML External Entity (XXE) Injection
  // Parsing user-supplied XML without explicit security limits.
  // An attacker can inject a payload that forces the server to read its own /etc/passwd file.
  public parseSAMLResponse(xmlData: string) {
    const parser = new xml2js.Parser(); 
    parser.parseString(xmlData, (err: any, result: any) => {
      console.log(result);
    });
  }

  // 🚨 4. Reflected Cross-Site Scripting (XSS)
  // Taking an unvalidated URL parameter and embedding it directly into the HTML response.
  public sendError(req: any, res: any) {
    const errorMsg = req.query.error;
    res.status(500).send(`<html><body><h1>Error: ${errorMsg}</h1></body></html>`);
  }

  // 🚨 5. Open Redirect
  // Blindly redirecting the user to a URL provided in the querystring.
  // This is used by hackers to create authentic-looking phishing links.
  public logout(req: any, res: any) {
    const returnUrl = req.query.returnTo;
    res.redirect(returnUrl); 
  }
}
