<template>
  <v-app>
    <!-- App Bar -->
    <v-app-bar app color="#3B5F6D" dark elevation="4">
      <v-app-bar-nav-icon @click="drawer = !drawer" class="d-md-none"></v-app-bar-nav-icon>
      <v-toolbar-title class="font-weight-bold">
        <v-icon left>mdi-account-multiple</v-icon> รายชื่อผู้ป่วย
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <div class="d-none d-md-flex">
        <v-btn text @click="goToHomePage"><v-icon left>mdi-logout</v-icon> ออกจากระบบ</v-btn>
        <v-btn text @click="goToUserPage"><v-icon left>mdi-account</v-icon> ข้อมูลส่วนตัว</v-btn>
        <v-btn text @click="goToAddPatient"><v-icon left>mdi-account-plus</v-icon> เพิ่มผู้ป่วยใหม่</v-btn>
        <v-btn text @click="goToMap"><v-icon left>mdi-map-marker-multiple</v-icon> แผนที่ผู้ป่วย</v-btn>
      </div>
    </v-app-bar>

    <!-- Navigation Drawer -->
    <v-navigation-drawer v-model="drawer" app temporary>
      <v-list>
        <v-list-item @click="goToHomePage">
          <v-list-item-icon><v-icon>mdi-logout</v-icon></v-list-item-icon>
          <v-list-item-content><v-list-item-title>ออกจากระบบ</v-list-item-title></v-list-item-content>
        </v-list-item>
        <v-list-item @click="goToUserPage">
          <v-list-item-icon><v-icon>mdi-account</v-icon></v-list-item-icon>
          <v-list-item-content><v-list-item-title>ข้อมูลส่วนตัว</v-list-item-title></v-list-item-content>
        </v-list-item>
        <v-list-item @click="goToAddPatient">
          <v-list-item-icon><v-icon>mdi-account-plus</v-icon></v-list-item-icon>
          <v-list-item-content><v-list-item-title>เพิ่มผู้ป่วยใหม่</v-list-item-title></v-list-item-content>
        </v-list-item>
        <v-list-item @click="goToMap">
          <v-list-item-icon><v-icon>mdi-map-marker-multiple</v-icon></v-list-item-icon>
          <v-list-item-content><v-list-item-title>แผนที่ผู้ป่วย</v-list-item-title></v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <!-- Main Content -->
    <v-main>
      <v-container class="mt-6">
        <!-- Search Field -->
        <v-text-field
          v-model="search"
          label="ค้นหาชื่อผู้ป่วย"
          append-icon="mdi-magnify"
          outlined
          dense
          class="search-field"
        />

        <!-- Patient Cards -->
        <v-container fluid class="pa-2">
          <v-row dense>
            <v-col v-for="patient in filteredPatients" :key="patient.id" cols="12" sm="6" md="4" lg="2" class="pa-1">
              <v-card class="mx-auto my-3 patient-card" elevation="4">
                <div class="image-container">
                  <v-btn icon x-small class="delete-btn" @click="deletePatient(patient.id)">
                    <v-icon color="error" size="20">mdi-delete</v-icon>
                  </v-btn>
                  <v-img
                    :src="patient.image_path ? `/auth/${patient.image_path}` : defaultImage"
                    class="patient-image"
                    :aspect-ratio="1"
                    cover
                  >
                    <template v-slot:placeholder>
                      <v-row class="fill-height ma-0" align="center" justify="center">
                        <v-progress-circular indeterminate color="primary"></v-progress-circular>
                      </v-row>
                    </template>
                  </v-img>
                  <div class="patient-info-overlay">
                    <v-card-title class="text-h6 white--text">{{ patient.name }}</v-card-title>
                    <v-card-subtitle class="white--text">{{ patient.age }} ปี | {{ patient.gender }}</v-card-subtitle>
                  </div>
                </div>

                <v-card-text class="pt-2 pb-2">
                  <v-row dense>
                    <v-col cols="12">
                      <div class="info-item"><v-icon x-small color="primary" class="mr-1">mdi-map-marker</v-icon>
                        <span class="text-truncate">{{ formatAddress(patient) }}</span>
                      </div>
                    </v-col>
                    <v-col cols="12">
                      <div class="info-item"><v-icon x-small color="primary" class="mr-1">mdi-account</v-icon>
                        <span class="text-truncate">{{ patient.occupation || 'ไม่มีข้อมูลอาชีพ' }}</span>
                      </div>
                    </v-col>
                    <v-col cols="12">
                      <div class="info-item"><v-icon x-small color="primary" class="mr-1">mdi-heart-pulse</v-icon>
                        <span class="text-truncate">{{ patient.illness_info || 'ไม่มีข้อมูลการเจ็บป่วย' }}</span>
                      </div>
                    </v-col>
                    <v-col cols="12">
                      <div class="info-item"><v-icon x-small color="primary" class="mr-1">mdi-account-group</v-icon>
                        <span class="text-truncate">{{ patient.community_health_worker || 'ยังไม่มีอสม.ที่รับผิดชอบ' }}</span>
                      </div>
                    </v-col>
                  </v-row>
                </v-card-text>

                <v-divider></v-divider>

                <!-- Action Buttons -->
                <v-card-actions class="pa-2">
                  <v-row no-gutters>
                    <v-col cols="6" sm="4" md="4" v-for="action in actions" :key="action.name">
                      <v-btn x-small text :color="action.color" @click="action.method(patient.id, patient)" class="action-btn">
                        <v-icon x-small left>{{ action.icon }}</v-icon> {{ action.name }}
                      </v-btn>
                    </v-col>
                  </v-row>
                </v-card-actions>
              </v-card>
            </v-col>
          </v-row>
        </v-container>

        <v-alert v-if="filteredPatients.length === 0" type="warning" border="left" colored-border elevation="2">
          ไม่พบผู้ป่วยที่ค้นหา
        </v-alert>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import Swal from 'sweetalert2';
