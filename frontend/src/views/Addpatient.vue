<template>
  <div class="background-image"></div>
  <v-app>
    <v-app-bar app color="#3B5F6D" dark elevation="4">
      <v-app-bar-nav-icon @click="drawer = !drawer" class="d-md-none"></v-app-bar-nav-icon>
      <v-toolbar-title class="font-weight-bold">
        <v-icon left>mdi-account-plus</v-icon>
        เพิ่มผู้ป่วยใหม่
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
        <v-btn text @click="goToPatientInfo">
          <v-icon left>mdi-account-multiple</v-icon>
          ข้อมูลผู้ป่วย
        </v-btn>
        <v-btn text @click="goToMap">
          <v-icon left>mdi-map-marker-multiple</v-icon>
          แผนที่ผู้ป่วย
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
        <v-list-item @click="goToPatientInfo">
          <v-list-item-icon>
            <v-icon>mdi-account-multiple</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>ข้อมูลผู้ป่วย</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item @click="goToMap">
          <v-list-item-icon>
            <v-icon>mdi-map-marker-multiple</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>แผนที่ผู้ป่วย</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-main>
      <v-container class="fill-height py-2" fluid>
        <v-row align="center" justify="center">
          <v-col cols="12" md="10" lg="8">
            <v-card elevation="12" class="pa-3 rounded-xl" style="background: linear-gradient(to bottom right, #ffffff, #f8f9fa);">
              <v-card-title class="text-h5 font-weight-bold mb-4 text-center" style="color: #2c3e50;">
                <v-icon left color="#3498db" size="24">mdi-account-plus</v-icon>
                เพิ่มผู้ป่วยใหม่
              </v-card-title>

              <v-form ref="form" v-model="valid" lazy-validation>
                <!-- ข้อมูลส่วนตัว -->
                <v-card flat class="pa-3 mb-4 rounded-lg" style="background: linear-gradient(to right, #ffffff, #f0f7ff); border: 1px solid #e3f2fd;">
                  <v-subheader class="font-weight-bold" style="color: #2980b9;">
                    <v-icon left color="#3498db">mdi-account</v-icon>
                    ข้อมูลส่วนตัว
                  </v-subheader>
                  <v-row dense>
                    <v-col cols="12" md="6">
                      <v-text-field 
                        v-model="name" 
                        label="ชื่อ-สกุล" 
                        :rules="[rules.required]" 
                        outlined 
                        dense
                        prepend-icon="mdi-account"
                        color="#3498db"
                        class="custom-field"
                      />
                      <v-text-field 
                        v-model="age" 
                        label="อายุ" 
                        :rules="[rules.required, rules.number]" 
                        outlined 
                        dense
                        prepend-icon="mdi-calendar"
                        color="#3498db"
                        class="custom-field"
                      />
                      <v-select 
                        v-model="gender" 
                        :items="genderOptions" 
                        label="เพศ" 
                        :rules="[rules.required]" 
                        outlined 
                        dense
                        prepend-icon="mdi-gender-male-female"
                        color="#3498db"
                        class="custom-field"
                      />
                    </v-col>

                    <v-col cols="12" md="6">
                      <v-text-field 
                        v-model="race" 
                        label="เชื้อชาติ" 
                        :rules="[rules.required]" 
                        outlined 
                        dense
                        prepend-icon="mdi-flag"
                        color="#3498db"
                        class="custom-field"
                      />
                      <v-text-field 
                        v-model="nationality" 
                        label="สัญชาติ" 
                        :rules="[rules.required]" 
                        outlined 
                        dense
                        prepend-icon="mdi-earth"
                        color="#3498db"
                        class="custom-field"
                      />
                      <v-text-field 
                        v-model="occupation" 
                        label="อาชีพ" 
                        :rules="[rules.required]" 
                        outlined 
                        dense
                        prepend-icon="mdi-briefcase"
                        color="#3498db"
                        class="custom-field"
                      />
                    </v-col>
                  </v-row>
                </v-card>

                <!-- ข้อมูลการดูแล -->
                <v-card flat class="pa-3 mb-4 rounded-lg" style="background: linear-gradient(to right, #ffffff, #f0fff4); border: 1px solid #e8f5e9;">
                  <v-subheader class="font-weight-bold" style="color: #27ae60;">
                    <v-icon left color="#2ecc71">mdi-medical-bag</v-icon>
                    ข้อมูลการดูแล
                  </v-subheader>
                  <v-row dense>
                    <v-col cols="12" md="6">
                      <v-textarea 
                        v-model="illness_info" 
                        label="รายละเอียดการเจ็บป่วย" 
                        outlined 
                        rows="3"
                        prepend-icon="mdi-heart-pulse"
                        color="#2ecc71"
                        class="custom-field"
                      />
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-text-field 
                        v-model="community_health_worker" 
                        label="อสม.ที่รับผิดชอบ" 
                        outlined 
                        dense
                        prepend-icon="mdi-account-group"
                        color="#2ecc71"
                        class="custom-field"
                      />
                    </v-col>
                  </v-row>
                </v-card>

                <!-- รูปภาพผู้ป่วย -->
                <v-card flat class="pa-3 mb-4 rounded-lg" style="background: linear-gradient(to right, #ffffff, #fff8e1); border: 1px solid #fff3e0;">
                  <v-subheader class="font-weight-bold" style="color: #f39c12;">
                    <v-icon left color="#f1c40f">mdi-camera</v-icon>
                    รูปภาพผู้ป่วย
                  </v-subheader>
                  <v-row dense>
                    <v-col cols="12">
                      <v-file-input
                        v-model="patientImage"
                        accept="image/*"
                        label="อัพโหลดรูปภาพผู้ป่วย"
                        prepend-icon="mdi-camera"
                        :rules="[rules.image]"
                        @change="previewImage"
                        outlined
                        dense
                        color="#f39c12"
                        class="custom-field"
                      ></v-file-input>
                      <v-img
                        v-if="imagePreview"
                        :src="imagePreview"
                        max-height="200"
                        contain
                        class="mt-2 rounded-lg"
                        style="border: 2px solid #f1c40f;"
                      ></v-img>
                    </v-col>
                  </v-row>
                </v-card>

                <!-- ที่อยู่และพิกัด -->
                <v-card flat class="pa-3 mb-4 rounded-lg" style="background: linear-gradient(to right, #ffffff, #f3e5f5); border: 1px solid #f3e5f5;">
                  <v-subheader class="font-weight-bold" style="color: #8e44ad;">
                    <v-icon left color="#9b59b6">mdi-map-marker</v-icon>
                    ที่อยู่และพิกัด
                  </v-subheader>

                  <v-row dense class="mb-3">
                    <v-col cols="12" md="4">
                      <v-text-field 
                        v-model="province" 
                        label="จังหวัด" 
                        outlined 
                        dense
                        prepend-icon="mdi-map"
                        color="#9b59b6"
                        class="custom-field"
                      />
                    </v-col>
                    <v-col cols="12" md="4">
                      <v-text-field 
                        v-model="district" 
                        label="อำเภอ" 
                        outlined 
                        dense
                        prepend-icon="mdi-map"
                        color="#9b59b6"
                        class="custom-field"
                      />
                    </v-col>
                    <v-col cols="12" md="4">
                      <v-text-field 
                        v-model="subdistrict" 
                        label="ตำบล" 
                        outlined 
                        dense
                        prepend-icon="mdi-map"
                        color="#9b59b6"
                        class="custom-field"
                      />
                    </v-col>
                  </v-row>

                  <v-row dense class="mb-3">
                    <v-col cols="12">
                      <v-text-field 
                        v-model="address_detail" 
                        label="ที่อยู่โดยละเอียด" 
                        outlined 
                        dense
                        prepend-icon="mdi-home"
                        color="#9b59b6"
                        class="custom-field"
                      />
                    </v-col>
                  </v-row>

                  <v-btn 
                    @click="searchLocation" 
                    color="#9b59b6"
                    class="mb-3 white--text"
                    elevation="2"
                  >
                    <v-icon left>mdi-map-search</v-icon>
                    ค้นหาตำแหน่งจากจังหวัด/อำเภอ/ตำบล
                  </v-btn>

                  <div id="map" class="mb-3 rounded-lg" style="height: 300px; border: 2px solid #9b59b6;"></div>

                  <v-row dense>
                    <v-col cols="12" md="6">
                      <v-text-field 
                        v-model="latitude" 
                        label="ละติจูด" 
                        readonly 
                        outlined 
                        dense
                        prepend-icon="mdi-latitude"
                        color="#9b59b6"
                        class="custom-field"
                      />
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-text-field 
                        v-model="longitude" 
                        label="ลองจิจูด" 
                        readonly 
                        outlined 
                        dense
                        prepend-icon="mdi-longitude"
                        color="#9b59b6"
                        class="custom-field"
                      />
                    </v-col>
                  </v-row>
                </v-card>

                <!-- ปุ่มดำเนินการ -->
                <v-card flat class="pa-3 rounded-lg" style="background: linear-gradient(to right, #ffffff, #e8eaf6); border: 1px solid #e8eaf6;">
                  <v-row dense>
                    <v-col cols="12" md="6">
                      <v-btn 
                        block 
                        color="success" 
                        :loading="loading" 
                        :disabled="!valid" 
                        @click="addPatient"
                        elevation="2"
                        class="white--text"
                      >
                        <v-icon left>mdi-check</v-icon>
                        บันทึกข้อมูลผู้ป่วย
                      </v-btn>
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-btn 
                        block 
                        color="grey" 
                        @click="$router.push('/Map')"
                        elevation="2"
                        class="white--text"
                      >
                        <v-icon left>mdi-arrow-left</v-icon>
                        กลับ
                      </v-btn>
                    </v-col>
                  </v-row>
                </v-card>
              </v-form>
            </v-card>
          </v-col>
        </v-row>

        <v-snackbar v-model="snackbar.show" :color="snackbar.color" top>
          {{ snackbar.text }}
          <template v-slot:action="{ attrs }">
            <v-btn text v-bind="attrs" @click="snackbar.show = false">ปิด</v-btn>
          </template>
        </v-snackbar>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import Swal from 'sweetalert2'
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import axios from 'axios';
import { showSuccessAlert, showErrorAlert, showWarningAlert } from '../utils/sweetAlert';

