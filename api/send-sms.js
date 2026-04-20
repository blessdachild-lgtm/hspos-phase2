// api/send-sms.js
// Vercel serverless function — sends SMS via Twilio
// Deploy this file to /api/send-sms.js in your GitHub repo

export default async function handler(req, res) {
  // Only allow POST
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { to, message } = req.body;

  // Validate inputs
  if (!to || !message) {
    return res.status(400).json({ error: "Missing required fields: to, message" });
  }

  // Validate phone number format
  const phoneRegex = /^\+1\d{10}$/;
  if (!phoneRegex.test(to)) {
    return res.status(400).json({ error: "Invalid phone number format. Use +1XXXXXXXXXX" });
  }

  // Get Twilio credentials from environment variables
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const from = process.env.TWILIO_PHONE_NUMBER;

  if (!accountSid || !authToken || !from) {
    return res.status(500).json({ error: "Twilio credentials not configured" });
  }

  try {
    // Call Twilio REST API directly (no SDK needed)
    const twilioUrl = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`;

    const body = new URLSearchParams({
      To: to,
      From: from,
      Body: message,
    });

    const response = await fetch(twilioUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: "Basic " + Buffer.from(`${accountSid}:${authToken}`).toString("base64"),
      },
      body: body.toString(),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Twilio error:", data);
      return res.status(response.status).json({
        error: data.message || "Failed to send SMS",
        code: data.code,
      });
    }

    return res.status(200).json({
      success: true,
      sid: data.sid,
    });

  } catch (error) {
    console.error("Server error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
