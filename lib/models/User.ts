import mongoose, { Schema, Document, Model } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;

  // 🔐 reset password fields
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;

  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      index: true,
    },

    password: {
      type: String,
      required: true,
    },

    // 🔐 reset password
    resetPasswordToken: {
      type: String,
    },

    resetPasswordExpires: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent model overwrite on hot reload
const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default User;
