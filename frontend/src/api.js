// src/api.js
import axios from 'axios';

// -------------------- Base URLs จากไฟล์ .env --------------------
const API_AUTH = import.meta.env.VITE_API_URL;          // /auth
const API_PATIENT = import.meta.env.VITE_API_PATIENT;   // /patient/
const API_USER = import.meta.env.VITE_API_USER;         // /user/
const API_APPOINTMENTS = import.meta.env.VITE_API_APPOINTMENTS; // /appointments
const API_TRACKING = import.meta.env.VITE_API_TRACKING; // /dailytracking/

// -------------------- Helpers --------------------
function getAuthHeader() {
  const token = localStorage.getItem('userToken') || localStorage.getItem('token');
  return token ? { 'x-auth-token': token, Authorization: `Bearer ${token}` } : {};
}

function joinUrl(base, path) {
  if (!base.endsWith("/")) base += "/";
  if (path.startsWith("/")) path = path.substring(1);
  return base + path;
}

// -------------------- AUTH --------------------
export async function login({ citizenId, password }) {
  return axios.post(joinUrl(API_AUTH, 'login'), { citizenId, password });
}

export async function registerPatient(data) {
  return axios.post(joinUrl(API_PATIENT, ''), data, {
    headers: { 'Content-Type': 'multipart/form-data', ...getAuthHeader() },
  });
}

// -------------------- PATIENT --------------------
export async function getPatients() {
  return axios.get(joinUrl(API_PATIENT, ''), { headers: getAuthHeader() });
}

export async function getPatientById(id) {
  return axios.get(joinUrl(API_PATIENT, `${id}`), { headers: getAuthHeader() });
}

// -------------------- USERS --------------------
export async function getUsers() {
  return axios.get(joinUrl(API_USER, ''), { headers: getAuthHeader() });
}

export async function getUserById(id) {
  return axios.get(joinUrl(API_USER, `${id}`), { headers: getAuthHeader() });
}

// -------------------- APPOINTMENTS --------------------
export async function getAppointments() {
  return axios.get(joinUrl(API_APPOINTMENTS, ''), { headers: getAuthHeader() });
}

// เรียกประวัติการนัดหมายของผู้ป่วย
export async function getAppointmentsByPatientId(patientId) {
  return axios.get(joinUrl(API_APPOINTMENTS, `patient/${patientId}`), { headers: getAuthHeader() });
}

export async function createAppointment(data) {
  return axios.post(joinUrl(API_APPOINTMENTS, ''), data, { headers: getAuthHeader() });
}

export async function updateAppointment(id, data) {
  return axios.put(joinUrl(API_APPOINTMENTS, `${id}`), data, { headers: getAuthHeader() });
}

export async function deleteAppointment(id) {
  return axios.delete(joinUrl(API_APPOINTMENTS, `${id}`), { headers: getAuthHeader() });
}

// -------------------- DAILY TRACKING --------------------
export async function getDailyTracking() {
  return axios.get(joinUrl(API_TRACKING, ''), { headers: getAuthHeader() });
}

export async function createDailyTracking(data) {
  return axios.post(joinUrl(API_TRACKING, ''), data, { headers: getAuthHeader() });
}
