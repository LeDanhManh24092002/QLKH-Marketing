const mongoose = require('mongoose');

const clientPasswordSchema = new mongoose.Schema({
  clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Client', required: true },
  password: { type: String, required: true },
});

module.exports = mongoose.model('ClientPassword', clientPasswordSchema);