<template>
  <v-app>
    <div class="background-image"></div>

    <v-app-bar app color="#3B5F6D" dark elevation="4">
      <v-app-bar-nav-icon @click="drawer = !drawer" class="d-md-none"></v-app-bar-nav-icon>
      <v-toolbar-title class="font-weight-bold">
        <v-icon left>mdi-map-marker-multiple</v-icon>
        แผนที่ผู้ป่วย
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <div class="d-none d-md-flex">
        <v-btn text @click="goToHomePage">
          <v-icon left>mdi-logout</v-icon>
          ออกจากระบบ
        </v-btn>
        <v-btn text @click="goToUserPage">
          <v-icon left>mdi-account</v-icon>
          ข้อมูลส่วนตัว
        </v-btn>
        <v-btn text @click="goToAddPatient">
          <v-icon left>mdi-account-plus</v-icon>
          เพิ่มผู้ป่วยใหม่
        </v-btn>
        <v-btn text @click="goToPatientInfo">
          <v-icon left>mdi-account-multiple</v-icon>
          ข้อมูลผู้ป่วย
        </v-btn>
      </div>
    </v-app-bar>

    <v-navigation-drawer v-model="drawer" app temporary>
      <v-list>
        <v-list-item @click="goToHomePage">
          <v-list-item-icon>
            <v-icon>mdi-logout</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>ออกจากระบบ</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item @click="goToUserPage">
          <v-list-item-icon>
            <v-icon>mdi-account</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>ข้อมูลส่วนตัว</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item @click="goToAddPatient">
          <v-list-item-icon>
            <v-icon>mdi-account-plus</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>เพิ่มผู้ป่วยใหม่</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item @click="goToPatientInfo">
          <v-list-item-icon>
            <v-icon>mdi-account-multiple</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>ข้อมูลผู้ป่วย</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-main>
      <v-container class="map-container" fluid>
        <v-row justify="center">
          <v-col cols="12" md="12" lg="12">
            <v-card elevation="12" class="map-card pa-4">
              <v-card-title class="text-h4 font-weight-bold mb-4 text-center d-flex justify-space-between align-center">
                <div class="flex-grow-1 text-center">
                  <v-icon left color="#3B5F6D" size="36">mdi-map-marker-multiple</v-icon>
                  แผนที่แสดงตำแหน่งผู้ใช้
                </div>
              </v-card-title>

              <v-card-text>
                <v-row justify="center">
                  <v-col cols="12" md="8">
                    <v-text-field
                      v-model="searchQuery"
                      label="ค้นหาด้วยชื่อ หรือ เลขบัตรประชาชน"
                      prepend-inner-icon="mdi-magnify"
                      clearable
                      outlined
                      dense
                      @keyup.enter="handleSearch"
                      class="search-field"
                    >
                      <template v-slot:append>
                        <v-btn
                          color="primary"
                          @click="handleSearch"
                          :loading="searching"
                          class="search-btn"
                        >
                          <v-icon left>mdi-magnify</v-icon>
                          ค้นหา
                        </v-btn>
                      </template>
                    </v-text-field>
                  </v-col>
                </v-row>
              </v-card-text>

              <v-card-text>
                <div id="map" class="map-content"></div>
              </v-card-text>

              <v-card-text v-if="selectedUserDetails">
                <v-card outlined class="coordinate-card pa-4">
                  <v-card-title class="text-h6 primary--text">
                    <v-icon left color="#3B5F6D">mdi-information</v-icon>
                    ข้อมูลตำแหน่ง
                  </v-card-title>
                  <v-card-text>
                    <v-row>
                      <v-col cols="12" md="6">
                        <div class="info-item">
                          <span class="info-label">ชื่อ-นามสกุล:</span>
                          <span class="info-value">{{ selectedUserDetails.first_name }} {{ selectedUserDetails.last_name }}</span>
                        </div>
                        <div class="info-item">
                          <span class="info-label">ที่อยู่:</span>
                          <span class="info-value">{{ selectedUserDetails.address }}</span>
                        </div>
                        <div v-if="selectedUserDetails.isPatient && selectedUserDetails.community_health_worker" class="info-item">
                          <span class="info-label">อสม.ที่รับผิดชอบ:</span>
                          <span class="info-value">{{ selectedUserDetails.community_health_worker }}</span>
                        </div>
                      </v-col>
                      <v-col cols="12" md="6">
                        <div class="info-item">
                          <span class="info-label">ละติจูด:</span>
                          <span class="info-value">{{ selectedUserDetails.latitude }}°N</span>
                        </div>
                        <div class="info-item">
                          <span class="info-label">ลองจิจูด:</span>
                          <span class="info-value">{{ selectedUserDetails.longitude }}°E</span>
                        </div>
                      </v-col>
                    </v-row>
                  </v-card-text>
                </v-card>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>

    <v-snackbar
      v-model="snackbar.show"
      :color="snackbar.color"
      timeout="3000"
      top
    >
      {{ snackbar.text }}
      <template v-slot:action="{ attrs }">
        <v-btn
          text
          v-bind="attrs"
          @click="snackbar.show = false"
        >
          ปิด
        </v-btn>
      </template>
    </v-snackbar>
  </v-app>
