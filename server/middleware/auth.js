import jwt from 'jsonwebtoken';

export const JWT_SECRET = process.env.JWT_SECRET || 'aavin_dairy_hub_secure_jwt_secret_kovilpatti_2026';

export const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id || user.id,
      username: user.username,
      name: user.name,
      role: user.role,
      phone: user.phone || '9443442471',
      cardNumber: user.cardNumber || '',
      businessName: user.businessName || '',
      email: user.email || ''
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
};

export const verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || req.headers['x-auth-token'];
    
    let token = '';
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    } else if (authHeader) {
      token = authHeader;
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No JWT token provided in Authorization header.'
      });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired JWT token',
      error: error.message
    });
  }
};

export const requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Unauthorized. Please login.' });
    }
    if (!allowedRoles.includes(req.user.role) && req.user.role !== 'admin' && req.user.role !== 'proprietor') {
      return res.status(403).json({
        success: false,
        message: `Forbidden: Access requires one of roles: [${allowedRoles.join(', ')}]. Current role: ${req.user.role}`
      });
    }
    next();
  };
};
