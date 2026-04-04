// src/enterprise-billing.ts
import * as jwt from 'jsonwebtoken';
import * as AdmZip from 'adm-zip';
import * as Handlebars from 'handlebars';
import * as crypto from 'crypto';

export class BillingService {

  // 😈 1. JWT Algorithm Confusion
  // Verifying a token without forcing the algorithm. 
  // Attackers can change the algorithm to 'none' or use an HMAC symmetric key to forge admin tokens.
  public verifyAdminToken(token: string, publicKey: string) {
    return jwt.verify(token, publicKey); 
  }

  // 😈 2. Timing Attack (Signature Verification)
  // Using standard '===' to compare cryptographic hashes.
  // Attackers can measure the microsecond delay in the server's response to guess the signature character by character.
  public validateWebhookSignature(userSig: string, serverSig: string) {
    return userSig === serverSig; 
  }

  // 😈 3. "Zip Slip" (Arbitrary File Write)
  // Extracting a ZIP file without sanitizing the file paths inside it.
  // An attacker can upload a ZIP containing a file named "../../../etc/cron.d/malware" to take over the server.
  public extractVendorInvoice(zipBuffer: Buffer) {
    const zip = new AdmZip(zipBuffer);
    zip.extractAllTo("/var/www/uploads/invoices/", true); 
  }

  // 😈 4. Server-Side Template Injection (SSTI)
  // Concatenating raw user input directly into a template compiler.
  // Attackers can pass Handlebars logic like {{process.mainModule.require('child_process').exec('rm -rf /')}}
  public generatePDFReceipt(req: any) {
    const templateString = "<h1>Invoice for: " + req.body.customerName + "</h1>";
    const template = Handlebars.compile(templateString);
    return template({});
  }

  // 😈 5. The "Regex Dodge" Leaked Secret
  // This is a live Stripe Secret Key. Because it doesn't start with "AKIA", 
  // your fast-regex will miss it. The AI MUST catch this!
  public processRefund(amount: number) {
    const STRIPE_SECRET = "sk_live_51MabcdeFGH123456789badcode";
    console.log(`Processing ${amount} with ${STRIPE_SECRET}`);
  }

  // 😈 6. Object.assign Mass Assignment
  // Blindly merging the entire request body into the authenticated user object.
  // An attacker can send { "email": "test@test.com", "role": "admin" } and elevate their own privileges.
  public updateProfile(req: any, currentUser: any) {
    const updatedUser = Object.assign(currentUser, req.body);
    Database.save(updatedUser);
  }

  // 😈 7. Unsafe Deserialization
  // Executing serialized JavaScript payload directly.
  // If an attacker controls the cookie, they can force the server to execute arbitrary malicious functions.
  public loadSession(req: any) {
    const sessionData = req.cookies.session_data;
    return eval("(" + sessionData + ")");
  }
}

const Database = { save: (data: any) => true };
