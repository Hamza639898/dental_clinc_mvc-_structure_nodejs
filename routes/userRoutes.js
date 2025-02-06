const express = require('express');
const router = express.Router();
const { getProfile, getAllUsers, deleteUser } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

// Route to get the current user's profile
router.get('/profile', protect, getProfile);

// Route to get all users (admin only)
router.get('/', protect, authorize('admin'), getAllUsers);

// Route to delete a user (admin only)
router.delete('/:id', protect, authorize('admin'), deleteUser);

module.exports = router;
