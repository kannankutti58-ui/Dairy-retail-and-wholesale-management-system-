import webpush from 'web-push';

/**
 * Web Push Notification Service (VAPID / Browser Push)
 * Used for instant cold storage freezer alerts and critical threshold monitoring
 */
class PushService {
  constructor() {
    this.subscriptions = new Map(); // Key: endpoint, Value: Subscription Object
    this.initVapid();
  }

  initVapid() {
    let publicKey = process.env.VAPID_PUBLIC_KEY;
    let privateKey = process.env.VAPID_PRIVATE_KEY;
    const subject = process.env.VAPID_SUBJECT || 'mailto:kuttiammal.dairy@gmail.com';

    // If no VAPID keys exist in .env, generate consistent keys for dev/session
    if (!publicKey || !privateKey || publicKey.includes('your_')) {
      const generated = webpush.generateVAPIDKeys();
      publicKey = generated.publicKey;
      privateKey = generated.privateKey;
      console.log('🔑 [PushService]: Auto-generated session VAPID keys for Web Push');
    }

    this.vapidPublicKey = publicKey;
    this.vapidPrivateKey = privateKey;
    this.vapidSubject = subject;

    try {
      webpush.setVapidDetails(this.vapidSubject, this.vapidPublicKey, this.vapidPrivateKey);
    } catch (err) {
      console.error('[PushService VAPID Init Error]:', err.message);
    }
  }

  getPublicKey() {
    return this.vapidPublicKey;
  }

  /**
   * Save client push subscription
   */
  addSubscription(subscription, clientInfo = {}) {
    if (!subscription || !subscription.endpoint) return false;
    this.subscriptions.set(subscription.endpoint, {
      subscription,
      clientInfo,
      subscribedAt: new Date().toISOString()
    });
    console.log(`📱 [PushService]: Registered push client (Total: ${this.subscriptions.size})`);
    return true;
  }

  /**
   * Remove client push subscription
   */
  removeSubscription(endpoint) {
    return this.subscriptions.delete(endpoint);
  }

  getSubscriptionsCount() {
    return this.subscriptions.size;
  }

  /**
   * Broadcast push notification to all subscribed devices
   */
  async broadcastNotification(payload) {
    const payloadStr = typeof payload === 'string' ? payload : JSON.stringify(payload);
    const results = [];
    const deadEndpoints = [];

    for (const [endpoint, entry] of this.subscriptions.entries()) {
      try {
        await webpush.sendNotification(entry.subscription, payloadStr, {
          urgency: 'high',
          TTL: 60 * 60 * 24 // 24 hours
        });
        results.push({ endpoint, status: 'DELIVERED' });
      } catch (error) {
        console.error(`[Push Notification Failed for endpoint]:`, error.statusCode || error.message);
        if (error.statusCode === 404 || error.statusCode === 410) {
          // Subscription has expired or is no longer valid
          deadEndpoints.push(endpoint);
        }
        results.push({ endpoint, status: 'FAILED', error: error.message });
      }
    }

    // Clean up expired endpoints
    for (const dead of deadEndpoints) {
      this.subscriptions.delete(dead);
    }

    return {
      sentCount: results.filter(r => r.status === 'DELIVERED').length,
      failedCount: results.filter(r => r.status === 'FAILED').length,
      totalSubscribers: this.subscriptions.size,
      results
    };
  }

  /**
   * Dispatch Freezer Critical Temperature Alert
   */
  async sendFreezerAlert({ temperature, target, threshold, shopName = "Kuttiammal's Dairy Hub" }) {
    const payload = {
      title: `🚨 Cold Storage Alert: ${temperature}°C!`,
      body: `CRITICAL: Freezer temp at ${shopName} reached ${temperature}°C (Limit: ${threshold}°C). Auxiliary cooling loop engaged.`,
      icon: '/kuttiammal_dairy_logo_1791197744218.jpg',
      badge: '/kuttiammal_dairy_logo_1791197744218.jpg',
      tag: 'freezer-critical-temp',
      data: {
        url: '/#freezer-monitor',
        type: 'FREEZER_ALERT',
        temperature,
        timestamp: new Date().toISOString()
      },
      actions: [
        { action: 'open_freezer', title: '❄️ Open Cold Storage' },
        { action: 'dismiss', title: 'Dismiss' }
      ]
    };

    return this.broadcastNotification(payload);
  }

  /**
   * Dispatch 5-Minute Reminder or Test Alert
   */
  async sendTestPushAlert({ note = '5-Minute Cold Storage Operational Health Check' } = {}) {
    const payload = {
      title: '🥛 Aavin Cold Storage: 5-Minute Check',
      body: `Notification System Online • ${note} • Deep Freezer running optimal at 3.2°C.`,
      icon: '/kuttiammal_dairy_logo_1791197744218.jpg',
      badge: '/kuttiammal_dairy_logo_1791197744218.jpg',
      tag: 'freezer-test-alert',
      data: {
        url: '/#freezer-monitor',
        type: 'TEST_ALERT',
        timestamp: new Date().toISOString()
      }
    };

    return this.broadcastNotification(payload);
  }
}

export const pushService = new PushService();
