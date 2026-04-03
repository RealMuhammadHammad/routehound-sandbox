// src/complex-logic.ts
import fetch from 'node-fetch';
import * as jwt from 'jsonwebtoken';

export class EnterpriseRouter {
  
  // 😈 1. The Race Condition (TOC/TOU Flaw)
  // Two rapid clicks from a user could allow them to withdraw money twice 
  // before the database finishes saving the first new balance.
  public async withdrawFunds(userId: string, amount: number) {
    const balance = await Database.getBalance(userId);
    if (balance >= amount) {
      // Fake network delay
      await new Promise(resolve => setTimeout(resolve, 500)); 
      await Database.updateBalance(userId, balance - amount);
      return "Success";
    }
    return "Insufficient Funds";
  }

  // 😈 2. Server-Side Request Forgery (SSRF)
  // Allowing a user to pass a URL that the SERVER fetches. 
  // A hacker could pass "http://localhost/admin" and bypass external firewalls.
  public async fetchProfilePicture(req: any) {
    const imageUrl = req.body.url;
    const response = await fetch(imageUrl); 
    return response.buffer();
  }

  // 😈 3. Prototype Pollution
  // Recursively merging unvalidated user JSON into a server object.
  // Hackers can overwrite core JavaScript object properties (like Object.prototype.isAdmin).
  public deepMerge(target: any, source: any) {
    for (const key in source) {
      if (typeof source[key] === 'object') {
        if (!target[key]) target[key] = {};
        this.deepMerge(target[key], source[key]);
      } else {
        target[key] = source[key];
      }
    }
    return target;
  }

  // 😈 4. Hardcoded JWT Secret (The Regex Dodge)
  // This is a leaked secret, but it's NOT an AWS key. 
  // Your Regex Bouncer should ignore this, but the AI MUST catch it!
  public generateAuthToken(user: any) {
    const SECRET = "super_secret_dev_key_123!!";
    return jwt.sign({ id: user.id }, SECRET);
  }

  // 😈 5. Catastrophic Backtracking (ReDoS)
  // This Regex looks innocent, but evaluating a long string against it 
  // will freeze the Node.js server at 100% CPU, taking down the entire website.
  public validateEmailString(req: any) {
    const dangerousRegex = /^([a-zA-Z0-9]+\s?)*$/;
    return dangerousRegex.test(req.body.textInput);
  }
}

const Database = {
  getBalance: async (id: string) => 100,
  updateBalance: async (id: string, newBal: number) => true
};
