document.addEventListener('DOMContentLoaded', () => {
  // Login form handler for admin-login.html
  const loginForm = document.getElementById('adminLoginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const username = document.getElementById('username').value;
      const password = document.getElementById('password').value;
      const loginError = document.getElementById('loginError');
      try {
        const res = await fetch('https://barangay-archive-production.up.railway.app/admin/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ username, password }),
          credentials: 'include'
        });
        const data = await res.json();
        if (data.success) {
          window.location.href = '/admin-dashboard.html';
        } else {
          loginError.textContent = data.message || 'Invalid credentials';
        }
      } catch (err) {
        loginError.textContent = 'Server error. Please try again.';
      }
    });
  }
  // Elements
  const statsContainer = document.getElementById('statsContainer');
  const ordinanceTable = document.getElementById('ordinanceTable').querySelector('tbody');
  const addOrdinanceBtn = document.getElementById('addOrdinanceBtn');
  const ordinanceFormContainer = document.getElementById('ordinanceFormContainer');
  const ordinanceForm = document.getElementById('ordinanceForm');
  const cancelBtn = document.getElementById('cancelBtn');
  const logoutBtn = document.getElementById('logoutBtn');

  // State
  let editingId = null;

  // Fetch stats
  fetch('/admin/stats')
    .then(res => res.json())
    .then(stats => {
      statsContainer.innerHTML = `
        <div>Total Ordinances: <b>${stats.totalOrdinances}</b></div>
        <div>Last Upload: <b>${stats.lastUpload || 'N/A'}</b></div>
      `;
    });

  // Fetch ordinances
  function loadOrdinances() {
    fetch('/admin/ordinances')
      .then(res => res.json())
      .then(data => {
        ordinanceTable.innerHTML = '';
        data.forEach(ord => {
          ordinanceTable.innerHTML += `
            <tr>
              <td>${ord.id}</td>
              <td>${ord.title}</td>
              <td>${ord.date}</td>
              <td><a href="${ord.fileUrl}" target="_blank">View</a></td>
              <td>
                <button onclick="editOrdinance(${ord.id})">Edit</button>
                <button onclick="deleteOrdinance(${ord.id})">Delete</button>
              </td>
            </tr>
          `;
        });
      });
  }
  loadOrdinances();

  // Add Ordinance
  addOrdinanceBtn.addEventListener('click', () => {
    editingId = null;
    ordinanceForm.reset();
    document.getElementById('formTitle').textContent = 'Add Ordinance';
    ordinanceFormContainer.classList.remove('hidden');
  });

  // Cancel
  cancelBtn.addEventListener('click', () => {
    ordinanceFormContainer.classList.add('hidden');
  });

  // Submit
  ordinanceForm.addEventListener('submit', e => {
    e.preventDefault();
    const formData = new FormData(ordinanceForm);
    let url = '/admin/ordinances';
    let method = editingId ? 'PUT' : 'POST';
    if (editingId) formData.append('id', editingId);
    fetch(url, {
      method,
      body: formData
    }).then(res => {
      if (res.ok) {
        ordinanceFormContainer.classList.add('hidden');
        loadOrdinances();
      }
    });
  });

  // Logout
  logoutBtn.addEventListener('click', () => {
    fetch('/admin/logout', { method: 'POST' })
      .then(() => window.location.href = '/admin-login.html');
  });
});

// Edit/Delete functions
window.editOrdinance = function(id) {
  fetch(`/admin/ordinances/${id}`)
    .then(res => res.json())
    .then(ord => {
      document.getElementById('ordinanceId').value = ord.id;
      document.getElementById('ordinanceTitle').value = ord.title;
      document.getElementById('ordinanceDate').value = ord.date;
      document.getElementById('formTitle').textContent = 'Edit Ordinance';
      document.getElementById('ordinanceFormContainer').classList.remove('hidden');
      window.editingId = ord.id;
    });
};
window.deleteOrdinance = function(id) {
  if (confirm('Delete this ordinance?')) {
    fetch(`/admin/ordinances/${id}`, { method: 'DELETE' })
      .then(res => {
        if (res.ok) window.location.reload();
      });
  }
};
