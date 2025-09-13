<template>
  <v-container fluid class="py-4">
    <v-row justify="center">
      <v-col cols="12" md="8">
        <v-card elevation="12" class="pa-4 rounded-xl">
          <v-card-title class="text-h5 font-weight-bold">
            <v-icon left color="primary">mdi-account-edit</v-icon>
            แก้ไขข้อมูลผู้ป่วย
          </v-card-title>
          <v-card-text>
            <v-form ref="editForm" v-model="formValid">
              <v-text-field
                v-model="patient.first_name"
                label="ชื่อ"
                :rules="[rules.required]"
                outlined
                dense
                class="mb-2"
              />
              <v-text-field
                v-model="patient.last_name"
                label="นามสกุล"
                :rules="[rules.required]"
                outlined
                dense
                class="mb-2"
              />
              <v-text-field
                v-model="patient.citizen_id"
                label="เลขบัตรประชาชน"
                outlined
                dense
                readonly
                disabled
                class="mb-2"
              />
              <v-text-field
                v-model="patient.phone"
                label="เบอร์โทรศัพท์"
                :rules="[rules.required, rules.phone]"
                outlined
                dense
                class="mb-2"
              />
              <v-text-field
                v-model="patient.address"
                label="ที่อยู่"
                :rules="[rules.required]"
                outlined
                dense
                class="mb-2"
              />
              <v-row dense>
                <v-col cols="6">
                  <v-text-field
                    v-model="patient.latitude"
                    label="ละติจูด"
                    outlined
                    dense
                    readonly
                  />
                </v-col>
                <v-col cols="6">
                  <v-text-field
                    v-model="patient.longitude"
                    label="ลองจิจูด"
                    outlined
                    dense
                    readonly
                  />
                </v-col>
              </v-row>

              <v-btn
                color="success"
                block
                :loading="saving"
                class="mt-4"
                @click="savePatient"
              >
                <v-icon left>mdi-content-save</v-icon>
                บันทึกข้อมูล
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
import { showSuccessAlert, showErrorAlert, showWarningAlert, showConfirmDialog, showLoading, closeLoading } from '../utils/sweetAlert';

export default {
  data() {
    return {
      patient: {
        id: null,
        first_name: '',
        last_name: '',
        citizen_id: '',
        phone: '',
        address: '',
        latitude: '',
        longitude: ''
      },
      formValid: false,
      saving: false,
      snackbar: { show: false, text: '', color: '' },
      rules: {
        required: v => !!v || 'จำเป็นต้องกรอกข้อมูล',
        phone: v => /^0\d{9}$/.test(v) || 'กรุณากรอกเบอร์โทรศัพท์ 10 หลัก'
      }
    };
  },
  mounted() {
    const patientId = this.$route.params.id;
    if (patientId) this.fetchPatient(patientId);
    else this.showSnackbar('ไม่พบ ID ผู้ป่วย', 'error');
  },
  methods: {
    async fetchPatient(id) {
      try {
        const res = await axios.get(`https://healthcare-production-1567.up.railway.app/patients/${id}`);
        if (res.data?.patient) this.patient = { ...res.data.patient };
        else this.showSnackbar('ไม่พบข้อมูลผู้ป่วย', 'warning');
      } catch (error) {
        console.error(error);
        showErrorAlert(error.response?.data?.message || 'เกิดข้อผิดพลาดในการโหลดข้อมูล');
      }
    },
    async savePatient() {
      if (!this.$refs.editForm.validate()) return showWarningAlert('กรุณากรอกข้อมูลให้ครบถ้วน');

      const result = await showConfirmDialog('ยืนยันการแก้ไข', 'คุณต้องการบันทึกการแก้ไขข้อมูลผู้ป่วยใช่หรือไม่?');
      if (!result.isConfirmed) return;

      this.saving = true;
      showLoading('กำลังบันทึก...');
      try {
        const res = await axios.put(`https://healthcare-production-1567.up.railway.app/patients/${this.patient.id}`, this.patient);
        if (res.data?.success) await showSuccessAlert('บันทึกข้อมูลสำเร็จ');
        else showErrorAlert('ไม่สามารถบันทึกข้อมูลได้');
      } catch (error) {
        console.error(error);
        showErrorAlert(error.response?.data?.message || 'เกิดข้อผิดพลาดในการบันทึกข้อมูล');
      } finally {
        this.saving = false;
        closeLoading();
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
.v-card { transition: 0.3s; }
.v-card:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(0,0,0,0.15); }
</style>