</template>

<script>
import Swal from 'sweetalert2'
import L from 'leaflet';
import axios from 'axios';
import 'leaflet/dist/leaflet.css';
import { showSuccessAlert, showErrorAlert, showWarningAlert } from '../utils/sweetAlert';

// Create a custom icon for patients using the imported images
const patientIcon = L.icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/149/149071.png',
  iconSize: [40, 40],
  iconAnchor: [20, 20],
  popupAnchor: [0, -20],
  className: 'default-marker'
});

// Your existing user icon (assuming '/backgroundvue.png' is correctly handled for the user icon)
const userIcon = L.icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/149/149071.png',
  iconSize: [40, 40],
  iconAnchor: [20, 20],
  popupAnchor: [0, -20],
  className: 'default-marker'
});

export default {
  data() {
    return {
      drawer: false,
      patients: [],
      users: [],
      allUsers: [],
      map: null,
      markers: [],
      searchQuery: '',
      selectedUserDetails: null,
      searching: false,
      snackbar: {
        show: false,
        text: '',
        color: ''
      }
    };
  },
  methods: {
    goToUserPage() {
      this.$router.push('/profile');
    },
    goToHomePage() {
      Swal.fire({
        title: 'คุณแน่ใจหรือไม่?',
        text: 'คุณต้องการออกจากระบบใช่หรือไม่',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'ใช่, ออกจากระบบ',
        cancelButtonText: 'ยกเลิก',
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
      }).then((result) => {
        if (result.isConfirmed) {
          // ทำการ logout หรือเปลี่ยนหน้า
          this.$router.push('/')
        }
      })
    },
    goToAddPatient() {
      this.$router.push('/Addpatient');
    },
    goToPatientInfo() {
      this.$router.push('/patientinfo');
    },

    async fetchUsers() {
      try {
        const res = await axios.get('https://healthcare-production-1567.up.railway.app/api/users');
        this.users = res.data.users || [];
        this.mergeAllUsers();
        this.showAllUserLocations();
      } catch (error) {
        console.error('Error fetching users:', error);
        showErrorAlert('โหลดข้อมูลผู้ใช้ล้มเหลว');
      }
    },

    async fetchPatients() {
      try {
        const res = await axios.get('https://healthcare-production-1567.up.railway.app/api/patients');
        if (Array.isArray(res.data)) {
          this.patients = res.data;
        } else if (res.data.patients && Array.isArray(res.data.patients)) {
          this.patients = res.data.patients;
        } else {
          this.patients = [];
        }
        this.mergeAllUsers();
        // After fetching both users and patients, re-show all locations
        this.showAllUserLocations(); 
      } catch (error) {
        console.error('Error fetching patients:', error);
        showErrorAlert('โหลดข้อมูลผู้ป่วยล้มเหลว');
      }
    },

    mergeAllUsers() {
      const formattedPatients = this.patients
        .filter(p => p.latitude && p.longitude)
        .map(p => ({
          id: p.id,
          first_name: p.name,
          last_name: '',
          address: `${p.address_detail || ''}, ${p.subdistrict || ''}, ${p.district || ''}, ${p.province || ''}`.replace(/(,\s?)+$/, ''),
          latitude: p.latitude,
          longitude: p.longitude,
          isPatient: true,
          image_path: p.image_path,
          community_health_worker: p.community_health_worker
        }));

      this.allUsers = [...this.users, ...formattedPatients];
    },

    handleSearch() {
      if (!this.searchQuery.trim()) {
        showWarningAlert('กรุณากรอกข้อมูลที่ต้องการค้นหา');
        return;
      }

      this.searching = true;
      const query = this.searchQuery.trim().toLowerCase();

      const foundUser = this.allUsers.find(user => {
        const fullName = `${user.first_name || ''} ${user.last_name || ''}`.toLowerCase();
        const citizenId = user.citizen_id ? user.citizen_id.toString() : '';
        return fullName.includes(query) || citizenId === query;
      });

      if (foundUser && foundUser.latitude && foundUser.longitude) {
        this.selectedUserDetails = foundUser;
        this.map.setView([foundUser.latitude, foundUser.longitude], 15);
        this.markers.forEach(marker => {
          if (marker.user && marker.user.id === foundUser.id) {
            marker.openPopup();
          }
        });
        showSuccessAlert('พบข้อมูลผู้ใช้');
      } else {
        this.selectedUserDetails = null;
        showWarningAlert('ไม่พบข้อมูลผู้ใช้');
      }

      this.searching = false;
    },

    showAllUserLocations() {
      // Clear existing markers
      this.markers.forEach(marker => marker.remove());
      this.markers = [];

      // Add markers for all users
      this.allUsers.forEach(user => {
        if (user.latitude && user.longitude) {
          let icon;
          if (user.isPatient && user.image_path) {
            // Create custom icon for patient with image
            icon = L.icon({
              iconUrl: `https://healthcare-production-1567.up.railway.app/api/https://healthcare-production-1567.up.railway.app/auth/${user.image_path}`,
              iconSize: [50, 50],
              iconAnchor: [25, 25],
              popupAnchor: [0, -25],
              className: 'patient-marker'
            });
          } else {
            // Use default circular icon for users without image
            icon = L.icon({
              iconUrl: 'https://cdn-icons-png.flaticon.com/512/149/149071.png',
              iconSize: [40, 40],
              iconAnchor: [20, 20],
              popupAnchor: [0, -20],
              className: 'default-marker'
            });
          }

          const marker = L.marker([user.latitude, user.longitude], { icon });

          // Create popup content with more details
          const popupContent = `
            <div class="popup-content">
              <h3>${user.first_name} ${user.last_name}</h3>
              ${user.isPatient && user.image_path ? 
                `<img src="https://healthcare-production-1567.up.railway.app/api/https://healthcare-production-1567.up.railway.app/auth/${user.image_path}" alt="รูปผู้ป่วย">` : ''}
              <p><strong>ที่อยู่:</strong> ${user.address}</p>
              ${user.isPatient && user.community_health_worker ? 
                `<p><strong>อสม.ที่รับผิดชอบ:</strong> ${user.community_health_worker}</p>` : ''}
            </div>
          `;

          marker.bindPopup(popupContent);
          marker.addTo(this.map);
          this.markers.push(marker);
        }
      });
    },

    initMap() {
      this.map = L.map('map', {
        center: [15.8700, 100.9925],
        zoom: 6,
        zoomControl: true
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
        maxZoom: 19
      }).addTo(this.map);
    },

    showSnackbar(text, color) {
      this.snackbar.text = text;
      this.snackbar.color = color;
      this.snackbar.show = true;
    }
  },

  mounted() {
    this.initMap();
    // this.fetchUsers();
    this.fetchPatients();

  const lat = parseFloat(this.$route.query.lat);
  const lng = parseFloat(this.$route.query.lng);
  const name = this.$route.query.name || '';

  if (!isNaN(lat) && !isNaN(lng)) {
    this.map.setView([lat, lng], 15);
    L.marker([lat, lng], { icon: userIcon })
      .addTo(this.map)
      .bindPopup(`<b>${name}</b>`)
      .openPopup();
  }
  }
};
</script>


