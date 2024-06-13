import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    campaigns: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Campaign",
        required: true,
      }
    ]
  },
  {
    timestamps: true,
  }
);

// Match user entered password to hashed password in database
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Encrypt password using bcrypt
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Method to add a campaign to the user's campaigns array
userSchema.methods.addCampaign = async function (campaignId) {
  if (!this.campaigns.includes(campaignId)) {
    this.campaigns.push(campaignId);
    await this.save();
  }
};

const User = mongoose.model('User', userSchema);

export default User;
