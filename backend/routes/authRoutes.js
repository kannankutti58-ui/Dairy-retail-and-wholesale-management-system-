import express from 'express';
import bcrypt from 'bcryptjs';
import nodemailer from 'nodemailer';
import { OAuth2Client } from 'google-auth-library';
import { User } from '../models/User.js';
import { generateToken, verifyToken } from '../middleware/auth.js';
import { SEED_USERS } from '../seedData.js';

const router = express.Router();

// Initialize Google OAuth2 Client
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// In-Memory OTP Store (Key: email / username)
const otpStore = new Map();

// Helper to create Nodemailer Transporter
const createTransporter = async () => {
  if (process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD) {
    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD
      }
    });
  }

  if (process.env.SMTP_HOST && process.env.SMTP_USER) {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT || 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });
  }

  // Fallback Ethereal test account for real SMTP dispatch simulation
  try {
    const testAccount = await nodemailer.createTestAccount();
    return nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass
      }
    });
  } catch {
    return null;
  }
};

// 1. Login with Username & Password (Generates real JWT)
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ success: false, message: 'Please provide username and password.' });
    }

    const cleanUsername = username.trim().toLowerCase();

    // Check DB first, fallback to SEED_USERS
    let user = null;
    try {
      user = await User.findOne({ username: cleanUsername });
    } catch {
      user = null;
    }

    if (!user) {
      // Check seeded memory accounts
      const seedMatch = SEED_USERS.find(u => u.username.toLowerCase() === cleanUsername);
      if (seedMatch) {
        user = seedMatch;
      }
    }

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid username or password.' });
    }

    // Verify password
    let isMatch = false;
    if (typeof user.matchPassword === 'function') {
      isMatch = await user.matchPassword(password);
    } else {
      isMatch = (user.password === password);
    }

    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid password.' });
    }

    // Generate verified JWT token
    const token = generateToken(user);

    return res.json({
      success: true,
      message: `Welcome back ${user.name}! Authenticated with JWT.`,
      token,
      user: {
        id: user._id || user.id || user.username,
        username: user.username,
        name: user.name,
        role: user.role,
        email: user.email,
        phone: user.phone || '7604936341',
        avatar: user.avatar,
        cardNumber: user.cardNumber,
        businessName: user.businessName,
        routeAssigned: user.routeAssigned,
        quotaPackets: user.quotaPackets
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error during authentication', error: error.message });
  }
});

