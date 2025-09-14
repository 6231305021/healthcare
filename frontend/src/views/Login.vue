<template>
  <v-container class="fill-height d-flex align-center justify-center">
    <v-row justify="center" align="center">
      <v-col cols="12" md="6" lg="4">
        <v-card elevation="12" class="pa-4 rounded-xl login-card">
          <v-card-title class="text-h5 font-weight-bold justify-center">
            <v-icon left color="primary">mdi-login</v-icon>
            เข้าสู่ระบบ
          </v-card-title>

          <v-form ref="loginForm" v-model="valid" lazy-validation>
            <!-- เลขบัตรประชาชน -->
            <v-text-field
              v-model="citizenId"
              label="เลขบัตรประชาชน"
              prepend-inner-icon="mdi-card-account-details"
              :rules="[rules.required, rules.citizenId]"
              outlined
              dense
              class="mb-3"
            />

            <!-- รหัสผ่าน -->
            <v-text-field
              v-model="password"
              label="รหัสผ่าน"
              prepend-inner-icon="mdi-lock"
              :type="showPassword ? 'text' : 'password'"
              :append-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
              @click:append="showPassword = !showPassword"
              :rules="[rules.required, rules.min]"
              outlined
              dense
              class="mb-3"
            />

            <v-btn
              block
              color="primary"
              :loading="loading"
              :disabled="!valid"
              @click="login"
              class="mb-2 login-btn"
            >
              <v-icon left>mdi-login</v-icon>
              เข้าสู่ระบบ
            </v-btn>

            <v-btn text block color="grey" @click="$router.push('/register')" class="back-btn hover-btn">
              <v-icon left small>mdi-account-plus</v-icon>
              สมัครสมาชิก
            </v-btn>
          </v-form>
        </v-card>
      </v-col>
    </v-row>

    <v-snackbar v-model="snackbar.show" :color="snackbar.color" top timeout="3000">
      {{ snackbar.text }}
      <template v-slot:action="{ attrs }">
        <v-btn text v-bind="attrs" @click="snackbar.show = false">ปิด</v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>

<script>
import axios from 'axios';
import { showErrorAlert, showSuccessAlert } from '../utils/sweetAlert';
const API_AUTH = import.meta.env.VITE_API_URL; // เช่น https://healthcare-production-1567.up.railway.app/auth

export default {
  data() {
    return {
      citizenId: '',
      password: '',
      showPassword: false,
      valid: false,
      loading: false,
      snackbar: { show: false, text: '', color: '' },
      rules: {
        required: v => !!v || 'กรุณากรอกข้อมูล',
        min: v => v.length >= 6 || 'รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร',
        citizenId: v => /^\d{13}$/.test(v) || 'เลขบัตรประชาชนต้องมี 13 ตัวเลข',
      },
    };
  },
  methods: {
    async login() {
      if (!this.$refs.loginForm.validate()) return;

      this.loading = true;
      try {
        const res = await axios.post(`${API_AUTH}/login`, {
          citizenId: this.citizenId,
          password: this.password,
        });

        if (res.data?.user && res.data?.token) {
          localStorage.setItem('userId', res.data.user.id);
          localStorage.setItem('token', res.data.token);
          await showSuccessAlert('เข้าสู่ระบบสำเร็จ');
          this.$router.push('/profile');
        } else {
          showErrorAlert('เลขบัตรประชาชนหรือรหัสผ่านไม่ถูกต้อง');
        }
      } catch (err) {
        console.error('Login error:', err.response?.data || err.message);
        showErrorAlert(err.response?.data?.message || 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ');
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>

<style scoped>
.login-card {
  background: #ffffff;
  transition: all 0.3s ease;
}
.login-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0,0,0,0.15);
}

.login-btn {
  font-weight: 600;
  border-radius: 4px;
  height: 36px;
  background-color: #4caf50 !important;
  transition: all 0.3s ease;
}
.login-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(76,175,80,0.3);
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

.hover-btn {
  transition: all 0.3s ease;
}
.hover-btn:hover {
  transform: scale(1.05);
  box-shadow: 0 2px 6px rgba(76, 175, 80, 0.2);
}
</style>
