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
        <v-btn text @click="goToHomePage"><v-icon left>mdi-logout</v-icon> ออกจากระบบ</v-btn>
        <v-btn text @click="goToUserPage"><v-icon left>mdi-account</v-icon> ข้อมูลส่วนตัว</v-btn>
        <v-btn text @click="goToAddPatient"><v-icon left>mdi-account-plus</v-icon> เพิ่มผู้ป่วยใหม่</v-btn>
        <v-btn text @click="goToPatientInfo"><v-icon left>mdi-account-multiple</v-icon> ข้อมูลผู้ป่วย</v-btn>
      </div>
    </v-app-bar>

    <v-navigation-drawer v-model="drawer" app temporary>
      <v-list>
        <v-list-item @click="goToHomePage"><v-list-item-icon><v-icon>mdi-logout</v-icon></v-list-item-icon><v-list-item-content><v-list-item-title>ออกจากระบบ</v-list-item-title></v-list-item-content></v-list-item>
        <v-list-item @click="goToUserPage"><v-list-item-icon><v-icon>mdi-account</v-icon></v-list-item-icon><v-list-item-content><v-list-item-title>ข้อมูลส่วนตัว</v-list-item-title></v-list-item-content></v-list-item>
        <v-list-item @click="goToAddPatient"><v-list-item-icon><v-icon>mdi-account-plus</v-icon></v-list-item-icon><v-list-item-content><v-list-item-title>เพิ่มผู้ป่วยใหม่</v-list-item-title></v-list-item-content></v-list-item>
        <v-list-item @click="goToPatientInfo"><v-list-item-icon><v-icon>mdi-account-multiple</v-icon></v-list-item-icon><v-list-item-content><v-list-item-title>ข้อมูลผู้ป่วย</v-list-item-title></v-list-item-content></v-list-item>
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
                        <div class="info-item"><span class="info-label">ชื่อ-นามสกุล:</span><span class="info-value">{{ selectedUserDetails.first_name }} {{ selectedUserDetails.last_name }}</span></div>
                        <div class="info-item"><span class="info-label">ที่อยู่:</span><span class="info-value">{{ selectedUserDetails.address }}</span></div>
                        <div v-if="selectedUserDetails.isPatient && selectedUserDetails.community_health_worker" class="info-item"><span class="info-label">อสม.ที่รับผิดชอบ:</span><span class="info-value">{{ selectedUserDetails.community_health_worker }}</span></div>
                      </v-col>
                      <v-col cols="12" md="6">
                        <div class="info-item"><span class="info-label">ละติจูด:</span><span class="info-value">{{ selectedUserDetails.latitude }}°N</span></div>
                        <div class="info-item"><span class="info-label">ลองจิจูด:</span><span class="info-value">{{ selectedUserDetails.longitude }}°E</span></div>
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

    <v-snackbar v-model="snackbar.show" :color="snackbar.color" timeout="3000" top>
      {{ snackbar.text }}
      <template v-slot:action="{ attrs }">
        <v-btn text v-bind="attrs" @click="snackbar.show = false">ปิด</v-btn>
      </template>
    </v-snackbar>
  </v-app>
</template>

