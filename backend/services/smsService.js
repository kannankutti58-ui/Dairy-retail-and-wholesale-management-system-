import axios from 'axios';

/**
 * Indian SMS Gateway Service
 * Supports Fast2SMS (DLT / Quick SMS), MSG91, and Twilio for Indian +91 numbers
 */
class SmsService {
  constructor() {
    this.fast2SmsUrl = 'https://www.fast2sms.com/dev/bulkV2';
  }

  getConfig() {
    const fast2SmsKey = process.env.FAST2SMS_API_KEY;
    const msg91AuthKey = process.env.MSG91_AUTH_KEY;
    const twilioAccountSid = process.env.TWILIO_ACCOUNT_SID;
    const twilioAuthToken = process.env.TWILIO_AUTH_TOKEN;

    let provider = 'NONE';
    let isConfigured = false;

    if (fast2SmsKey && !fast2SmsKey.includes('your_')) {
      provider = 'FAST2SMS';
      isConfigured = true;
    } else if (msg91AuthKey && !msg91AuthKey.includes('your_')) {
      provider = 'MSG91';
      isConfigured = true;
    } else if (twilioAccountSid && twilioAuthToken && !twilioAccountSid.includes('your_')) {
      provider = 'TWILIO';
      isConfigured = true;
    }

    return {
      provider,
      isConfigured,
      fast2SmsKey,
      msg91AuthKey,
      twilioAccountSid,
      twilioAuthToken,
      twilioPhone: process.env.TWILIO_PHONE_NUMBER
    };
  }

  getStatus() {
    const config = this.getConfig();
    return {
      service: 'Indian Telecom SMS Gateway',
      provider: config.provider,
      isConfigured: config.isConfigured,
      dltHeader: 'VK-AAVIN',
      mode: config.isConfigured ? 'PRODUCTION_GATEWAY' : 'DEVELOPMENT_FALLBACK'
    };
  }

  /**
   * Clean 10-digit Indian Mobile Number
   */
  formatIndianPhone(phone) {
    if (!phone) return '';
    const digits = phone.toString().replace(/[^0-9]/g, '');
    if (digits.length === 10) return digits;
    if (digits.length === 12 && digits.startsWith('91')) return digits.slice(2);
    if (digits.length > 10) return digits.slice(-10);
    return digits;
  }

  /**
   * Send SMS via active provider
   */
  async sendSms(phone, message) {
    const config = this.getConfig();
    const cleanPhone = this.formatIndianPhone(phone);

    if (!cleanPhone || cleanPhone.length !== 10) {
      return {
        success: false,
        error: 'Invalid 10-digit Indian mobile number',
        phone
      };
    }

    if (!config.isConfigured) {
      return {
        success: false,
        configured: false,
        status: 'NOT_CONFIGURED',
        provider: 'NONE',
        message: 'SMS Gateway credentials (FAST2SMS_API_KEY, MSG91_AUTH_KEY, or TWILIO) not configured in .env',
        phone: cleanPhone,
        nativeSmsUrl: `sms:+91${cleanPhone}?body=${encodeURIComponent(message)}`
      };
    }

    if (config.provider === 'FAST2SMS') {
      try {
        const response = await axios.post(
          this.fast2SmsUrl,
          {
            route: 'v3',
            sender_id: 'TXTIND',
            message: message,
            language: 'english',
            flash: 0,
            numbers: cleanPhone
          },
          {
            headers: {
              'authorization': config.fast2SmsKey,
              'Content-Type': 'application/json'
            },
            timeout: 10000
          }
        );

        if (response.data?.return === true) {
          return {
            success: true,
            configured: true,
            provider: 'FAST2SMS',
            status: 'DELIVERED_TO_OPERATOR',
            requestId: response.data.request_id,
            phone: cleanPhone,
            message: 'SMS submitted to telecom operator successfully'
          };
        } else {
          return {
            success: false,
            configured: true,
            provider: 'FAST2SMS',
            status: 'GATEWAY_ERROR',
            error: response.data?.message?.[0] || 'Unknown Fast2SMS response',
            phone: cleanPhone
          };
        }
      } catch (error) {
        return {
          success: false,
          configured: true,
          provider: 'FAST2SMS',
          status: 'HTTP_ERROR',
          error: error.response?.data?.message || error.message,
          phone: cleanPhone
        };
      }
    }

    return {
      success: false,
      configured: false,
      status: 'NOT_CONFIGURED',
      message: 'Active provider not recognized'
    };
  }
}

export const smsService = new SmsService();
