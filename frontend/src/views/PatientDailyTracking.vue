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
        <v-btn text @click="goToUserPage"><v-icon start>mdi-account</v-icon>ข้อมูลส่วนตัว</v-btn>
        <v-btn text @click="goToAddPatient"><v-icon start>mdi-account-plus</v-icon>เพิ่มผู้ป่วยใหม่</v-btn>
        <v-btn text @click="goToPatientInfo"><v-icon start>mdi-account-group</v-icon>ข้อมูลผู้ป่วย</v-btn>
        <v-btn text @click="goToMapPage"><v-icon start>mdi-map-marker-multiple</v-icon>แผนที่ผู้ป่วย</v-btn>
      </div>
    </v-app-bar>

    <v-navigation-drawer v-model="drawer" app temporary>
      <v-list>
        <v-list-item @click="goToUserPage">
          <template v-slot:prepend>
            <v-icon>mdi-account</v-icon>
          </template>
          <v-list-item-title>ข้อมูลส่วนตัว</v-list-item-title>
        </v-list-item>
        <v-list-item @click="goToAddPatient">
          <template v-slot:prepend>
            <v-icon>mdi-account-plus</v-icon>
          </template>
          <v-list-item-title>เพิ่มผู้ป่วยใหม่</v-list-item-title>
        </v-list-item>
        <v-list-item @click="goToPatientInfo">
          <template v-slot:prepend>
            <v-icon>mdi-account-group</v-icon>
          </template>
          <v-list-item-title>ข้อมูลผู้ป่วย</v-list-item-title>
        </v-list-item>
        <v-list-item @click="goToMapPage">
          <template v-slot:prepend>
            <v-icon>mdi-map-marker-multiple</v-icon>
          </template>
          <v-list-item-title>แผนที่ผู้ป่วย</v-list-item-title>
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
                  <v-text-field v-model.number="newTracking.temperature" label="อุณหภูมิ (°C)" type="number" step="0.01" prepend-icon="mdi-thermometer"
                    :rules="[value => (value === null || value === '') || (value >= 30 && value <= 45) || 'กรุณากรอกอุณหภูมิที่ถูกต้อง (30-45°C)']"/>
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
                    <template v-slot:activator="{ props }">
                      <v-text-field v-model="datePicker" label="วันที่บันทึก" prepend-icon="mdi-calendar" readonly v-bind="props"/>
                    </template>
                    <v-date-picker v-model="datePicker" locale="th" scrollable no-title @update:model-value="dateMenu=false"/>
                  </v-menu>
                </v-col>

                <v-col cols="12" sm="6" md="6">
                   <v-menu v-model="timeMenu" :close-on-content-click="false" transition="scale-transition" offset-y min-width="290px">
                    <template v-slot:activator="{ props }">
                      <v-text-field v-model="timePicker" label="เวลาบันทึก" prepend-icon="mdi-clock" readonly v-bind="props"/>
                    </template>
                    <v-time-picker v-model="timePicker" format="24hr" @update:model-value="timeMenu=false"/>
                  </v-menu>
                </v-col>
              </v-row>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer/>
            <v-btn color="indigo" dark @click="goToAppointments">
              <v-icon start>mdi-calendar-plus</v-icon>เพิ่มการนัดหมาย
            </v-btn>
            <v-btn color="#3B5F6D" dark @click="addTrackingData" :loading="loading" :disabled="!valid">
              <v-icon start>mdi-plus</v-icon>เพิ่มข้อมูล
            </v-btn>
          </v-card-actions>
        </v-card>

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

        <v-row class="mt-6">
          <v-col cols="12" md="6">
            <v-card class="pa-5">
              <v-card-title class="text-h6">กราฟอุณหภูมิ (°C)</v-card-title>
              <!-- บรรทัด 361: ที่เกิด error ใน console -->
              <line-chart :chart-data="chartData.temperature" :chart-options="chartOptions.temperature" />
            </v-card>
          </v-col>
          <v-col cols="12" md="6">
            <v-card class="pa-5">
              <v-card-title class="text-h6">กราฟความดันโลหิต (mmHg)</v-card-title>
              <line-chart :chart-data="chartData.bloodPressure" :chart-options="chartOptions.bloodPressure" />
            </v-card>
          </v-col>
          <v-col cols="12" md="4">
            <v-card class="pa-5">
              <v-card-title class="text-h6">กราฟอัตราชีพจร (ครั้ง/นาที)</v-card-title>
              <line-chart :chart-data="chartData.pulseRate" :chart-options="chartOptions.pulseRate" />
            </v-card>
          </v-col>
          <v-col cols="12" md="4">
            <v-card class="pa-5">
              <v-card-title class="text-h6">กราฟอัตราการหายใจ (ครั้ง/นาที)</v-card-title>
              <line-chart :chart-data="chartData.respiratoryRate" :chart-options="chartOptions.respiratoryRate" />
            </v-card>
          </v-col>
          <v-col cols="12" md="4">
            <v-card class="pa-5">
              <v-card-title class="text-h6">กราฟระดับน้ำตาลในเลือด (mg/dL)</v-card-title>
              <line-chart :chart-data="chartData.bloodSugar" :chart-options="chartOptions.bloodSugar" />
            </v-card>
          </v-col>
        </v-row>
        
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import axios from 'axios';
import Swal from 'sweetalert2';
import dayjs from 'dayjs';
import buddhistEra from 'dayjs/plugin/buddhistEra';
import 'dayjs/locale/th'; 
import { ref, onMounted, watch, defineComponent } from 'vue';
// ตรวจสอบให้แน่ใจว่า Chart.js ถูกนำเข้าอย่างครบถ้วน
import { Chart, LineController, LineElement, PointElement, LinearScale, CategoryScale, Title, Tooltip, Legend } from 'chart.js';