import axios from 'axios';

export default {
  name: 'PatientInfo',
  data() {
    return {
      drawer: false,
      patients: [],
      search: '',
      defaultImage: 'https://cdn-icons-png.flaticon.com/512/4320/4320337.png',
      actions: [
        { name: 'แก้ไข', color: 'primary', icon: 'mdi-pencil', method: (id) => this.editPatient(id) },
        { name: 'แผนที่', color: 'green', icon: 'mdi-map-marker', method: (id, patient) => this.viewOnMap(patient) },
        { name: 'ติดตาม', color: '#03A9F4', icon: 'mdi-clipboard-pulse', method: (id) => this.goToDailyTracking(id) },
        { name: 'การนัด', color: '#FFC107', icon: 'mdi-calendar-check', method: (id) => this.goToAppointments(id) },
        { name: 'ประวัติ', color: '#607D8B', icon: 'mdi-history', method: (id) => this.goToAppointmentHistory(id) },
        { name: 'กราฟ', color: '#8BC34A', icon: 'mdi-chart-line', method: (id) => this.goToDailyTrackingGraph(id) },
      ]
    };
  },
  computed: {
    filteredPatients() {
      return this.patients.filter(p => p.name?.toLowerCase().includes(this.search.toLowerCase()));
    }
  },
  methods: {
    formatAddress(patient) {
      return [patient.address_detail, patient.subdistrict, patient.district, patient.province].filter(Boolean).join(', ') || 'ไม่มีข้อมูลที่อยู่';
    },
    async fetchPatients() {
      try {
        const res = await axios.get('/auth/patients');
        this.patients = Array.isArray(res.data.patients) ? res.data.patients : [];
      } catch (err) {
        Swal.fire('Error', 'ไม่สามารถโหลดข้อมูลผู้ป่วยได้', 'error');
      }
    },
    async editPatient(id) { if ((await Swal.fire({ title:'ยืนยันแก้ไข?', icon:'question', showCancelButton:true })).isConfirmed) this.$router.push(`/editpatient/${id}`); },
    async viewOnMap(patient) { if ((await Swal.fire({ title:'ดูแผนที่?', icon:'question', showCancelButton:true })).isConfirmed) this.$router.push(`/map?lat=${patient.latitude||0}&lng=${patient.longitude||0}&name=${encodeURIComponent(patient.name||'ไม่ทราบชื่อ')}`); },
    async goToDailyTracking(id) { if ((await Swal.fire({ title:'ติดตามสุขภาพ?', icon:'question', showCancelButton:true })).isConfirmed) this.$router.push(`/daily-tracking?patientId=${id}`); },
    async goToAppointments(id) { if ((await Swal.fire({ title:'ดูการนัด?', icon:'question', showCancelButton:true })).isConfirmed) this.$router.push(`/appointments?patientId=${id}`); },
    async goToAppointmentHistory(id) { if ((await Swal.fire({ title:'ดูประวัติ?', icon:'question', showCancelButton:true })).isConfirmed) this.$router.push(`/appointment-history?patientId=${id}`); },
    async goToDailyTrackingGraph(id) { if ((await Swal.fire({ title:'ดูกราฟ?', icon:'question', showCancelButton:true })).isConfirmed) this.$router.push(`/daily-tracking-graph?patientId=${id}`); },
    async deletePatient(id) {
      if ((await Swal.fire({ title:'ลบผู้ป่วย?', text:'ไม่สามารถย้อนกลับได้', icon:'warning', showCancelButton:true })).isConfirmed) {
        try {
          const token = localStorage.getItem('userToken');
          await axios.delete(`/auth/patients/${id}`, { headers: token ? {'x-auth-token': token} : {} });
          Swal.fire('สำเร็จ','ลบข้อมูลผู้ป่วยเรียบร้อย','success');
          this.fetchPatients();
        } catch { Swal.fire('Error','ไม่สามารถลบข้อมูลผู้ป่วยได้','error'); }
      }
    },
    goToHomePage() { Swal.fire({ title:'ออกจากระบบ?', icon:'warning', showCancelButton:true }).then(r=>r.isConfirmed && this.$router.push('/')); },
    goToUserPage(){ this.$router.push('/profile'); },
    goToAddPatient(){ this.$router.push('/addpatient'); },
    goToMap(){ this.$router.push('/map'); }
  },
  mounted() { this.fetchPatients(); }
};
</script>

