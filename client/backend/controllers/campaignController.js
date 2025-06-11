const Client = require("../models/Client");
const Campaign = require("../models/Campaign");
const UserCampaign = require("../models/UserCampaign");
const Transaction = require("../models/Transaction");
const bcrypt = require("bcryptjs");
const QRCode = require("qrcode");

exports.getCampaigns = async (req, res) => {
    try {
        console.log("Fetching campaigns from database");
        const campaigns = await Campaign.find({ status: "active" });
        console.log("Campaigns found:", campaigns);
        res.json(campaigns);
    } catch (error) {
        console.error("Error in getCampaigns:", error);
        res.status(500).json({ message: "Lỗi server", error: error.message });
    }
};

exports.registerCampaign = async (req, res) => {
    const { campaignId } = req.body;
    try {
        const userCampaign = new UserCampaign({
            clientId: req.client.clientId,
            campaignId,
            status: "pending",
        });
        await userCampaign.save();
        res.status(201).json({
            message: "Đăng ký chiến dịch thành công ",
        });
    } catch (error) {
        res.status(500).json({ message: "Lỗi server", error: error.message });
    }
};

exports.getMyCampaigns = async (req, res) => {
    try {
        const registrations = await UserCampaign.find({
            clientId: req.client.clientId,
        }).populate("campaignId");
        res.json(registrations);
    } catch (error) {
        res.status(500).json({ message: "Lỗi server", error: error.message });
    }
};

exports.getTransactions = async (req, res) => {
    try {
        const transactions = await Transaction.find({
            clientId: req.client.clientId,
        });
        res.json(transactions);
    } catch (error) {
        res.status(500).json({ message: "Lỗi server", error: error.message });
    }
};

exports.deposit = async (req, res) => {
    const { amount, paymentMethod } = req.body;
    try {
        const transaction = new Transaction({
            clientId: req.client.clientId,
            amount,
            paymentMethod,
            status: "completed",
        });
        await transaction.save();

        const client = await Client.findById(req.client.clientId);
        if (!client) {
            return res
                .status(404)
                .json({ message: "Không tìm thấy khách hàng" });
        }
        client.balance += amount;
        await client.save();

        res.status(201).json({
            message: "Nạp tiền thành công",
            balance: client.balance,
        });
    } catch (error) {
        console.error("Error in deposit:", error);
        res.status(500).json({ message: "Lỗi server", error: error.message });
    }
};

exports.createBankQR = async (req, res) => {
    try {
        const { amount } = req.body;
        const bankAccount = process.env.BANK_ACCOUNT;
        const bankName = process.env.BANK_NAME;
        const clientId = req.client.clientId;

        const qrData = `Bank: ${bankName}\nAccount: ${bankAccount}\nAmount: ${amount}\nClientID: ${clientId}`;
        const qrCodeUrl = await QRCode.toDataURL(qrData);

        res.json({ qrCodeUrl, amount, clientId });
    } catch (error) {
        console.error("Error in createBankQR:", error);
        res.status(500).json({ message: "Lỗi server", error: error.message });
    }
};

exports.confirmBankQR = async (req, res) => {
    const { amount } = req.body;
    const clientId = req.client.clientId;
    try {
        console.log(
            `Confirming BankQR: clientId=${clientId}, amount=${amount}`
        );
        const transaction = new Transaction({
            clientId,
            amount,
            paymentMethod: "BankQR",
            status: "completed",
        });
        await transaction.save();

        const client = await Client.findById(clientId);
        if (!client) {
            console.error("Client not found:", clientId);
            return res
                .status(404)
                .json({ message: "Không tìm thấy khách hàng" });
        }
        client.balance += amount;
        await client.save();
        console.log("Updated client:", { clientId, balance: client.balance });

        res.status(201).json({
            message: "Nạp tiền qua QR ngân hàng thành công",
            balance: client.balance,
        });
    } catch (error) {
        console.error("Error in confirmBankQR:", error);
        res.status(500).json({ message: "Lỗi server", error: error.message });
    }
}; 

