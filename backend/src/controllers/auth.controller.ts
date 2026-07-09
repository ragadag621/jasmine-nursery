import { Request, Response } from 'express';
import { User } from '../models';
import { ApiError } from '../utils/ApiError';
import { asyncHandler } from '../utils/asyncHandler';
import { signToken, setAuthCookie, clearAuthCookie } from '../utils/token';
import { LoginInput } from '../validators/auth.validator';

/**
 * POST /api/auth/login
 * Verifies credentials, issues a JWT, and sets it as an httpOnly cookie.
 * The token itself is NEVER included in the JSON response body — only the
 * safe-to-expose admin profile is returned. The cookie is the sole auth
 * transport for this app (see utils/token.ts and middleware/auth.middleware.ts).
 */
export const login = asyncHandler(async (req: Request, res: Response) => {
  const { username, password } = req.body as LoginInput;

  // Same generic error for "user not found" and "wrong password" so a
  // login form can't be used to enumerate valid usernames.
  const invalidCredentialsError = ApiError.unauthorized('Invalid username or password');

  const user = await User.findOne({ username: username.toLowerCase() });
  if (!user) {
    throw invalidCredentialsError;
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw invalidCredentialsError;
  }

  const token = signToken({ id: user.id as string, role: user.role });
  setAuthCookie(res, token);

  res.status(200).json({
    success: true,
    message: 'Logged in successfully',
    data: {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
    },
  });
});

/**
 * POST /api/auth/logout
 * Clears the httpOnly auth cookie. No DB-side session to invalidate since
 * auth is stateless JWT — the cookie removal is sufficient for this
 * single-admin app.
 */
export const logout = asyncHandler(async (_req: Request, res: Response) => {
  clearAuthCookie(res);
  res.status(200).json({
    success: true,
    message: 'Logged out successfully',
  });
});

/**
 * GET /api/auth/me
 * Requires verifyToken to have already run. Returns the current admin's
 * profile — this is the endpoint the frontend's AuthContext calls on
 * mount to determine "am I logged in?" purely from the browser's cookie.
 */
export const getCurrentAdmin = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw ApiError.unauthorized('Authentication required');
  }

  const user = await User.findById(req.user.id);
  if (!user) {
    throw ApiError.unauthorized('Account no longer exists');
  }

  res.status(200).json({
    success: true,
    data: {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
    },
  });
});
