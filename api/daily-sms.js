// api/daily-sms.js
// Vercel Cron Job — runs at 8AM daily
// Reads all registered users from Upstash Redis
// Sends protocol-specific SMS to each user regardless of app open status

import { Redis } from '@upstash/redis';

const redis = Redis.fromEnv();

// Protocol presence messages — matches PRESENCE_MESSAGES in App.jsx
const PRESENCE_MESSAGES = {
  state: [
    "You're not trying to feel calmer today. You're teaching your body a repeatable baseline. Whether it works or not is irrelevant. Run the cycle.",
    "If you can't notice state shifts when nothing is at stake, you will miss them when it matters. Today is about noticing, not correcting.",
    "One cycle before entry. Not ten minutes. Not optimization. Regulation happens before contact or not at all.",
    "Today you're hunting for your spike signature. When it fires, don't fix it. Name it.",
    "MIRP must run during the spike, not after. Post-event awareness doesn't count.",
    "This is a real interaction. Manufactured reps don't install the system.",
    "You're not proving calm. You're proving recoverability. Catch, downshift, stay in, exit clean.",
  ],
  identity: [
    "Write this down. If it stays in your head, it won't hold under pressure.",
    "The exact moment the anchor weakens is the data. Don't smooth it. Locate it.",
    "Today is abstinence. Warmth comes back later. Right now you're isolating the habit.",
    "Interest is not a cue to escalate. Hold the same pace you had before it appeared.",
    "Validation today is currency, not comfort. If no one invested, nothing is owed.",
    "Correct with a pause, not performance. If you have to prove, the anchor slipped.",
    "Identity stability is proven when the room doesn't reward you.",
  ],
  decision: [
    "Every opening you don't take counts. Avoidance dressed as thinking is still avoidance.",
    "Find the exact sentence your brain uses. Once named, the script loses leverage.",
    "Three seconds is not time to decide. It's the window before the script closes it.",
    "First valid opening. No scanning. No rehearsing. Move.",
    "Today removes doubt. If the bottleneck was ability, volume would collapse you. It won't.",
    "State, Identity, Decision all run today. If one engine stalls, the loop breaks.",
    "Be precise. Which window closed because the script ran?",
  ],
  calibration: [
    "You are not broken. You're biased. Today isolates the distortion.",
    "If you can't name the signals, you will read emotion instead of evidence.",
    "No investment today. Accuracy improves when your ego is idle.",
    "Whatever you read, discount it once. This corrects for overperception.",
    "One test. One read. Then act or exit. Re-testing is force.",
    "Advance when signals cluster — not when you feel ready.",
    "Exit quality reveals calibration quality. Staying too long is misread data.",
  ],
};

const MODULE_TITLES = {
  state: "State Regulation",
  identity: "Identity & Foundation",
  decision: "Decision Engine",
  calibration: "Signal Calibration",
};

const DAY_TITLES = {
  state: ["Baseline Calibration", "State Awareness", "Pre-Contact Regulation", "Mid-Contact Awareness", "First MIRP Dry Run", "Sustained Regulation Rep", "System Test"],
  identity: ["Identity Audit", "Pressure Test the Anchor", "The Withhold Rep", "Pace Lock Under Green Signal", "Exchange vs. Give", "Full Loop With Identity Monitoring", "Outcome Independence Test"],
  decision: ["The Hesitation Audit", "Name the Override Script", "The 3-Second Rule", "Satisficing Under Pressure", "Multi-Rep Volume Day", "Full Loop Integration", "Missed Window Accountability"],
  calibration: ["Inflation Audit", "Signal Vocabulary Installation", "Observation-Only Rep", "Live Read With Discount", "The Yellow Test", "Advance Timing Rep", "Clean Exit Test"],
};

function buildMessage(moduleId, dayIndex) {
  const mod = moduleId || 'state';
  const day = Math.min(dayIndex || 0, 6);
  const title = MODULE_TITLES[mod] || 'HS-POS';
  const dayTitle = DAY_TITLES[mod]?.[day] || `Day ${day + 1}`;
  const presence = PRESENCE_MESSAGES[mod]?.[day] || '';

  return `HS-POS · ${title} · Day ${day + 1}: ${dayTitle}\n\n${presence}\n\nhspos-phase2.vercel.app`;
}

export default async function handler(req, res) {
  // Verify this is a legitimate cron call
  const authHeader = req.headers['authorization'];
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const from = process.env.TWILIO_PHONE_NUMBER;

  try {
    // Get all registered phone numbers
    const phones = await redis.smembers('registered_users');

    if (!phones || phones.length === 0) {
      return res.status(200).json({ message: 'No registered users', sent: 0 });
    }

    const results = { sent: 0, skipped: 0, failed: 0, errors: [] };
    const today = new Date().toDateString();

    for (const phone of phones) {
      try {
        const user = await redis.hgetall(`user:${phone}`);

        if (!user || !user.active || user.active === 'false') {
          results.skipped++;
          continue;
        }

        // Check frequency
        if (user.frequency === 'off') {
          results.skipped++;
          continue;
        }

        if (user.frequency === 'alternate' && user.lastSent) {
          const diffDays = Math.floor((new Date() - new Date(user.lastSent)) / (1000 * 60 * 60 * 24));
          if (diffDays < 2) {
            results.skipped++;
            continue;
          }
        }

        // Don't double-send today
        if (user.lastSent && new Date(user.lastSent).toDateString() === today) {
          results.skipped++;
          continue;
        }

        const message = buildMessage(user.moduleId, parseInt(user.dayIndex) || 0);

        const twilioUrl = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`;
        const body = new URLSearchParams({ To: phone, From: from, Body: message });

        const twilioRes = await fetch(twilioUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Authorization: 'Basic ' + Buffer.from(`${accountSid}:${authToken}`).toString('base64'),
          },
          body: body.toString(),
        });

        if (twilioRes.ok) {
          // Update last sent
          await redis.hset(`user:${phone}`, { lastSent: new Date().toISOString() });
          results.sent++;
        } else {
          const err = await twilioRes.json();
          results.failed++;
          results.errors.push({ phone: phone.slice(-4), error: err.message });
        }

        // Rate limit — 1 second between sends
        await new Promise(r => setTimeout(r, 1000));

      } catch (userError) {
        results.failed++;
        results.errors.push({ error: userError.message });
      }
    }

    return res.status(200).json({
      success: true,
      total: phones.length,
      ...results,
    });

  } catch (error) {
    console.error('Daily SMS cron error:', error);
    return res.status(500).json({ error: 'Cron job failed', details: error.message });
  }
}
