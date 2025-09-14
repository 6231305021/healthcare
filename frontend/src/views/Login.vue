<template>
  <v-app>
    <div class="background-image"></div>
    <v-container class="login-container" fill-height>
      <v-row align="start" justify="center">
        <v-col cols="12" class="text-center mb-4">
          <div class="logo-text-container">
            <div class="logo-top-text text-h1 d-flex align-center justify-center">
              <v-icon left class="mx-2" color="#3B5F6D">mdi-heart-pulse</v-icon>
              <span class="logo-text">ผู้ดูแลสุขภาพ</span>
              <v-icon right class="mx-2" color="#3B5F6D">mdi-stethoscope</v-icon>
            </div>
          </div>
        </v-col>

        <v-col cols="12" sm="8" md="6" lg="4" class="login-form-col">
          <v-card elevation="0" class="login-card pa-4">
            <v-card-text>
              <v-form ref="form" @submit.prevent="login" v-model="formValid">
                <v-text-field
                  label="เลขบัตรประชาชน 13 หลัก"
                  v-model="citizenId"
                  :rules="[rules.required, rules.idCard]"
                  dense
                  outlined
                  clearable
                  class="custom-textfield mb-4"
                />

                <v-text-field
                  label="รหัสผ่าน"
                  v-model="password"
                  :type="showPassword ? 'text' : 'password'"
                  :append-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
                  @click:append="showPassword = !showPassword"
                  :rules="[rules.required]"
                  dense
                  outlined
                  clearable
                  class="custom-textfield mb-6"
                />

                <v-btn
                  type="submit"
                  color="#92D7D0"
                  block
                  large
                  :loading="loading"
                  :disabled="loading || !formValid"
                  class="login-button mb-3"
                >
                  เข้าสู่ระบบ
                </v-btn>

                <v-col cols="auto" class="text-center">
                  <v-btn
                    variant="text"
                    large
                    class="create-account-button"
                    @click="$router.push('/register')"
                  >
                    สร้างบัญชีใหม่
                  </v-btn>
                </v-col>
              </v-form>
            </v-card-text>
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
          <v-btn color="white" text v-bind="attrs" @click="snackbar.show = false">
            ปิด
          </v-btn>
        </template>
      </v-snackbar>
    </v-container>
  </v-app>
</template>

<script>
import Swal from 'sweetalert2';
import axios from 'axios';
import { showSuccessAlert, showErrorAlert, showWarningAlert } from '../utils/sweetAlert';

export default {
  data() {
    return {
      citizenId: '',
      password: '',
      showPassword: false,
      loading: false,
      formValid: false,
      snackbar: { show: false, text: '', color: '' },
      rules: {
        required: v => !!v || 'กรุณากรอกข้อมูล',
        idCard: v => (v && v.length === 13 && /^\d+$/.test(v)) || 'กรุณากรอกเลขบัตรประชาชน 13 หลักให้ถูกต้อง',
      },
    };
  },
  methods: {
    async login() {
      const { valid } = await this.$refs.form.validate();
      if (!valid) {
        showErrorAlert('กรุณากรอกข้อมูลให้ถูกต้อง');
        return;
      }

      this.loading = true;
      try {
        const res = await axios.post(`${import.meta.env.VITE_API_BASE}/auth/login`, {
          citizenId: this.citizenId,
          password: this.password,
        });

        if (res.data?.token) {
          localStorage.setItem('token', res.data.token);

          const user = res.data.user;
          if (user?.id && user?.role) {
            localStorage.setItem('userId', user.id);
            localStorage.setItem('userRole', user.role);

            if (user.role === 'admin') {
              await showSuccessAlert('เข้าสู่ระบบสำเร็จ (Admin)');
              this.$router.push('/adminmap');
            } else {
              await showSuccessAlert('เข้าสู่ระบบสำเร็จ');
              this.$router.push('/map');
            }
          } else {
            showErrorAlert('เข้าสู่ระบบล้มเหลว: ไม่พบข้อมูลผู้ใช้');
          }
        } else {
          showErrorAlert(res.data?.message || 'เข้าสู่ระบบล้มเหลว: ไม่ได้รับ Token');
        }
      } catch (error) {
        console.error('Login error:', error.response?.data || error.message);
        showErrorAlert(error.response?.data?.message || 'เข้าสู่ระบบล้มเหลว: เลขบัตรประชาชนหรือรหัสผ่านไม่ถูกต้อง');
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
/* background, layout และ responsive เหมือนเดิม */
.background-image {
  position: fixed; top: 0; left: 0; right: 0; bottom: 0;
  width: 100%; height: 100%;
  background-image: url('/backgroundvue.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  filter: blur(6px); transform: scale(1.1); margin: -10px;
}
.login-container { position: relative; z-index:1; min-height:100vh; display:flex; align-items:center; width:100%; overflow-x:hidden; padding-top:2.5rem; }
.logo-top-text { font-size:3em; font-weight:bold; color:#3B5F6D; display:flex; align-items:center; justify-content:center; gap:8px; }
.login-card { background-color:#F8F8F4; border-radius:20px; border:3px solid #8EC3B0; padding:30px; width:100%; max-width:400px; margin:0 auto; }
.login-button { background-color:#92D7D0 !important; color:white !important; border-radius:10px; height:50px; font-size:1.2em; font-weight:bold; }
.create-account-button { color:#000 !important; text-decoration:underline; font-size:1.1em; text-transform:none !important; padding:0; min-width:unset; }
/* media queries ตามเดิม */
</style>
