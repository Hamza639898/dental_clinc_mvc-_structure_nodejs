const Patient = require('../models/Patient');

// Create a new patient
const createPatient = async (req, res) => {
  const { name, age, contact, address } = req.body;
  try {
    const patient = await Patient.create({ name, age, contact, address });
    res.status(201).json(patient);
  } catch (error) {
    res.status(500).json({ message: 'Error creating patient', error: error.message });
  }
};

// Get all patients
const getPatients = async (req, res) => {
  try {
    const patients = await Patient.find();
    res.json(patients);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching patients', error: error.message });
  }
};

// Update a patient
const updatePatient = async (req, res) => {
  try {
    const updatedPatient = await Patient.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedPatient) {
      return res.status(404).json({ message: 'Patient not found' });
    }
    res.json(updatedPatient);
  } catch (error) {
    res.status(500).json({ message: 'Error updating patient', error: error.message });
  }
};

// Delete a patient
const deletePatient = async (req, res) => {
  try {
    const deletedPatient = await Patient.findByIdAndDelete(req.params.id);
    if (!deletedPatient) {
      return res.status(404).json({ message: 'Patient not found' });
    }
    res.json({ message: 'Patient deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting patient', error: error.message });
  }
};

module.exports = { createPatient, getPatients, updatePatient, deletePatient };