exports.updateProfile = async (req, res) => {
    const { name, phone, country, address } = req.body;
    try {
        const client = await Client.findById(req.client.clientId);
        if (!client) {
            return res
                .status(404)
                .json({ message: "Không tìm thấy khách hàng" });
        }
        client.name = name || client.name;
        client.phone = phone || client.phone;
        client.country = country || client.country;
        client.address = address || client.address;
        client.updated = Date.now();
        await client.save();
        res.json({ message: "Cập nhật thông tin thành công", client });
    } catch (error) {
        console.error("Error in updateProfile:", error);
        res.status(500).json({ message: "Lỗi server", error: error.message });
    }
};

exports.changePassword = async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    try {
        const clientPassword = await ClientPassword.findOne({
            clientId: req.client.clientId,
        });
        if (!clientPassword) {
            return res
                .status(400)
                .json({ message: "Không tìm thấy thông tin mật khẩu" });
        }

        const isMatch = await bcrypt.compare(
            oldPassword,
            clientPassword.password
        );
        if (!isMatch) {
            return res.status(400).json({ message: "Mật khẩu cũ không đúng" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);
        clientPassword.password = hashedPassword;
        await clientPassword.save();

        res.json({ message: "Đổi mật khẩu thành công" });
    } catch (error) {
        console.error("Error in changePassword:", error);
        res.status(500).json({ message: "Lỗi server", error: error.message });
    }
};


exports.payCampaign = async (req, res) => {
    const { userCampaignId } = req.body;

    try {
        const userCampaign = await UserCampaign.findById(userCampaignId).populate("campaignId");
        if (!userCampaign) {
            return res.status(404).json({ message: "Không tìm thấy chiến dịch đã đăng ký" });
        }

        if (userCampaign.status === "paid") {
            return res.status(400).json({ message: "Chiến dịch này đã được thanh toán rồi" });
        }

        const client = await Client.findById(req.client.clientId);
        const campaign = userCampaign.campaignId;

        if (!client || !campaign) {
            return res.status(404).json({ message: "Dữ liệu không hợp lệ" });
        }

        if (client.balance < campaign.budget) {
            return res.status(400).json({ message: "Số dư không đủ để thanh toán chiến dịch này" });
        }

        // Trừ tiền
        client.balance -= campaign.budget;
        await client.save();

        // Ghi nhận giao dịch
        const transaction = new Transaction({
            clientId: client._id,
            amount: -campaign.budget,
            paymentMethod: "campaign-payment",
            status: "completed",
            description: `Thanh toán chiến dịch: ${campaign.name}`
        });
        await transaction.save();

        // Cập nhật trạng thái
        userCampaign.status = "paid";
        await userCampaign.save();

        res.status(200).json({
            message: "Thanh toán chiến dịch thành công",
            balance: client.balance
        });
    } catch (error) {
        console.error("Lỗi trong payCampaign:", error);
        res.status(500).json({ message: "Lỗi server", error: error.message });
    }
};


exports.cancelCampaignPayment = async (req, res) => {
    const { userCampaignId } = req.body;

    try {
        const userCampaign = await UserCampaign.findById(userCampaignId).populate("campaignId");
        if (!userCampaign) {
            return res.status(404).json({ message: "Không tìm thấy chiến dịch đã đăng ký" });
        }

        if (userCampaign.status !== "paid") {
            return res.status(400).json({ message: "Chỉ có thể huỷ chiến dịch đã thanh toán" });
        }

        const campaign = userCampaign.campaignId;
        const client = await Client.findById(req.client.clientId);

        if (!client || !campaign) {
            return res.status(404).json({ message: "Dữ liệu không hợp lệ" });
        }

        // Hoàn tiền
        client.balance += campaign.budget;
        await client.save();

        // Ghi nhận hoàn tiền
        const transaction = new Transaction({
            clientId: client._id,
            amount: campaign.budget,
            paymentMethod: "refund",
            status: "completed",
            description: `Hoàn tiền huỷ chiến dịch: ${campaign.name}`
        });
        await transaction.save();

        // Cập nhật trạng thái chiến dịch
        userCampaign.status = "canceled";
        await userCampaign.save();

        res.status(200).json({
            message: "Hủy chiến dịch và hoàn tiền thành công",
            balance: client.balance
        });
    } catch (error) {
        console.error("Lỗi trong cancelCampaignPayment:", error);
        res.status(500).json({ message: "Lỗi server", error: error.message });
    }
};