<style scoped>
.background-image {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-image: url('/backgroundvue.png');
  background-size: cover;
  background-position: center center;
  background-repeat: no-repeat;
  background-attachment: fixed;
  background-color: transparent;
  filter: blur(6px);
}

.map-container {
  position: relative;
  z-index: 1;
  padding: 24px;
  /* Consider max-width here if you want it to not stretch endlessly on very large monitors */
  /* max-width: 1600px; /* Example: Limit max width for extremely large screens */
  /* margin: 0 auto; /* Center it if you set a max-width */
}

.map-card {
  background-color: white;
  border-radius: 15px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.map-content {
  width: 100%;
  height: calc(100vh - 350px); 
  min-height: 600px; 
  border-radius: 12px;
  border: 2px solid #92D7D0;
  overflow: hidden;
  margin-bottom: 20px;
}

@media (max-width: 768px) { 
  .map-content {
    height: calc(100vh - 300px); 
    min-height: 400px; 
  }
}

.search-field {
  background: rgba(255, 255, 255, 0.9);
  border-radius: 8px;
}

.search-btn {
  margin-left: 8px;
  height: 40px !important;
}

.coordinate-card {
  background: rgba(255, 255, 255, 0.9) !important;
  border-radius: 12px !important;
  margin-top: 16px;
}

.info-item {
  margin-bottom: 12px;
  display: flex;
  flex-direction: column;
}

.info-label {
  color: #3B5F6D;
  font-weight: bold;
  font-size: 0.9em;
  margin-bottom: 4px;
}

.info-value {
  color: #666;
  font-size: 1.1em;
}

.custom-popup {
  padding: 8px;
  text-align: center;
}

.popup-title {
  color: #3B5F6D;
  font-size: 1.1em;
  font-weight: bold;
  margin: 0 0 8px 0;
}

.popup-address {
  color: #666;
  font-size: 0.9em;
  margin: 4px 0;
}

.popup-coordinates {
  color: #888;
  font-size: 0.8em;
  margin: 4px 0;
}

/* Deep selectors for Leaflet styles */
:deep(.leaflet-popup-content-wrapper) {
  border-radius: 10px;
  padding: 0;
}

:deep(.leaflet-popup-content) {
  padding: 15px;
  text-align: center;
}

:deep(.leaflet-popup-content h3) {
  margin: 0 0 10px 0;
  color: #3B5F6D;
  font-size: 16px;
}

:deep(.leaflet-popup-content img) {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 50%;
  border: 3px solid #3B5F6D;
  margin: 5px 0;
}

:deep(.leaflet-popup-content p) {
  margin: 5px 0;
  font-size: 14px;
  color: #666;
}

/* Deep selectors for Leaflet styles */
:deep(.leaflet-control-zoom) {
  border: none !important;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1) !important;
}

