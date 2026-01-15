import mongoose, { Schema, Document, Model } from "mongoose";

export interface IProduct extends Document {
  userId: mongoose.Types.ObjectId;
  name: string;
  description?: string;
  price: number;
  category: string;
  stock: number;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new Schema<IProduct>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true, // 🔥 critical for user-specific queries
    },
    name: {
      type: String,
      required: true,
      trim: true,
      index: true, // 🔍 search optimization
    },
    description: {
      type: String,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
      index: true,
    },
    category: {
      type: String,
      required: true,
      index: true,
    },
    stock: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent model overwrite on hot reload
const Product: Model<IProduct> =
  mongoose.models.Product || mongoose.model<IProduct>("Product", ProductSchema);

export default Product;
