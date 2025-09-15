<template>
  <v-app>
    <!-- App Bar -->
    <v-app-bar app color="#3B5F6D" dark>
      <v-app-bar-nav-icon @click="drawer = !drawer" class="d-md-none"></v-app-bar-nav-icon>
      <v-toolbar-title class="font-weight-bold">
        <v-icon left>mdi-clipboard-pulse</v-icon>
        ข้อมูลติดตามสุขภาพประจำวัน: {{ patientName }}
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <div class="d-none d-md-flex">
        <v-btn text @click="goToUserPage"><v-icon left>mdi-account</v-icon>ข้อมูลส่วนตัว</v-btn>
        <v-btn text @click="goToAddPatient"><v-icon left>mdi-account-plus</v-icon>เพิ่มผู้ป่วยใหม่</v-btn>
        <v-btn text @click="goToPatientInfo"><v-icon left>mdi-account-group</v-icon>ข้อมูลผู้ป่วย</v-btn>
        <v-btn text @click="goToMapPage"><v-icon left>mdi-map-marker-multiple</v-icon>แผนที่ผู้ป่วย</v-btn>
      </div>
    </v-app-bar>

    <!-- Navigation Drawer -->
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

    <!-- Main Content -->
    <v-main>
      <v-container class="mt-6">
        <!-- ฟอร์มบันทึกข้อมูล -->
        <v-card class="pa-5">
          <v-card-title class="text-h6">บันทึกข้อมูลสุขภาพใหม่</v-card-title>
          <v-card-text>
            <v-form ref="trackingForm" v-model="valid" lazy-validation>
              <v-row>
                <v-col cols="12" sm="6" md="4">
                  <v-text-field v-model.number="newTracking.temperature" label="อุณหภูมิ (°C)" type="number" step="0.01" prepend-icon="mdi-thermometer"
                    :rules="[value => (value === null || value === '') || (value >= 30 && value <= 45) || 'กรุณากรอกอุณหภูมิที่ถูกต้อง']"/>
                </v-col>
                <v-col cols="12" sm="6" md="4">
                  <v-text-field v-model.number="newTracking.blood_pressure_systolic" label="ความดันโลหิต (บน)" type="number" prepend-icon="mdi-heart-pulse"
                    :rules="[value => (value === null || value === '') || (value > 0) || 'กรุณากรอกความดันบนให้ถูกต้อง']"/>
                </v-col>
                <v-col cols="12" sm="6" md="4">
                  <v-text-field v-model.number="newTracking.blood_pressure_diastolic" label="ความดันโลหิต (ล่าง)" type="number"
                    :rules="[value => (value === null || value === '') || (value > 0) || 'กรุณากรอกความดันล่างให้ถูกต้อง']"/>
                </v-col>
                <v-col cols="12" sm="6" md="4">
                  <v-text-field v-model.number="newTracking.pulse_rate" label="อัตราการเต้นของหัวใจ" type="number" prepend-icon="mdi-pulse"
                    :rules="[value => (value === null || value === '') || (value > 0) || 'กรุณากรอกอัตราชีพจรให้ถูกต้อง']"/>
                </v-col>
                <v-col cols="12" sm="6" md="4">
                  <v-text-field v-model.number="newTracking.respiratory_rate" label="อัตราการหายใจ" type="number" prepend-icon="mdi-lungs"
                    :rules="[value => (value === null || value === '') || (value > 0) || 'กรุณากรอกอัตราการหายใจให้ถูกต้อง']"/>
                </v-col>
                <v-col cols="12" sm="6" md="4">
                  <v-text-field v-model.number="newTracking.blood_sugar" label="ระดับน้ำตาลในเลือด" type="number" step="0.1" prepend-icon="mdi-water-outline"
                    :rules="[value => (value === null || value === '') || (value >= 0) || 'กรุณากรอกระดับน้ำตาลให้ถูกต้อง']"/>
                </v-col>

                <v-col cols="12" sm="6" md="6">
                  <v-menu v-model="dateMenu" :close-on-content-click="false" transition="scale-transition" offset-y min-width="290px">
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field v-model="datePicker" label="วันที่บันทึก" prepend-icon="mdi-calendar" readonly v-bind="attrs" v-on="on"/>
                    </template>
                    <v-date-picker v-model="datePicker" locale="th" scrollable no-title @input="dateMenu=false"/>
                  </v-menu>
                </v-col>

                <v-col cols="12" sm="6" md="6">
                  <v-menu v-model="timeMenu" :close-on-content-click="false" transition="scale-transition" offset-y min-width="290px">
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field v-model="timePicker" label="เวลาบันทึก" prepend-icon="mdi-clock" readonly v-bind="attrs" v-on="on"/>
                    </template>
                    <v-time-picker v-model="timePicker" format="24hr" @input="timeMenu=false"/>
                  </v-menu>
                </v-col>
              </v-row>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer/>
            <!-- ปุ่มเพิ่มนัดหมาย -->
            <v-btn color="indigo" dark @click="goToAppointments">
              <v-icon left>mdi-calendar-plus</v-icon>เพิ่มการนัดหมาย
            </v-btn>
            <!-- ปุ่มเพิ่มข้อมูล -->
            <v-btn color="#3B5F6D" dark @click="addTrackingData" :loading="loading" :disabled="!valid">
              <v-icon left>mdi-plus</v-icon>เพิ่มข้อมูล
            </v-btn>
          </v-card-actions>
        </v-card>

        <!-- ตารางประวัติ -->
        <v-card class="mt-6 pa-5">
          <v-card-title class="text-h6">ประวัติข้อมูลติดตามสุขภาพ</v-card-title>
          <v-data-table :headers="headers" :items="dailyTrackingData" :loading="loadingData" class="elevation-1">
            <template v-slot:item.blood_pressure="{ item }">
              {{ item.blood_pressure_systolic }}/{{ item.blood_pressure_diastolic }}
            </template>
            <template v-slot:item.recorded_at="{ item }">
              {{ formatDateTime(item.recorded_at) }}
            </template>
            <template v-slot:no-data>ไม่มีข้อมูลติดตามสุขภาพสำหรับผู้ป่วยนี้</template>
          </v-data-table>
        </v-card>

        <!-- กราฟ -->
        <v-card class="mt-6 pa-5">
          <v-card-title class="text-h6">กราฟติดตามสุขภาพ</v-card-title>
          <line-chart ref="lineChart" :chart-data="chartData" :chart-options="chartOptions"/>
        </v-card>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import axios from 'axios';
