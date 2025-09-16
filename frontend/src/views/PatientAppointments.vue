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
        <v-btn text @click="goToUserPage">
          <v-icon left>mdi-account</v-icon> ข้อมูลส่วนตัว
        </v-btn>
        <v-btn text @click="goToAddPatient">
          <v-icon left>mdi-account-plus</v-icon> เพิ่มผู้ป่วยใหม่
        </v-btn>
        <v-btn text @click="goToPatientInfo">
          <v-icon left>mdi-account-group</v-icon> ข้อมูลผู้ป่วย
        </v-btn>
        <v-btn text @click="goToMapPage">
          <v-icon left>mdi-map-marker-multiple</v-icon> แผนที่ผู้ป่วย
        </v-btn>
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
          <!-- Form Section -->
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
                      />
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-text-field
                        v-model="newAppointment.rights"
                        label="สิทธิการรักษา"
                        prepend-icon="mdi-shield-account"
                      />
                    </v-col>
                    <v-col cols="12" sm="6" md="6">
                      <v-text-field
                        v-model="datePicker"
                        label="วันที่นัดหมาย"
                        prepend-icon="mdi-calendar"
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
                            outlined
                            dense
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
                      <v-select
                        v-model="newAppointment.status"
                        :items="statusOptions"
                        label="สถานะการนัดหมาย"
                        prepend-icon="mdi-check-circle-outline"
                      />
                    </v-col>
                  </v-row>
                </v-form>
              </v-card-text>
              <v-card-actions>
                <v-spacer />
                <v-btn color="#3B5F6D" dark @click="addAppointment" :loading="loading">
                  <v-icon left>mdi-plus</v-icon> เพิ่มการนัดหมาย
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-col>

          <!-- Chart Section -->
          <v-col cols="12" md="5">
            <v-card class="pa-5">
              <v-card-title class="text-h6">สถิติเข้าตรวจตามนัด</v-card-title>
              <v-card-text>
                <canvas id="appointmentChart"></canvas>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>

        <!-- Appointment History -->
        <v-card class="mt-6 pa-5">
          <v-card-title class="text-h6 d-flex justify-space-between align-center">
            <span>ประวัติการนัดหมาย</span>
          </v-card-title>
          <v-data-table
            :headers="headers"
            :items="appointmentHistory"
            :loading="loadingData"
            item-key="id"
          >
            <template v-slot:item.appointment_datetime="{ item }">
              {{ formatDateTime(item.appointment_date, item.appointment_time) }}
            </template>
            <template v-slot:item.hn_number="{ item }">
              {{ item.hn_number || '-' }}
            </template>
            <template v-slot:item.rights="{ item }">
              {{ item.rights || '-' }}
            </template>
            <template v-slot:item.status="{ item }">
              <v-chip :color="getStatusColor(item.status)" dark>{{ item.status }}</v-chip>
            </template>
            <template v-slot:item.actions="{ item }">
              <v-icon small @click="deleteAppointment(item.id)">mdi-delete</v-icon>
            </template>
            <template v-slot:no-data>
              ไม่มีข้อมูลการนัดหมายสำหรับผู้ป่วยนี้
            </template>
          </v-data-table>
        </v-card>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import axios from 'axios';
import Swal from 'sweetalert2';
import Chart from 'chart.js/auto';

const API_APPOINTMENTS = import.meta.env.VITE_API_APPOINTMENTS;
const API_PATIENT = import.meta.env.VITE_API_PATIENT;

