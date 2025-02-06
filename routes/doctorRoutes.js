const express = require('express');
const router = express.Router();
const { createDoctor, getDoctors, updateDoctor, deleteDoctor } = require('../controllers/doctorController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

// Only admin users can create, update, or delete doctors
router.post('/', protect, authorize('admin'), createDoctor);
router.get('/', protect, getDoctors);
router.put('/:id', protect, authorize('admin'), updateDoctor);
router.delete('/:id', protect, authorize('admin'), deleteDoctor);

module.exports = router;