import Swal from 'sweetalert2';
import dayjs from 'dayjs';
import { ref, onMounted, watch, defineComponent } from 'vue';
import { Chart, LineController, LineElement, PointElement, LinearScale, CategoryScale, Title, Tooltip, Legend } from 'chart.js';

Chart.register(LineController, LineElement, PointElement, LinearScale, CategoryScale, Title, Tooltip, Legend);

export default {
  name: 'PatientDailyTracking',
  components: {
    LineChart: defineComponent({
      props: ['chartData','chartOptions'],
      setup(props){
        const chartRef = ref(null);
        let chartInstance = null;

        const renderChart = () => {
          if (!chartRef.value) return;
          const ctx = chartRef.value.getContext('2d');
          if (!chartInstance) {
            chartInstance = new Chart(ctx, {
              type: 'line',
              data: props.chartData,
              options: props.chartOptions
            });
          } else {
            chartInstance.data = props.chartData;
            chartInstance.options = props.chartOptions;
            chartInstance.update();
          }
        };

        onMounted(() => renderChart());
        watch(() => props.chartData, () => renderChart(), { deep:true });
        watch(() => props.chartOptions, () => renderChart(), { deep:true });

        return { chartRef };
      },
      template: `<canvas ref="chartRef" style="width:100%;height:300px"></canvas>`
    })
  },
  data(){
    return {
      drawer:false,
      patientName:'กำลังโหลด...',
      dailyTrackingData:[],
      newTracking:{temperature:null, blood_pressure_systolic:null, blood_pressure_diastolic:null, pulse_rate:null, respiratory_rate:null, blood_sugar:null},
      patientId:null,
      datePicker:new Date().toISOString().substr(0,10),
      timePicker:new Date().toTimeString().substr(0,5),
      dateMenu:false,
      timeMenu:false,
      valid:false,
      loading:false,
      loadingData:false,
      headers:[
        { text:'วันที่/เวลา', value:'recorded_at' },
        { text:'อุณหภูมิ (°C)', value:'temperature' },
        { text:'ความดัน (บน/ล่าง)', value:'blood_pressure' }, 
        { text:'อัตราชีพจร', value:'pulse_rate' },
        { text:'อัตราการหายใจ', value:'respiratory_rate' },
        { text:'น้ำตาลในเลือด', value:'blood_sugar' },
      ],
      chartData:{ labels: [], datasets: [] },
      chartOptions:{ responsive:true, maintainAspectRatio:false }
    };
  },
  mounted(){
    this.patientId = this.$route.query.patientId || null;
    if(this.patientId){
      this.fetchPatientDetails(this.patientId);
      this.fetchDailyTrackingData();
    } else this.patientName='ไม่พบผู้ป่วย';
  },
  methods:{
    async fetchPatientDetails(id){
      try{
        const token = localStorage.getItem('userToken');
        const headers = token ? {'x-auth-token':token} : {};
        const res = await axios.get(`${import.meta.env.VITE_API_PATIENT}${id}`, { headers });
        this.patientName = res.data.name || res.data.patient?.name || 'ไม่พบชื่อผู้ป่วย';
      } catch(err){ console.error(err); this.patientName='ไม่พบผู้ป่วย'; }
    },
    async fetchDailyTrackingData(){
      this.loadingData=true;
      try{
        const token = localStorage.getItem('userToken');
        const headers = token ? {'x-auth-token':token} : {};
        const res = await axios.get(`${import.meta.env.VITE_API_TRACKING}/patient/${this.patientId}`, { headers });
        this.dailyTrackingData = Array.isArray(res.data) ? res.data : [];
        this.updateChart();
      } catch(err){
        console.error(err);
        this.dailyTrackingData=[];
      } finally{ this.loadingData=false; }
    },
    async addTrackingData(){
      const recordedAt = dayjs(`${this.datePicker} ${this.timePicker}`).format('YYYY-MM-DD HH:mm:ss');
      const payload = {...this.newTracking, patient_id:this.patientId, recorded_at:recordedAt};
      this.loading=true;
      try{
        const token = localStorage.getItem('userToken');
        const headers = token ? {'x-auth-token':token} : {};
        await axios.post(`${import.meta.env.VITE_API_TRACKING}`, payload, { headers });
        Swal.fire({ icon:'success', title:'บันทึกสำเร็จ', timer: 1500, showConfirmButton:false });
        this.resetNewTrackingForm();
        await this.fetchDailyTrackingData();
      } catch(err){ 
        console.error(err); 
        Swal.fire({ icon:'error', title:'บันทึกข้อมูลล้มเหลว' });
      } finally{ this.loading=false; }
    },
    resetNewTrackingForm(){
      this.newTracking={temperature:null, blood_pressure_systolic:null, blood_pressure_diastolic:null, pulse_rate:null, respiratory_rate:null, blood_sugar:null};
      this.datePicker=new Date().toISOString().substr(0,10);
      this.timePicker=new Date().toTimeString().substr(0,5);
      if(this.$refs.trackingForm && this.$refs.trackingForm.resetValidation) {
        this.$refs.trackingForm.resetValidation();
      }
    },
    updateChart(){
      const sorted = [...this.dailyTrackingData].sort((a,b)=>new Date(a.recorded_at)-new Date(b.recorded_at));
      const labels = sorted.map(d=>dayjs(d.recorded_at).format('DD/MM'));
      const datasets=[
        { label:'อุณหภูมิ', data:sorted.map(d=>d.temperature ?? null), borderColor:'red', fill:false },
        { label:'ความดันบน', data:sorted.map(d=>d.blood_pressure_systolic ?? null), borderColor:'blue', fill:false },
        { label:'ความดันล่าง', data:sorted.map(d=>d.blood_pressure_diastolic ?? null), borderColor:'green', fill:false },
        { label:'น้ำตาล', data:sorted.map(d=>d.blood_sugar ?? null), borderColor:'orange', fill:false },
      ];
      this.chartData = { labels, datasets };
    },
    formatDateTime(dateTimeString){
      if(!dateTimeString) return 'N/A';
      const date = new Date(dateTimeString);
      return date.toLocaleDateString('th-TH',{year:'numeric',month:'long',day:'numeric',hour:'2-digit',minute:'2-digit',hour12:false});
    },
    goToUserPage(){ this.$router.push('/profile'); },
    goToAddPatient(){ this.$router.push('/addpatient'); },
    goToPatientInfo(){ this.$router.push('/patientinfo'); },
    goToMapPage(){ this.$router.push('/map'); },
    goToAppointments(){
      if(this.patientId){
        this.$router.push({ path: '/appointments', query:{ patientId:this.patientId } });
      } else {
        this.$router.push('/appointments');
      }
    }
  }
};
</script>

<style scoped>
.v-application{background-color:#f5f7fa !important;}
.v-card{box-shadow:0 10px 30px rgba(0,0,0,.08) !important;}
</style>
