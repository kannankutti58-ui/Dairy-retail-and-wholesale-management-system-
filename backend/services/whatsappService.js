import axios from 'axios';

/**
 * Universal WhatsApp Multi-Gateway Service
 * Supports:
 * 1. UltraMsg (QR Code Instant WhatsApp API - No Meta Verification Needed)
 * 2. Meta WhatsApp Cloud API (Graph API v20.0+)
 * 3. Green-API / Maytapi
 * 4. Universal WhatsApp Web / Mobile Direct Deep Link Generator
 */
class WhatsAppService {
  constructor() {
    this.metaApiUrl = 'https://graph.facebook.com/v20.0';
    this.ultraMsgUrl = 'https://api.ultramsg.com';
  }

  getConfig() {
    // UltraMsg Config (QR Scan Instance API)
    const ultraInstanceId = process.env.ULTRAMSG_INSTANCE_ID;
    const ultraToken = process.env.ULTRAMSG_TOKEN;

    // Meta Cloud API Config
    const metaToken = process.env.META_WHATSAPP_TOKEN;
    const metaPhoneNumberId = process.env.META_PHONE_NUMBER_ID;
    const metaBusinessAccountId = process.env.META_BUSINESS_ACCOUNT_ID;

    // Green-API Config
    const greenInstanceId = process.env.GREEN_API_INSTANCE_ID;
    const greenToken = process.env.GREEN_API_TOKEN;

    let provider = 'DIRECT_WEB_LINK';
    let isConfigured = false;

    if (ultraInstanceId && ultraToken && !ultraInstanceId.includes('your_')) {
      provider = 'ULTRAMSG';
      isConfigured = true;
    } else if (metaToken && metaPhoneNumberId && !metaToken.includes('your_')) {
      provider = 'META_CLOUD_API';
      isConfigured = true;
    } else if (greenInstanceId && greenToken && !greenInstanceId.includes('your_')) {
      provider = 'GREEN_API';
      isConfigured = true;
    }

    return {
      provider,
      isConfigured,
      ultraInstanceId,
      ultraToken,
      metaToken,
      metaPhoneNumberId,
      metaBusinessAccountId,
      greenInstanceId,
      greenToken
    };
  }

  getStatus() {
    const config = this.getConfig();
    return {
      service: 'Universal WhatsApp Multi-Gateway',
      provider: config.provider,
      isConfigured: config.isConfigured,
      defaultTarget: '917604936341',
      mode: config.isConfigured ? `PRODUCTION_${config.provider}` : 'DIRECT_WEB_BRIDGE'
    };
  }

  /**
   * Format Indian Phone Number to WhatsApp international format (e.g., 917604936341)
   */
  formatPhoneNumber(phone) {
    if (!phone) return '917604936341';
    const digits = phone.toString().replace(/[^0-9]/g, '');
    if (digits.length === 10) return `91${digits}`;
    if (digits.length === 12 && digits.startsWith('91')) return digits;
    if (digits.length > 10) return digits;
    return '917604936341';
  }

  /**
   * Build Direct WhatsApp Web / App Link
   */
  buildDirectWhatsAppUrl(phone, message) {
    const formatted = this.formatPhoneNumber(phone);
    return `https://api.whatsapp.com/send?phone=${formatted}&text=${encodeURIComponent(message)}`;
  }

  /**
   * Send WhatsApp text / brochure / invoice message
   * @param {string} to - Recipient phone number (e.g. 7604936341)
   * @param {string} message - Text or formatted brochure content
   */
  async sendTextMessage(to, message) {
    const config = this.getConfig();
    const formattedTo = this.formatPhoneNumber(to);
    const directUrl = this.buildDirectWhatsAppUrl(to, message);

    // 1. UltraMsg Gateway (Instant QR Scan API)
    if (config.provider === 'ULTRAMSG') {
      try {
        const url = `${this.ultraMsgUrl}/${config.ultraInstanceId}/messages/chat`;
        const response = await axios.post(
          url,
          new URLSearchParams({
            token: config.ultraToken,
            to: formattedTo,
            body: message
          }),
          {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            timeout: 12000
          }
        );

        if (response.data?.sent === 'true' || response.data?.id) {
          return {
            success: true,
            configured: true,
            provider: 'ULTRAMSG',
            status: 'SENT_VIA_WHATSAPP',
            messageId: response.data.id,
            recipient: formattedTo,
            directUrl
          };
        }
      } catch (err) {
        console.error('[UltraMsg Error]:', err.response?.data || err.message);
      }
    }

    // 2. Meta WhatsApp Cloud API (Graph API v20.0+)
    if (config.provider === 'META_CLOUD_API') {
      try {
        const url = `${this.metaApiUrl}/${config.metaPhoneNumberId}/messages`;
        const response = await axios.post(
          url,
          {
            messaging_product: 'whatsapp',
            recipient_type: 'individual',
            to: formattedTo,
            type: 'text',
            text: { preview_url: false, body: message }
          },
          {
            headers: {
              'Authorization': `Bearer ${config.metaToken}`,
              'Content-Type': 'application/json'
            },
            timeout: 12000
          }
        );

        return {
          success: true,
          configured: true,
          provider: 'META_CLOUD_API',
          status: 'SENT_TO_META',
          messageId: response.data.messages?.[0]?.id,
          recipient: formattedTo,
          directUrl
        };
      } catch (err) {
        console.error('[Meta Cloud API Error]:', err.response?.data || err.message);
      }
    }

    // 3. Fallback: Universal Direct WhatsApp Web & App Bridge
    return {
      success: true,
      configured: false,
      provider: 'DIRECT_WEB_BRIDGE',
      status: 'WEB_READY',
      message: 'Opening instant WhatsApp chat prefilled with formatted content.',
      recipient: formattedTo,
      directUrl: directUrl
    };
  }

  /**
   * Send WhatsApp Media / Gift Brochure Flyer
   */
  async sendMediaMessage(to, imageUrl, caption = '') {
    const config = this.getConfig();
    const formattedTo = this.formatPhoneNumber(to);
    const directUrl = this.buildDirectWhatsAppUrl(to, caption);

    if (config.provider === 'ULTRAMSG') {
      try {
        const url = `${this.ultraMsgUrl}/${config.ultraInstanceId}/messages/image`;
        const response = await axios.post(
          url,
          new URLSearchParams({
            token: config.ultraToken,
            to: formattedTo,
            image: imageUrl,
            caption: caption
          }),
          { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
        );

        return {
          success: true,
          provider: 'ULTRAMSG',
          status: 'MEDIA_SENT',
          messageId: response.data?.id,
          recipient: formattedTo
        };
      } catch (err) {
        console.error('[UltraMsg Media Error]:', err.message);
      }
    }

    return {
      success: true,
      provider: 'DIRECT_WEB_BRIDGE',
      status: 'WEB_READY',
      recipient: formattedTo,
      directUrl
    };
  }
}

export const whatsAppService = new WhatsAppService();
