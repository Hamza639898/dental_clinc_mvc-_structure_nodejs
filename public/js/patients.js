// Ensure the token is stored in localStorage
const token = localStorage.getItem('token');

// Function to fetch data from the API
async function fetchData(url) {
  const res = await fetch(url, {
    headers: { 'Authorization': 'Bearer ' + token }
  });
  return res.ok ? await res.json() : [];
}

// Function to load patients and display them in the table
async function loadPatients() {
  const data = await fetchData('/api/patients');
  const tbody = document.querySelector('#patientsTable tbody');
  tbody.innerHTML = '';
  data.forEach(patient => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${patient.name}</td>
      <td>${patient.age || ''}</td>
      <td>${patient.contact || ''}</td>
      <td>${patient.address || ''}</td>
      <td>
        <!-- Edit icon -->
        <i class="fas fa-edit" style="cursor:pointer;" onclick='editPatient(${JSON.stringify(patient)})'></i>
        <!-- Delete icon -->
        <i class="fas fa-trash" style="cursor:pointer;" onclick='deletePatient("${patient._id}")'></i>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

// Functions to open and close the patient form modal
function openPatientForm() {
  document.getElementById('patientForm').style.display = 'block';
}
function closePatientForm() {
  document.getElementById('patientForm').style.display = 'none';
  clearPatientForm();
}
function clearPatientForm() {
  document.getElementById('patientId').value = '';
  document.getElementById('patientName').value = '';
  document.getElementById('patientAge').value = '';
  document.getElementById('patientContact').value = '';
  document.getElementById('patientAddress').value = '';
}

// Function to save (create or update) a patient
async function savePatient() {
  const id = document.getElementById('patientId').value;
  const patient = {
    name: document.getElementById('patientName').value,
    age: document.getElementById('patientAge').value,
    contact: document.getElementById('patientContact').value,
    address: document.getElementById('patientAddress').value
  };

  let url = '/api/patients';
  let method = 'POST';
  if (id) {
    // If editing, use PUT and append the id to the URL
    url += '/' + id;
    method = 'PUT';
  }
  
  const res = await fetch(url, {
    method,
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token 
    },
    body: JSON.stringify(patient)
  });
  
  if (res.ok) {
    closePatientForm();
    loadPatients();
  } else {
    console.error('Error saving patient data');
  }
}

// Function to fill the form with patient data for editing
function editPatient(patient) {
  document.getElementById('patientId').value = patient._id;
  document.getElementById('patientName').value = patient.name;
  document.getElementById('patientAge').value = patient.age;
  document.getElementById('patientContact').value = patient.contact;
  document.getElementById('patientAddress').value = patient.address;
  document.getElementById('patientForm').style.display = 'block';
}

// Function to delete a patient
async function deletePatient(id) {
  if (confirm('Are you sure you want to delete this patient?')) {
    const res = await fetch('/api/patients/' + id, {
      method: 'DELETE',
      headers: { 'Authorization': 'Bearer ' + token }
    });
    if (res.ok) {
      loadPatients();
    } else {
      console.error('Error deleting patient');
    }
  }
}

// Load patients when the page loads
loadPatients();