dayjs.extend(buddhistEra);
dayjs.locale('th');

Chart.register(LineController, LineElement, PointElement, LinearScale, CategoryScale, Title, Tooltip, Legend);

/**
 * คอมโพเนนต์ LineChart ที่ใช้ Chart.js (Composition API)
 */
const LineChart = defineComponent({
  props: {
    chartData: {
      type: Object,
      required: true
    },
    chartOptions: {
      type: Object,
      required: true
    }
  },
  setup(props){
    const chartRef = ref(null);
    let chartInstance = null;

    const renderChart = () => {
      if (!chartRef.value) return;
      const ctx = chartRef.value.getContext('2d');
      
      // ทำลายอินสแตนซ์เก่าก่อนสร้างใหม่เสมอ
      if (chartInstance) {
        chartInstance.destroy(); 
        chartInstance = null; 
      }
      
      // ตรวจสอบว่ามีข้อมูลหรือไม่ ก่อนสร้างกราฟ (ป้องกันการสร้างกราฟเปล่า)
      const hasData = props.chartData && 
                      props.chartData.datasets && 
                      props.chartData.datasets.length > 0 && 
                      props.chartData.datasets.some(d => d.data && d.data.length > 0);

      if (hasData) {
        chartInstance = new Chart(ctx, {
          type: 'line',
          data: props.chartData,
          options: props.chartOptions
        });
      }
    };

    onMounted(() => renderChart());
    
    // **✅ การแก้ไข:** ลบ { deep: true } เพื่อป้องกันวงวนการอัปเดตแบบวนซ้ำ
    // เราจะเฝ้าดูแค่การเปลี่ยน Reference ของ Object เท่านั้น (ซึ่งเพียงพอเพราะ Parent Component สร้าง Object ใหม่)
    watch(() => props.chartData, () => renderChart()); 
    watch(() => props.chartOptions, () => renderChart());
    
    // ส่งคืน chartRef เพื่อให้ template ใช้ได้
    return { chartRef };
  },
  // โค้ด HTML สำหรับ LineChart
  template: `<canvas ref="chartRef" style="width:100%;max-height:300px"></canvas>` 
});


