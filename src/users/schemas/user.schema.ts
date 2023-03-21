import { Schema } from 'mongoose';

export const UserSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: {
        values: ['admin', 'client', 'super-user', 'SEO'],
        message: '{VALUE} is not supported',
        default: 'client',
        required: true,
      },
    },
  },
  {
    timestamps: true,
  },
);
