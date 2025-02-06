const express = require('express');
const router = express.Router();
const { createPatient, getPatients, updatePatient, deletePatient } = require('../controllers/patientController');
const { protect } = require('../middleware/authMiddleware');

// Endpoints for patients
router.post('/', protect, createPatient);          // Create a new patient
router.get('/', protect, getPatients);               // Get all patients
router.put('/:id', protect, updatePatient);          // Update a patient
router.delete('/:id', protect, deletePatient);       // Delete a patient

module.exports = router;
