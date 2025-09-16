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
        <v-list-item @click="goToUserPage">
          <v-list-item-icon><v-icon>mdi-account</v-icon></v-list-item-icon>
          <v-list-item-content><v-list-item-title>ข้อมูลส่วนตัว</v-list-item-title></v-list-item-content>
        </v-list-item>
        <v-list-item @click="goToAddPatient">
          <v-list-item-icon><v-icon>mdi-account-plus</v-icon></v-list-item-icon>
          <v-list-item-content><v-list-item-title>เพิ่มผู้ป่วยใหม่</v-list-item-title></v-list-item-content>
        </v-list-item>
        <v-list-item @click="goToPatientInfo">
          <v-list-item-icon><v-icon>mdi-account-group</v-icon></v-list-item-icon>
          <v-list-item-content><v-list-item-title>ข้อมูลผู้ป่วย</v-list-item-title></v-list-item-content>
        </v-list-item>
        <v-list-item @click="goToMapPage">
          <v-list-item-icon><v-icon>mdi-map-marker-multiple</v-icon></v-list-item-icon>
          <v-list-item-content><v-list-item-title>แผนที่ผู้ป่วย</v-list-item-title></v-list-item-content>
        </v-list-item>
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
                      <v-text-field
                        v-model="newAppointment.hn_number"
                        label="หมายเลข HN"
                        prepend-icon="mdi-identifier"
                        :rules="[v => !!v || 'กรุณากรอกหมายเลข HN']"
                        required
                      />
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-text-field
                        v-model="newAppointment.rights"
                        label="สิทธิการรักษา"
                        prepend-icon="mdi-shield-account"
                        :rules="[v => !!v || 'กรุณากรอกสิทธิการรักษา']"
                        required
                      />
                    </v-col>
                    <v-col cols="12" sm="6" md="6">
                      <v-text-field
                        v-model="datePicker"
                        label="วันที่นัดหมาย"
                        prepend-icon="mdi-calendar"
                        :rules="[v => !!v || 'กรุณาใส่วันที่นัดหมาย']"
                        required
                        outlined
                        dense
                        type="date"
                      />
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
                            label="เวลานัดหมาย"
                            prepend-icon="mdi-clock"
                            v-bind="attrs"
                            :rules="[v => !!v || 'กรุณาใส่เวลานัดหมาย']"
                            required
                            outlined
                            dense
                            placeholder="HH:MM"
                          />
                        </template>
                        <v-time-picker
                          v-model="timePicker"
                          format="24hr"
                          @input="timeMenu = false"
                        />
                      </v-menu>
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-text-field v-model="newAppointment.reason" label="เหตุผลการนัดหมาย" prepend-icon="mdi-text-box-outline" />
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-text-field v-model="newAppointment.appointed_by" label="แพทย์ผู้นัด / ผู้บันทึกนัด" prepend-icon="mdi-medical-bag" />
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-text-field v-model="newAppointment.contact_location" label="สถานที่ติดต่อ" prepend-icon="mdi-map-marker-radius" />
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-text-field v-model="newAppointment.diagnosis" label="วินิจฉัย" prepend-icon="mdi-stethoscope" />
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-text-field v-model="newAppointment.other_details" label="รายละเอียดอื่นๆ (เช่น LAB/X-Ray)" prepend-icon="mdi-note-text-outline" />
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-select v-model="newAppointment.status" :items="statusOptions" label="สถานะการนัดหมาย" prepend-icon="mdi-check-circle-outline" :rules="[v => !!v || 'กรุณาเลือกสถานะ']" required />
                    </v-col>
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
                <template v-slot:item.hn_number="{ item }">
                  {{ item.hn_number || 'ไม่ได้ระบุ' }}
                </template>
                <template v-slot:item.rights="{ item }">
                  {{ item.rights || 'ไม่ได้ระบุ' }}
                </template>
                <template v-slot:item.appointed_by="{ item }">
                  {{ item.appointed_by || 'ไม่ได้ระบุ' }}
                </template>
                <template v-slot:item.contact_location="{ item }">
                  {{ item.contact_location || 'ไม่ได้ระบุ' }}
                </template>
                <template v-slot:item.diagnosis="{ item }">
                  {{ item.diagnosis || 'ไม่ได้ระบุ' }}
                </template>
                <template v-slot:item.reason="{ item }">
                  {{ item.reason || 'ไม่ได้ระบุ' }}
                </template>
                <template v-slot:item.other_details="{ item }">
                  {{ item.other_details || 'ไม่ได้ระบุ' }}
                </template>
                <template v-slot:item.status="{ item }">
                  <v-chip :color="getStatusColor(item.status)" dark>{{ item.status || 'ไม่ได้ระบุ' }}</v-chip>
                </template>
                <template v-slot:item.actions="{ item }">
                  <v-icon small @click="deleteAppointment(item.id)">mdi-delete</v-icon>
                </template>
                <template v-slot:no-data>
                  ไม่มีข้อมูลการนัดหมายสำหรับผู้ป่วยนี้
                </template>
              </v-data-table>
            </v-card>
          </v-col>
        </v-row>

        <v-dialog v-model="exportDialog" max-width="600px">
          <v-card>
            <v-card-title class="text-h6">เลือกนัดหมายที่ต้องการส่งออกใบนัด</v-card-title>
            <v-card-text>
              <v-select
                v-model="selectedAppointmentId"
                :items="appointmentHistory.map(a => ({ title: `HN: ${a.hn_number || '-' } - วันที่: ${formatDate(a.appointment_date)}`, value: a.id }))"
                label="เลือกนัดหมาย"
                item-title="title"
                item-value="value"
                outlined
              />
            </v-card-text>
            <v-card-actions>
              <v-spacer />
              <v-btn text @click="exportDialog = false">ยกเลิก</v-btn>
              <v-btn color="#3B5F6D" dark @click="exportAppointmentPDF" :disabled="!selectedAppointmentId">
                <v-icon left>mdi-printer</v-icon> ส่งออก
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import Swal from 'sweetalert2';
import Chart from 'chart.js/auto';
import jsPDF from 'jspdf';
import { getPatientById, getAppointmentsByPatientId, createAppointment as createAppointmentApi, deleteAppointment as deleteAppointmentApi } from '@/api.js';

