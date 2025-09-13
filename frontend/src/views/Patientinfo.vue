<template>
  <v-container fluid class="py-4">
    <v-row justify="center">
      <v-col cols="12" md="10">
        <v-card elevation="12" class="pa-4 rounded-xl">
          <v-card-title class="font-weight-bold text-h5">
            <v-icon left color="primary">mdi-account-multiple</v-icon>
            ข้อมูลผู้ป่วย
          </v-card-title>
          <v-card-text>
            <v-data-table
              :headers="headers"
              :items="patients"
              :loading="loading"
              loading-text="กำลังโหลด..."
              class="elevation-1"
              dense
            >
              <template v-slot:item.actions="{ item }">
                <v-btn icon color="primary" @click="goToEditPatient(item.id)">
                  <v-icon>mdi-pencil</v-icon>
                </v-btn>
                <v-btn icon color="red" @click="deletePatient(item.id)">
                  <v-icon>mdi-delete</v-icon>
                </v-btn>
              </template>
            </v-data-table>
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
import { showErrorAlert, showSuccessAlert, showConfirmDialog } from '../utils/sweetAlert';

export default {
  data() {
    return {
      patients: [],
      loading: false,
      snackbar: { show: false, text: '', color: '' },
      headers: [
        { text: 'ชื่อ', value: 'first_name' },
        { text: 'นามสกุล', value: 'last_name' },
        { text: 'เลขบัตรประชาชน', value: 'citizen_id' },
        { text: 'เบอร์โทร', value: 'phone' },
        { text: 'อีเมล', value: 'email' },
        { text: 'ที่อยู่', value: 'address' },
        { text: 'Actions', value: 'actions', sortable: false }
      ]
    };
  },
  mounted() {
    this.fetchPatients();
  },
  methods: {
    async fetchPatients() {
      this.loading = true;
      try {
        const res = await axios.get('https://healthcare-production-1567.up.railway.app/patient');
        if (res.data?.patients) {
          this.patients = res.data.patients;
        } else {
          this.showSnackbar('ไม่พบข้อมูลผู้ป่วย', 'warning');
        }
      } catch (error) {
        console.error(error);
        showErrorAlert(error.response?.data?.message || 'เกิดข้อผิดพลาดในการดึงข้อมูลผู้ป่วย');
      } finally {
        this.loading = false;
      }
    },
    goToEditPatient(id) {
      this.$router.push(`/editpatient/${id}`);
    },
    async deletePatient(id) {
      const result = await showConfirmDialog('ยืนยันการลบ', 'คุณต้องการลบผู้ป่วยรายนี้หรือไม่?');
      if (!result.isConfirmed) return;

      try {
        const res = await axios.delete(`https://healthcare-production-1567.up.railway.app/patient/${id}`);
        if (res.data?.success) {
          await showSuccessAlert('ลบผู้ป่วยสำเร็จ');
          this.fetchPatients();
        } else {
          this.showSnackbar('ไม่สามารถลบผู้ป่วยได้', 'error');
        }
      } catch (error) {
        console.error(error);
        showErrorAlert(error.response?.data?.message || 'เกิดข้อผิดพลาดในการลบผู้ป่วย');
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
.v-card-title {
  display: flex;
  align-items: center;
}

.v-data-table {
  font-size: 0.95rem;
}
</style>
