const express = require("express");
const router = express.Router();
const campaignController = require("../controllers/campaignController");
const authMiddleware = require("../middleware/authMiddleware");

router.get("/list", (req, res, next) => {
    console.log("Received GET /api/campaign/list");
    campaignController.getCampaigns(req, res, next);
});

router.post("/register", authMiddleware, campaignController.registerCampaign);
router.get("/my-campaigns", authMiddleware, campaignController.getMyCampaigns);
router.get("/transactions", authMiddleware, campaignController.getTransactions);
router.post("/deposit", authMiddleware, campaignController.deposit);
router.put("/profile", authMiddleware, campaignController.updateProfile);
router.put("/password", authMiddleware, campaignController.changePassword);
router.post("/bank_qr", authMiddleware, campaignController.createBankQR);
router.post( "/bank_qr_confirm", authMiddleware, campaignController.confirmBankQR);
router.post("/pay-campaign", authMiddleware, campaignController.payCampaign);
router.post("/cancel-campaign", authMiddleware, campaignController.cancelCampaignPayment);

module.exports = router;
