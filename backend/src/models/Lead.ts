import mongoose, { Document, Schema } from 'mongoose';

export enum LeadStatus {
  NEW = 'New',
  CONTACTED = 'Contacted',
  QUALIFIED = 'Qualified',
  LOST = 'Lost',
}

export enum LeadSource {
  WEBSITE = 'Website',
  INSTAGRAM = 'Instagram',
  REFERRAL = 'Referral',
}

export interface ILead extends Document {
  name: string;
  email: string;
  status: LeadStatus;
  source: LeadSource;
  createdAt: Date;
  updatedAt: Date;
}

const leadSchema = new Schema<ILead>(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(LeadStatus),
      default: LeadStatus.NEW,
    },
    source: {
      type: String,
      enum: Object.values(LeadSource),
      required: true,
    },
  },
  {
    timestamps: true, // Automatically manages createdAt and updatedAt
  }
);

// Indexes for faster search and filtering
leadSchema.index({ name: 'text', email: 'text' });
leadSchema.index({ status: 1 });
leadSchema.index({ source: 1 });

const Lead = mongoose.model<ILead>('Lead', leadSchema);

export default Lead;
