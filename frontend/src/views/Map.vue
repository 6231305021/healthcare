<template>
  <v-app>
    <v-app-bar app color="#3B5F6D" dark>
      <v-app-bar-nav-icon @click="drawer = !drawer" class="d-md-none"></v-app-bar-nav-icon>
      <v-toolbar-title>
        <v-icon left>mdi-map-marker-multiple</v-icon>
        แผนที่ผู้ป่วย
      </v-toolbar-title>
    </v-app-bar>

    <v-navigation-drawer v-model="drawer" app temporary>
      <v-list dense>
        <v-list-item @click="$router.push('/profile')">
          <v-list-item-icon><v-icon>mdi-account</v-icon></v-list-item-icon>
          <v-list-item-content><v-list-item-title>ข้อมูลส่วนตัว</v-list-item-title></v-list-item-content>
        </v-list-item>
        <v-list-item @click="$router.push('/addpatient')">
          <v-list-item-icon><v-icon>mdi-account-plus</v-icon></v-list-item-icon>
          <v-list-item-content><v-list-item-title>เพิ่มผู้ป่วยใหม่</v-list-item-title></v-list-item-content>
        </v-list-item>
        <v-list-item @click="$router.push('/patientinfo')">
          <v-list-item-icon><v-icon>mdi-account-multiple</v-icon></v-list-item-icon>
          <v-list-item-content><v-list-item-title>ข้อมูลผู้ป่วย</v-list-item-title></v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-main>
      <v-container fluid>
        <div id="map" class="map-container"></div>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import axios from 'axios';
import { showErrorAlert } from '../utils/sweetAlert';

export default {
  data() {
    return {
      drawer: false,
      map: null,
      markers: [],
      patients: [],
    };
  },
  mounted() {
    this.initMap();
    this.fetchPatients();
  },
  methods: {
    initMap() {
      this.map = L.map('map').setView([13.736717, 100.523186], 6);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
      }).addTo(this.map);
    },
    async fetchPatients() {
      try {
        const res = await axios.get('https://healthcare-production-1567.up.railway.app/patient/all');
        this.patients = res.data?.patients || [];

        this.patients.forEach(p => {
          if (p.latitude && p.longitude) {
            const marker = L.marker([p.latitude, p.longitude]).addTo(this.map);
            marker.bindPopup(`<strong>${p.first_name} ${p.last_name}</strong><br>${p.address}<br>${p.phone}`);
            this.markers.push(marker);
          }
        });
      } catch (err) {
        console.error(err);
        showErrorAlert(err.response?.data?.message || 'เกิดข้อผิดพลาดในการโหลดข้อมูลผู้ป่วย');
      }
    },
  },
};
</script>

<style scoped>
.map-container {
  height: 80vh;
  width: 100%;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.1);
}
</style>
