import mongoose, { Document, Schema, Model } from 'mongoose';

export interface ICategory extends Document {
  name: string;
  color: string;
  owner: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const categorySchema = new Schema<ICategory>(
  {
    name: {
      type: String,
      required: [true, 'Category name is required'],
      trim: true,
      maxlength: [50, 'Category name cannot exceed 50 characters'],
    },
    color: {
      type: String,
      default: '#6366f1',
      match: [/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/, 'Invalid hex color code'],
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Category owner is required'],
      index: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (_doc, ret) => {
        delete (ret as any).__v;
        return ret;
      },
    },
  }
);

categorySchema.index({ owner: 1, name: 1 }, { unique: true });

export const Category: Model<ICategory> =
  mongoose.models.Category || mongoose.model<ICategory>('Category', categorySchema);
