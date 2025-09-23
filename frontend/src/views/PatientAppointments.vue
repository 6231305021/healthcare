<template>
  <v-app>
    <v-app-bar app color="#3B5F6D" dark>
      <v-app-bar-nav-icon @click="drawer = !drawer" class="d-md-none"></v-app-bar-nav-icon>
      <v-toolbar-title class="font-weight-bold">
        <v-icon left>mdi-calendar-edit</v-icon>
        การนัดหมายผู้ป่วย: {{ patientName }}
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <div class="d-none d-md-flex">
        <v-btn text @click="goToUserPage"><v-icon left>mdi-account</v-icon> ข้อมูลส่วนตัว</v-btn>
        <v-btn text @click="goToAddPatient"><v-icon left>mdi-account-plus</v-icon> เพิ่มผู้ป่วยใหม่</v-btn>
        <v-btn text @click="goToPatientInfo"><v-icon left>mdi-account-group</v-icon> ข้อมูลผู้ป่วย</v-btn>
        <v-btn text @click="goToMapPage"><v-icon left>mdi-map-marker-multiple</v-icon> แผนที่ผู้ป่วย</v-btn>
      </div>
    </v-app-bar>

    <v-navigation-drawer v-model="drawer" app temporary>
      <v-list>
        <v-list-item @click="goToUserPage"><v-list-item-icon><v-icon>mdi-account</v-icon></v-list-item-icon><v-list-item-content><v-list-item-title>ข้อมูลส่วนตัว</v-list-item-title></v-list-item-content></v-list-item>
        <v-list-item @click="goToAddPatient"><v-list-item-icon><v-icon>mdi-account-plus</v-icon></v-list-item-icon><v-list-item-content><v-list-item-title>เพิ่มผู้ป่วยใหม่</v-list-item-title></v-list-item-content></v-list-item>
        <v-list-item @click="goToPatientInfo"><v-list-item-icon><v-icon>mdi-account-group</v-icon></v-list-item-icon><v-list-item-content><v-list-item-title>ข้อมูลผู้ป่วย</v-list-item-title></v-list-item-content></v-list-item>
        <v-list-item @click="goToMapPage"><v-list-item-icon><v-icon>mdi-map-marker-multiple</v-icon></v-list-item-icon><v-list-item-content><v-list-item-title>แผนที่ผู้ป่วย</v-list-item-title></v-list-item-content></v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-main>
      <v-container class="mt-6">
        <v-row>
          <v-col cols="12" md="7">
            <v-card class="pa-5 mb-6">
              <v-card-title class="text-h6">บันทึกการนัดหมายใหม่</v-card-title>
              <v-card-text>
                <v-form ref="appointmentForm" v-model="valid" lazy-validation>
                  <v-row>
                    <v-col cols="12" md="6">
                      <v-text-field v-model="newAppointment.hn_number" label="HN (Patient ID)" prepend-icon="mdi-identifier" readonly outlined dense />
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-text-field v-model="newAppointment.rights" label="สิทธิการรักษา" prepend-icon="mdi-shield-account" outlined dense clearable />
                    </v-col>
                    <v-col cols="12" sm="6" md="6">
                      <v-text-field v-model="datePicker" label="วันที่นัดหมาย" prepend-icon="mdi-calendar" :rules="[v => !!v || 'กรุณาใส่วันที่นัดหมาย']" required outlined dense type="date" />
                    </v-col>
                    <v-col cols="12" sm="6" md="6">
                      <v-menu v-model="timeMenu" :close-on-content-click="false" transition="scale-transition" offset-y min-width="290px">
                        <template v-slot:activator="{ on, attrs }">
                          <v-text-field v-model="timePicker" label="เวลานัดหมาย" prepend-icon="mdi-clock" v-bind="attrs" v-on="on" :rules="[v => !!v || 'กรุณาใส่เวลานัดหมาย']" required outlined dense placeholder="HH:MM" />
                        </template>
                        <v-time-picker v-model="timePicker" format="24hr" @input="timeMenu = false" />
                      </v-menu>
                    </v-col>
                    <v-col cols="12" md="6"> <v-text-field v-model="newAppointment.reason" label="เหตุผลการนัดหมาย" prepend-icon="mdi-text-box-outline" outlined dense /> </v-col>
                    <v-col cols="12" md="6"> <v-text-field v-model="newAppointment.appointed_by" label="แพทย์ผู้นัด / ผู้บันทึกนัด" prepend-icon="mdi-medical-bag" outlined dense /> </v-col>
                    <v-col cols="12" md="6"> <v-text-field v-model="newAppointment.contact_location" label="สถานที่ติดต่อ" prepend-icon="mdi-map-marker-radius" outlined dense /> </v-col>
                    <v-col cols="12" md="6"> <v-text-field v-model="newAppointment.diagnosis" label="วินิจฉัย" prepend-icon="mdi-stethoscope" outlined dense /> </v-col>
                    <v-col cols="12" md="6"> <v-text-field v-model="newAppointment.other_details" label="รายละเอียดอื่นๆ (เช่น LAB/X-Ray)" prepend-icon="mdi-note-text-outline" outlined dense /> </v-col>
                    <v-col cols="12" md="6"> <v-select v-model="newAppointment.status" :items="statusOptions" label="สถานะการนัดหมาย" prepend-icon="mdi-check-circle-outline" :rules="[v => !!v || 'กรุณาเลือกสถานะ']" required outlined dense /> </v-col>
                  </v-row>
                </v-form>
              </v-card-text>
              <v-card-actions>
                <v-spacer />
                <v-btn color="#3B5F6D" dark @click="addAppointment" :loading="loading" :disabled="!valid">
                  <v-icon left>mdi-plus</v-icon> เพิ่มการนัดหมาย
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-col>

          <v-col cols="12" md="5">
            <v-card class="pa-5">
              <v-card-title class="text-h6">สถิติเข้าตรวจตามนัด</v-card-title>
              <v-card-text><canvas id="appointmentChart"></canvas></v-card-text>
            </v-card>
          </v-col>

          <v-col cols="12">
            <v-card class="mt-6 pa-5">
              <v-card-title class="text-h6 d-flex justify-space-between align-center">
                <span>ประวัติการนัดหมาย</span>
                <v-btn color="#3B5F6D" dark @click="openExportDialog" :disabled="appointmentHistory.length === 0">
                  <v-icon left>mdi-printer</v-icon> ส่งออกใบนัด
                </v-btn>
              </v-card-title>
              <v-data-table
                :headers="headers"
                :items="appointmentHistory"
                :loading="loadingData"
                class="elevation-1"
                item-key="id"
              >
                <template v-slot:item.appointment_datetime="{ item }">
                  {{ formatDateTime(item.appointment_date, item.appointment_time) }}
                </template>
                <template v-slot:item.rights="{ item }">
                  {{ currentPatientBenefits }}
                </template>
                <template v-slot:item.appointed_by="{ item }"> {{ item.appointed_by || 'ไม่ได้ระบุ' }} </template>
                <template v-slot:item.contact_location="{ item }"> {{ item.contact_location || 'ไม่ได้ระบุ' }} </template>
                <template v-slot:item.diagnosis="{ item }"> {{ item.diagnosis || 'ไม่ได้ระบุ' }} </template>
                <template v-slot:item.reason="{ item }"> {{ item.reason || 'ไม่ได้ระบุ' }} </template>
                <template v-slot:item.other_details="{ item }"> {{ item.other_details || 'ไม่ได้ระบุ' }} </template>
                <template v-slot:item.status="{ item }"> <v-chip :color="getStatusColor(item.status)" dark>{{ item.status || 'ไม่ได้ระบุ' }}</v-chip> </template>
                <template v-slot:item.actions="{ item }"> <v-icon small @click="deleteAppointment(item.id)">mdi-delete</v-icon> </template>
                <template v-slot:no-data> ไม่มีข้อมูลการนัดหมายสำหรับผู้ป่วยนี้ </template>
              </v-data-table>
            </v-card>
          </v-col>
        </v-row>

        <v-dialog v-model="exportDialog" max-width="600px">
          <v-card>
            <v-card-title class="text-h6">เลือกนัดหมายที่ต้องการส่งออกใบนัด</v-card-title>
            <v-card-text>
              <v-select v-model="selectedAppointmentId" :items="appointmentHistory.map(a => ({ title: `ID: ${a.id} - วันที่: ${formatDate(a.appointment_date)}`, value: a.id }))" label="เลือกนัดหมาย" item-title="title" item-value="value" outlined />
            </v-card-text>
            <v-card-actions>
              <v-spacer />
              <v-btn text @click="exportDialog = false">ยกเลิก</v-btn>
              <v-btn color="#3B5F6D" dark @click="showPrintPreview" :disabled="!selectedAppointmentId">
                <v-icon left>mdi-printer</v-icon> ดูตัวอย่างและพิมพ์
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

        <v-dialog v-model="printDialog" fullscreen hide-overlay transition="dialog-bottom-transition">
          <v-card>
            <v-toolbar dense dark color="#3B5F6D" class="no-print">
              <v-btn icon dark @click="printDialog = false"> <v-icon>mdi-close</v-icon> </v-btn>
              <v-toolbar-title>ตัวอย่างใบนัด</v-toolbar-title>
              <v-spacer></v-spacer>
              <v-btn color="white" dark class="mr-2 black--text" @click="printAppointment"> <v-icon left>mdi-printer</v-icon> พิมพ์ใบนัด </v-btn>
            </v-toolbar>
            <v-card-text class="pa-10">
              <div id="print-content" class="pa-5">
                <h1 class="text-h5 text-center mb-6">ใบนัดผู้ป่วย</h1>
                <v-row no-gutters>
                  <v-col cols="12" class="mb-2"> <strong>HN:</strong> {{ selectedAppointmentDetails.hn_number || newAppointment.hn_number }} </v-col>
                  <v-col cols="12" class="mb-2"> <strong>ชื่อผู้ป่วย:</strong> {{ patientName }} </v-col>
                  <v-col cols="12" class="mb-2"> <strong>สิทธิการรักษา:</strong> {{ currentPatientBenefits }} </v-col>
                  <v-col cols="12" class="mb-2"> <strong>วันที่/เวลานัดหมาย:</strong> {{ formatDateTime(selectedAppointmentDetails.appointment_date, selectedAppointmentDetails.appointment_time) }} </v-col>
                  <v-col cols="12" class="mb-2"> <strong>แพทย์/ผู้บันทึก:</strong> {{ selectedAppointmentDetails.appointed_by || 'ไม่ได้ระบุ' }} </v-col>
                  <v-col cols="12" class="mb-2"> <strong>สถานที่ติดต่อ:</strong> {{ selectedAppointmentDetails.contact_location || 'ไม่ได้ระบุ' }} </v-col>
                  <v-col cols="12" class="mb-2"> <strong>วินิจฉัย:</strong> {{ selectedAppointmentDetails.diagnosis || 'ไม่ได้ระบุ' }} </v-col>
                  <v-col cols="12" class="mb-2"> <strong>เหตุผล:</strong> {{ selectedAppointmentDetails.reason || 'ไม่ได้ระบุ' }} </v-col>
                  <v-col cols="12" class="mb-2"> <strong>รายละเอียดอื่นๆ:</strong> {{ selectedAppointmentDetails.other_details || 'ไม่ได้ระบุ' }} </v-col>
                  <v-col cols="12" class="mb-2"> <strong>สถานะ:</strong> {{ selectedAppointmentDetails.status || 'ไม่ได้ระบุ' }} </v-col>
                </v-row>
              </div>
            </v-card-text>
          </v-card>
        </v-dialog>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import Swal from 'sweetalert2';