:deep(.leaflet-control-zoom a) {
  background-color: #92D7D0 !important;
  color: #3B5F6D !important;
  border: none !important;
  width: 36px !important;
  height: 36px !important;
  line-height: 36px !important;
  font-size: 18px !important;
}

:deep(.leaflet-control-zoom a:hover) {
  background-color: #3B5F6D !important;
  color: white !important;
}

/* สไตล์สำหรับไอคอนบนแผนที่ */
:deep(.patient-marker),
:deep(.default-marker) {
  border-radius: 50%;
  border: 2px solid white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

:deep(.patient-marker img),
:deep(.default-marker img) {
  border-radius: 50%;
  object-fit: cover;
}

:deep(.default-marker) {
  background-color: #3B5F6D;
  padding: 2px;
}

.patient-tag {
  display: inline-block;
  background-color: #ff5252;
  color: white !important;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 10px !important;
  margin-top: 5px !important;
}

@media (max-width: 960px) {
  .v-toolbar__title {
    font-size: 1.1rem;
  }
  
  .v-btn {
    padding: 0 8px;
  }
  
  .v-btn .v-icon {
    margin-right: 4px;
  }
  
  .map-card {
    padding: 16px;
  }
  
  .map-content {
    height: calc(100vh - 300px);
  }
}

@media (max-width: 600px) {
  .v-toolbar__title {
    font-size: 1rem;
  }
  
  .map-card {
    padding: 12px;
  }
  
  .map-content {
    height: calc(100vh - 250px);
    min-height: 300px;
  }
  
  .v-card-title {
    font-size: 1.1rem;
  }
  
  .v-card-text {
    font-size: 0.9rem;
  }
  
  .search-field {
    margin-bottom: 8px;
  }
  
  .v-btn {
    padding: 0 4px;
    font-size: 0.8rem;
  }
}
</style>