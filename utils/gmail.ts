import { google } from "googleapis";

export async function getSalesforceVerificationCode(): Promise<string> {
  const clientId = process.env.GMAIL_CLIENT_ID;
  const clientSecret = process.env.GMAIL_CLIENT_SECRET;
  const refreshToken = process.env.GMAIL_REFRESH_TOKEN;

  if (!clientId || !clientSecret || !refreshToken) {
    throw new Error(
      "GMAIL_CLIENT_ID, GMAIL_CLIENT_SECRET and GMAIL_REFRESH_TOKEN must be defined.",
    );
  }

  const oauth2Client = new google.auth.OAuth2(clientId, clientSecret);

  oauth2Client.setCredentials({
    refresh_token: refreshToken,
  });

  const gmail = google.gmail({
    version: "v1",
    auth: oauth2Client,
  });

  const maxAttempts = 30;
  const delayMs = 2000;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    console.log(
      `Checking Gmail for Salesforce verification email... attempt ${attempt}/${maxAttempts}`,
    );

    try {
      const response = await gmail.users.messages.list({
        userId: "me",
        q: "newer_than:5m Salesforce",
        maxResults: 10,
      });

      const messages = response.data.messages;

      if (messages && messages.length > 0) {
        for (const message of messages) {
          if (!message.id) {
            continue;
          }

          const email = await gmail.users.messages.get({
            userId: "me",
            id: message.id,
            format: "full",
          });

          const subject = getHeader(email.data.payload, "Subject");

          const from = getHeader(email.data.payload, "From");

          const body = extractEmailBody(email.data.payload);

          console.log(`Email found: ${subject}`);
          console.log(`From: ${from}`);

          const code = extractVerificationCode(body);

          if (code) {
            console.log("Salesforce verification code found successfully.");

            return code;
          }
        }
      }
    } catch (error) {
      console.error("Error while checking Gmail:", error);
    }

    if (attempt < maxAttempts) {
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
  }

  throw new Error(
    "Salesforce verification code was not received within 60 seconds.",
  );
}

/**
 * Extract the email body recursively.
 * Salesforce emails can contain nested multipart sections.
 */
function extractEmailBody(payload: any): string {
  if (!payload) {
    return "";
  }

  if (payload.body?.data) {
    return decodeBase64Url(payload.body.data);
  }

  if (payload.parts && payload.parts.length > 0) {
    let body = "";

    for (const part of payload.parts) {
      body += extractEmailBody(part);
    }

    return body;
  }

  return "";
}

/**
 * Decode Gmail's base64url encoded email body.
 */
function decodeBase64Url(data: string): string {
  return Buffer.from(
    data.replace(/-/g, "+").replace(/_/g, "/"),
    "base64",
  ).toString("utf-8");
}

/**
 * Get an email header such as Subject or From.
 */
function getHeader(payload: any, headerName: string): string {
  const headers = payload?.headers || [];

  const header = headers.find(
    (item: any) => item.name?.toLowerCase() === headerName.toLowerCase(),
  );

  return header?.value || "";
}

/**
 * Extract a 6-digit Salesforce verification code.
 */
function extractVerificationCode(body: string): string | null {
  // Remove HTML tags so the regex works better
  // with HTML emails.
  const text = body
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/\s+/g, " ")
    .trim();

  // Look for a 6-digit code.
  const match = text.match(/\b\d{6}\b/);

  return match ? match[0] : null;
}
