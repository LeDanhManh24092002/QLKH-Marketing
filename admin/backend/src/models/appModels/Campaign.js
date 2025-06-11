const mongoose = require('mongoose');

const campaignSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  startDate: Date,
  endDate: Date,
  budget: Number,
  status: String,
  profitStatus: { type: String, enum: ['profit', 'loss', 'neutral'], default: 'neutral' },
  created: { type: Date, default: Date.now },
  updated: { type: Date, default: Date.now }
});

campaignSchema.plugin(require('mongoose-autopopulate'));

module.exports = mongoose.model('Campaign', campaignSchema);