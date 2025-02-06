document.getElementById('logout').addEventListener('click', () => {
    localStorage.removeItem('token');
    window.location.href = 'login.html';
  });
  
  async function fetchData(url) {
    const token = localStorage.getItem('token');
    const res = await fetch(url, { headers: { 'Authorization': 'Bearer ' + token } });
    return res.ok ? await res.json() : [];
  }
  
  async function loadReports() {
    const patients = await fetchData('/api/patients');
    const doctors = await fetchData('/api/doctors');
    const appointments = await fetchData('/api/appointments');
    const users = await fetchData('/api/user');
  
    document.getElementById('totalPatients').innerText = patients.length;
    document.getElementById('totalDoctors').innerText = doctors.length;
    document.getElementById('totalAppointments').innerText = appointments.length;
    document.getElementById('totalUsers').innerText = users.length;
  }
  
  loadReports();
  