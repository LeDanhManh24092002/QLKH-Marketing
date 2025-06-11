const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Client = require('../models/Client');
const ClientPassword = require('../models/ClientPassword');

exports.register = async (req, res) => {
  console.log('Received POST /api/auth/register with body:', req.body);
  const { name, phone, country, address, email, password } = req.body;

  try {
    let client = await Client.findOne({ email });
    if (client) {
      return res.status(400).json({ message: 'Email đã tồn tại' });
    }

    client = new Client({ name, phone, country, address, email });
    await client.save();

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const clientPassword = new ClientPassword({
      clientId: client._id,
      password: hashedPassword,
    });
    await clientPassword.save();

    res.status(201).json({ message: 'Đăng ký thành công' });
  } catch (error) {
    console.error('Error in register:', error);
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const client = await Client.findOne({ email });
    if (!client || !client.enabled || client.removed) {
      return res.status(400).json({ message: 'Thông tin đăng nhập không hợp lệ' });
    }

    const clientPassword = await ClientPassword.findOne({ clientId: client._id });
    if (!clientPassword) {
      return res.status(400).json({ message: 'Thông tin đăng nhập không hợp lệ' });
    }

    const isMatch = await bcrypt.compare(password, clientPassword.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Thông tin đăng nhập không hợp lệ' });
    }

    const payload = { clientId: client._id };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({ token, name: client.name });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const client = await Client.findById(req.client.clientId);
    if (!client) {
      return res.status(404).json({ message: 'Không tìm thấy khách hàng' });
    }
    res.json({ name: client.name });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};