export default {
  data() {
    return {
      drawer: false,
      subdistrict: '',
      address_detail: '',
      name: '',
      age: '',
      gender: null,
      race: '',
      nationality: '',
      occupation: '',
      community_health_worker: '',
      illness_info: '',
      province: '',
      district: '',
      latitude: '',
      longitude: '',
      valid: false,
      loading: false,
      map: null,
      marker: null,
      genderOptions: ['ชาย', 'หญิง', 'อื่นๆ'],
      patientImage: null,
      imagePreview: null,
      snackbar: {
        show: false,
        text: '',
        color: '',
      },
      rules: {
        required: v => !!v || 'กรุณากรอกข้อมูล',
        number: v => /^\d+$/.test(v) || 'กรุณากรอกตัวเลขเท่านั้น',
        image: v => !v || v.size < 5000000 || 'ขนาดรูปภาพต้องไม่เกิน 5MB',
      },
    };
  },
  mounted() {
    this.initMap();
  },
  methods: {
    initMap() {
      this.map = L.map('map').setView([13.736717, 100.523186], 6); // Default Bangkok
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
      }).addTo(this.map);

      this.marker = L.marker([13.736717, 100.523186], { draggable: true }).addTo(this.map);
      this.latitude = 13.736717;
      this.longitude = 100.523186;

      this.marker.on('dragend', () => {
        const { lat, lng } = this.marker.getLatLng();
        this.latitude = lat.toFixed(6);
        this.longitude = lng.toFixed(6);
      });

      this.map.on('click', (e) => {
        const { lat, lng } = e.latlng;
        this.marker.setLatLng([lat, lng]);
        this.latitude = lat.toFixed(6);
        this.longitude = lng.toFixed(6);
      });
    },

    async searchLocation() {
      if (!this.province && !this.district) {
        showWarningAlert('กรุณากรอกจังหวัดหรืออำเภอเพื่อค้นหา');
        return;
      }
      const query = `${this.subdistrict} ${this.district} ${this.province}`;
      try {
        const res = await axios.get(`https://nominatim.openstreetmap.org/search`, {
          params: {
            q: query,
            format: 'json',
            addressdetails: 1,
            limit: 1,
          },
        });

        if (res.data.length > 0) {
          const { lat, lon } = res.data[0];
          this.map.setView([lat, lon], 14);
          this.marker.setLatLng([lat, lon]);
          this.latitude = parseFloat(lat).toFixed(6);
          this.longitude = parseFloat(lon).toFixed(6);
          showSuccessAlert(`พบพิกัดของ ${query}`);
        } else {
          showWarningAlert('ไม่พบพิกัดที่ระบุ');
        }
      } catch (error) {
        showErrorAlert('เกิดข้อผิดพลาดในการค้นหาพิกัด');
      }
    },

    previewImage(file) {
      if (!file) {
        this.imagePreview = null;
        return;
      }
      const reader = new FileReader();
      reader.onload = e => {
        this.imagePreview = e.target.result;
      };
      reader.readAsDataURL(file);
    },

    async addPatient() {
      if (!this.$refs.form.validate()) {
        showErrorAlert('กรุณากรอกข้อมูลให้ครบถ้วนและถูกต้อง');
        return;
      }

      this.loading = true;
      try {
        const formData = new FormData();
        formData.append('name', this.name);
        formData.append('age', this.age);
        formData.append('gender', this.gender);
        formData.append('race', this.race);
        formData.append('nationality', this.nationality);
        formData.append('occupation', this.occupation);
        formData.append('community_health_worker', this.community_health_worker);
        formData.append('illness_info', this.illness_info);
        formData.append('province', this.province);
        formData.append('district', this.district);
        formData.append('subdistrict', this.subdistrict);
        formData.append('address_detail', this.address_detail);
        formData.append('latitude', this.latitude);
        formData.append('longitude', this.longitude);
        
        if (this.patientImage) {
          formData.append('patientImage', this.patientImage);
        }

        const res = await axios.post('https://healthcare-production-1567.up.railway.app/auth/', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });

        await showSuccessAlert(res.data.message);
        this.$router.push('/patientinfo');
      } catch (err) {
        const errorMessage = err.response?.data?.message || 'เกิดข้อผิดพลาดในการบันทึกข้อมูล';
        showErrorAlert(errorMessage);
      } finally {
        this.loading = false;
      }
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
          this.$router.push('/')
        }
      })
    },
    goToUserPage() {
      this.$router.push('/profile')
    },
    goToPatientInfo() {
      this.$router.push('/patientinfo')
    },
    goToMap() {
      this.$router.push('/map')
    },
  },
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
#map {
  width: 100%;
  height: 300px;
  border-radius: 10px;
  border: 1px solid #ccc;
}

@media (max-width: 960px) {
  .v-toolbar__title {
    font-size: 1.1rem;
  }
  .v-btn { padding: 0 8px; }
  .v-btn .v-icon { margin-right: 4px; }
  .v-card { padding: 16px; }
}

@media (max-width: 600px) {
  .v-toolbar__title { font-size: 1rem; }
  .v-card { padding: 12px; }
  .v-card-title { font-size: 1.1rem; }
  .v-card-text { font-size: 0.9rem; }
  .v-text-field { margin-bottom: 8px; }
  .v-btn { padding: 0 4px; font-size: 0.8rem; }
}
</style>
