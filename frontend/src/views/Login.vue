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
            <v-text-field
              v-model="citizenId"
              label="เลขบัตรประชาชน"
              prepend-inner-icon="mdi-card-account-details"
              :rules="[rules.required]"
              outlined
              dense
              class="mb-3"
            />
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
          </v-form>

          <v-btn text block color="grey" @click="$router.push('/register')" class="back-btn hover-btn">
            <v-icon left small>mdi-account-plus</v-icon>
            สมัครสมาชิก
          </v-btn>
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
      },
    };
  },
  methods: {
    async login() {
      if (!this.$refs.loginForm.validate()) return;

      this.loading = true;
      try {
        const res = await axios.post(`${import.meta.env.VITE_API_URL}/login`, {
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
        console.error('Login error:', err.response?.data || err);
        showErrorAlert(err.response?.data?.message || 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ');
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>
