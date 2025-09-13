<template>
  <v-app>
    <!-- Background Image -->
    <div class="background-image"></div>

    <!-- Profile Container -->
    <v-container class="profile-container" fluid>
      <v-row justify="center">
        <v-col cols="12" md="8" lg="6">
          <v-card elevation="12" class="pa-3 rounded-xl profile-card">
            <!-- Card Header -->
            <v-card-title class="text-h5 font-weight-bold mb-4 text-center" style="color: #2c3e50;">
              <v-icon left color="#3498db" size="24">mdi-account-circle</v-icon>
              ข้อมูลส่วนตัวผู้ใช้งาน
              <v-spacer></v-spacer>
              <v-btn color="#3498db" outlined @click="goBackToMap" class="hover-btn">
                <v-icon left>mdi-arrow-left</v-icon>
                กลับ
              </v-btn>
            </v-card-title>

            <!-- Form -->
            <v-card-text>
              <v-form ref="profileForm" v-model="formValid">
                
                <!-- Personal Info -->
                <v-card flat class="section-card mb-4">
                  <v-subheader class="section-title">
                    <v-icon left color="#3498db">mdi-account</v-icon>
                    ข้อมูลส่วนตัว
                  </v-subheader>
                  <v-row dense>
                    <v-col cols="12" md="6">
                      <v-text-field
                        v-model="user.first_name"
                        label="ชื่อ"
                        prepend-inner-icon="mdi-account"
                        outlined
                        dense
                        :rules="[rules.required]"
                        color="#3498db"
                        class="custom-field"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-text-field
                        v-model="user.last_name"
                        label="นามสกุล"
                        prepend-inner-icon="mdi-account"
                        outlined
                        dense
                        :rules="[rules.required]"
                        color="#3498db"
                        class="custom-field"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12">
                      <v-text-field
                        v-model="user.citizen_id"
                        label="เลขบัตรประชาชน"
                        prepend-inner-icon="mdi-card-account-details-outline"
                        outlined
                        dense
                        readonly
                        disabled
                        color="#3498db"
                        class="custom-field"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                </v-card>

                <!-- Contact Info -->
                <v-card flat class="section-card mb-4 contact-card">
                  <v-subheader class="section-title contact-title">
                    <v-icon left color="#2ecc71">mdi-phone</v-icon>
                    ข้อมูลการติดต่อ
                  </v-subheader>
                  <v-row dense>
                    <v-col cols="12">
                      <v-text-field
                        v-model="user.phone"
                        label="เบอร์โทรศัพท์"
                        prepend-inner-icon="mdi-phone"
                        outlined
                        dense
                        :rules="[rules.required, rules.phoneNumber]"
                        color="#2ecc71"
                        class="custom-field"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12">
                      <v-text-field
                        v-model="user.email"
                        label="อีเมล"
                        prepend-inner-icon="mdi-email"
                        outlined
                        dense
                        :rules="[rules.required, rules.email]"
                        color="#2ecc71"
                        class="custom-field"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                </v-card>

                <!-- Address & Coordinates -->
                <v-card flat class="section-card mb-4 address-card">
                  <v-subheader class="section-title address-title">
                    <v-icon left color="#9b59b6">mdi-map-marker</v-icon>
                    ที่อยู่และพิกัด
                  </v-subheader>
                  <v-row dense>
                    <v-col cols="12">
                      <v-text-field
                        v-model="user.address"
                        label="ที่อยู่"
                        prepend-inner-icon="mdi-map-marker"
                        outlined
                        dense
                        :rules="[rules.required]"
                        color="#9b59b6"
                        class="custom-field"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-text-field
                        v-model="user.latitude"
                        label="ละติจูด"
                        prepend-inner-icon="mdi-latitude"
                        outlined
                        dense
                        readonly
                        disabled
                        color="#9b59b6"
                        class="custom-field"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-text-field
                        v-model="user.longitude"
                        label="ลองจิจูด"
                        prepend-inner-icon="mdi-longitude"
                        outlined
                        dense
                        readonly
                        disabled
                        color="#9b59b6"
                        class="custom-field"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                </v-card>

                <!-- Save Button -->
                <v-card flat class="section-card mb-0">
                  <v-row dense>
                    <v-col cols="12">
                      <v-btn 
                        block 
                        color="success" 
                        @click="saveProfile" 
                        :loading="saving"
                        elevation="2"
                        class="white--text hover-btn"
                      >
                        <v-icon left>mdi-content-save</v-icon>
                        บันทึกข้อมูล
                      </v-btn>
                    </v-col>
                  </v-row>
                </v-card>

              </v-form>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>

    <!-- Snackbar -->
    <v-snackbar
      v-model="snackbar.show"
      :color="snackbar.color"
      timeout="3000"
      top
    >
      {{ snackbar.text }}
      <template v-slot:action="{ attrs }">
        <v-btn text v-bind="attrs" @click="snackbar.show = false">
          ปิด
        </v-btn>
      </template>
    </v-snackbar>
  </v-app>