// ข้อมูลฟอนต์ THSarabunNew (Base64) - ใช้แค่บางส่วนตามที่คุณให้มา
const THSarabunNewBase64 = `AAUWBwACAABNYWMgT1MgWCAgICAgICAgAAIAAAAJAAAAMgAAAKAAAAACAAAA0gAAAABzZm50AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQVRUUgAAAAAAAADSAAAAqAAAACoAAAAAAAAAAAAAAAAAAAABAAAAqAAAACoAACRjb20uYXBwbGUubWV0YWRhdGE6X2tNREl0ZW1Vc2VyVGFncwAAYnBsaXN0MDCgCAAAAAAAAAEBAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAAJ`;

export default {
  name: 'PatientAppointments',
  props: ['patientId'], // รับ patientId จาก router params
  data() {
    return {
      drawer: false,
      patientName: 'กำลังโหลด...',
      appointmentHistory: [],
      newAppointment: {
        hn_number: null,
        rights: null,
        reason: null,
        appointed_by: null,
        contact_location: null,
        other_details: null,
        diagnosis: null,
        status: 'นัดหมาย',
      },
      datePicker: new Date().toISOString().substr(0, 10),
      timePicker: new Date().toTimeString().substr(0, 5),
      timeMenu: false,
      valid: false,
      loading: false,
      loadingData: false,
      statusOptions: ['มาตามนัด', 'ไม่มาตามนัด', 'ส่งต่อรักษา', 'รอนัด'],
      headers: [
        { text: 'วันที่/เวลา', value: 'appointment_datetime' },
        { text: 'HN', value: 'hn_number' },
        { text: 'สิทธิการรักษา', value: 'rights' },
        { text: 'เหตุผล', value: 'reason' },
        { text: 'แพทย์/ผู้บันทึก', value: 'appointed_by' },
        { text: 'สถานที่ติดต่อ', value: 'contact_location' },
        { text: 'วินิจฉัย', value: 'diagnosis' },
        { text: 'รายละเอียดอื่นๆ', value: 'other_details' },
        { text: 'สถานะ', value: 'status' },
        { text: 'Actions', value: 'actions', sortable: false },
      ],
      chartInstance: null,
      chartColors: {
        'มาตามนัด': '#4CAF50',
        'ไม่มาตามนัด': '#F44336',
        'ส่งต่อรักษา': '#2196F3',
        'รอนัด': '#FF9800',
      },
      exportDialog: false,
      selectedAppointmentId: null,
    };
  },
  computed: {
    // isAddingAppointment: false เสมอ เพื่อแสดงทั้งสองส่วน
    isAddingAppointment() {
        return !!this.patientId;
    }
  },
  mounted() {
    if (this.patientId) {
      this.fetchPatientDetails(this.patientId);
      this.fetchAppointments(this.patientId);
    }
  },
  watch: {
    '$route.params.patientId'(newId) {
      if (newId) {
        this.patientId = newId;
        this.fetchPatientDetails(this.patientId);
        this.fetchAppointments(this.patientId);
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
        this.newAppointment.hn_number = patientData.hn_number || null;
        this.newAppointment.rights = patientData.rights || null;
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
        if (this.chartInstance) { this.chartInstance.destroy(); this.chartInstance = null; }
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
          patient_id: this.patientId,
          appointment_date: this.datePicker,
          appointment_time: this.timePicker,
        };
        await createAppointmentApi(appointmentData);
        await Swal.fire({ title: 'สำเร็จ!', text: 'เพิ่มการนัดหมายเรียบร้อยแล้ว', icon: 'success', confirmButtonColor: '#3B5F6D' });
        
        // อัปเดตตารางและรีเซ็ตฟอร์ม
        this.fetchAppointments(this.patientId);
        this.$refs.appointmentForm.reset();
        
      } catch (e) {
        console.error(e);
        await Swal.fire({ title: 'เกิดข้อผิดพลาด', text: 'ไม่สามารถเพิ่มการนัดหมายได้', icon: 'error', confirmButtonColor: '#d33' });
      } finally {
        this.loading = false;
      }
    },

    async deleteAppointment(appointmentId) {
      const result = await Swal.fire({
        title: 'คุณแน่ใจหรือไม่?',
        text: 'ข้อมูลการนัดหมายนี้จะถูกลบอย่างถาวร!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'ใช่, ลบเลย!',
        cancelButtonText: 'ยกเลิก',
      });

      if (result.isConfirmed) {
        try {
          await deleteAppointmentApi(appointmentId);
          await Swal.fire({ title: 'ลบสำเร็จ!', text: 'ข้อมูลการนัดหมายถูกลบแล้ว', icon: 'success', confirmButtonColor: '#3B5F6D' });
          this.fetchAppointments(this.patientId);
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
      const statusCounts = {};
      this.appointmentHistory.forEach(a => statusCounts[a.status] = (statusCounts[a.status] || 0) + 1);
      const data = {
        labels: Object.keys(statusCounts),
        datasets: [{ label: 'จำนวนการนัดหมาย', data: Object.values(statusCounts), backgroundColor: Object.keys(statusCounts).map(s => this.chartColors[s] || '#9E9E9E') }],
      };
      const ctx = document.getElementById('appointmentChart').getContext('2d');
      this.chartInstance = new Chart(ctx, { type: 'bar', data, options: { responsive: true, plugins: { legend: { display: false } } } });
    },

    openExportDialog() { this.exportDialog = true; this.selectedAppointmentId = null; },

    async exportAppointmentPDF() {
      if (!this.selectedAppointmentId) return;
      const a = this.appointmentHistory.find(x => x.id === this.selectedAppointmentId);
      if (!a) return;

      const doc = new jsPDF();
      
      doc.addFileToVFS('THSarabunNew.ttf', THSarabunNewBase64);
      doc.addFont('THSarabunNew.ttf', 'THSarabunNew', 'normal');
      doc.setFont('THSarabunNew');

      doc.setFontSize(16);
      doc.text('ใบนัดผู้ป่วย', 14, 20);
      doc.setFontSize(12);
      doc.text(`HN: ${a.hn_number || 'ไม่ได้ระบุ'}`, 14, 30);
      doc.text(`ชื่อผู้ป่วย: ${this.patientName}`, 14, 38);
      doc.text(`วันที่นัดหมาย: ${this.formatDateTime(a.appointment_date, a.appointment_time)}`, 14, 46);
      doc.text(`แพทย์/ผู้บันทึก: ${a.appointed_by || 'ไม่ได้ระบุ'}`, 14, 54);
      doc.text(`สถานที่ติดต่อ: ${a.contact_location || 'ไม่ได้ระบุ'}`, 14, 62);
      doc.text(`วินิจฉัย: ${a.diagnosis || 'ไม่ได้ระบุ'}`, 14, 70);
      doc.text(`เหตุผล: ${a.reason || 'ไม่ได้ระบุ'}`, 14, 78);
      doc.text(`รายละเอียดอื่นๆ: ${a.other_details || 'ไม่ได้ระบุ'}`, 14, 86);
      doc.text(`สถานะ: ${a.status || 'ไม่ได้ระบุ'}`, 14, 94);
      
      doc.save(`Appointment_${a.hn_number || 'unknown'}.pdf`);
      this.exportDialog = false;
    },
  },
};
</script>

<style scoped>
.v-application { background-color: #f5f5f5; }
</style>