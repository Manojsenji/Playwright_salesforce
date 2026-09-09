import { google } from "googleapis";
import readline from "readline";
import dotenv from "dotenv";
import path from "path";

dotenv.config({
  path: path.resolve(process.cwd(), "config", ".env"),
});

const clientId = process.env.GMAIL_CLIENT_ID;
const clientSecret = process.env.GMAIL_CLIENT_SECRET;

if (!clientId || !clientSecret) {
  throw new Error(
    "GMAIL_CLIENT_ID and GMAIL_CLIENT_SECRET must be defined in config/.env",
  );
}

const oauth2Client = new google.auth.OAuth2(
  clientId,
  clientSecret,
  "http://localhost:3000/oauth2callback",
);

const scopes = ["https://www.googleapis.com/auth/gmail.readonly"];

const authUrl = oauth2Client.generateAuthUrl({
  access_type: "offline",
  scope: scopes,
  prompt: "consent",
});

console.log("\nOpen this URL in your browser:\n");
console.log(authUrl);
console.log("\n");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question("Paste the authorization code here: ", async (code) => {
  try {
    const { tokens } = await oauth2Client.getToken(code);

    console.log("\nTokens received.");

    if (tokens.refresh_token) {
      console.log("\nYOUR REFRESH TOKEN:\n");
      console.log(tokens.refresh_token);
    } else {
      console.log(
        "\nNo refresh token was returned. Re-authorize with prompt=consent.",
      );
    }

    rl.close();
  } catch (error) {
    console.error("Failed to get tokens:", error);
    rl.close();
  }
});