<script>
import Swal from 'sweetalert2'
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { showSuccessAlert, showErrorAlert, showWarningAlert } from '../utils/sweetAlert';
import { getUsers, getPatients } from '../api.js'; // <-- เรียก API จาก api.js

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
      snackbar: { show: false, text: '', color: '' }
    };
  },
  methods: {
    goToUserPage() { this.$router.push('/profile'); },
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
      }).then((result) => { if(result.isConfirmed) this.$router.push('/') });
    },
    goToAddPatient() { this.$router.push('/Addpatient'); },
    goToPatientInfo() { this.$router.push('/patientinfo'); },

    async fetchUsers() {
      try {
        const res = await getUsers(); // <-- เรียกจาก api.js
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
        const res = await getPatients(); // <-- เรียกจาก api.js
        this.patients = Array.isArray(res.data) ? res.data : res.data.patients || [];
        this.mergeAllUsers();
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
      if (!this.searchQuery.trim()) return showWarningAlert('กรุณากรอกข้อมูลที่ต้องการค้นหา');
      this.searching = true;
      const query = this.searchQuery.trim().toLowerCase();
      const foundUser = this.allUsers.find(user => {
        const fullName = `${user.first_name || ''} ${user.last_name || ''}`.toLowerCase();
        const citizenId = user.citizen_id ? user.citizen_id.toString() : '';
        return fullName.includes(query) || citizenId === query;
      });
      if(foundUser && foundUser.latitude && foundUser.longitude){
        this.selectedUserDetails = foundUser;
        this.map.setView([foundUser.latitude, foundUser.longitude], 15);
        this.markers.forEach(marker => marker.user?.id===foundUser.id && marker.openPopup());
        showSuccessAlert('พบข้อมูลผู้ใช้');
      } else { this.selectedUserDetails = null; showWarningAlert('ไม่พบข้อมูลผู้ใช้'); }
      this.searching = false;
    },

    showAllUserLocations() {
      this.markers.forEach(m => m.remove());
      this.markers = [];
      this.allUsers.forEach(user => {
        if(user.latitude && user.longitude){
          const icon = user.isPatient && user.image_path
            ? L.icon({ iconUrl:`${import.meta.env.VITE_API_URL.replace('/auth','')}/${user.image_path}`, iconSize:[50,50], iconAnchor:[25,25], popupAnchor:[0,-25] })
            : L.icon({ iconUrl:'https://cdn-icons-png.flaticon.com/512/149/149071.png', iconSize:[40,40], iconAnchor:[20,20], popupAnchor:[0,-20] });

          const marker = L.marker([user.latitude, user.longitude], { icon });
          const popupContent = `
            <div class="popup-content">
              <h3>${user.first_name} ${user.last_name}</h3>
              ${user.isPatient && user.image_path ? `<img src="${import.meta.env.VITE_API_URL.replace('/auth','')}/${user.image_path}" alt="รูปผู้ป่วย">` : ''}
              <p><strong>ที่อยู่:</strong> ${user.address}</p>
              ${user.isPatient && user.community_health_worker ? `<p><strong>อสม.ที่รับผิดชอบ:</strong> ${user.community_health_worker}</p>` : ''}
            </div>`;
          marker.bindPopup(popupContent);
          marker.addTo(this.map);
          marker.user = user;
          this.markers.push(marker);
        }
      });
    },

    initMap() {
      if(!this.map){
        this.map = L.map('map', { center:[15.8700,100.9925], zoom:6 });
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution:'&copy; OpenStreetMap contributors' }).addTo(this.map);
      }
    },

    showSnackbar(text,color){ this.snackbar.text=text; this.snackbar.color=color; this.snackbar.show=true; }
  },

  mounted() {
    this.initMap();
    this.fetchUsers();
    this.fetchPatients();

    const lat = parseFloat(this.$route.query.lat);
    const lng = parseFloat(this.$route.query.lng);
    const name = this.$route.query.name || '';
    if(!isNaN(lat) && !isNaN(lng)){
      this.map.setView([lat,lng],15);
      L.marker([lat,lng]).addTo(this.map).bindPopup(`<b>${name}</b>`).openPopup();
    }
  }
};
</script>

<style scoped>
/* ยังคงสไตล์เดิมทั้งหมด */
.background-image { position: fixed; top:0; left:0; width:100vw; height:100vh; background-image:url('/backgroundvue.png'); background-size:cover; background-position:center center; filter:blur(6px); }
.map-container{ position:relative; z-index:1; padding:24px; }
.map-card{ background-color:white; border-radius:15px; box-shadow:0 4px 6px rgba(0,0,0,0.1); }
.map-content{ width:100%; height:calc(100vh-350px); min-height:600px; border-radius:12px; border:2px solid #92D7D0; overflow:hidden; margin-bottom:20px; }
@media(max-width:768px){.map-content{height:calc(100vh-300px);min-height:400px;}}
.search-field{background:rgba(255,255,255,0.9);border-radius:8px;}
.search-btn{margin-left:8px;height:40px !important;}
.coordinate-card{background:rgba(255,255,255,0.9)!important;border-radius:12px!important;margin-top:16px;}
</style>
