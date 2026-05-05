// api/register-phone.js
// Saves user phone number to Upstash Redis and sends confirmation SMS
// Called from the phone setup screen in App.jsx

import { Redis } from '@upstash/redis';

const redis = Redis.fromEnv();

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { phoneNumber, moduleId, frequency } = req.body;

  if (!phoneNumber) {
    return res.status(400).json({ error: 'Phone number required' });
  }

  // Ensure E.164 format
  let formatted = phoneNumber.replace(/\D/g, '');
  if (formatted.length === 10) formatted = `+1${formatted}`;
  else if (formatted.length === 11 && formatted.startsWith('1')) formatted = `+${formatted}`;
  else if (!phoneNumber.startsWith('+')) formatted = `+1${formatted}`;
  else formatted = phoneNumber;

  const phoneRegex = /^\+1\d{10}$/;
  if (!phoneRegex.test(formatted)) {
    return res.status(400).json({ error: 'Invalid US phone number' });
  }

  try {
    // Save user to Upstash Redis
    // Key: user:{phone} — phone is the unique identifier
    await redis.hset(`user:${formatted}`, {
      phoneNumber: formatted,
      moduleId: moduleId || 'state',
      frequency: frequency || 'daily',
      dayIndex: 0,
      registeredAt: new Date().toISOString(),
      lastSent: null,
      active: true,
    });

    // Add to the set of all registered users for easy cron lookup
    await redis.sadd('registered_users', formatted);

    // Send confirmation SMS via Twilio
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const from = process.env.TWILIO_PHONE_NUMBER;

    const twilioUrl = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`;

    const body = new URLSearchParams({
      To: formatted,
      From: from,
      Body: `HS-POS is set up. You'll receive your daily protocol reminder every morning. Reply STOP anytime to opt out.\n\nhspos-phase2.vercel.app`,
    });

    const twilioRes = await fetch(twilioUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: 'Basic ' + Buffer.from(`${accountSid}:${authToken}`).toString('base64'),
      },
      body: body.toString(),
    });

    const twilioData = await twilioRes.json();

    if (!twilioRes.ok) {
      // SMS failed but number is saved — don't block the user
      return res.status(200).json({
        success: true,
        smsSent: false,
        warning: 'Number saved. Confirmation SMS could not be sent.',
        code: twilioData.code,
      });
    }

    return res.status(200).json({
      success: true,
      smsSent: true,
    });

  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({ error: 'Registration failed', details: error.message });
  }
}
