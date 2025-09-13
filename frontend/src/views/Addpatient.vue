<template>
  <v-container fluid class="py-4">
    <v-row justify="center">
      <v-col cols="12" md="8">
        <v-card elevation="12" class="pa-4 rounded-xl">
          <v-card-title class="font-weight-bold text-h5">
            <v-icon left color="primary">mdi-account-plus</v-icon>
            เพิ่มผู้ป่วยใหม่
          </v-card-title>
          <v-card-text>
            <v-form ref="form" v-model="valid">
              <v-text-field
                v-model="patient.first_name"
                label="ชื่อ"
                outlined
                dense
                :rules="[rules.required]"
              />
              <v-text-field
                v-model="patient.last_name"
                label="นามสกุล"
                outlined
                dense
                :rules="[rules.required]"
              />
              <v-text-field
                v-model="patient.citizen_id"
                label="เลขบัตรประชาชน"
                outlined
                dense
                :rules="[rules.required, rules.citizenId]"
              />
              <v-text-field
                v-model="patient.phone"
                label="เบอร์โทรศัพท์"
                outlined
                dense
                :rules="[rules.required, rules.phone]"
              />
              <v-text-field
                v-model="patient.email"
                label="อีเมล"
                outlined
                dense
                :rules="[rules.required, rules.email]"
              />
              <v-text-field
                v-model="patient.address"
                label="ที่อยู่"
                outlined
                dense
                :rules="[rules.required]"
              />
              <v-btn
                block
                color="success"
                class="mt-4"
                :loading="loading"
                @click="addPatient"
              >
                <v-icon left>mdi-content-save</v-icon>
                บันทึกผู้ป่วย
              </v-btn>
            </v-form>
          </v-card-text>
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
import { showSuccessAlert, showErrorAlert, showWarningAlert } from '../utils/sweetAlert';

export default {
  data() {
    return {
      patient: {
        first_name: '',
        last_name: '',
        citizen_id: '',
        phone: '',
        email: '',
        address: ''
      },
      valid: false,
      loading: false,
      snackbar: { show: false, text: '', color: '' },
      rules: {
        required: v => !!v || 'จำเป็นต้องกรอกข้อมูล',
        email: v => /.+@.+\..+/.test(v) || 'อีเมลไม่ถูกต้อง',
        phone: v => /^0\d{9}$/.test(v) || 'เบอร์โทรศัพท์ไม่ถูกต้อง',
        citizenId: v => /^\d{13}$/.test(v) || 'เลขบัตรประชาชนต้อง 13 หลัก'
      }
    };
  },
  methods: {
    async addPatient() {
      if (!this.$refs.form.validate()) return showWarningAlert('กรุณากรอกข้อมูลให้ครบถ้วน');

      this.loading = true;
      try {
        const res = await axios.post('https://healthcare-production-1567.up.railway.app/patient', this.patient);
        if (res.data?.success) {
          await showSuccessAlert('เพิ่มผู้ป่วยสำเร็จ');
          this.patient = { first_name:'', last_name:'', citizen_id:'', phone:'', email:'', address:'' };
        } else showErrorAlert('ไม่สามารถเพิ่มผู้ป่วยได้');
      } catch (error) {
        console.error(error);
        showErrorAlert(error.response?.data?.message || 'เกิดข้อผิดพลาดในการบันทึกผู้ป่วย');
      } finally {
        this.loading = false;
      }
    },
    showSnackbar(text, color) {
      this.snackbar.text = text;
      this.snackbar.color = color;
      this.snackbar.show = true;
    }
  }
};
</script>

<style scoped>
.section-card { transition: 0.3s; }
.section-card:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
</style>
