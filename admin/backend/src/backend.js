const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// Kết nối MongoDB
mongoose
  .connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Schema và Model
const campaignSchema = new mongoose.Schema({
  name: String,
  description: String,
  startDate: Date,
  endDate: Date,
  budget: Number,
  status: String,
  created: Date,
  updated: Date,
});
const Campaign = mongoose.model('Campaign', campaignSchema);

const clientSchema = new mongoose.Schema({
  name: String,
  phone: String,
  country: String,
  address: String,
  email: String,
  created: Date,
  updated: Date,
  removed: Boolean,
  enabled: Boolean,
});
const Client = mongoose.model('Client', clientSchema);

const registrationSchema = new mongoose.Schema({
  clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Client' },
  campaignId: { type: mongoose.Schema.Types.ObjectId, ref: 'Campaign' },
  registrationDate: Date,
  status: String,
  paymentAmount: Number,
});
const Registration = mongoose.model('Registration', registrationSchema);

// API: Lấy danh sách khách hàng theo campaign
app.get('/api/campaigns/:campaignId/clients', async (req, res) => {
  try {
    const registrations = await Registration.find({ campaignId: req.params.campaignId }).populate(
      'clientId',
      'name email phone address'
    );
    res.json(registrations);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// API: Thêm campaign
app.post('/api/campaigns', async (req, res) => {
  try {
    console.log(req.body);
    const campaign = new Campaign({
      ...req.body,
      created: new Date(),
      updated: new Date(),
    });
    await campaign.save();
    res.status(201).json(campaign);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// API: Sửa campaign
app.put('/api/campaigns/:id', async (req, res) => {
  try {
    const campaign = await Campaign.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updated: new Date() },
      { new: true }
    );
    if (!campaign) return res.status(404).json({ error: 'Campaign not found' });
    res.json(campaign);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// API: Xóa campaign
app.delete('/api/campaigns/:id', async (req, res) => {
  try {
    const campaign = await Campaign.findByIdAndDelete(req.params.id);
    if (!campaign) return res.status(404).json({ error: 'Campaign not found' });
    res.json({ message: 'Campaign deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// API: Duyệt trạng thái đăng ký
app.patch('/api/registrations/:id/approve', async (req, res) => {
  try {
    const registration = await Registration.findByIdAndUpdate(
      req.params.id,
      { status: 'approved', updated: new Date() },
      { new: true }
    );
    if (!registration) return res.status(404).json({ error: 'Registration not found' });
    res.json(registration);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Khởi động server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
