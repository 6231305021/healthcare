// src/api.js
import axios from 'axios';

// Base URLs จากไฟล์ .env
const API_AUTH = import.meta.env.VITE_API_URL;          // /auth
const API_PATIENT = import.meta.env.VITE_API_PATIENT;   // /patient
const API_USER = import.meta.env.VITE_API_USER;         // /user
const API_APPOINTMENTS = import.meta.env.VITE_API_APPOINTMENTS;
const API_TRACKING = import.meta.env.VITE_API_TRACKING;

// Header สำหรับ Token (ถ้ามี)
function getAuthHeader() {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// -------------------- AUTH --------------------
export async function login({ citizenId, password }) {
  return axios.post(`${API_AUTH}/login`, { citizenId, password });
}

export async function registerPatient(data) {
  return axios.post(`${API_PATIENT}`, data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
}

// -------------------- PATIENT --------------------
export async function getPatients() {
  return axios.get(`${API_PATIENT}`, { headers: getAuthHeader() });
}

export async function getPatientById(id) {
  return axios.get(`${API_PATIENT}${id}`, { headers: getAuthHeader() });
}

// -------------------- USERS --------------------
export async function getUsers() {
  return axios.get(`${API_USER}`, { headers: getAuthHeader() });
}

export async function getUserById(id) {
  return axios.get(`${API_USER}${id}`, { headers: getAuthHeader() });
}

// -------------------- APPOINTMENTS --------------------
export async function getAppointments() {
  return axios.get(`${API_APPOINTMENTS}`, { headers: getAuthHeader() });
}

export async function createAppointment(data) {
  return axios.post(`${API_APPOINTMENTS}`, data, { headers: getAuthHeader() });
}

// -------------------- DAILY TRACKING --------------------
export async function getDailyTracking() {
  return axios.get(`${API_TRACKING}`, { headers: getAuthHeader() });
}

export async function createDailyTracking(data) {
  return axios.post(`${API_TRACKING}`, data, { headers: getAuthHeader() });
}
