<template>
  <v-app>
    <v-app-bar app color="#3B5F6D" dark>
      <v-app-bar-nav-icon @click="drawer = !drawer" class="d-md-none"></v-app-bar-nav-icon>
      <v-toolbar-title class="font-weight-bold">
        <v-icon left>mdi-clipboard-pulse</v-icon>
        ข้อมูลติดตามสุขภาพประจำวัน: {{ patientName }}
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <div class="d-none d-md-flex">
        <v-btn text @click="goToUserPage">
          <v-icon left>mdi-account</v-icon>
          ข้อมูลส่วนตัว
        </v-btn>
        <v-btn text @click="goToAddPatient">
          <v-icon left>mdi-account-plus</v-icon>
          เพิ่มผู้ป่วยใหม่
        </v-btn>
        <v-btn text @click="goToPatientInfo">
          <v-icon left>mdi-account-group</v-icon>
          ข้อมูลผู้ป่วย
        </v-btn>
        <v-btn text @click="goToMapPage">
          <v-icon left>mdi-map-marker-multiple</v-icon>
          แผนที่ผู้ป่วย
        </v-btn>
      </div>
    </v-app-bar>

    <v-navigation-drawer v-model="drawer" app temporary>
      <v-list>
        <v-list-item @click="goToUserPage">
          <v-list-item-icon>
            <v-icon>mdi-account</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>ข้อมูลส่วนตัว</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item @click="goToAddPatient">
          <v-list-item-icon>
            <v-icon>mdi-account-plus</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>เพิ่มผู้ป่วยใหม่</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item @click="goToPatientInfo">
          <v-list-item-icon>
            <v-icon>mdi-account-group</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>ข้อมูลผู้ป่วย</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item @click="goToMapPage">
          <v-list-item-icon>
            <v-icon>mdi-map-marker-multiple</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>แผนที่ผู้ป่วย</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-main>
      <v-container class="mt-6">
        <v-card class="pa-5">
          <v-card-title class="text-h6">บันทึกข้อมูลสุขภาพใหม่</v-card-title>
          <v-card-text>
            <v-form ref="trackingForm" v-model="valid" lazy-validation>
              <v-row>
                <v-col cols="12" sm="6" md="4">
                  <v-text-field
                    v-model.number="newTracking.temperature"
                    label="อุณหภูมิ (°C)"
                    type="number"
                    step="0.01"
                    prepend-icon="mdi-thermometer"
                    :rules="[value => (value === null || value === '') || (value >= 30 && value <= 45) || 'กรุณากรอกอุณหภูมิที่ถูกต้อง']"
                  />
                </v-col>
                <v-col cols="12" sm="6" md="4">
                  <v-text-field
                    v-model.number="newTracking.blood_pressure_systolic"
                    label="ความดันโลหิต (บน)"
                    type="number"
                    prepend-icon="mdi-heart-pulse"
                    :rules="[value => (value === null || value === '') || (value > 0) || 'กรุณากรอกความดันบนให้ถูกต้อง']"
                  />
                </v-col>
                <v-col cols="12" sm="6" md="4">
                  <v-text-field
                    v-model.number="newTracking.blood_pressure_diastolic"
                    label="ความดันโลหิต (ล่าง)"
                    type="number"
                    :rules="[value => (value === null || value === '') || (value > 0) || 'กรุณากรอกความดันล่างให้ถูกต้อง']"
                  />
                </v-col>
                <v-col cols="12" sm="6" md="4">
                  <v-text-field
                    v-model.number="newTracking.pulse_rate"
                    label="อัตราการเต้นของหัวใจ"
                    type="number"
                    prepend-icon="mdi-pulse"
                    :rules="[value => (value === null || value === '') || (value > 0) || 'กรุณากรอกอัตราชีพจรให้ถูกต้อง']"
                  />
                </v-col>
                <v-col cols="12" sm="6" md="4">
                  <v-text-field
                    v-model.number="newTracking.respiratory_rate"
                    label="อัตราการหายใจ"
                    type="number"
                    prepend-icon="mdi-lungs"
                    :rules="[value => (value === null || value === '') || (value > 0) || 'กรุณากรอกอัตราการหายใจให้ถูกต้อง']"
                  />
                </v-col>
                <v-col cols="12" sm="6" md="4">
                  <v-text-field
                    v-model.number="newTracking.blood_sugar"
                    label="ระดับน้ำตาลในเลือด"
                    type="number"
                    step="0.1"
                    prepend-icon="mdi-water-outline"
                    :rules="[value => (value === null || value === '') || (value >= 0) || 'กรุณากรอกระดับน้ำตาลให้ถูกต้อง']"
                  />
                </v-col>

                <v-col cols="12" sm="6" md="6">
                  <v-menu
                    v-model="dateMenu"
                    :close-on-content-click="false"
                    transition="scale-transition"
                    offset-y
                    min-width="290px"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        v-model="datePicker"
                        label="วันที่บันทึก"
                        prepend-icon="mdi-calendar"
                        readonly
                        v-bind="attrs"
                        v-on="on"
                      />
                    </template>
                    <v-date-picker
                      v-model="datePicker"
                      locale="th"
                      scrollable
                      no-title
                      @input="dateMenu = false"
                    />
                  </v-menu>
                </v-col>

                <v-col cols="12" sm="6" md="6">
                  <v-menu
                    v-model="timeMenu"
                    :close-on-content-click="false"
                    transition="scale-transition"
                    offset-y
                    min-width="290px"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        v-model="timePicker"
                        label="เวลาบันทึก"
                        prepend-icon="mdi-clock"
                        readonly
                        v-bind="attrs"
                        v-on="on"
                      />
                    </template>
                    <v-time-picker
                      v-model="timePicker"
                      format="24hr"
                      @input="timeMenu = false"
                    />
                  </v-menu>
                </v-col>
              </v-row>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn
              color="#3B5F6D"
              dark
              @click="addTrackingData"
              :loading="loading"
              :disabled="!valid"
            >
              <v-icon left>mdi-plus</v-icon>
              เพิ่มข้อมูล
            </v-btn>
          </v-card-actions>
        </v-card>

        <v-card class="mt-6 pa-5">
          <v-card-title class="text-h6">ประวัติข้อมูลติดตามสุขภาพ</v-card-title>
          <v-data-table
            :headers="headers"
            :items="dailyTrackingData"
            :loading="loadingData"
            class="elevation-1"
            >
            <template v-slot:item.blood_pressure="{ item }">
                {{ item.blood_pressure_systolic }}/{{ item.blood_pressure_diastolic }}
            </template>

            <template v-slot:item.recorded_at="{ item }">
                {{ formatDateTime(item.recorded_at) }}
            </template>

            <template v-slot:no-data>
                ไม่มีข้อมูลติดตามสุขภาพสำหรับผู้ป่วยนี้
            </template>
            </v-data-table>
        </v-card>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import Swal from 'sweetalert2'
