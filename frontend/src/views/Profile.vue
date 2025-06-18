<template>
  <v-app>
    <div class="background-image"></div>
    <v-container class="profile-container" fluid>
      <v-row justify="center">
        <v-col cols="12" md="8" lg="6">
          <v-card elevation="12" class="pa-3 rounded-xl" style="background: linear-gradient(to bottom right, #ffffff, #f8f9fa);">
            <v-card-title class="text-h5 font-weight-bold mb-4 text-center" style="color: #2c3e50;">
              <v-icon left color="#3498db" size="24">mdi-account-circle</v-icon>
              ข้อมูลส่วนตัวผู้ใช้งาน
              <v-spacer></v-spacer>
              <v-btn color="#3498db" outlined @click="goBackToMap">
                <v-icon left>mdi-arrow-left</v-icon>
                กลับ
              </v-btn>
            </v-card-title>

            <v-card-text>
              <v-form ref="profileForm" v-model="formValid">
                <!-- ข้อมูลส่วนตัว -->
                <v-card flat class="pa-3 mb-4 rounded-lg" style="background: linear-gradient(to right, #ffffff, #f0f7ff); border: 1px solid #e3f2fd;">
                  <v-subheader class="font-weight-bold" style="color: #2980b9;">
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

                <!-- ข้อมูลการติดต่อ -->
                <v-card flat class="pa-3 mb-4 rounded-lg" style="background: linear-gradient(to right, #ffffff, #f0fff4); border: 1px solid #e8f5e9;">
                  <v-subheader class="font-weight-bold" style="color: #27ae60;">
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

                <!-- ที่อยู่และพิกัด -->
                <v-card flat class="pa-3 mb-4 rounded-lg" style="background: linear-gradient(to right, #ffffff, #f3e5f5); border: 1px solid #f3e5f5;">
                  <v-subheader class="font-weight-bold" style="color: #8e44ad;">
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

                <!-- ปุ่มดำเนินการ -->
                <v-card flat class="pa-3 rounded-lg" style="background: linear-gradient(to right, #ffffff, #e8eaf6); border: 1px solid #e8eaf6;">
                  <v-row dense>
                    <v-col cols="12">
                      <v-btn 
                        block 
                        color="success" 
                        @click="saveProfile" 
                        :loading="saving"
                        elevation="2"
                        class="white--text"
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
        phoneNumber: value => {
          const pattern = /^\d{10}$/; // Simple 10-digit phone number check
          return pattern.test(value) || 'กรุณากรอกเบอร์โทรศัพท์ 10 หลัก';
        }
      },
      snackbar: {
        show: false,
        text: '',
        color: ''
      },
      defaultImage: 'https://cdn-icons-png.flaticon.com/512/4320/4320337.png'
    };
  },
  mounted() {
    const loggedInUserId = localStorage.getItem('userId'); 
    
    if (loggedInUserId) {
      this.fetchUserProfile(loggedInUserId);
    } else {
      showWarningAlert('กรุณาเข้าสู่ระบบเพื่อดูข้อมูลส่วนตัว');
      this.$router.push('/login'); 
    }
  },
  methods: {
    goBackToMap() {
      this.$router.push('/map');
    },
    async fetchUserProfile(userId) {
      if (!userId) { 
        console.error('User ID is missing for fetching profile.');
        showErrorAlert('ไม่สามารถดึงข้อมูลโปรไฟล์ได้: ไม่พบ User ID');
        return; 
      }
      try {
        const res = await axios.get(`http://localhost:3001/api/users/${userId}`);
        if (res.data && res.data.user) {
          if (res.data.user.citizen_id) {
            res.data.user.citizen_id = String(res.data.user.citizen_id);
          }
          this.user = { ...res.data.user };
        } else {
          showWarningAlert('ไม่พบข้อมูลผู้ใช้งาน');
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
        showErrorAlert('เกิดข้อผิดพลาดในการโหลดข้อมูล');
      }
    },
    async saveProfile() {
      if (this.$refs.profileForm.validate()) {
        const result = await showConfirmDialog(
          'ยืนยันการแก้ไขข้อมูล',
          'คุณต้องการบันทึกการแก้ไขข้อมูลส่วนตัวใช่หรือไม่?'
        );

        if (!result.isConfirmed) {
          return;
        }

        this.saving = true;
        showLoading('กำลังบันทึกข้อมูล...');

        try {
          const res = await axios.put(`http://localhost:3001/api/users/${this.user.id}`, this.user);
          if (res.data && res.data.success) {
            closeLoading();
            await showSuccessAlert('บันทึกข้อมูลส่วนตัวสำเร็จ!');
          } else {
            closeLoading();
            showErrorAlert('ไม่สามารถบันทึกข้อมูลได้');
          }
        } catch (error) {
          closeLoading();
          console.error('Error saving profile:', error);
          const errorMessage = error.response?.data?.message || 'เกิดข้อผิดพลาดในการบันทึกข้อมูล';
          showErrorAlert(errorMessage);
        } finally {
          this.saving = false;
        }
      } else {
        showWarningAlert('กรุณากรอกข้อมูลให้ครบถ้วนและถูกต้อง');
      }
    }
  }
};
</script>

<style scoped>
/* สไตล์ยังคงเหมือนเดิม */
.background-image {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-image: url('/backgroundvue.png'); /* Ensure this path is correct */
  background-size: cover;
  background-position: center center;
  background-repeat: no-repeat;
  background-attachment: fixed;
  background-color: transparent;
  filter: blur(6px);
}

.profile-container {
  position: relative;
  z-index: 1;
  padding: 24px;
  min-height: 100vh;
  display: flex; /* Use flexbox for centering */
  align-items: center; /* Center vertically */
}

.profile-card {
  background: rgba(255, 255, 255, 0.95) !important;
  border-radius: 16px !important;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1) !important;
  width: 100%; /* Ensure card takes full column width */
}

/* Customizing Vuetify text fields for consistent look */
:deep(.v-input--outlined fieldset) {
  border-color: #92D7D0 !important; /* Light teal border */
}

:deep(.v-input--is-focused.v-input--outlined fieldset) {
  border-color: #3B5F6D !important; /* Darker teal on focus */
  border-width: 2px !important;
}

:deep(.v-label) {
  color: #3B5F6D !important; /* Label color */
}

:deep(.v-input__icon--prepend-inner .v-icon) {
  color: #92D7D0 !important; /* Icon color */
}

:deep(.v-text-field.v-input--is-disabled .v-input__control) {
  opacity: 0.7; /* Make disabled fields slightly faded */
}
</style>