export default {
  name: 'PatientDailyTracking',
  components: { LineChart },
  data(){
    const defaultChartOptions = {
        responsive:true, 
        maintainAspectRatio:false, 
        plugins: { legend: { display: true } },
        scales: { 
          // เปลี่ยน 'x' เป็น 'xAxis' ใน Chart.js V3+
            xAxis: { display: true, title: { display: true, text: 'วันที่/เวลา' } },
            y: { display: true, title: { display: true, text: 'ค่า' }, beginAtZero: false }
        }
    };

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
        { title:'วันที่/เวลา', value:'recorded_at' }, // Vuetify 3 ใช้ 'title' แทน 'text'
        { title:'อุณหภูมิ (°C)', value:'temperature' },
        { title:'ความดัน (บน/ล่าง)', value:'blood_pressure' }, 
        { title:'อัตราชีพจร', value:'pulse_rate' },
        { title:'อัตราการหายใจ', value:'respiratory_rate' },
        { title:'น้ำตาลในเลือด', value:'blood_sugar' },
      ],
      chartData:{ 
        temperature: { labels: [], datasets: [] },
        bloodPressure: { labels: [], datasets: [] },
        pulseRate: { labels: [], datasets: [] },
        respiratoryRate: { labels: [], datasets: [] },
        bloodSugar: { labels: [], datasets: [] },
      },
      chartOptions:{ 
          // อุณหภูมิ: ไม่เริ่มจาก 0
          temperature: { 
              ...defaultChartOptions, 
              scales: { 
                  ...defaultChartOptions.scales, 
                  y: { ...defaultChartOptions.scales.y, beginAtZero: false, title: { display: true, text: 'อุณหภูมิ (°C)' } } 
              } 
          },
          // อื่นๆ: เริ่มจาก 0
          bloodPressure: { 
              ...defaultChartOptions, 
              scales: { 
                  ...defaultChartOptions.scales, 
                  y: { ...defaultChartOptions.scales.y, beginAtZero: true, title: { display: true, text: 'ความดันโลหิต (mmHg)' } } 
              } 
          },
          pulseRate: { 
              ...defaultChartOptions, 
              scales: { 
                  ...defaultChartOptions.scales, 
                  y: { ...defaultChartOptions.scales.y, beginAtZero: true, title: { display: true, text: 'อัตราชีพจร (ครั้ง/นาที)' } } 
              } 
          },
          respiratoryRate: { 
              ...defaultChartOptions, 
              scales: { 
                  ...defaultChartOptions.scales, 
                  y: { ...defaultChartOptions.scales.y, beginAtZero: true, title: { display: true, text: 'อัตราการหายใจ (ครั้ง/นาที)' } } 
              } 
          },
          bloodSugar: { 
              ...defaultChartOptions, 
              scales: { 
                  ...defaultChartOptions.scales, 
                  y: { ...defaultChartOptions.scales.y, beginAtZero: true, title: { display: true, text: 'ระดับน้ำตาลในเลือด (mg/dL)' } } 
              } 
          },
      }
    };
  },
  mounted(){
    this.$nextTick(() => {
      this.patientId = this.$route.query.patientId || null; 
      if(this.patientId){
        this.fetchPatientDetails(this.patientId);
        this.fetchDailyTrackingData();
      } else {
        this.patientName='ไม่พบผู้ป่วย';
      }
    });
  },
  methods:{
    /**
     * ดึงข้อมูลผู้ป่วยเพื่อแสดงชื่อ
     */
    async fetchPatientDetails(id){
      try{
        const token = localStorage.getItem('userToken');
        const headers = token ? {'x-auth-token':token} : {};
        // สมมติว่า VITE_API_PATIENT เป็น URL พื้นฐานสำหรับดึงข้อมูลผู้ป่วย
        const res = await axios.get(`${import.meta.env.VITE_API_PATIENT}/${id}`, { headers }); 
        this.patientName = res.data.name || res.data.patient?.name || 'ไม่พบชื่อผู้ป่วย';
      } catch(err){ console.error(err); this.patientName='ไม่พบผู้ป่วย'; }
    },
    /**
     * ดึงข้อมูลการติดตามสุขภาพประจำวัน
     */
    async fetchDailyTrackingData(){
      this.loadingData=true;
      try{
        const token = localStorage.getItem('userToken');
        const headers = token ? {'x-auth-token':token} : {};
        // สมมติว่า VITE_API_TRACKING เป็น URL พื้นฐานสำหรับดึงข้อมูลการติดตาม
        const res = await axios.get(`${import.meta.env.VITE_API_TRACKING}/patient/${this.patientId}`, { headers });
        this.dailyTrackingData = Array.isArray(res.data) ? res.data : []; 
        this.updateChart(); 
      } catch(err){
        console.error(err);
        this.dailyTrackingData=[];
        this.updateChart(); 
      } finally{ this.loadingData=false; }
    },
    /**
     * เพิ่มข้อมูลการติดตามสุขภาพใหม่
     */
    async addTrackingData(){
      // ตรวจสอบความถูกต้องของฟอร์มก่อน
      if (!this.$refs.trackingForm.validate()) return;

      const recordedAt = dayjs(`${this.datePicker} ${this.timePicker}`).format('YYYY-MM-DD HH:mm:ss');
      // กรองค่าที่เป็น null หรือสตริงว่างออกก่อนส่ง
      const payload = { 
          ...Object.fromEntries(Object.entries(this.newTracking).filter(([_, v]) => v !== null && v !== '')),
          patient_id:this.patientId, 
          recorded_at:recordedAt
      };
      
      // ตรวจสอบว่ามีข้อมูลอย่างน้อยหนึ่งค่าที่กรอกหรือไม่ (ยกเว้น patient_id และ recorded_at)
      if (Object.keys(payload).length <= 2) { 
          Swal.fire({ icon:'warning', title:'กรุณากรอกข้อมูลสุขภาพอย่างน้อยหนึ่งรายการ' });
          return;
      }

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
        Swal.fire({ icon:'error', title:'บันทึกข้อมูลล้มเหลว', text: err.response?.data?.message || err.message });
      } finally{ this.loading=false; }
    },
    /**
     * รีเซ็ตฟอร์มบันทึกข้อมูลใหม่
     */
    resetNewTrackingForm(){
      this.newTracking={temperature:null, blood_pressure_systolic:null, blood_pressure_diastolic:null, pulse_rate:null, respiratory_rate:null, blood_sugar:null};
      this.datePicker=new Date().toISOString().substr(0,10);
      this.timePicker=new Date().toTimeString().substr(0,5);
      if(this.$refs.trackingForm && this.$refs.trackingForm.resetValidation) {
        this.$refs.trackingForm.resetValidation();
      }
    },
    /**
     * เตรียมและอัปเดตข้อมูลสำหรับกราฟแต่ละตัว
     */
    updateChart(){
      // เรียงข้อมูลตามเวลาบันทึกจากเก่าไปใหม่
      const sorted = [...this.dailyTrackingData].sort((a,b)=>dayjs(a.recorded_at).valueOf()-dayjs(b.recorded_at).valueOf());
      
      // ใช้รูปแบบ 'DD/MM BB HH:mm' พร้อมปีพุทธศักราช
      const labels = sorted.map(d=>dayjs(d.recorded_at).format('DD/MM BB HH:mm')); 
      
      // 1. กราฟอุณหภูมิ
      this.chartData.temperature = {
        labels: labels,
        datasets: [{ 
          label:'อุณหภูมิ (°C)', 
          // ใช้ d.temperature ?? null เพื่อให้กราฟสามารถข้ามจุดข้อมูลที่ขาดหายได้
          data:sorted.map(d=>d.temperature ?? null), 
          borderColor:'#dc3545', 
          backgroundColor:'rgba(220, 53, 69, 0.2)',
          fill:false, 
          tension:0.1,
          pointRadius: 5,
        }]
      };

      // 2. กราฟความดันโลหิต
      this.chartData.bloodPressure = {
        labels: labels,
        datasets: [
          { 
            label:'ความดันบน (Systolic)', 
            data:sorted.map(d=>d.blood_pressure_systolic ?? null), 
            borderColor:'#007bff', 
            backgroundColor:'rgba(0, 123, 255, 0.2)',
            fill:false, 
            tension:0.1,
            pointRadius: 5,
          },
          { 
            label:'ความดันล่าง (Diastolic)', 
            data:sorted.map(d=>d.blood_pressure_diastolic ?? null), 
            borderColor:'#28a745', 
            backgroundColor:'rgba(40, 167, 69, 0.2)',
            fill:false, 
            tension:0.1,
            pointRadius: 5,
          }
        ]
      };
      
      // 3. กราฟอัตราชีพจร
      this.chartData.pulseRate = {
        labels: labels,
        datasets: [{ 
          label:'อัตราชีพจร (ครั้ง/นาที)', 
          data:sorted.map(d=>d.pulse_rate ?? null), 
          borderColor:'#6f42c1', 
          backgroundColor:'rgba(111, 66, 193, 0.2)',
          fill:false, 
          tension:0.1,
          pointRadius: 5,
        }]
      };

      // 4. กราฟอัตราการหายใจ
      this.chartData.respiratoryRate = {
        labels: labels,
        datasets: [{ 
          label:'อัตราการหายใจ (ครั้ง/นาที)', 
          data:sorted.map(d=>d.respiratory_rate ?? null), 
          borderColor:'#fd7e14', 
          backgroundColor:'rgba(253, 126, 20, 0.2)',
          fill:false, 
          tension:0.1,
          pointRadius: 5,
        }]
      };

      // 5. กราฟระดับน้ำตาลในเลือด
      this.chartData.bloodSugar = {
        labels: labels,
        datasets: [{ 
          label:'น้ำตาลในเลือด (mg/dL)', 
          data:sorted.map(d=>d.blood_sugar ?? null), 
          borderColor:'#ffc107', 
          backgroundColor:'rgba(255, 193, 7, 0.2)',
          fill:false, 
          tension:0.1,
          pointRadius: 5,
        }]
      };
    },
    /**
     * จัดรูปแบบวันที่/เวลาแสดงในตาราง (ปีพุทธศักราช)
     */
    formatDateTime(dateTimeString){
      if(!dateTimeString) return 'N/A';
      return dayjs(dateTimeString).format('D MMM BB HH:mm น.'); 
    },
    // การนำทาง
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
/* กำหนดความสูงสูงสุดของกราฟเพื่อความสวยงาม */
canvas {
  max-height: 300px;
}
</style>
