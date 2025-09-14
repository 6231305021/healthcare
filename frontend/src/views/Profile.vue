<template>
  <v-container>
    <v-card class="pa-4">
      <v-card-title>โปรไฟล์ผู้ใช้</v-card-title>
      <v-card-text>
        <v-form ref="profileForm" v-model="valid">
          <v-text-field v-model="user.first_name" label="ชื่อ" :rules="[rules.required]" />
          <v-text-field v-model="user.last_name" label="นามสกุล" :rules="[rules.required]" />
          <v-text-field v-model="user.email" label="อีเมล" :rules="[rules.required, rules.email]" />
          <v-text-field v-model="user.phone" label="โทรศัพท์" :rules="[rules.required]" />
          <v-text-field v-model="user.address" label="ที่อยู่" />
          <v-btn color="primary" @click="updateProfile" :loading="loading">บันทึก</v-btn>
        </v-form>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
import axios from 'axios';
import { showErrorAlert, showSuccessAlert } from '../utils/sweetAlert';

export default {
  data() {
    return {
      user: {},
      valid: false,
      loading: false,
      rules: {
        required: v => !!v || 'กรุณากรอกข้อมูล',
        email: v => /.+@.+\..+/.test(v) || 'อีเมลไม่ถูกต้อง'
      }
    };
  },
  mounted() {
    this.loadUser();
  },
  methods: {
    async loadUser() {
      const userId = localStorage.getItem('userId');
      if (!userId) return;

      try {
        const res = await axios.get(`${import.meta.env.VITE_API_USER}${userId}`);
        this.user = res.data.user;
      } catch (err) {
        console.error('API error:', err.response?.data || err);
        showErrorAlert('ไม่สามารถโหลดข้อมูลผู้ใช้ได้');
      }
    },
    async updateProfile() {
      if (!this.$refs.profileForm.validate()) return;
      this.loading = true;

      try {
        const userId = localStorage.getItem('userId');
        await axios.put(`${import.meta.env.VITE_API_USER}${userId}`, {
          first_name: this.user.first_name,
          last_name: this.user.last_name,
          email: this.user.email,
          phone: this.user.phone,
          address: this.user.address
        });
        await showSuccessAlert('อัปเดตโปรไฟล์สำเร็จ');
      } catch (err) {
        console.error('API error:', err.response?.data || err);
        showErrorAlert(err.response?.data?.message || 'เกิดข้อผิดพลาดในการอัปเดตโปรไฟล์');
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>