</template>

<script>
import axios from 'axios';
import { showSuccessAlert, showErrorAlert, showWarningAlert, showConfirmDialog, showLoading, closeLoading } from '../utils/sweetAlert';

export default {
  data() {
    return {
      user: {
        id: null,
        first_name: '',
        last_name: '',
        citizen_id: '',
        address: '',
        latitude: '',
        longitude: '',
        phone: '',
        email: '',
      },
      formValid: false,
      saving: false,
      rules: {
        required: value => !!value || 'จำเป็นต้องกรอกข้อมูล',
        email: value => {
          const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
          return pattern.test(value) || 'รูปแบบอีเมลไม่ถูกต้อง';
        },
        phoneNumber: value => /^\d{10}$/.test(value) || 'กรุณากรอกเบอร์โทรศัพท์ 10 หลัก'
      },
      snackbar: { show: false, text: '', color: '' }
    };
  },
  mounted() {
    const loggedInUserId = localStorage.getItem('userId'); 
    if (loggedInUserId) this.fetchUserProfile(loggedInUserId);
    else {
      showWarningAlert('กรุณาเข้าสู่ระบบเพื่อดูข้อมูลส่วนตัว');
      this.$router.push('/login'); 
    }
  },
  methods: {
    goBackToMap() { this.$router.push('/map'); },
    async fetchUserProfile(userId) {
      if (!userId) return showErrorAlert('ไม่สามารถดึงข้อมูลโปรไฟล์ได้: ไม่พบ User ID');
      try {
        const res = await axios.get(`https://healthcare-production-1567.up.railway.app/auth/users/${userId}`);
        if (res.data?.user) this.user = { ...res.data.user, citizen_id: String(res.data.user.citizen_id) };
        else showWarningAlert('ไม่พบข้อมูลผู้ใช้งาน');
      } catch (error) {
        console.error(error);
        showErrorAlert('เกิดข้อผิดพลาดในการโหลดข้อมูล');
      }
    },
    async saveProfile() {
      if (!this.$refs.profileForm.validate()) return showWarningAlert('กรุณากรอกข้อมูลให้ครบถ้วนและถูกต้อง');

      const result = await showConfirmDialog('ยืนยันการแก้ไขข้อมูล','คุณต้องการบันทึกการแก้ไขข้อมูลส่วนตัวใช่หรือไม่?');
      if (!result.isConfirmed) return;

      this.saving = true; showLoading('กำลังบันทึกข้อมูล...');
      try {
        const res = await axios.put(`https://healthcare-production-1567.up.railway.app/auth/users/${this.user.id}`, this.user);
        if (res.data?.success) await showSuccessAlert('บันทึกข้อมูลส่วนตัวสำเร็จ!');
        else showErrorAlert('ไม่สามารถบันทึกข้อมูลได้');
      } catch (error) {
        console.error(error);
        const msg = error.response?.data?.message || 'เกิดข้อผิดพลาดในการบันทึกข้อมูล';
        showErrorAlert(msg);
      } finally { this.saving = false; closeLoading(); }
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
  filter: blur(6px);
  z-index: -1;
}

.profile-container {
  position: relative;
  z-index: 1;
  padding: 24px;
  min-height: 100vh;
  display: flex;
  align-items: center;
}

.profile-card {
  background: rgba(255, 255, 255, 0.95) !important;
  border-radius: 16px !important;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15) !important;
}

.section-card {
  background: linear-gradient(to right, #ffffff, #f0f7ff);
  border: 1px solid #e3f2fd;
  border-radius: 12px;
  transition: 0.3s;
}
.section-card:hover { transform: translateY(-3px); box-shadow: 0 6px 20px rgba(0,0,0,0.1); }

.contact-card { background: linear-gradient(to right, #ffffff, #f0fff4); border: 1px solid #e8f5e9; }
.address-card { background: linear-gradient(to right, #ffffff, #f3e5f5); border: 1px solid #f3e5f5; }

.section-title { font-weight: bold; color: #3498db; margin-bottom: 12px; }
.contact-title { color: #27ae60; }
.address-title { color: #8e44ad; }

.hover-btn { transition: 0.3s; }
.hover-btn:hover { transform: scale(1.05); box-shadow: 0 4px 12px rgba(0,0,0,0.1); }

.custom-field { margin-bottom: 12px; }

:deep(.v-input--outlined fieldset) { border-color: #92D7D0 !important; }
:deep(.v-input--is-focused.v-input--outlined fieldset) { border-color: #3B5F6D !important; border-width: 2px !important; }
:deep(.v-label) { color: #3B5F6D !important; }
:deep(.v-input__icon--prepend-inner .v-icon) { color: #92D7D0 !important; }
:deep(.v-text-field.v-input--is-disabled .v-input__control) { opacity: 0.7; }
</style>
