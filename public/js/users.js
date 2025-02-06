// Retrieve token from localStorage
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

// Function to load users and display them in the table
async function loadUsers() {
  const data = await fetchData('/api/user');
  const tbody = document.querySelector('#usersTable tbody');
  tbody.innerHTML = '';
  data.forEach(user => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${user.name}</td>
      <td>${user.email}</td>
      <td>${user.role}</td>
      <td>
        <i class="fas fa-edit" style="cursor:pointer;" onclick='editUser(${JSON.stringify(user)})'></i>
        <i class="fas fa-trash" style="cursor:pointer;" onclick='deleteUser("${user._id}")'></i>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

// Function to open the user form modal
function openUserForm() {
  document.getElementById('userForm').style.display = 'block';
}

// Function to close the user form modal
function closeUserForm() {
  document.getElementById('userForm').style.display = 'none';
  clearUserForm();
}

// Function to clear form fields
function clearUserForm() {
  document.getElementById('userId').value = '';
  document.getElementById('userName').value = '';
  document.getElementById('userEmail').value = '';
  document.getElementById('userPassword').value = '';
  document.getElementById('userRole').value = 'user';
}

// Function to save (create or update) a user
async function saveUser() {
  const id = document.getElementById('userId').value;
  const user = {
    name: document.getElementById('userName').value,
    email: document.getElementById('userEmail').value,
    password: document.getElementById('userPassword').value,
    role: document.getElementById('userRole').value
  };

  // Here we assume the registration endpoint is used for new users
  // and (optionally) an update endpoint would be used for editing.
  // For simplicity, this example uses the registration endpoint.
  let url = '/api/users/register';
  let method = 'POST';
  
  const res = await fetch(url, {
    method,
    headers: { 
      'Content-Type': 'application/json', 
      'Authorization': 'Bearer ' + token 
    },
    body: JSON.stringify(user)
  });
  
  if (res.ok) {
    closeUserForm();
    loadUsers();
  } else {
    console.error('Error saving user data');
  }
}

// Function to fill the form with user data for editing
function editUser(user) {
  document.getElementById('userId').value = user._id;
  document.getElementById('userName').value = user.name;
  document.getElementById('userEmail').value = user.email;
  // Note: Password is not pre-filled for security reasons.
  document.getElementById('userRole').value = user.role;
  document.getElementById('userForm').style.display = 'block';
}

// Function to delete a user
async function deleteUser(id) {
  if (confirm('Are you sure you want to delete this user?')) {
    const res = await fetch('/api/user/' + id, {
      method: 'DELETE',
      headers: { 'Authorization': 'Bearer ' + token }
    });
    if (res.ok) {
      loadUsers();
    } else {
      console.error('Error deleting user');
    }
  }
}

// Load users when the page loads
loadUsers();
