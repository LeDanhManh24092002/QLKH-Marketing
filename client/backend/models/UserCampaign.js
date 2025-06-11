const mongoose = require('mongoose');

const registrationschema = new mongoose.Schema({
  clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'client', required: true },
  campaignId: { type: mongoose.Schema.Types.ObjectId, ref: 'campaigns', required: true },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  registeredAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('registrations', registrationschema);