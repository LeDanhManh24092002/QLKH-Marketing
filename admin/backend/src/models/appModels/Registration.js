const mongoose = require('mongoose');

const registrationSchema = new mongoose.Schema({
  clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Client' },
  campaignId: { type: mongoose.Schema.Types.ObjectId, ref: 'Campaign' },
  registrationDate: Date,
  status: String,
  paymentAmount: Number
});

module.exports = mongoose.model('Registration', registrationSchema);