// Retrieve the token from localStorage
const token = localStorage.getItem('token');

// Generic function to fetch data from an API endpoint
async function fetchData(url) {
  const res = await fetch(url, {
    headers: { 'Authorization': 'Bearer ' + token }
  });
  return res.ok ? await res.json() : [];
}

// Function to load appointments and display them in the table
async function loadAppointments() {
  const data = await fetchData('/api/appointments');
  const tbody = document.querySelector('#appointmentsTable tbody');
  tbody.innerHTML = '';
  data.forEach(appointment => {
    const appointmentDate = new Date(appointment.appointmentDate).toLocaleString();
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${appointment.patient.name}</td>
      <td>${appointment.doctor.name}</td>
      <td>${appointmentDate}</td>
      <td>${appointment.description || ''}</td>
      <td>
        <i class="fas fa-edit" style="cursor:pointer;" onclick='editAppointment(${JSON.stringify(appointment)})'></i>
        <i class="fas fa-trash" style="cursor:pointer;" onclick='deleteAppointment("${appointment._id}")'></i>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

// Function to load patients and populate the "Patient" combo box
async function loadPatientsCombo() {
  const patients = await fetchData('/api/patients');
  const select = document.getElementById('appointmentPatient');
  select.innerHTML = '<option value="">Select Patient</option>';
  patients.forEach(patient => {
    const option = document.createElement('option');
    option.value = patient._id;
    option.textContent = patient.name;
    select.appendChild(option);
  });
}

// Function to load doctors and populate the "Doctor" combo box
async function loadDoctorsCombo() {
  const doctors = await fetchData('/api/doctors');
  const select = document.getElementById('appointmentDoctor');
  select.innerHTML = '<option value="">Select Doctor</option>';
  doctors.forEach(doctor => {
    const option = document.createElement('option');
    option.value = doctor._id;
    option.textContent = doctor.name + (doctor.specialty ? ' (' + doctor.specialty + ')' : '');
    select.appendChild(option);
  });
}

// Functions to open and close the appointment form modal
function openAppointmentForm() {
  document.getElementById('appointmentForm').style.display = 'block';
  // Load combo box data each time the form is opened
  loadPatientsCombo();
  loadDoctorsCombo();
}
function closeAppointmentForm() {
  document.getElementById('appointmentForm').style.display = 'none';
  clearAppointmentForm();
}
function clearAppointmentForm() {
  document.getElementById('appointmentId').value = '';
  document.getElementById('appointmentPatient').value = '';
  document.getElementById('appointmentDoctor').value = '';
  document.getElementById('appointmentDate').value = '';
  document.getElementById('appointmentDesc').value = '';
}

// Function to save (create or update) an appointment
async function saveAppointment() {
  const id = document.getElementById('appointmentId').value;
  const appointment = {
    patient: document.getElementById('appointmentPatient').value,
    doctor: document.getElementById('appointmentDoctor').value,
    appointmentDate: document.getElementById('appointmentDate').value,
    description: document.getElementById('appointmentDesc').value
  };

  let url = '/api/appointments';
  let method = 'POST';
  if (id) {
    url += '/' + id;
    method = 'PUT';
  }

  const res = await fetch(url, {
    method,
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
    },
    body: JSON.stringify(appointment)
  });
  
  if (res.ok) {
    closeAppointmentForm();
    loadAppointments();
  } else {
    console.error('Error saving appointment data');
  }
}

// Function to fill the form for editing an appointment
function editAppointment(appointment) {
  document.getElementById('appointmentId').value = appointment._id;
  // Preselect the patient and doctor using their IDs
  document.getElementById('appointmentPatient').value = appointment.patient._id;
  document.getElementById('appointmentDoctor').value = appointment.doctor._id;
  
  // Format the appointment date to match the input's value format (YYYY-MM-DDTHH:mm)
  const date = new Date(appointment.appointmentDate);
  const formattedDate = date.toISOString().slice(0, 16);
  document.getElementById('appointmentDate').value = formattedDate;
  
  document.getElementById('appointmentDesc').value = appointment.description || '';
  document.getElementById('appointmentForm').style.display = 'block';
}

// Function to delete an appointment
async function deleteAppointment(id) {
  if (confirm('Are you sure you want to delete this appointment?')) {
    const res = await fetch('/api/appointments/' + id, {
      method: 'DELETE',
      headers: { 'Authorization': 'Bearer ' + token }
    });
    if (res.ok) {
      loadAppointments();
    } else {
      console.error('Error deleting appointment');
    }
  }
}

// Load appointments when the page loads
loadAppointments();
