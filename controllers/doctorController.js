const Doctor = require('../models/Doctor');

// Create a new doctor (only for admin)
const createDoctor = async (req, res) => {
  const { name, specialty, contact } = req.body;
  try {
    const doctor = await Doctor.create({ name, specialty, contact });
    res.status(201).json(doctor);
  } catch (error) {
    res.status(500).json({ message: 'Error creating doctor', error: error.message });
  }
};

// Get all doctors
const getDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find();
    res.json(doctors);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching doctors', error: error.message });
  }
};

// Update a doctor
const updateDoctor = async (req, res) => {
  try {
    const updatedDoctor = await Doctor.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedDoctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }
    res.json(updatedDoctor);
  } catch (error) {
    res.status(500).json({ message: 'Error updating doctor', error: error.message });
  }
};

// Delete a doctor
const deleteDoctor = async (req, res) => {
  try {
    const deletedDoctor = await Doctor.findByIdAndDelete(req.params.id);
    if (!deletedDoctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }
    res.json({ message: 'Doctor deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting doctor', error: error.message });
  }
};

module.exports = { createDoctor, getDoctors, updateDoctor, deleteDoctor };