import axios from 'axios';
import { showSuccessAlert, showErrorAlert, showWarningAlert } from '../utils/sweetAlert';

const API_PATIENT = import.meta.env.VITE_API_PATIENT;
const API_TRACKING = import.meta.env.VITE_API_TRACKING;

export default {
  name: 'PatientDailyTracking',
  data() {
    return {
      drawer: false,
      patientName: 'กำลังโหลด...',
      dailyTrackingData: [],
      newTracking: {
        temperature: null,
        blood_pressure_systolic: null,
        blood_pressure_diastolic: null,
        pulse_rate: null,
        respiratory_rate: null,
        blood_sugar: null,
      },
      patientId: null,
      datePicker: new Date().toISOString().substr(0, 10),
      timePicker: new Date().toTimeString().substr(0, 5),
      dateMenu: false,
      timeMenu: false,
      valid: false,
      loading: false,
      loadingData: false,
      headers: [
        { text: 'วันที่/เวลา', value: 'recorded_at' },
        { text: 'อุณหภูมิ (°C)', value: 'temperature' },
        { text: 'ความดัน (บน/ล่าง)', value: 'blood_pressure_systolic' },
        { text: 'อัตราชีพจร', value: 'pulse_rate' },
        { text: 'อัตราการหายใจ', value: 'respiratory_rate' },
        { text: 'น้ำตาลในเลือด', value: 'blood_sugar' },
      ],
    };
  },
  mounted() {
    this.patientId = this.$route.query.patientId || null;
    if (this.patientId) {
      this.fetchPatientDetails(this.patientId);
      this.fetchDailyTrackingData(this.patientId);
    } else {
      this.patientName = 'ไม่พบผู้ป่วย';
    }
  },
  watch: {
    '$route.query.patientId'(newId) {
      this.patientId = newId || null;
      if (this.patientId) {
        this.fetchPatientDetails(this.patientId);
        this.fetchDailyTrackingData(this.patientId);
      } else {
        this.patientName = 'ไม่พบผู้ป่วย';
        this.dailyTrackingData = [];
      }
    },
  },
  methods: {
    async fetchPatientDetails(id) {
      try {
        const token = localStorage.getItem('userToken');
        const headers = token ? { 'x-auth-token': token } : {};
        const response = await axios.get(`${API_PATIENT}${id}`, { headers });
        this.patientName = response.data.name || response.data.patient?.name || 'ไม่พบชื่อผู้ป่วย';
      } catch (error) {
        console.error('โหลดชื่อผู้ป่วยล้มเหลว:', error.response?.data || error.message);
        this.patientName = 'ไม่พบผู้ป่วย';
        if (error.response?.status === 401) this.logout();
      }
    },
    async fetchDailyTrackingData(id) {
      this.loadingData = true;
      try {
        const token = localStorage.getItem('userToken');
        const headers = token ? { 'x-auth-token': token } : {};
        const response = await axios.get(`${API_TRACKING}patient/${id}`, { headers });
        this.dailyTrackingData = response.data.map(item => ({
          ...item,
          blood_pressure_systolic: item.blood_pressure_systolic,
          blood_pressure_diastolic: item.blood_pressure_diastolic,
        }));
      } catch (error) {
        console.error('โหลดข้อมูลติดตามสุขภาพล้มเหลว:', error.response?.data || error.message);
        this.dailyTrackingData = [];
        if (error.response?.status === 401) this.logout();
      } finally {
        this.loadingData = false;
      }
    },
    async addTrackingData() {
      if (!this.patientId) {
        showWarningAlert('ไม่พบ patientId');
        return;
      }

      const recordedAt = new Date(`${this.datePicker}T${this.timePicker}:00`).toISOString();

      const payload = {
        patient_id: this.patientId,
        temperature: this.newTracking.temperature,
        blood_pressure_systolic: this.newTracking.blood_pressure_systolic,
        blood_pressure_diastolic: this.newTracking.blood_pressure_diastolic,
        pulse_rate: this.newTracking.pulse_rate,
        respiratory_rate: this.newTracking.respiratory_rate,
        blood_sugar: this.newTracking.blood_sugar,
        recorded_at: recordedAt,
      };

      this.loading = true;
      try {
        const token = localStorage.getItem('userToken');
        const headers = token ? { 'x-auth-token': token } : {};
        await axios.post(`${API_TRACKING}`, payload, { headers });
        showSuccessAlert('บันทึกข้อมูลสำเร็จ');
        this.resetNewTrackingForm();
        this.fetchDailyTrackingData(this.patientId);
      } catch (error) {
        console.error('บันทึกข้อมูลติดตามสุขภาพล้มเหลว:', error.response?.data || error.message);
        showErrorAlert('บันทึกข้อมูลล้มเหลว');
      } finally {
        this.loading = false;
      }
    },
    resetNewTrackingForm() {
      this.newTracking = {
        temperature: null,
        blood_pressure_systolic: null,
        blood_pressure_diastolic: null,
        pulse_rate: null,
        respiratory_rate: null,
        blood_sugar: null,
      };
      this.datePicker = new Date().toISOString().substr(0, 10);
      this.timePicker = new Date().toTimeString().substr(0, 5);
      this.$refs.trackingForm.resetValidation();
    },
    formatDateTime(dateTimeString) {
      if (!dateTimeString) return 'N/A';
      const date = new Date(dateTimeString);
      return date.toLocaleDateString('th-TH', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      });
    },
    goToUserPage() {
      this.$router.push('/profile');
    },
    logout() {
      localStorage.removeItem('userToken');
      localStorage.removeItem('userData');
      this.$router.push('/');
    },
    goToAddPatient() {
      this.$router.push('/Addpatient');
    },
    goToPatientInfo() {
      this.$router.push('/patientinfo');
    },
    goToMapPage() {
      this.$router.push('/Map');
    },
  },
};
</script>

