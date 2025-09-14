<template>
  <div class="background-image"></div>
  <v-container class="fill-height py-2" fluid>
    <v-row align="center" justify="center">
      <v-col cols="12" md="10" lg="8">
        <v-card elevation="12" class="pa-3 rounded-xl" style="background: linear-gradient(to bottom right, #ffffff, #f8f9fa);">
          <v-card-title class="text-h5 font-weight-bold mb-4 text-center" style="color: #2c3e50;">
            <v-icon left color="#3498db" size="24">mdi-account-edit</v-icon>
            แก้ไขข้อมูลผู้ป่วย
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
                    v-model="patient.name" 
                    label="ชื่อ-สกุล" 
                    :rules="[rules.required]" 
                    outlined 
                    dense
                    prepend-icon="mdi-account"
                    color="#3498db"
                    class="custom-field"
                  />
                  <v-text-field 
                    v-model="patient.age" 
                    label="อายุ" 
                    :rules="[rules.required, rules.number]" 
                    outlined 
                    dense
                    prepend-icon="mdi-calendar"
                    color="#3498db"
                    class="custom-field"
                  />
                  <v-select 
                    v-model="patient.gender" 
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
                    v-model="patient.race" 
                    label="เชื้อชาติ" 
                    :rules="[rules.required]" 
                    outlined 
                    dense
                    prepend-icon="mdi-flag"
                    color="#3498db"
                    class="custom-field"
                  />
                  <v-text-field 
                    v-model="patient.nationality" 
                    label="สัญชาติ" 
                    :rules="[rules.required]" 
                    outlined 
                    dense
                    prepend-icon="mdi-earth"
                    color="#3498db"
                    class="custom-field"
                  />
                  <v-text-field 
                    v-model="patient.occupation" 
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
                    v-model="patient.illness_info" 
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
                    v-model="patient.community_health_worker" 
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
                    v-if="imagePreview || patient.image_path"
                    :src="imagePreview || `${API_PATIENT}${patient.image_path}`"
                    max-height="200"
                    contain
                    class="mt-2 rounded-lg"
                    style="border: 2px solid #f1c40f;"
                  ></v-img>
                  <v-img
                    v-else
                    :src="defaultImage"
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
                    v-model="patient.province" 
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
                    v-model="patient.district" 
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
                    v-model="patient.subdistrict" 
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
                    v-model="patient.address_detail" 
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
                    v-model="patient.latitude" 
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
                    v-model="patient.longitude" 
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
              <v-row>
                <v-col cols="12" md="6">
                  <v-btn 
                    block 
                    color="#4CAF50"
                    :loading="loading" 
                    :disabled="!valid" 
                    @click="updatePatient"
                    class="mb-2 white--text"
                    elevation="2"
                  >
                    <v-icon left>mdi-check</v-icon> 
                    บันทึกการแก้ไข
                  </v-btn>
                </v-col>
                <v-col cols="12" md="6">
                  <v-btn 
                    block 
                    color="#607D8B"
                    @click="$router.back()"
                    class="white--text"
                    elevation="2"
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
</template>

<script>
import Swal from 'sweetalert2'
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import axios from 'axios';
import { showSuccessAlert, showErrorAlert, showWarningAlert, showConfirmDialog, showLoading, closeLoading } from '../utils/sweetAlert';

const API_PATIENT = import.meta.env.VITE_API_PATIENT; // ประกาศตัวแปร API ให้ใช้ใน template ได้

