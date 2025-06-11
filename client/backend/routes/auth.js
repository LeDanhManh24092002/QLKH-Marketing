const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/test', (req, res) => {
  console.log('Received GET /api/auth/test');
  res.json({ message: 'Auth routes are working' });
});

router.post('/register', (req, res, next) => {
  console.log('Received POST /api/auth/register with body:', req.body);
  authController.register(req, res, next);
});
router.post('/login', authController.login);
router.get('/profile', authMiddleware, authController.getProfile);

module.exports = router;