import { Schema, model, Document, Model } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser {
  username: string;
  email: string;
  passwordHash: string;
  role: 'admin';
}

export interface IUserDocument extends IUser, Document {
  comparePassword(candidate: string): Promise<boolean>;
}

interface IUserModel extends Model<IUserDocument> {
  hashPassword(plain: string): Promise<string>;
}

const userSchema = new Schema<IUserDocument, IUserModel>(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      minlength: 3,
      maxlength: 40,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Invalid email address'],
    },
    passwordHash: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ['admin'],
      default: 'admin',
      required: true,
    },
  },
  { timestamps: true }
);

// Never expose the hash in API responses / JSON.stringify output.
userSchema.set('toJSON', {
  transform: (_doc, ret) => {
    const { passwordHash: _omit, ...safe } = ret;
    return safe;
  },
});

/**
 * Instance method: compares a plaintext candidate password against the
 * stored bcrypt hash. Used by the login controller.
 */
userSchema.methods.comparePassword = function (candidate: string): Promise<boolean> {
  return bcrypt.compare(candidate, this.passwordHash);
};

/**
 * Static helper so controllers/seed scripts never call bcrypt directly —
 * keeps the hashing cost factor centralized in one place.
 */
userSchema.statics.hashPassword = function (plain: string): Promise<string> {
  const SALT_ROUNDS = 12;
  return bcrypt.hash(plain, SALT_ROUNDS);
};

export const User = model<IUserDocument, IUserModel>('User', userSchema);
