<template>
  <v-container class="fill-height py-2" fluid>
    <v-row align="center" justify="center">
      <v-col cols="12" md="10" lg="8">
        <v-card elevation="12" class="pa-3 rounded-xl asom-theme">
          <v-card-title class="text-h5 font-weight-bold mb-2 text-center">
            <v-icon left color="primary" size="24">mdi-account-plus</v-icon>
            สมัครสมาชิก อสม.
          </v-card-title>

          <v-form ref="form" v-model="valid" lazy-validation>
            <v-row dense>
              <!-- ส่วนข้อมูลส่วนตัว -->
              <v-col cols="12" md="6">
                <v-card flat class="mb-3 pa-2 rounded-lg section-card">
                  <div class="text-subtitle-2 font-weight-bold mb-2 primary--text">
                    <v-icon left small>mdi-account</v-icon>
                    ข้อมูลส่วนตัว
                  </div>
                  
                  <v-text-field
                    v-model="citizenId"
                    label="เลขบัตรประชาชน"
                    :rules="[rules.required, rules.citizenId]"
                    maxlength="13"
                    outlined
                    clearable
                    color="primary"
                    dense
                    class="mb-2"
                    hide-details="auto"
                  />
                  <v-text-field
                    v-model="phone"
                    label="เบอร์โทรศัพท์"
                    :rules="[rules.required, rules.phone]"
                    maxlength="10"
                    outlined
                    clearable
                    color="primary"
                    dense
                    class="mb-2"
                    hide-details="auto"
                  />
                  <v-text-field
                    v-model="firstName"
                    label="ชื่อ"
                    :rules="[rules.required]"
                    outlined
                    clearable
                    color="primary"
                    dense
                    class="mb-2"
                    hide-details="auto"
                  />
                  <v-text-field
                    v-model="lastName"
                    label="นามสกุล"
                    :rules="[rules.required]"
                    outlined
                    clearable
                    color="primary"
                    dense
                    hide-details="auto"
                  />
                </v-card>
              </v-col>

              <!-- ส่วนข้อมูลการเข้าสู่ระบบ -->
              <v-col cols="12" md="6">
                <v-card flat class="mb-3 pa-2 rounded-lg section-card">
                  <div class="text-subtitle-2 font-weight-bold mb-2 primary--text">
                    <v-icon left small>mdi-lock</v-icon>
                    ข้อมูลการเข้าสู่ระบบ
                  </div>

                  <v-text-field
                    v-model="email"
                    label="อีเมล"
                    prepend-inner-icon="mdi-email"
                    :rules="[rules.required, rules.email]"
                    outlined
                    clearable
                    color="primary"
                    dense
                    class="mb-2"
                    hide-details="auto"
                  />
                  <v-text-field
                    v-model="password"
                    label="รหัสผ่าน"
                    :type="showPassword ? 'text' : 'password'"
                    :append-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
                    @click:append="showPassword = !showPassword"
                    :rules="[rules.required, rules.min]"
                    outlined
                    clearable
                    color="primary"
                    dense
                    class="mb-2"
                    hide-details="auto"
                  />
                  <v-text-field
                    v-model="confirmPassword"
                    label="ยืนยันรหัสผ่าน"
                    :type="showConfirmPassword ? 'text' : 'password'"
                    :append-icon="showConfirmPassword ? 'mdi-eye-off' : 'mdi-eye'"
                    @click:append="showConfirmPassword = !showConfirmPassword"
                    :rules="[rules.required, rules.match]"
                    outlined
                    clearable
                    color="primary"
                    dense
                    class="mb-2"
                    hide-details="auto"
                  />
                  <v-text-field
                    v-model="location"
                    label="ที่อยู่โดยละเอียด"
                    :rules="[rules.required]"
                    outlined
                    clearable
                    color="primary"
                    dense
                    hide-details="auto"
                  />
                </v-card>
              </v-col>
            </v-row>

            <!-- ส่วนข้อมูลที่อยู่ -->
            <v-card flat class="mb-3 pa-2 rounded-lg section-card">
              <div class="text-subtitle-2 font-weight-bold mb-2 primary--text">
                <v-icon left small>mdi-map-marker</v-icon>
                ข้อมูลที่อยู่
              </div>

              <v-row dense>
                <v-col cols="12" md="8" class="mx-auto">
                  <div class="d-flex align-center mb-2">
                    <label class="font-weight-bold asom-label mr-2">ระบุตำแหน่งบ้าน</label>
                    <v-btn
                      color="primary"
                      @click="goToCurrentLocation"
                      outlined
                      x-small
                      elevation="2"
                      class="ml-auto"
                    >
                      <v-icon left x-small>mdi-crosshairs-gps</v-icon>
                      ตำแหน่งปัจจุบัน
                    </v-btn>
                  </div>
                  <div id="map" class="mb-4"></div>
                  <v-row dense>
                    <v-col cols="6">
                      <v-text-field
                        v-model="latitude"
                        label="ละติจูด"
                        readonly
                        outlined
                        color="primary"
                        dense
                        hide-details="auto"
                      />
                    </v-col>
                    <v-col cols="6">
                      <v-text-field
                        v-model="longitude"
                        label="ลองจิจูด"
                        readonly
                        outlined
                        color="primary"
                        dense
                        hide-details="auto"
                      />
                    </v-col>
                  </v-row>
                </v-col>
              </v-row>
            </v-card>

            <v-btn
              block
              color="primary"
              :loading="loading"
              :disabled="!valid"
              @click="register"
              class="mb-2 register-btn"
              elevation="4"
            >
              <v-icon left>mdi-account-check</v-icon>
              สมัครสมาชิก
            </v-btn>

            <v-btn text block color="grey" @click="$router.push('/')" class="back-btn">
              <v-icon left small>mdi-arrow-left</v-icon>
              กลับไปหน้าเข้าสู่ระบบ
            </v-btn>
          </v-form>
        </v-card>
      </v-col>
    </v-row>

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
  </v-container>
