import { createRouter, createWebHistory } from 'vue-router';

import Login from '../views/Login.vue';
import Register from '../views/Register.vue';
import Map from '../views/Map.vue';
import Profile from '../views/Profile.vue';
import AddPatient from '../views/Addpatient.vue';
import PatientInfo from '../views/Patientinfo.vue';
import EditPatient from '../views/EditPatient.vue';
import PatientDailyTracking from '../views/PatientDailyTracking.vue';
import PatientAppointments from '../views/PatientAppointments.vue'; // ไฟล์ที่มีอยู่จริง
import AppointmentHistory from '../views/AppointmentHistory.vue';
import DailyTrackingGraph from '../views/DailyTrackingGraph.vue';
// ลบบรรทัด import AddAppointment ออก เพราะไม่มีไฟล์นี้อยู่จริง

const routes = [
  {
    path: '/',
    name: 'Login',
    component: Login,
  },
  {
    path: '/register',
    name: 'Register',
    component: Register,
  },
  {
    path: '/map',
    name: 'Map',
    component: Map,
  },
  {
    path: '/profile',
    name: 'Profile',
    component: Profile,
  },
  {
    path: '/addpatient',
    name: 'AddPatient',
    component: AddPatient,
  },
  {
    path: '/patientinfo',
    name: 'PatientInfo',
    component: PatientInfo,
  },
  {
    path: '/editpatient/:id', 
    name: 'EditPatient',
    component: EditPatient,
    props: true, 
  },
  {
    path: '/daily-tracking',
    name: 'PatientDailyTracking',
    component: PatientDailyTracking,
  },
  {
    path: '/appointments',
    name: 'PatientAppointments',
    component: PatientAppointments, // เส้นทางสำหรับดูรายการนัดหมาย
  },
  {
    path: '/appointment-history',
    name: 'AppointmentHistory',
    component: AppointmentHistory,
    props: route => ({
      patientId: route.query.patientId ? parseInt(route.query.patientId) : null,
    }),
  },
  {
    path: '/daily-tracking-graph',
    name: 'DailyTrackingGraph',
    component: DailyTrackingGraph,
    props: (route) => ({ patientId: route.query.patientId }), 
  },
  {
    path: '/add-appointment/:patientId',
    name: 'AddAppointment',
    component: PatientAppointments, // ชี้ไปที่ไฟล์ที่มีอยู่จริง
    props: true, // ทำให้ patientId ที่ส่งมาใน params เข้าถึงได้ในคอมโพเนนต์
  },
];

const router = createRouter({
  history: createWebHistory(), 
  routes, 
});

export default router;