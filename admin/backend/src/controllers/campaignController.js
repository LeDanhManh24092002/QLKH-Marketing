const mongoose = require('mongoose');
const Campaign = require('../models/appModels/Campaign');
const Registration = require('../models/appModels/Registration');

exports.create = async (req, res) => {
  try {
    console.log('Creating new campaign:', req.body);
    const campaign = new Campaign({
      ...req.body,
      created: new Date(),
      updated: new Date(),
    });
    await campaign.save();
    console.log('Campaign created:', campaign);
    res.status(201).json(campaign);
  } catch (error) {
    console.error('Error in create:', error.message);
    res.status(500).json({ error: 'Không thể tạo chiến dịch', details: error.message });
  }
};

exports.read = async (req, res) => {
  try {
    console.log('Reading campaign with ID:', req.params.id);
    const campaign = await Campaign.findById(req.params.id);
    if (!campaign) {
      console.warn('Campaign not found');
      return res.status(404).json({ error: 'Chiến dịch không tồn tại' });
    }
    res.json(campaign);
  } catch (error) {
    console.error('Error in read:', error.message);
    res.status(500).json({ error: 'Không thể đọc chiến dịch', details: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    console.log('Updating campaign ID:', req.params.id, 'with data:', req.body);
    const campaign = await Campaign.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updated: new Date() },
      { new: true }
    );
    if (!campaign) {
      console.warn('Campaign not found for update');
      return res.status(404).json({ error: 'Chiến dịch không tồn tại' });
    }
    console.log('Updated campaign:', campaign);
    res.json(campaign);
  } catch (error) {
    console.error('Error in update:', error.message);
    res.status(500).json({ error: 'Không thể cập nhật chiến dịch', details: error.message });
  }
};

exports.delete = async (req, res) => {
  try {
    console.log('Deleting campaign ID:', req.params.id);
    const campaign = await Campaign.findByIdAndDelete(req.params.id);
    if (!campaign) {
      console.warn('Campaign not found for delete');
      return res.status(404).json({ error: 'Chiến dịch không tồn tại' });
    }
    console.log('Deleted campaign:', campaign);
    res.json({ message: 'Chiến dịch đã được xóa' });
  } catch (error) {
    console.error('Error in delete:', error.message);
    res.status(500).json({ error: 'Không thể xóa chiến dịch', details: error.message });
  }
};

exports.search = async (req, res) => {
  try {
    const { query } = req.query;
    console.log('Searching campaigns with query:', query);
    const campaigns = await Campaign.find({ name: new RegExp(query, 'i') });
    res.json(campaigns);
  } catch (error) {
    console.error('Error in search:', error.message);
    res.status(500).json({ error: 'Không thể tìm kiếm chiến dịch', details: error.message });
  }
};

exports.list = async (req, res) => {
  try {
    console.log('Listing active campaigns');
    const campaigns = await Campaign.find({ status: 'active' });
    res.json(campaigns);
  } catch (error) {
    console.error('Error in list:', error.message);
    res.status(500).json({ error: 'Không thể liệt kê chiến dịch', details: error.message });
  }
};

exports.listAll = async (req, res) => {
  try {
    console.log('Fetching all campaigns');
    const campaigns = await Campaign.find();
    console.log('Campaigns:', campaigns);
    res.json(campaigns);
  } catch (error) {
    console.error('Error in listAll:', error.message);
    res.status(500).json({ error: 'Không thể lấy danh sách chiến dịch', details: error.message });
  }
};

exports.filter = async (req, res) => {
  try {
    const { status, startDate, endDate } = req.query;
    console.log('Filtering campaigns with:', req.query);
    const filter = {};
    if (status) filter.status = status;
    if (startDate) filter.startDate = { $gte: new Date(startDate) };
    if (endDate) filter.endDate = { ...(filter.startDate || {}), $lte: new Date(endDate) };

    const campaigns = await Campaign.find(filter);
    console.log('Filtered campaigns:', campaigns);
    res.json(campaigns);
  } catch (error) {
    console.error('Error in filter:', error.message);
    res.status(500).json({ error: 'Không thể lọc chiến dịch', details: error.message });
  }
};

// Trong campaignController.js, thay hàm summary bằng:
exports.summary = async (req, res, next) => {
  try {
    console.log('Getting campaign summary');
    const total = await Campaign.countDocuments();
    const active = await Campaign.countDocuments({ status: 'active' });
    const profit = await Campaign.countDocuments({ profitStatus: 'profit' });
    const loss = await Campaign.countDocuments({ profitStatus: 'loss' });
    console.log('Summary data:', { total, active, profit, loss });
    res.json({ total, active, profit, loss });
  } catch (error) {
    console.error('Error in summary:', error.message, error.stack);
    res.status(500).json({ error: 'Không thể lấy tóm tắt chiến dịch', details: error.message });
  }
};

exports.getClientsByCampaign = async (req, res) => {
  try {
    console.log('Getting clients by campaign ID:', req.params.campaignId);
    const registrations = await Registration.find({ campaignId: req.params.campaignId })
      .populate({
        path: 'clientId',
        select: 'name email phone address',
        match: { removed: false, enabled: true },
      })
      .lean();
    const filteredRegistrations = registrations.filter((reg) => reg.clientId);
    console.log('Registrations:', filteredRegistrations);
    res.json(filteredRegistrations);
  } catch (error) {
    console.error('Error in getClientsByCampaign:', error.message);
    res.status(500).json({ error: 'Không thể lấy danh sách khách hàng', details: error.message });
  }
};

exports.approveRegistration = async (req, res) => {
  try {
    console.log('Approving registration ID:', req.params.registrationId);
    const registration = await Registration.findByIdAndUpdate(
      req.params.registrationId,
      { status: 'approved', updated: new Date() },
      { new: true }
    ).populate('clientId', 'name email phone address');
    if (!registration) {
      console.warn('Registration not found');
      return res.status(404).json({ error: 'Đăng ký không tồn tại' });
    }
    console.log('Approved registration:', registration);
    res.json({ message: 'Đăng ký đã được duyệt', registration });
  } catch (error) {
    console.error('Error in approveRegistration:', error.message);
    res.status(500).json({ error: 'Không thể duyệt đăng ký', details: error.message });
  }
};