import mongoose from 'mongoose';

// Define enums for day frequency and time slots
const dayFrequencyEnum = ['Daily', 'Weekly', 'Monthly'];
const timeSlotsEnum = ['Morning', 'Afternoon', 'Evening', 'Night'];

// Define the schema
const campaignSchema = new mongoose.Schema({
  createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
      },
  campaignName: {
    type: String,
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  totalBudget: {
    type: Number,
    min: [5000, 'Enter a valid amount'],
    required: true
  },
  mediaFile: {
    type: String,
    required: true
  },
  locations: [{
    type: String,
    required: true
  }],
  dayFrequency: {
    type: String,
    enum: dayFrequencyEnum,
    required: true
  },
  timeSlots: [{
    type: String,
    enum: timeSlotsEnum,
    required: true
  }],
  hoursLeft: {
    type: Number,
    default: function() {
      const hourlyRate = 50; // Example hourly rate
      return this.totalBudget / hourlyRate;
    }},
    dayFrequency: {
      type: String,
      required:true
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid'],
      default: 'pending',
    },
    razorpay_order_id: {
      type: String,
      default:'null'
    },
    razorpay_payment_id: {
      type: String,
      default:'null'
    },
    razorpay_signature: {
      type: String,
      default:'null'
    },

},
{
  timestamps: true,
});

// Create the model
const Campaign = mongoose.model('Campaign', campaignSchema);

export default Campaign;