export default {
  data() {
    return {
      patient: {
        name: '',
        age: null,
        gender: '',
        race: '',
        nationality: '',
        occupation: '',
        community_health_worker: '',
        illness_info: '',
        province: '',
        district: '',
        subdistrict: '',
        address_detail: '',
        latitude: 13.736717,
        longitude: 100.523186,
        image_path: null,
      },
      patientImage: null,
      imagePreview: null,
      defaultImage: 'https://cdn-icons-png.flaticon.com/512/4320/4320337.png',
      valid: false,
      loading: false,
      map: null,
      marker: null,
      genderOptions: ['ชาย', 'หญิง', 'อื่นๆ'],
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
    this.fetchPatient();
  },
  methods: {
    async fetchPatient() {
      const patientId = this.$route.params.id;
      if (!patientId) {
        showErrorAlert('ไม่พบ ID ผู้ป่วย');
        return;
      }
      try {
        const res = await axios.get(`${API_PATIENT}${patientId}`);
        if (res.data.patient) {
          this.patient = res.data.patient;
          this.initMap(this.patient.latitude, this.patient.longitude);
        } else {
          showErrorAlert('ไม่พบข้อมูลผู้ป่วย');
          this.initMap();
        }
      } catch (error) {
        console.error(error);
        showErrorAlert('โหลดข้อมูลผู้ป่วยล้มเหลว');
        this.initMap();
      }
    },

    initMap(lat = 13.736717, lng = 100.523186) {
      if (this.map) {
        this.map.remove();
      }
      this.map = L.map('map').setView([lat, lng], 14);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
      }).addTo(this.map);

      this.marker = L.marker([lat, lng], { draggable: true }).addTo(this.map);

      this.patient.latitude = parseFloat(lat).toFixed(6);
      this.patient.longitude = parseFloat(lng).toFixed(6);

      this.marker.on('dragend', () => {
        const { lat, lng } = this.marker.getLatLng();
        this.patient.latitude = lat.toFixed(6);
        this.patient.longitude = lng.toFixed(6);
      });

      this.map.on('click', e => {
        const { lat, lng } = e.latlng;
        this.marker.setLatLng([lat, lng]);
        this.patient.latitude = lat.toFixed(6);
        this.patient.longitude = lng.toFixed(6);
      });
    },

    async searchLocation() {
      if (!this.patient.province && !this.patient.district) {
        showWarningAlert('กรุณากรอกจังหวัดหรืออำเภอเพื่อค้นหา');
        return;
      }
      const query = `${this.patient.subdistrict} ${this.patient.district} ${this.patient.province}`;
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
          this.patient.latitude = parseFloat(lat).toFixed(6);
          this.patient.longitude = parseFloat(lon).toFixed(6);
          showSuccessAlert(`พบพิกัดของ ${query}`);
        } else {
          showWarningAlert('ไม่พบพิกัดที่ระบุ');
        }
      } catch (error) {
        console.error(error);
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

    async updatePatient() {
      if (!this.$refs.form.validate()) {
        showErrorAlert('กรุณากรอกข้อมูลให้ครบถ้วนและถูกต้อง');
        return;
      }

      const result = await showConfirmDialog(
        'ยืนยันการแก้ไขข้อมูล',
        'คุณต้องการบันทึกการแก้ไขข้อมูลผู้ป่วยใช่หรือไม่?'
      );

      if (!result.isConfirmed) {
        return;
      }

      this.loading = true;
      showLoading('กำลังบันทึกข้อมูล...');

      try {
        const patientId = this.$route.params.id;
        const formData = new FormData();
        
        Object.keys(this.patient).forEach(key => {
          if (key !== 'image_path') {
            formData.append(key, this.patient[key]);
          }
        });

        if (this.patientImage) {
          formData.append('patientImage', this.patientImage);
        }

        const res = await axios.put(`${API_PATIENT}${patientId}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });

        if (res.data.message) {
          closeLoading();
          await showSuccessAlert(res.data.message);
          this.$router.back();
        }
      } catch (err) {
        closeLoading();
        const errorMessage = err.response?.data?.message || 'เกิดข้อผิดพลาดในการแก้ไขข้อมูล';
        showErrorAlert(errorMessage);
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style>
.custom-field {
  transition: all 0.3s ease;
}

.custom-field:hover {
  transform: translateY(-2px);
}

.v-card {
  transition: all 0.3s ease;
}

.v-card:hover {
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}

#map {
  transition: all 0.3s ease;
}

#map:hover {
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}

.v-btn {
  transition: all 0.3s ease;
}

.v-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.2);
}

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
</style>