export default {
  data() {
    return {
      drawer: false,
      patientName: 'กำลังโหลด...',
      patientId: null,
      appointmentHistory: [],
      newAppointment: { hn_number: null, rights: null, reason: '', appointed_by: '', contact_location: '', other_details: '', diagnosis: '', status: 'รอนัด' },
      datePicker: new Date().toISOString().substr(0, 10),
      timePicker: new Date().toTimeString().substr(0, 5),
      timeMenu: false,
      loading: false,
      loadingData: false,
      valid: false,
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
      chartColors: { 'มาตามนัด':'#4CAF50','ไม่มาตามนัด':'#F44336','ส่งต่อรักษา':'#2196F3','รอนัด':'#FF9800' },
    };
  },
  mounted() {
    this.patientId = this.$route.query.patientId;
    if (this.patientId) {
      this.fetchPatientDetails();
      this.fetchAppointments();
    }
  },
  methods: {
    async fetchPatientDetails() {
      try {
        const res = await axios.get(`${API_PATIENT}${this.patientId}`);
        this.patientName = res.data.patient?.name || res.data.name || 'ไม่พบชื่อผู้ป่วย';
      } catch (err) {
        console.error(err);
        this.patientName = 'ไม่พบผู้ป่วย';
      }
    },
    async fetchAppointments() {
      this.loadingData = true;
      try {
        const res = await axios.get(`${API_APPOINTMENTS}patient/${this.patientId}`);
        this.appointmentHistory = res.data;
        this.$nextTick(() => this.updateChart());
      } catch (err) {
        console.error(err);
        this.appointmentHistory = [];
      } finally { this.loadingData = false; }
    },
    async addAppointment() {
      if (!this.patientId) return;
      this.loading = true;
      try {
        await axios.post(`${API_APPOINTMENTS}`, { ...this.newAppointment, patient_id: this.patientId, appointment_date: this.datePicker, appointment_time: this.timePicker });
        Swal.fire('สำเร็จ','บันทึกการนัดหมายเรียบร้อย','success');
        this.newAppointment = { hn_number: null, rights: null, reason: '', appointed_by: '', contact_location: '', other_details: '', diagnosis: '', status: 'รอนัด' };
        this.datePicker = new Date().toISOString().substr(0,10);
        this.timePicker = new Date().toTimeString().substr(0,5);
        this.fetchAppointments();
      } catch (err) {
        console.error(err);
        Swal.fire('ผิดพลาด','ไม่สามารถบันทึกการนัดหมายได้','error');
      } finally { this.loading = false; }
    },
    async deleteAppointment(id) {
      const result = await Swal.fire({ title:'ยืนยัน', text:'ต้องการลบใช่หรือไม่?', icon:'warning', showCancelButton:true, confirmButtonText:'ใช่', cancelButtonText:'ยกเลิก' });
      if (result.isConfirmed) {
        try {
          await axios.delete(`${API_APPOINTMENTS}${id}`);
          Swal.fire('สำเร็จ','ลบเรียบร้อย','success');
          this.fetchAppointments();
        } catch (err) {
          console.error(err);
          Swal.fire('ผิดพลาด','ไม่สามารถลบได้','error');
        }
      }
    },
    formatDateTime(date,time){
      if(!date) return '-';
      const d = new Date(`${date}T${time||'00:00'}`);
      return `${d.getDate().toString().padStart(2,'0')}/${(d.getMonth()+1).toString().padStart(2,'0')}/${d.getFullYear()} ${d.getHours().toString().padStart(2,'0')}:${d.getMinutes().toString().padStart(2,'0')}`;
    },
    getStatusColor(status){ return this.chartColors[status] || '#000'; },
    updateChart(){
      if(!this.appointmentHistory.length) return;
      const counts = {}; this.statusOptions.forEach(s=>counts[s]=0);
      this.appointmentHistory.forEach(a=>{ if(counts[a.status]!==undefined) counts[a.status]++; });
      const data={ labels:this.statusOptions, datasets:[{ label:'สถานะการนัดหมาย', data:this.statusOptions.map(s=>counts[s]), backgroundColor:this.statusOptions.map(s=>this.chartColors[s]) }] };
      if(this.chartInstance) this.chartInstance.destroy();
      const ctx=document.getElementById('appointmentChart').getContext('2d');
      this.chartInstance=new Chart(ctx,{ type:'bar', data });
    },
    goToUserPage(){ this.$router.push('/user'); },
    goToAddPatient(){ this.$router.push('/add-patient'); },
    goToPatientInfo(){ this.$router.push('/patients'); },
    goToMapPage(){ this.$router.push('/map'); }
  }
};
</script>
