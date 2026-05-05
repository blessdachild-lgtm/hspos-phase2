// api/kv-users.js
// Admin endpoint — view all registered SMS users
// Protected by CRON_SECRET so only you can access it
// Call: GET https://hspos-phase2.vercel.app/api/kv-users
// With header: Authorization: Bearer {CRON_SECRET}

import { Redis } from '@upstash/redis';

const redis = Redis.fromEnv();

export default async function handler(req, res) {
  // Protect endpoint
  const authHeader = req.headers['authorization'];
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const phones = await redis.smembers('registered_users');

    if (!phones || phones.length === 0) {
      return res.status(200).json({ total: 0, users: [] });
    }

    const users = [];

    for (const phone of phones) {
      const user = await redis.hgetall(`user:${phone}`);
      if (user) {
        users.push({
          phone: `***-***-${phone.slice(-4)}`, // masked for privacy
          moduleId: user.moduleId,
          dayIndex: user.dayIndex,
          frequency: user.frequency,
          active: user.active,
          registeredAt: user.registeredAt,
          lastSent: user.lastSent,
        });
      }
    }

    return res.status(200).json({
      total: users.length,
      users,
    });

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