<style scoped>
.patient-card { border-radius:12px; overflow:hidden; transition:0.3s; display:flex; flex-direction:column; }
.patient-card:hover { transform:translateY(-5px); box-shadow:0 8px 16px rgba(0,0,0,0.15); }
.image-container { position:relative; overflow:hidden; width:100%; padding-top:100%; }
.patient-image { position:absolute !important; top:0; left:0; width:100% !important; height:100% !important; object-fit:cover; transition:transform 0.3s; }
.patient-card:hover .patient-image { transform:scale(1.05); }
.patient-info-overlay { position:absolute; bottom:0; left:0; right:0; background:linear-gradient(to top,rgba(0,0,0,0.85),rgba(0,0,0,0.4),transparent); padding:12px; }
.info-item { display:flex; align-items:center; margin-bottom:4px; font-size:0.8rem; color:#666; }
.action-btn { margin:2px; border-radius:4px; height:28px; min-width:0; padding:0 8px; transition:0.2s; }
.action-btn:hover { background-color:rgba(0,0,0,0.05); }
.delete-btn { background-color:rgba(255,255,255,0.9)!important; width:32px!important; height:32px!important; border-radius:50%; box-shadow:0 2px 4px rgba(0,0,0,0.1); transition:0.3s; }
.delete-btn:hover { background-color:#ffebee!important; transform:scale(1.1); box-shadow:0 4px 8px rgba(0,0,0,0.15); }
.delete-btn .v-icon { transition:0.3s; }
.delete-btn:hover .v-icon { transform:scale(1.1); }
.search-field { max-width:600px; margin:0 auto 16px; }
@media (max-width:960px){ .v-toolbar__title{ font-size:1.1rem; } .v-btn{ padding:0 8px; } .v-btn .v-icon{ margin-right:4px; } }
@media (max-width:600px){ .v-card{ margin:4px; } .action-btn{ padding:0 4px; font-size:0.8rem; } }
</style>
