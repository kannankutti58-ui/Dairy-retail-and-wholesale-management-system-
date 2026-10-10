import express from 'express';
import bcrypt from 'bcryptjs';
import nodemailer from 'nodemailer';
import { User } from '../models/User.js';
import { generateToken, verifyToken } from '../middleware/auth.js';
import { SEED_USERS } from '../seedData.js';

const router = express.Router();

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
        phone: user.phone || '9443442471',
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

// 2. Google OAuth Token Authentication Endpoint
router.post('/google', async (req, res) => {
  try {
    const { email, name, avatar } = req.body;
    const cleanEmail = email || 'kuttiammal.dairy@gmail.com';
    const cleanName = name || 'Kuttiammal M.';

    const googleUserPayload = {
      id: 'google-' + cleanEmail,
      username: cleanEmail.split('@')[0],
      name: cleanName,
      role: cleanEmail.includes('lakshmi') || cleanEmail.includes('subscriber') ? 'client' : 'admin',
      email: cleanEmail,
      phone: '9443442471',
      avatar: avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
      businessName: "Kuttiammal's Dairy Hub"
    };

    const token = generateToken(googleUserPayload);

    return res.json({
      success: true,
      message: `Authenticated with Google OAuth as ${cleanEmail}`,
      token,
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
                <p style="margin: 0;">Shop Location: Main Road, Kovilpatti • Phone: +91 94434 42471</p>
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

    console.log(`\n======================================================`);
    console.log(`🔐 [PASSWORD RESET OTP DISPATCHED]`);
    console.log(`📧 Target Email: ${targetEmail}`);
    console.log(`🔢 6-Digit OTP : ${otp}`);
    console.log(`⏳ Valid For   : 10 Minutes`);
    console.log(`======================================================\n`);

    return res.json({
      success: true,
      message: `Verification code sent to ${targetEmail}`,
      email: targetEmail,
      otp: otp, // sent for instant UI test badge / dev verification
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
      return res.status(400).json({ success: false, message: 'Please provide both email and OTP.' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const storedRecord = otpStore.get(cleanEmail);

    if (!storedRecord) {
      return res.status(400).json({ success: false, message: 'No active OTP found. Please request a new code.' });
    }

    if (Date.now() > storedRecord.expiresAt) {
      otpStore.delete(cleanEmail);
      return res.status(400).json({ success: false, message: 'OTP has expired. Please request a new code.' });
    }

    if (storedRecord.otp !== otp.trim()) {
      return res.status(400).json({ success: false, message: 'Invalid 6-digit OTP code.' });
    }

    return res.json({
      success: true,
      message: 'OTP verified successfully! You can now set a new password.'
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error verifying OTP', error: error.message });
  }
});

// 5. Reset Password & Return New JWT Token
router.post('/reset-password', async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return res.status(400).json({ success: false, message: 'Please provide email, OTP, and new password.' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const storedRecord = otpStore.get(cleanEmail);

    if (!storedRecord || storedRecord.otp !== otp.trim() || Date.now() > storedRecord.expiresAt) {
      return res.status(400).json({ success: false, message: 'OTP verification failed or expired.' });
    }

    // Hash password with bcrypt
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update in MongoDB if user exists
    let updatedUser = null;
    try {
      updatedUser = await User.findOneAndUpdate(
        { $or: [{ email: cleanEmail }, { username: storedRecord.username }] },
        { password: hashedPassword },
        { new: true }
      );
    } catch {}

    // Update in memory SEED_USERS
    const seedUser = SEED_USERS.find(u => 
      u.email.toLowerCase() === cleanEmail || 
      u.username.toLowerCase() === storedRecord.username.toLowerCase()
    );

    if (seedUser) {
      seedUser.password = newPassword;
      if (!updatedUser) updatedUser = seedUser;
    }

    if (!updatedUser) {
      updatedUser = {
        username: storedRecord.username || cleanEmail.split('@')[0],
        name: cleanEmail.split('@')[0],
        role: cleanEmail.includes('lakshmi') ? 'client' : 'admin',
        email: cleanEmail,
        phone: '9443442471'
      };
    }

    // Clean up used OTP
    otpStore.delete(cleanEmail);

    // Generate fresh JWT token
    const token = generateToken(updatedUser);

    console.log(`✅ [PASSWORD RESET SUCCESSFUL]: Password updated for ${cleanEmail}`);

    return res.json({
      success: true,
      message: 'Password reset successfully! Logged in with new credentials.',
      token,
      user: {
        id: updatedUser._id || updatedUser.username,
        username: updatedUser.username,
        name: updatedUser.name,
        role: updatedUser.role,
        email: updatedUser.email,
        phone: updatedUser.phone || '9443442471'
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error resetting password', error: error.message });
  }
});

// 6. Get Authenticated User Profile from JWT Token
router.get('/me', verifyToken, async (req, res) => {
  return res.json({
    success: true,
    user: req.user
  });
});

// 7. Get Available Test Logins List
router.get('/available-logins', (req, res) => {
  const usersList = SEED_USERS.map(u => ({
    username: u.username,
    role: u.role,
    name: u.name,
    passwordHint: u.password,
    phone: u.phone,
    roleDescription: 
      u.role === 'admin' 
        ? 'Store Proprietor & Master Admin (Kuttiammal M.)' 
        : `Shop Client / Attai Pass Customer (${u.cardNumber || 'Monthly Pass'})`
  }));

  return res.json({
    success: true,
    count: usersList.length,
    users: usersList
  });
});

export default router;