import Chart from 'chart.js/auto';
import { getPatientById, getAppointmentsByPatientId, createAppointment as createAppointmentApi, deleteAppointment as deleteAppointmentApi } from '@/api.js';

export default {
  name: 'PatientAppointments',
  props: ['patientId'],
  data() {
    return {
      drawer: false,
      patientName: 'กำลังโหลด...',
      appointmentHistory: [],
      currentPatientBenefits: 'ไม่ได้ระบุ',
      newAppointment: { hn_number: null, rights: null, reason: null, appointed_by: null, contact_location: null, other_details: null, diagnosis: null, status: 'รอนัด' },
      datePicker: new Date().toISOString().substr(0, 10),
      timePicker: new Date().toTimeString().substr(0, 5),
      timeMenu: false,
      valid: false,
      loading: false,
      loadingData: false,
      statusOptions: ['มาตามนัด', 'ไม่มาตามนัด', 'ส่งต่อรักษา', 'รอนัด'],
      headers: [
        { text: 'ID การนัดหมาย', value: 'id' },
        { text: 'สิทธิการรักษา', value: 'rights' },
        { text: 'วันที่/เวลา', value: 'appointment_datetime' },
        { text: 'เหตุผล', value: 'reason' },
        { text: 'แพทย์/ผู้บันทึก', value: 'appointed_by' },
        { text: 'สถานที่ติดต่อ', value: 'contact_location' },
        { text: 'วินิจฉัย', value: 'diagnosis' },
        { text: 'รายละเอียดอื่นๆ', value: 'other_details' },
        { text: 'สถานะ', value: 'status' },
        { text: 'Actions', value: 'actions', sortable: false },
      ],
      chartInstance: null,
      chartColors: { 'มาตามนัด': '#4CAF50', 'ไม่มาตามนัด': '#F44336', 'ส่งต่อรักษา': '#2196F3', 'รอนัด': '#FF9800' },
      exportDialog: false,
      printDialog: false,
      selectedAppointmentId: null,
      selectedAppointmentDetails: {},
    };
  },
  mounted() {
    const id = this.$route.params.patientId || this.patientId;
    if (id) {
      this.fetchPatientDetails(id);
      this.fetchAppointments(id);
    }
  },
  watch: {
    '$route.params.patientId'(newId) {
      if (newId) {
        this.fetchPatientDetails(newId);
        this.fetchAppointments(newId);
      }
    },
  },
  methods: {
    goToUserPage() { this.$router.push('/profile'); },
    goToAddPatient() { this.$router.push('/Addpatient'); },
    goToPatientInfo() { this.$router.push('/patientinfo'); },
    goToMapPage() { this.$router.push('/map'); },

    async fetchPatientDetails(id) {
      try {
        const res = await getPatientById(id);
        const patientData = res.data.patient || res.data;
        this.patientName = patientData.name || 'ไม่พบชื่อผู้ป่วย';
        this.newAppointment.hn_number = patientData.id;
        this.newAppointment.rights = patientData.Benefits || null;
        this.currentPatientBenefits = patientData.Benefits || 'ไม่ได้ระบุ';
      } catch (e) {
        console.error(e);
        this.patientName = 'ไม่พบผู้ป่วย';
        await Swal.fire({ title: 'เกิดข้อผิดพลาด', text: 'ไม่สามารถโหลดข้อมูลผู้ป่วยได้', icon: 'error', confirmButtonColor: '#d33' });
      }
    },

    async fetchAppointments(id) {
      this.loadingData = true;
      try {
        const res = await getAppointmentsByPatientId(id);
        this.appointmentHistory = Array.isArray(res.data) ? res.data : [];
        this.$nextTick(() => this.updateChart());
      } catch (e) {
        console.error(e);
        this.appointmentHistory = [];
        if (this.chartInstance) { this.chartInstance.destroy(); }
        await Swal.fire({ title: 'เกิดข้อผิดพลาด', text: 'ไม่สามารถโหลดข้อมูลการนัดหมายได้', icon: 'error', confirmButtonColor: '#d33' });
      } finally { this.loadingData = false; }
    },

    async addAppointment() {
      if (!this.$refs.appointmentForm.validate()) {
        await Swal.fire({ title: 'ข้อมูลไม่ครบถ้วน', text: 'กรุณากรอกข้อมูลที่จำเป็นทั้งหมด', icon: 'warning', confirmButtonColor: '#3B5F6D' });
        return;
      }
      this.loading = true;
      try {
        const appointmentData = {
          ...this.newAppointment,
          patient_id: this.patientId || this.$route.params.patientId,
          appointment_date: this.datePicker,
          appointment_time: this.timePicker,
        };
        await createAppointmentApi(appointmentData);
        await Swal.fire({ title: 'สำเร็จ!', text: 'เพิ่มการนัดหมายเรียบร้อยแล้ว', icon: 'success', confirmButtonColor: '#3B5F6D' });
        
        this.fetchPatientDetails(this.patientId || this.$route.params.patientId);
        this.fetchAppointments(this.patientId || this.$route.params.patientId);
        
        this.$refs.appointmentForm.resetValidation();
        const hn = this.newAppointment.hn_number;
        const rights = this.newAppointment.rights;
        this.newAppointment = { hn_number: hn, rights: rights, reason: null, appointed_by: null, contact_location: null, other_details: null, diagnosis: null, status: 'รอนัด' };
        this.datePicker = new Date().toISOString().substr(0, 10);
        this.timePicker = new Date().toTimeString().substr(0, 5);
      } catch (e) {
        console.error(e);
        await Swal.fire({ title: 'เกิดข้อผิดพลาด', text: 'ไม่สามารถเพิ่มการนัดหมายได้', icon: 'error', confirmButtonColor: '#d33' });
      } finally { this.loading = false; }
    },

    async deleteAppointment(appointmentId) {
      const result = await Swal.fire({ title: 'คุณแน่ใจหรือไม่?', text: 'ข้อมูลการนัดหมายนี้จะถูกลบอย่างถาวร!', icon: 'warning', showCancelButton: true, confirmButtonColor: '#3085d6', cancelButtonColor: '#d33', confirmButtonText: 'ใช่, ลบเลย!', cancelButtonText: 'ยกเลิก' });
      if (result.isConfirmed) {
        try {
          await deleteAppointmentApi(appointmentId);
          await Swal.fire({ title: 'ลบสำเร็จ!', text: 'ข้อมูลการนัดหมายถูกลบแล้ว', icon: 'success', confirmButtonColor: '#3B5F6D' });
          this.fetchAppointments(this.patientId || this.$route.params.patientId);
        } catch (e) {
          console.error(e);
          await Swal.fire({ title: 'ลบไม่สำเร็จ', text: 'เกิดข้อผิดพลาดในการลบข้อมูล', icon: 'error', confirmButtonColor: '#d33' });
        }
      }
    },

    formatDate(dateStr) {
      if (!dateStr) return '-';
      const d = new Date(dateStr);
      return `${d.getDate().toString().padStart(2,'0')}/${(d.getMonth()+1).toString().padStart(2,'0')}/${d.getFullYear()}`;
    },

    formatDateTime(dateStr, timeStr) {
      if (!dateStr) return '-';
      const d = new Date(dateStr);
      const date = `${d.getDate().toString().padStart(2,'0')}/${(d.getMonth()+1).toString().padStart(2,'0')}/${d.getFullYear()}`;
      return `${date} ${timeStr || ''}`;
    },

    getStatusColor(status) { return this.chartColors[status] || 'grey'; },

    updateChart() {
      if (this.chartInstance) this.chartInstance.destroy();
      const ctx = document.getElementById('appointmentChart');
      if (!ctx) return;
      const statusCounts = {};
      this.appointmentHistory.forEach(a => statusCounts[a.status] = (statusCounts[a.status] || 0) + 1);
      const data = { labels: Object.keys(statusCounts), datasets: [{ label: 'จำนวนการนัดหมาย', data: Object.values(statusCounts), backgroundColor: Object.keys(statusCounts).map(s => this.chartColors[s] || '#9E9E9E') }], };
      this.chartInstance = new Chart(ctx, { type: 'bar', data, options: { responsive: true, plugins: { legend: { display: false } } } });
    },

    openExportDialog() {
      this.exportDialog = true;
      this.selectedAppointmentId = null;
    },

    showPrintPreview() {
      const appointment = this.appointmentHistory.find(a => a.id === this.selectedAppointmentId);
      if (appointment) {
        this.selectedAppointmentDetails = appointment;
        this.exportDialog = false;
        this.printDialog = true;
      }
    },

    printAppointment() {
      window.print();
    },
  },
};
</script>

<style>
.v-application {
  background-color: #f5f5f5;
}
@media print {
  .v-app-bar, .v-navigation-drawer, .no-print { display: none !important; }
  .v-main { padding: 0 !important; margin: 0 !important; }
  .v-container { width: 100% !important; max-width: none !important; padding: 0 !important; }
  .v-card { box-shadow: none !important; border: none !important; }
  #print-content { width: 100%; margin-top: 50px; padding: 0 !important; }
}
</style>