</template>

<script>
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import axios from 'axios';
import { showSuccessAlert, showErrorAlert } from '../utils/sweetAlert';

export default {
  data() {
    return {
      citizenId: '',
      firstName: '',
      lastName: '',
      phone: '',
      email: '',
      location: '',
      latitude: '',
      longitude: '',
      password: '',
      confirmPassword: '',
      showPassword: false,
      showConfirmPassword: false,
      valid: false,
      loading: false,
      map: null,
      marker: null,
      snackbar: {
        show: false,
        text: '',
        color: '',
      },
      rules: {
        required: v => !!v || 'กรุณากรอกข้อมูล',
        email: v => /.+@.+\..+/.test(v) || 'อีเมลไม่ถูกต้อง',
        phone: v => /^0\d{9}$/.test(v) || 'เบอร์ไม่ถูกต้อง',
        citizenId: v => /^\d{13}$/.test(v) || 'ต้องมี 13 หลัก',
        min: v => v.length >= 6 || 'รหัสผ่านอย่างน้อย 6 ตัวอักษร',
        match: v => v === this.password || 'รหัสผ่านไม่ตรงกัน',
      },
    };
  },
  mounted() {
    this.initMap();
  },
  methods: {
    initMap() {
      this.map = L.map('map').setView([13.736717, 100.523186], 6);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
      }).addTo(this.map);

      this.marker = L.marker([13.736717, 100.523186], { draggable: true }).addTo(this.map);

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

      this.latitude = 13.736717;
      this.longitude = 100.523186;
    },

    goToCurrentLocation() {
      if (!navigator.geolocation) {
        this.showSnackbar('เบราว์เซอร์ของคุณไม่รองรับ Geolocation', 'error');
        return;
      }
      this.showSnackbar('กำลังค้นหาตำแหน่งปัจจุบัน...', 'info');

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;

          this.map.setView([lat, lng], 16);
          this.marker.setLatLng([lat, lng]);

          this.latitude = lat.toFixed(6);
          this.longitude = lng.toFixed(6);

          this.showSnackbar('พบตำแหน่งปัจจุบันแล้ว', 'success');
        },
        (error) => {
          switch(error.code) {
            case error.PERMISSION_DENIED:
              this.showSnackbar('ปฏิเสธการเข้าถึงตำแหน่ง', 'error');
              break;
            case error.POSITION_UNAVAILABLE:
              this.showSnackbar('ไม่สามารถระบุตำแหน่งได้', 'error');
              break;
            case error.TIMEOUT:
              this.showSnackbar('หมดเวลาการค้นหาตำแหน่ง', 'error');
              break;
            default:
              this.showSnackbar('เกิดข้อผิดพลาดในการค้นหาตำแหน่ง', 'error');
              break;
          }
        },
        { enableHighAccuracy: true, timeout: 10000 }
      );
    },
    async register() {
      if (!this.valid) return;

      this.loading = true;
      try {
        const response = await axios.post('https://healthcare-production-1567.up.railway.app/api/https://healthcare-production-1567.up.railway.app/auth/register', {
          citizenId: this.citizenId,
          firstName: this.firstName,
          lastName: this.lastName,
          phone: this.phone,
          email: this.email,
          location: this.location,
          latitude: this.latitude,
          longitude: this.longitude,
          password: this.password,
        });
        
        if (response.data.message) {
          await showSuccessAlert(response.data.message);
          this.$router.push('/');
        }
      } catch (err) {
        console.error('Registration error:', err.response?.data || err);
        const errorMessage = err.response?.data?.message || 'เกิดข้อผิดพลาดในการสมัคร';
        showErrorAlert(errorMessage);
      } finally {
        this.loading = false;
      }
    },
    showSnackbar(text, color) {
      this.snackbar.text = text;
      this.snackbar.color = color;
      this.snackbar.show = true;
    },
  },
};
</script>