<style scoped>
/* --- ไม่แก้ดีไซน์ --- */
.v-application {
  background-color: #f5f7fa !important;
}
.v-app-bar {
  border-bottom: 1px solid rgba(0, 0, 0, 0.12) !important;
}
.v-main {
  display: flex;
  flex-direction: column;
}
.v-container.fill-height {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}
.v-card.flex-grow-1 {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}
.v-card-text.d-flex.flex-column.flex-grow-1 {
  flex-grow: 1;
}
.v-card {
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08) !important;
}
.v-card-title {
  padding-bottom: 0px !important;
}
@media (max-width: 960px) {
  .v-toolbar__title { font-size: 1.1rem; }
  .v-btn { padding: 0 8px; }
  .v-btn .v-icon { margin-right: 4px; }
  .v-card { padding: 16px; }
  .v-data-table { font-size: 0.9rem; }
}
@media (max-width: 600px) {
  .v-toolbar__title { font-size: 1rem; }
  .v-card { padding: 12px; }
  .v-card-title { font-size: 1.1rem; }
  .v-card-text { font-size: 0.9rem; }
  .v-text-field { margin-bottom: 8px; }
  .v-btn { padding: 0 4px; font-size: 0.8rem; }
  .v-data-table { font-size: 0.8rem; }
  .v-chip { font-size: 0.8rem; height: 24px; }
}
</style>
