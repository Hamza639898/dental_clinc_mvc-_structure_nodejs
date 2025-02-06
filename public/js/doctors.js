// Retrieve the token from localStorage
const token = localStorage.getItem('token');

// Logout functionality
document.getElementById('logout').addEventListener('click', () => {
  localStorage.removeItem('token');
  window.location.href = 'login.html';
});

// Generic function to fetch data from an API endpoint
async function fetchData(url) {
  const res = await fetch(url, {
    headers: { 'Authorization': 'Bearer ' + token }
  });
  return res.ok ? await res.json() : [];
}

// Function to load doctors and display them in the table
async function loadDoctors() {
  const data = await fetchData('/api/doctors');
  const tbody = document.querySelector('#doctorsTable tbody');
  tbody.innerHTML = '';
  data.forEach(doctor => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${doctor.name}</td>
      <td>${doctor.specialty || ''}</td>
      <td>${doctor.contact || ''}</td>
      <td>
        <i class="fas fa-edit" style="cursor:pointer;" onclick='editDoctor(${JSON.stringify(doctor)})'></i>
        <i class="fas fa-trash" style="cursor:pointer;" onclick='deleteDoctor("${doctor._id}")'></i>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

// Function to open the doctor form modal
function openDoctorForm() {
  document.getElementById('doctorForm').style.display = 'block';
}

// Function to close the doctor form modal
function closeDoctorForm() {
  document.getElementById('doctorForm').style.display = 'none';
  clearDoctorForm();
}

// Function to clear the form fields
function clearDoctorForm() {
  document.getElementById('doctorId').value = '';
  document.getElementById('doctorName').value = '';
  document.getElementById('doctorSpecialty').value = '';
  document.getElementById('doctorContact').value = '';
}

// Function to save (create or update) a doctor
async function saveDoctor() {
  const id = document.getElementById('doctorId').value;
  const doctor = {
    name: document.getElementById('doctorName').value,
    specialty: document.getElementById('doctorSpecialty').value,
    contact: document.getElementById('doctorContact').value
  };

  let url = '/api/doctors';
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
    body: JSON.stringify(doctor)
  });
  
  if (res.ok) {
    closeDoctorForm();
    loadDoctors();
  } else {
    console.error('Error saving doctor data');
  }
}

// Function to fill the form with doctor data for editing
function editDoctor(doctor) {
  document.getElementById('doctorId').value = doctor._id;
  document.getElementById('doctorName').value = doctor.name;
  document.getElementById('doctorSpecialty').value = doctor.specialty;
  document.getElementById('doctorContact').value = doctor.contact;
  document.getElementById('doctorForm').style.display = 'block';
}

// Function to delete a doctor
async function deleteDoctor(id) {
  if (confirm('Are you sure you want to delete this doctor?')) {
    const res = await fetch('/api/doctors/' + id, {
      method: 'DELETE',
      headers: { 'Authorization': 'Bearer ' + token }
    });
    if (res.ok) {
      loadDoctors();
    } else {
      console.error('Error deleting doctor');
    }
  }
}

// Load doctors when the page loads
loadDoctors();
