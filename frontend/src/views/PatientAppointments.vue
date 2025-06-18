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
                      <v-text-field
                        v-model="newAppointment.reason"
                        label="เหตุผลการนัดหมาย"
                        prepend-icon="mdi-text-box-outline"
                      />
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-text-field
                        v-model="newAppointment.appointed_by"
                        label="แพทย์ผู้นัด / ผู้บันทึกนัด"
                        prepend-icon="mdi-medical-bag"
                      />
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-text-field
                        v-model="newAppointment.contact_location"
                        label="สถานที่ติดต่อ"
                        prepend-icon="mdi-map-marker-radius"
                      />
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-text-field
                        v-model="newAppointment.diagnosis"
                        label="วินิจฉัย"
                        prepend-icon="mdi-stethoscope"
                      />
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-text-field
                        v-model="newAppointment.other_details"
                        label="รายละเอียดอื่นๆ (เช่น LAB/X-Ray)"
                        prepend-icon="mdi-note-text-outline"
                      />
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-select
                        v-model="newAppointment.status"
                        :items="statusOptions"
                        label="สถานะการนัดหมาย"
                        prepend-icon="mdi-check-circle-outline"
                        :rules="[v => !!v || 'กรุณาเลือกสถานะ']"
                        required
                      />
                    </v-col>
                  </v-row>
                </v-form>
              </v-card-text>
              <v-card-actions>
                <v-spacer />
                <v-btn
                  color="#3B5F6D"
                  dark
                  @click="addAppointment"
                  :loading="loading"
                  :disabled="!valid"
                >
                  <v-icon left>mdi-plus</v-icon>
                  เพิ่มการนัดหมาย
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


        <v-card class="mt-6 pa-5">
          <v-card-title class="text-h6 d-flex justify-space-between align-center">
            <span>ประวัติการนัดหมาย</span>
            <v-btn color="#3B5F6D" dark @click="openExportDialog" :disabled="appointmentHistory.length === 0">
              <v-icon left>mdi-printer</v-icon>
              ส่งออกใบนัด
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
            <template v-slot:item.status="{ item }">
                <v-chip :color="getStatusColor(item.status)" dark>{{ item.status }}</v-chip>
            </template>
            <template v-slot:item.actions="{ item }">
              <v-icon
                small
                @click="deleteAppointment(item.id)"
              >
                mdi-delete
              </v-icon>
            </template>
            <template v-slot:no-data>
                ไม่มีข้อมูลการนัดหมายสำหรับผู้ป่วยนี้
            </template>
          </v-data-table>
        </v-card>
        <!-- Dialog สำหรับเลือกนัดหมายที่จะส่งออก -->
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
                <v-icon left>mdi-printer</v-icon>
                ส่งออก
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import axios from 'axios';
import Swal from 'sweetalert2';
import Chart from 'chart.js/auto';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export default {
  name: 'PatientAppointments',
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
      patientId: null,
      datePicker: new Date().toISOString().substr(0, 10),
      timePicker: new Date().toTimeString().substr(0, 5),
      dateMenu: false,
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
  mounted() {
    this.patientId = this.$route.query.patientId || null;
    if (this.patientId) {
      this.fetchPatientDetails(this.patientId);
      this.fetchAppointments(this.patientId);
    } else {
      this.patientName = 'ไม่พบผู้ป่วย';
    }
  },
  watch: {
    '$route.query.patientId'(newId) {
      this.patientId = newId || null;
      if (this.patientId) {
        this.fetchPatientDetails(this.patientId);
        this.fetchAppointments(this.patientId);
      } else {
        this.patientName = 'ไม่พบผู้ป่วย';
        this.appointmentHistory = [];
        if (this.chartInstance) {
          this.chartInstance.destroy(); // Destroy chart if patient changes or becomes null
          this.chartInstance = null;
        }
      }
    },
  },
  methods: {
    async fetchPatientDetails(id) {
      try {
        const token = localStorage.getItem('userToken');
        const headers = token ? { 'x-auth-token': token } : {};
        const response = await axios.get(`http://localhost:3001/api/patients/${id}`, { headers });
        this.patientName = response.data.name || response.data.patient?.name || 'ไม่พบชื่อผู้ป่วย';
      } catch (error) {
        console.error('Failed to load patient name:', error.response?.data || error.message);
        this.patientName = 'ไม่พบผู้ป่วย';
        await Swal.fire({
          title: 'เกิดข้อผิดพลาด',
          text: 'ไม่สามารถโหลดข้อมูลผู้ป่วยได้',
          icon: 'error',
          confirmButtonColor: '#d33',
          customClass: {
            container: 'error-dialog',
            popup: 'rounded-lg',
            title: 'text-h5 font-weight-bold',
            confirmButton: 'v-btn v-btn--contained theme--light v-size--default error'
          }
        });
        if (error.response?.status === 401) {
          this.logout();
        }
      }
    },
    async fetchAppointments(id) {
      this.loadingData = true;
      try {
        const token = localStorage.getItem('userToken');
        const headers = token ? { 'x-auth-token': token } : {};
        const response = await axios.get(`http://localhost:3001/api/appointments/patient/${id}`, { headers });
        this.appointmentHistory = response.data;
        this.$nextTick(() => {
          this.updateChart();
        });
      } catch (error) {
        console.error('Failed to load appointment history:', error.response?.data || error.message);
        this.appointmentHistory = [];
        if (this.chartInstance) {
          this.chartInstance.destroy();
          this.chartInstance = null;
        }
        await Swal.fire({
          title: 'เกิดข้อผิดพลาด',
          text: 'ไม่สามารถโหลดข้อมูลการนัดหมายได้',
          icon: 'error',
          confirmButtonColor: '#d33',
          customClass: {
            container: 'error-dialog',
            popup: 'rounded-lg',
            title: 'text-h5 font-weight-bold',
            confirmButton: 'v-btn v-btn--contained theme--light v-size--default error'
          }
        });
        if (error.response?.status === 401) {
          this.logout();
        }
      } finally {
        this.loadingData = false;
      }
    },
    async addAppointment() {
      if (!this.patientId) {
        await Swal.fire({
          title: 'คำเตือน',
          text: 'ไม่พบ patientId กรุณาเลือกผู้ป่วย',
          icon: 'warning',
          confirmButtonColor: '#3085d6',
          customClass: {
            container: 'warning-dialog',
            popup: 'rounded-lg',
            title: 'text-h5 font-weight-bold',
            confirmButton: 'v-btn v-btn--contained theme--light v-size--default primary'
          }
        });
        return;
      }
      if (!this.$refs.appointmentForm.validate()) {
        return;
      }

      const payload = {
        patient_id: this.patientId,
        hn_number: this.newAppointment.hn_number,
        rights: this.newAppointment.rights,
        appointment_date: this.datePicker,
        appointment_time: this.timePicker,
        reason: this.newAppointment.reason,
        appointed_by: this.newAppointment.appointed_by,
        contact_location: this.newAppointment.contact_location,
        other_details: this.newAppointment.other_details,
        diagnosis: this.newAppointment.diagnosis,
        status: this.newAppointment.status,
      };

      this.loading = true;
      try {
        const token = localStorage.getItem('userToken');
        const headers = token ? { 'x-auth-token': token } : {};
        const response = await axios.post('http://localhost:3001/api/appointments', payload, { headers });
        console.log('Appointment added successfully:', response.data);
        await Swal.fire({
          title: 'บันทึกสำเร็จ',
          text: 'บันทึกการนัดหมายเรียบร้อยแล้ว',
          icon: 'success',
          confirmButtonColor: '#4CAF50',
          customClass: {
            container: 'success-dialog',
            popup: 'rounded-lg',
            title: 'text-h5 font-weight-bold',
            confirmButton: 'v-btn v-btn--contained theme--light v-size--default success'
          }
        });
        this.resetNewAppointmentForm();
        this.fetchAppointments(this.patientId);
      } catch (error) {
        console.error('Failed to add appointment:', error.response?.data || error.message);
        await Swal.fire({
          title: 'เกิดข้อผิดพลาด',
          text: 'ไม่สามารถบันทึกการนัดหมายได้: ' + (error.response?.data?.message || error.message),
          icon: 'error',
          confirmButtonColor: '#d33',
          customClass: {
            container: 'error-dialog',
            popup: 'rounded-lg',
            title: 'text-h5 font-weight-bold',
            confirmButton: 'v-btn v-btn--contained theme--light v-size--default error'
          }
        });
      } finally {
        this.loading = false;
      }
    },
    async deleteAppointment(id) {
      const result = await Swal.fire({
        title: 'ยืนยันการลบ',
        text: 'คุณต้องการลบการนัดหมายนี้ใช่หรือไม่?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'ใช่, ลบการนัดหมาย',
        cancelButtonText: 'ยกเลิก',
        customClass: {
          container: 'delete-confirm-dialog',
          popup: 'rounded-lg',
          title: 'text-h5 font-weight-bold',
          confirmButton: 'v-btn v-btn--contained theme--light v-size--default error',
          cancelButton: 'v-btn v-btn--contained theme--light v-size--default primary'
        }
      });

      if (result.isConfirmed) {
        try {
          const token = localStorage.getItem('userToken');
          const headers = token ? { 'x-auth-token': token } : {};
          await axios.delete(`http://localhost:3001/api/appointments/${id}`, { headers });
          await Swal.fire({
            title: 'ลบสำเร็จ',
            text: 'ลบการนัดหมายเรียบร้อยแล้ว',
            icon: 'success',
            confirmButtonColor: '#4CAF50',
            customClass: {
              container: 'success-dialog',
              popup: 'rounded-lg',
              title: 'text-h5 font-weight-bold',
              confirmButton: 'v-btn v-btn--contained theme--light v-size--default success'
            }
          });
          this.fetchAppointments(this.patientId);
        } catch (error) {
          console.error('Failed to delete appointment:', error);
          await Swal.fire({
            title: 'เกิดข้อผิดพลาด',
            text: 'ไม่สามารถลบการนัดหมายได้: ' + (error.response?.data?.message || error.message),
            icon: 'error',
            confirmButtonColor: '#d33',
            customClass: {
              container: 'error-dialog',
              popup: 'rounded-lg',
              title: 'text-h5 font-weight-bold',
              confirmButton: 'v-btn v-btn--contained theme--light v-size--default error'
            }
          });
        }
      }
    },
    resetNewAppointmentForm() {
      this.newAppointment = {
        hn_number: null,
        rights: null,
        reason: null,
        appointed_by: null,
        contact_location: null,
        other_details: null,
        diagnosis: null,
        status: 'รอนัด',
      };
      this.datePicker = new Date().toISOString().substr(0, 10);
      this.timePicker = new Date().toTimeString().substr(0, 5);
      this.$refs.appointmentForm.resetValidation();
    },
    formatDateTime(dateString, timeString) {
      if (!dateString) return 'N/A';

      // แยกเอาแค่วันที่จาก datetime เช่น '2025-06-14T17:00:00.000Z' => '2025-06-14'
      let dateOnly = dateString.split('T')[0]; 

      let timeTrimmed = '';
      if (timeString && typeof timeString === 'string') {
        timeTrimmed = timeString.trim().substr(0,5);
      }

      let dateTimeStr = timeTrimmed ? `${dateOnly}T${timeTrimmed}:00` : dateOnly;

      const date = new Date(dateTimeStr);

      if (isNaN(date.getTime())) {
        return 'N/A';
      }

      return date.toLocaleDateString('th-TH', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      });
    },
    getStatusColor(status) {
      switch (status) {
        case 'มาตามนัด': return 'green';
        case 'ไม่มาตามนัด': return 'red';
        case 'ส่งต่อรักษา': return 'blue';
        case 'รอนัด': return 'orange';
        default: return 'grey';
      }
    },
    updateChart() {
      const ctx = document.getElementById('appointmentChart');

      if (this.chartInstance) {
        this.chartInstance.destroy(); // Destroy previous chart instance if it exists
      }

      if (!ctx) {
        console.warn("Canvas element 'appointmentChart' not found. Chart will not be rendered.");
        return;
      }

      // Count status occurrences
      const statusCounts = {};
      this.statusOptions.forEach(status => {
        statusCounts[status] = 0; // Initialize all possible statuses
      });

      this.appointmentHistory.forEach(appointment => {
        if (statusCounts.hasOwnProperty(appointment.status)) {
          statusCounts[appointment.status]++;
        } else {
          console.warn(`Unexpected appointment status encountered: ${appointment.status}. It will not be included in the chart.`);
        }
      });

      const labels = Object.keys(statusCounts);
      const data = Object.values(statusCounts);
      const backgroundColors = labels.map(label => this.chartColors[label] || '#9E9E9E'); // Fallback color

      this.chartInstance = new Chart(ctx, {
        type: 'pie',
        data: {
          labels: labels,
          datasets: [{
            data: data,
            backgroundColor: backgroundColors,
            hoverOffset: 4
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false, // Allow chart to fill container's width/height
          plugins: {
            legend: {
              position: 'right', // Place legend on the right side
              labels: {
                font: {
                  size: 14 // Adjust font size for readability
                }
              }
            },
            tooltip: {
              callbacks: {
                label: function(context) {
                  const label = context.label || '';
                  const value = context.raw;
                  const total = context.dataset.data.reduce((acc, current) => acc + current, 0);
                  const percentage = total > 0 ? ((value / total) * 100).toFixed(2) : 0;
                  return `${label}: ${value} (${percentage}%)`;
                }
              }
            },
            title: {
              display: false, // Title is already in v-card-title
            }
          },
        }
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
    openExportDialog() {
      this.selectedAppointmentId = null;
      this.exportDialog = true;
    },
    exportAppointmentPDF() {
      const appointment = this.appointmentHistory.find(a => a.id === this.selectedAppointmentId);
      if (!appointment) {
        this.$swal({
          title: 'ไม่พบข้อมูล',
          text: 'ไม่สามารถดึงข้อมูลนัดหมายได้',
          icon: 'error',
        });
        return;
      }
      // เตรียมข้อมูลสำหรับ PDF
      const patientName = this.patientName;
      const hn = appointment.hn_number || '-';
      const rights = appointment.rights || '-';
      const dateThai = this.formatThaiDate(appointment.appointment_date);
      const timeThai = this.formatThaiTime(appointment.appointment_time);
      const reason = appointment.reason || '-';
      const doctor = appointment.appointed_by || '-';
      const contact = appointment.contact_location || '-';
      const lab = appointment.other_details || '-';
      const diagnosis = appointment.diagnosis || '-';
      const status = appointment.status || '-';
      // ฟอร์ม HTML ชั่วคราวสำหรับแปลงเป็น PDF
      const html = `
        <div style="font-family: 'Sarabun', Arial, sans-serif; padding: 24px; width: 700px;">
          <div style="font-size: 2.2rem; font-weight: bold; margin-bottom: 8px; border-bottom: 3px solid #222; display:inline-block;">ใบนัด</div>
          <div style="margin-top: 16px; font-size: 1.2rem;">
            <b>ชื่อ-นามสกุล</b> ${patientName} &nbsp;&nbsp; <b>HN</b> ${hn}<br/>
            <b>สิทธิการรักษา</b> ${rights}<br/>
            <b>วันที่นัด</b> ${dateThai} &nbsp;&nbsp; <b>เวลา</b> ${timeThai}<br/>
            <b>เหตุผลการนัด</b> ${reason} &nbsp;&nbsp; <b>แพทย์ผู้นัด</b> ${doctor}<br/>
            <b>สถานที่ติดต่อ</b> ${contact}<br/>
            <hr style="margin: 16px 0; border: 1px solid #222;"/>
            <b>LAB/X-Ray/การตรวจอื่น ๆ</b><br/>
            ${lab}<br/>
            <br/>
            <b>วินิจฉัย</b> ${diagnosis}<br/>
            <br/>
            <div style="text-align: right; margin-top: 32px;">ผู้ออกใบนัด .......................................</div>
          </div>
        </div>
      `;
      // สร้าง element ชั่วคราว
      const el = document.createElement('div');
      el.innerHTML = html;
      el.style.position = 'fixed';
      el.style.left = '-9999px';
      document.body.appendChild(el);
      this.exportDialog = false;
      setTimeout(() => {
        html2canvas(el, { scale: 2 }).then(canvas => {
          const imgData = canvas.toDataURL('image/png');
          const pdf = new jsPDF({ orientation: 'landscape', unit: 'px', format: [canvas.width, canvas.height] });
          pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
          pdf.save('appointment-slip.pdf');
          document.body.removeChild(el);
        }).catch(() => {
          document.body.removeChild(el);
          this.$swal({
            title: 'เกิดข้อผิดพลาด',
            text: 'ไม่สามารถสร้าง PDF ได้',
            icon: 'error',
          });
        });
      }, 200);
    },
    formatDate(dateStr) {
      if (!dateStr) return '-';
      const d = new Date(dateStr);
      return d.toLocaleDateString('th-TH');
    },
    formatThaiDate(dateStr) {
      if (!dateStr) return '-';
      const d = new Date(dateStr);
      const months = [
        'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
        'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
      ];
      const day = d.getDate();
      const month = months[d.getMonth()];
      const year = d.getFullYear() + 543;
      return `${day} ${month} พ.ศ. ${year}`;
    },
    formatThaiTime(timeStr) {
      if (!timeStr) return '-';
      const [h, m] = timeStr.split(':');
      return `${h}:${m} น.`;
    },
  },
};
</script>

<style scoped>
.v-card {
  border-radius: 10px;
}
#appointmentChart {
  max-height: 300px; 
  width: 100%; 
}
/* Dialog styles */
:deep(.error-dialog),
:deep(.warning-dialog),
:deep(.success-dialog),
:deep(.delete-confirm-dialog) {
  font-family: 'Kanit', sans-serif;
}

:deep(.error-dialog .swal2-popup),
:deep(.warning-dialog .swal2-popup),
:deep(.success-dialog .swal2-popup),
:deep(.delete-confirm-dialog .swal2-popup) {
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

:deep(.error-dialog .swal2-title),
:deep(.warning-dialog .swal2-title),
:deep(.success-dialog .swal2-title),
:deep(.delete-confirm-dialog .swal2-title) {
  color: #333;
  margin-bottom: 1rem;
}

:deep(.error-dialog .swal2-html-container),
:deep(.warning-dialog .swal2-html-container),
:deep(.success-dialog .swal2-html-container),
:deep(.delete-confirm-dialog .swal2-html-container) {
  margin: 1rem 0;
  color: #666;
}

:deep(.error-dialog .swal2-confirm),
:deep(.warning-dialog .swal2-confirm),
:deep(.success-dialog .swal2-confirm),
:deep(.delete-confirm-dialog .swal2-confirm) {
  padding: 0.5rem 2rem;
  font-size: 1rem;
  border-radius: 8px;
  text-transform: none;
  font-weight: 500;
}

:deep(.delete-confirm-dialog .swal2-cancel) {
  padding: 0.5rem 2rem;
  font-size: 1rem;
  border-radius: 8px;
  text-transform: none;
  font-weight: 500;
}

@media (max-width: 960px) {
  .v-toolbar__title {
    font-size: 1.1rem;
  }
  
  .v-btn {
    padding: 0 8px;
  }
  
  .v-btn .v-icon {
    margin-right: 4px;
  }
  
  .v-card {
    padding: 16px;
  }
  
  .v-data-table {
    font-size: 0.9rem;
  }
}

@media (max-width: 600px) {
  .v-toolbar__title {
    font-size: 1rem;
  }
  
  .v-card {
    padding: 12px;
  }
  
  .v-card-title {
    font-size: 1.1rem;
  }
  
  .v-card-text {
    font-size: 0.9rem;
  }
  
  .v-text-field {
    margin-bottom: 8px;
  }
  
  .v-btn {
    padding: 0 4px;
    font-size: 0.8rem;
  }
  
  .v-data-table {
    font-size: 0.8rem;
  }
  
  .v-chip {
    font-size: 0.8rem;
    height: 24px;
  }
}
</style>