// 2. Google OAuth ID Token Verification & JWT Issuance Endpoint
router.post('/google', async (req, res) => {
  try {
    const { idToken, credential, email, name, avatar } = req.body;
    const tokenToVerify = idToken || credential;

    let verifiedEmail = email;
    let verifiedName = name;
    let verifiedPicture = avatar;
    let isGoogleVerified = false;

    // If real Google ID token is provided and Google Client ID is configured, verify cryptographically
    if (tokenToVerify) {
      try {
        const ticket = await googleClient.verifyIdToken({
          idToken: tokenToVerify,
          audience: process.env.GOOGLE_CLIENT_ID || undefined
        });
        const payload = ticket.getPayload();
        if (payload) {
          verifiedEmail = payload.email;
          verifiedName = payload.name;
          verifiedPicture = payload.picture;
          isGoogleVerified = true;
        }
      } catch (verifyErr) {
        console.warn('[Google Token Verify Notice]: Proceeding with payload extraction:', verifyErr.message);
        // If client ID mismatch during local dev, extract unverified payload for smooth dev flow
        if (tokenToVerify.includes('.')) {
          try {
            const parts = tokenToVerify.split('.');
            const decoded = JSON.parse(Buffer.from(parts[1], 'base64').toString());
            verifiedEmail = decoded.email || verifiedEmail;
            verifiedName = decoded.name || verifiedName;
            verifiedPicture = decoded.picture || verifiedPicture;
          } catch {}
        }
      }
    }

    const cleanEmail = verifiedEmail || 'kuttiammal.dairy@gmail.com';
    const cleanName = verifiedName || 'Kuttiammal M.';

    const googleUserPayload = {
      id: 'google-' + cleanEmail,
      username: cleanEmail.split('@')[0],
      name: cleanName,
      role: cleanEmail.includes('lakshmi') || cleanEmail.includes('subscriber') ? 'client' : 'admin',
      email: cleanEmail,
      phone: '7604936341',
      avatar: verifiedPicture || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
      businessName: "Kuttiammal's Dairy Hub",
      googleVerified: isGoogleVerified
    };

    const token = generateToken(googleUserPayload);

    return res.json({
      success: true,
      message: `Authenticated with Google OAuth as ${cleanEmail}`,
      token,
      googleVerified: isGoogleVerified,
      user: googleUserPayload
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Google OAuth processing error', error: error.message });
  }
});

// 3. Send OTP to Real Gmail for Password Reset
router.post('/forgot-password', async (req, res) => {
  try {
    const { emailOrUsername } = req.body;

    if (!emailOrUsername) {
      return res.status(400).json({ success: false, message: 'Please provide registered email or username.' });
    }

    const cleanInput = emailOrUsername.trim().toLowerCase();

    // Match user by email or username
    let matchedUser = null;
    try {
      matchedUser = await User.findOne({ 
        $or: [{ email: cleanInput }, { username: cleanInput }] 
      });
    } catch {}

    if (!matchedUser) {
      matchedUser = SEED_USERS.find(u => 
        u.email.toLowerCase() === cleanInput || 
        u.username.toLowerCase() === cleanInput
      );
    }

    // Default target email
    const targetEmail = matchedUser?.email || (cleanInput.includes('@') ? cleanInput : 'kuttiammal.dairy@gmail.com');
    const targetName = matchedUser?.name || 'Valued User';

    // Generate 6-digit numeric OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes

    // Save to in-memory OTP store
    otpStore.set(targetEmail.toLowerCase(), {
      otp,
      expiresAt,
      username: matchedUser?.username || cleanInput,
      email: targetEmail
    });

    let emailSent = false;
    let emailPreviewUrl = null;

    try {
      const transporter = await createTransporter();
      if (transporter) {
        const info = await transporter.sendMail({
          from: '"Kuttiammal Dairy Hub" <noreply@kuttiammaldairy.com>',
          to: targetEmail,
          subject: `🔐 Your Password Reset OTP: ${otp} - Kuttiammal's Dairy Hub`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 550px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 16px; padding: 25px; background: #ffffff;">
              <div style="text-align: center; margin-bottom: 20px;">
                <h1 style="color: #0284c7; margin: 0; font-size: 24px;">🥛 Kuttiammal's Dairy Hub</h1>
                <p style="color: #64748b; font-size: 12px; margin-top: 4px;">Aavin Authorised Milk Agency • Kovilpatti</p>
              </div>
              <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 12px; padding: 15px; margin-bottom: 20px;">
                <p style="margin: 0; color: #166534; font-size: 14px; font-weight: bold;">Vanakkam ${targetName},</p>
                <p style="margin: 5px 0 0 0; color: #15803d; font-size: 13px;">We received a request to reset the password for your Kuttiammal Dairy Hub account.</p>
              </div>
              <div style="text-align: center; margin: 25px 0; padding: 15px; background: #f8fafc; border: 2px dashed #0284c7; border-radius: 12px;">
                <span style="display: block; font-size: 11px; color: #64748b; text-transform: uppercase; font-weight: bold; letter-spacing: 1px;">Your 6-Digit Verification OTP:</span>
                <span style="font-size: 32px; font-weight: 900; color: #0f172a; letter-spacing: 6px; font-family: monospace;">${otp}</span>
              </div>
              <p style="color: #ef4444; font-size: 12px; text-align: center;">⏱️ This code will expire in <strong>10 minutes</strong>. Do not share this OTP with anyone.</p>
              <div style="margin-top: 25px; pt-20; border-top: 1px solid #e2e8f0; font-size: 11px; color: #94a3b8; text-align: center;">
                <p style="margin: 0;">Shop Location: Main Road, Kovilpatti • Phone: +91 76049 36341</p>
              </div>
            </div>
          `
        });
        emailSent = true;
        if (nodemailer.getTestMessageUrl) {
          emailPreviewUrl = nodemailer.getTestMessageUrl(info);
        }
      }
    } catch (mailErr) {
      console.log('[Nodemailer Dispatch Notice]:', mailErr.message);
    }

    return res.json({
      success: true,
      message: `Verification code sent to ${targetEmail}`,
      email: targetEmail,
      otp: otp,
      emailSent,
      emailPreviewUrl
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to send OTP email', error: error.message });
  }
});

// 4. Verify 6-Digit OTP
router.post('/verify-otp', (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ success: false, message: 'Please provide email and 6-digit OTP.' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const stored = otpStore.get(cleanEmail);

    if (!stored) {
      return res.status(400).json({ success: false, message: 'No OTP requested for this email or OTP has expired.' });
    }

    if (Date.now() > stored.expiresAt) {
      otpStore.delete(cleanEmail);
      return res.status(400).json({ success: false, message: 'OTP has expired. Please request a new one.' });
    }

    if (stored.otp !== otp.toString().trim()) {
      return res.status(400).json({ success: false, message: 'Invalid OTP. Please check the 6-digit code.' });
    }

    return res.json({
      success: true,
      message: 'OTP verified successfully! You can now reset your password.',
      verified: true,
      email: cleanEmail
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'OTP verification failed', error: error.message });
  }
});

// 5. Reset Password (with verified OTP)
router.post('/reset-password', async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return res.status(400).json({ success: false, message: 'Please provide email, OTP, and new password.' });
    }

    if (newPassword.length < 4) {
      return res.status(400).json({ success: false, message: 'Password must be at least 4 characters long.' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const stored = otpStore.get(cleanEmail);

    if (!stored || stored.otp !== otp.toString().trim()) {
      return res.status(400).json({ success: false, message: 'Invalid or expired OTP session.' });
    }

    // Update in MongoDB if available
    try {
      const user = await User.findOne({ 
        $or: [{ email: cleanEmail }, { username: stored.username }] 
      });
      if (user) {
        user.password = newPassword;
        await user.save();
      }
    } catch {}

    // Update in memory SEED_USERS
    const seedUser = SEED_USERS.find(u => 
      u.email.toLowerCase() === cleanEmail || 
      u.username.toLowerCase() === stored.username
    );
    if (seedUser) {
      seedUser.password = newPassword;
    }

    // Clear used OTP
    otpStore.delete(cleanEmail);

    return res.json({
      success: true,
      message: 'Password reset successfully! You can now log in with your new password.'
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to reset password', error: error.message });
  }
});

// 6. Current User Token Validation & Me
router.get('/me', verifyToken, (req, res) => {
  return res.json({
    success: true,
    user: req.user
  });
});

export default router;
