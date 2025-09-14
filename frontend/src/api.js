// frontend/src/api.js

const API_AUTH = import.meta.env.VITE_API_URL;
const API_PATIENT = import.meta.env.VITE_API_PATIENT;
const API_APPOINTMENTS = import.meta.env.VITE_API_APPOINTMENTS;
const API_TRACKING = import.meta.env.VITE_API_TRACKING;
const API_GEOCODE = import.meta.env.VITE_API_GEOCODE;
const API_USER = import.meta.env.VITE_API_USER;

// -------------------- Helper --------------------
async function handleRequest(url, options = {}) {
  try {
    const res = await fetch(url, options);
    const text = await res.text(); // รับ text ก่อน
    let data;
    try { data = JSON.parse(text); } catch { data = text; }
    if (!res.ok) throw new Error(data?.message || data?.error || 'API request failed');
    return data;
  } catch (err) {
    console.error('API error:', err.message);
    throw err;
  }
}

// -------------------- Auth --------------------
export async function registerUser(data) {
  return handleRequest(`${API_AUTH}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
}

// Login by citizenId
export async function loginUser(data) {
  return handleRequest(`${API_AUTH}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
}

// -------------------- Patient --------------------
export async function getAllPatients() {
  return handleRequest(`${API_PATIENT}`);
}

export async function getPatientById(id) {
  return handleRequest(`${API_PATIENT}${id}`);
}

export async function createPatient(data, imageFile) {
  const formData = new FormData();
  for (const key in data) formData.append(key, data[key]);
  if (imageFile) formData.append('patientImage', imageFile);

  return handleRequest(`${API_PATIENT}`, { method: 'POST', body: formData });
}

export async function updatePatient(id, data, imageFile) {
  const formData = new FormData();
  for (const key in data) formData.append(key, data[key]);
  if (imageFile) formData.append('patientImage', imageFile);

  return handleRequest(`${API_PATIENT}${id}`, { method: 'PUT', body: formData });
}

export async function deletePatient(id) {
  return handleRequest(`${API_PATIENT}${id}`, { method: 'DELETE' });
}

// -------------------- Appointments --------------------
export async function getAppointments(params = {}) {
  const url = new URL(`${API_APPOINTMENTS}`);
  Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));
  return handleRequest(url);
}

export async function createAppointment(data) {
  return handleRequest(`${API_APPOINTMENTS}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
}

export async function updateAppointment(id, data) {
  return handleRequest(`${API_APPOINTMENTS}${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
}

export async function deleteAppointment(id) {
  return handleRequest(`${API_APPOINTMENTS}${id}`, { method: 'DELETE' });
}

// -------------------- Daily Tracking --------------------
export async function addDailyTracking(data) {
  return handleRequest(`${API_TRACKING}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
}

// -------------------- Geocode --------------------
export async function geocodeAddress(address) {
  return handleRequest(`${API_GEOCODE}/geocode`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ address }),
  });
}

// -------------------- User --------------------
export async function getUserById(id) {
  return handleRequest(`${API_USER}${id}`);
}

export async function updateUser(id, data) {
  return handleRequest(`${API_USER}${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
}

export async function updateUserCoordinates(id, latitude, longitude) {
  return handleRequest(`${API_USER}${id}/coordinates`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ latitude, longitude }),
  });
}

export async function getAllUsers(params = {}) {
  const url = new URL(`${API_USER}`);
  Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));
  return handleRequest(url);
}
