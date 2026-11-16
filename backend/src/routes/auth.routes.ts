import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import rateLimit from 'express-rate-limit';
import { Admin } from '../models/Admin.js';
import { LoginSchema, formatZodErrors } from '../validators/schemas.js';
import { requireAuth, AuthRequest } from '../middleware/auth.js';

export const authRouter = Router();

const JWT_SECRET = process.env.JWT_SECRET || 'spark_salon_super_secret_jwt_key_2026_luxury_atelier_production';
const isProd = process.env.NODE_ENV === 'production';

// Rate limiting on login: max 15 attempts per 15 minutes
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 15,
  message: { error: 'Too many login attempts. Please try again in 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * POST /api/admin/login
 */
authRouter.post('/login', loginLimiter, async (req: Request, res: Response): Promise<void> => {
  const result = LoginSchema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json({ errors: formatZodErrors(result.error) });
    return;
  }

  const { email, password } = result.data;

  try {
    const admin = await Admin.findOne({ email });
    if (!admin || !admin.isActive) {
      res.status(401).json({ error: 'Invalid email or password.' });
      return;
    }

    const isMatch = await bcrypt.compare(password, admin.passwordHash);
    if (!isMatch) {
      res.status(401).json({ error: 'Invalid email or password.' });
      return;
    }

    // Generate JWT & CSRF Token
    const payload = {
      id: admin._id.toString(),
      email: admin.email,
      name: admin.name,
      role: admin.role,
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' });
    const csrfToken = crypto.randomBytes(32).toString('hex');

    // Set secure HTTP-only cookie
    res.cookie('spark_admin_token', token, {
      httpOnly: true,
      secure: isProd,
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000,
      path: '/',
    });

    // Set CSRF cookie (readable by JS to include in headers)
    res.cookie('spark_csrf_token', csrfToken, {
      httpOnly: false,
      secure: isProd,
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000,
      path: '/',
    });

    res.json({
      success: true,
      admin: {
        id: admin._id,
        email: admin.email,
        name: admin.name,
        role: admin.role,
      },
      csrfToken,
    });
  } catch (error: any) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error during login.' });
  }
});

/**
 * POST /api/admin/logout
 */
authRouter.post('/logout', (req: Request, res: Response): void => {
  res.clearCookie('spark_admin_token', { path: '/' });
  res.clearCookie('spark_csrf_token', { path: '/' });
  res.json({ success: true, message: 'Logged out successfully.' });
});

/**
 * GET /api/admin/me
 */
authRouter.get('/me', requireAuth, (req: AuthRequest, res: Response): void => {
  const csrfToken = req.cookies?.spark_csrf_token;
  res.json({
    success: true,
    admin: req.admin,
    csrfToken,
  });
});

