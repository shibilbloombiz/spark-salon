import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { Admin } from '../models/Admin.js';

export interface AuthRequest extends Request {
  admin?: {
    id: string;
    email: string;
    name: string;
    role: string;
  };
}

const JWT_SECRET = process.env.JWT_SECRET || 'spark_salon_super_secret_jwt_key_2026_luxury_atelier_production';

export async function requireAuth(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const token = req.cookies?.spark_admin_token || req.headers.authorization?.replace(/^Bearer\s+/i, '');

    if (!token) {
      res.status(401).json({ error: 'Unauthorized: Session missing or expired. Please sign in.' });
      return;
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { id: string; email: string; name: string; role: string };
    
    // Verify admin still exists and isActive
    const admin = await Admin.findById(decoded.id);
    if (!admin || !admin.isActive) {
      res.status(401).json({ error: 'Unauthorized: Account deactivated or not found.' });
      return;
    }

    // CSRF Check for mutative operations
    const method = req.method.toUpperCase();
    if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
      // Exclude login/logout from CSRF check
      const isLoginOrLogout = req.path.endsWith('/login') || req.path.endsWith('/logout');
      if (!isLoginOrLogout) {
        const clientCsrf = req.headers['x-csrf-token'];
        const cookieCsrf = req.cookies?.spark_csrf_token;
        if (!clientCsrf || !cookieCsrf || clientCsrf !== cookieCsrf) {
          res.status(403).json({ error: 'Invalid or missing CSRF token.' });
          return;
        }
      }
    }

    req.admin = {
      id: admin._id.toString(),
      email: admin.email,
      name: admin.name,
      role: admin.role,
    };

    next();
  } catch (err: any) {
    res.status(401).json({ error: 'Unauthorized: Invalid session token.' });
  }
}