<style scoped>
.asom-theme {
  background: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(76, 175, 80, 0.15);
}

.section-card {
  background: #f1f8e9;
  border: 1px solid rgba(76, 175, 80, 0.1);
  transition: all 0.3s ease;
  height: 380px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.section-card > div:first-child {
  flex-shrink: 0;
}

.section-card > div:last-child {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  padding-right: 4px;
}

.v-text-field {
  margin-bottom: 8px !important;
}

.v-text-field .v-messages {
  min-height: 20px;
  max-height: 40px;
  overflow-y: auto;
}

.asom-label {
  color: #2e7d32;
  font-size: 0.75rem;
}

#map {
  height: 200px;
  border: 1px solid #4caf50;
  border-radius: 6px;
  transition: all 0.3s ease;
}

#map:hover {
  box-shadow: 0 1px 4px rgba(76, 175, 80, 0.2);
}

.register-btn {
  font-weight: 600;
  text-transform: none;
  border-radius: 4px;
  height: 36px;
  transition: all 0.3s ease;
  background-color: #4caf50 !important;
  border-color: #4caf50 !important;
}

.register-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(76, 175, 80, 0.3);
  background-color: #43a047 !important;
}

.back-btn {
  transition: all 0.3s ease;
  height: 32px;
  color: #2e7d32 !important;
}

.back-btn:hover {
  background: rgba(76, 175, 80, 0.1);
}

.v-text-field, .v-textarea {
  transition: all 0.3s ease;
}

.v-text-field:focus-within, .v-textarea:focus-within {
  transform: translateY(-1px);
}

/* Override Vuetify primary color */
:deep(.v-application .primary) {
  background-color: #4caf50 !important;
  border-color: #4caf50 !important;
}

:deep(.v-application .primary--text) {
  color: #2e7d32 !important;
}

:deep(.v-application .primary--text .v-icon) {
  color: #2e7d32 !important;
}

:deep(.v-text-field--outlined.v-input--dense .v-label) {
  color: #2e7d32 !important;
}

:deep(.v-text-field--outlined.v-input--dense .v-input__slot) {
  border-color: rgba(76, 175, 80, 0.3) !important;
}

:deep(.v-text-field--outlined.v-input--dense.v-input--is-focused .v-input__slot) {
  border-color: #4caf50 !important;
}
</style>