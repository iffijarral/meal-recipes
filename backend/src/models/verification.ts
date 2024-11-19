import mongoose, { Schema, Document } from 'mongoose';

interface IVerification extends Document {
  userId: mongoose.Schema.Types.ObjectId;
  verificationToken: string;
  verificationTokenExpires: Date;
}

const verificationSchema: Schema<IVerification> = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  verificationToken: { type: String, required: true },
  verificationTokenExpires: { type: Date, required: true },
}, { timestamps: true });

const Verification = mongoose.model<IVerification>('Verification', verificationSchema);

export { Verification, IVerification };
