// src/bad-code.ts
import { exec } from 'child_process';
import * as fs from 'fs';
import * as crypto from 'crypto';

export class VulnerableApp {
  
  // 🚨 1. The Bouncer Test (Leaked Secrets) hi
  // This should trigger your Regex Bouncer instantly.
  public awsConfig = {
    region: 'us-east-1',
    accessKey: 'FAKEIOSFODNN7EXAMPLE', 
    secretKey: 'wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY'
  };

  // 🚨 2. SQL Injection (SQLi)
  // Blindly concatenating user input into a database query.
  public getUser(req: any) {
    const query = "SELECT * FROM users WHERE username = '" + req.body.username + "'";
    return Database.execute(query); 
  }

  // 🚨 3. Command Injection (RCE)
  // Allowing a user to pass an IP address that gets executed in the server's terminal.
  public pingDevice(req: any) {
    exec('ping -c 4 ' + req.body.ip, (err, stdout, stderr) => {
      console.log(stdout);
    });
  }

  // 🚨 4. Path Traversal
  // Allowing a user to read any file on the server by passing "../../../etc/passwd".
  public downloadFile(req: any) {
    const filePath = '/var/www/uploads/' + req.query.filename;
    return fs.readFileSync(filePath, 'utf8');
  }

  // 🚨 5. Weak Cryptography (MD5)
  // MD5 was broken decades ago and can be cracked in seconds.
  public hashPassword(password: string) {
    return crypto.createHash('md5').update(password).digest('hex');
  }

  // 🚨 6. Insecure Randomness
  // Math.random is predictable. Hackers can guess the password reset token.
  public generateResetToken() {
    return Math.random().toString(36).substring(2, 15);
  }

  // 🚨 7. Cross-Site Scripting (XSS)
  // Reflecting unsanitized user input directly into HTML.
  public renderWelcome(req: any, res: any) {
    res.send("<h1>Welcome to the dashboard, " + req.query.name + "</h1>");
  }

  // 🚨 8. Insecure Direct Object Reference (IDOR)
  // Changing a password without verifying if the user requesting the change OWNS the account.
  public updatePassword(req: any) {
    Database.update('users', { id: req.body.userId }, { password: req.body.newPassword });
  }

  // 🚨 9. Mass Assignment
  // Taking the entire JSON body from a user and dumping it into the database. 
  // A user could send { "username": "bob", "isAdmin": true } and hack their own permissions.
  public registerUser(req: any) {
    Database.insert('users', req.body);
  }

  // 🚨 10. Eval Execution
  // The most dangerous function in JavaScript. Executes arbitrary strings as code.
  public calculateMath(req: any) {
    return eval(req.body.mathExpression);
  }
}

// Mock Database object so TypeScript doesn't yell at us
const Database = {
  execute: (q: string) => true,
  update: (t: string, w: any, d: any) => true,
  insert: (t: string, d: any) => true
};
