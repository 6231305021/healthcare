<template>
  <v-app>
    <!-- App Bar -->
    <v-app-bar app color="#3B5F6D" dark>
      <v-app-bar-nav-icon @click="drawer = !drawer" class="d-md-none"></v-app-bar-nav-icon>
      <v-toolbar-title class="font-weight-bold">
        <v-icon left>mdi-calendar-edit</v-icon>
        การนัดหมายผู้ป่วย: {{ patientName }}
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
        <v-list-item @click="goToUserPage"><v-list-item-icon><v-icon>mdi-account</v-icon></v-list-item-icon><v-list-item-content><v-list-item-title>ข้อมูลส่วนตัว</v-list-item-title></v-list-item-content></v-list-item>
        <v-list-item @click="goToAddPatient"><v-list-item-icon><v-icon>mdi-account-plus</v-icon></v-list-item-icon><v-list-item-content><v-list-item-title>เพิ่มผู้ป่วยใหม่</v-list-item-title></v-list-item-content></v-list-item>
        <v-list-item @click="goToPatientInfo"><v-list-item-icon><v-icon>mdi-account-group</v-icon></v-list-item-icon><v-list-item-content><v-list-item-title>ข้อมูลผู้ป่วย</v-list-item-title></v-list-item-content></v-list-item>
        <v-list-item @click="goToMapPage"><v-list-item-icon><v-icon>mdi-map-marker-multiple</v-icon></v-list-item-icon><v-list-item-content><v-list-item-title>แผนที่ผู้ป่วย</v-list-item-title></v-list-item-content></v-list-item>
      </v-list>
    </v-navigation-drawer>

    <!-- Main Content -->
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
                      <v-text-field v-model="newAppointment.hn_number" label="หมายเลข HN" prepend-icon="mdi-identifier" :rules="[v => !!v || 'กรุณากรอกหมายเลข HN']" required/>
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-text-field v-model="newAppointment.rights" label="สิทธิการรักษา" prepend-icon="mdi-shield-account" :rules="[v => !!v || 'กรุณากรอกสิทธิการรักษา']" required/>
                    </v-col>

                    <v-col cols="12" sm="6" md="6">
                      <v-text-field v-model="datePicker" label="วันที่นัดหมาย" prepend-icon="mdi-calendar" :rules="[v => !!v || 'กรุณาใส่วันที่นัดหมาย']" required outlined dense type="date"/>
                    </v-col>

                    <v-col cols="12" sm="6" md="6">
                      <v-text-field v-model="timePicker" label="เวลานัดหมาย" prepend-icon="mdi-clock" :rules="[v => !!v || 'กรุณาใส่เวลานัดหมาย']" required outlined dense type="time"/>
                    </v-col>

                    <v-col cols="12" md="6">
                      <v-text-field v-model="newAppointment.reason" label="เหตุผลการนัดหมาย" prepend-icon="mdi-text-box-outline"/>
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-text-field v-model="newAppointment.appointed_by" label="แพทย์ผู้นัด / ผู้บันทึกนัด" prepend-icon="mdi-medical-bag"/>
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-text-field v-model="newAppointment.contact_location" label="สถานที่ติดต่อ" prepend-icon="mdi-map-marker-radius"/>
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-text-field v-model="newAppointment.diagnosis" label="วินิจฉัย" prepend-icon="mdi-stethoscope"/>
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-text-field v-model="newAppointment.other_details" label="รายละเอียดอื่นๆ (เช่น LAB/X-Ray)" prepend-icon="mdi-note-text-outline"/>
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-select v-model="newAppointment.status" :items="statusOptions" label="สถานะการนัดหมาย" prepend-icon="mdi-check-circle-outline" :rules="[v => !!v || 'กรุณาเลือกสถานะ']" required/>
                    </v-col>
                  </v-row>
                </v-form>
              </v-card-text>
              <v-card-actions>
                <v-spacer/>
                <v-btn color="#3B5F6D" dark @click="addAppointment" :loading="loading" :disabled="!valid">
                  <v-icon left>mdi-plus</v-icon>เพิ่มการนัดหมาย
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

        <!-- Appointment History Table -->
        <v-card class="mt-6 pa-5">
          <v-card-title class="text-h6 d-flex justify-space-between align-center">
            <span>ประวัติการนัดหมาย</span>
            <v-btn color="#3B5F6D" dark @click="openExportDialog" :disabled="appointmentHistory.length===0">
              <v-icon left>mdi-printer</v-icon>ส่งออกใบนัด
            </v-btn>
          </v-card-title>
          <v-data-table
            :headers="headers"
            :items="appointmentHistory"
            :loading="loadingData"
            class="elevation-1"
            item-key="id"
          >
            <template v-slot:item.appointment_datetime="{ item }">{{ formatDateTime(item.appointment_date,item.appointment_time) }}</template>
            <template v-slot:item.status="{ item }"><v-chip :color="getStatusColor(item.status)" dark>{{ item.status }}</v-chip></template>
            <template v-slot:item.actions="{ item }">
              <v-icon small class="mr-2" @click="openEditDialog(item)">mdi-pencil</v-icon>
              <v-icon small @click="deleteAppointment(item.id)">mdi-delete</v-icon>
            </template>
            <template v-slot:no-data>ไม่มีข้อมูลการนัดหมายสำหรับผู้ป่วยนี้</template>
          </v-data-table>
        </v-card>

        <!-- Export Dialog -->
        <v-dialog v-model="exportDialog" max-width="600px">
          <v-card>
            <v-card-title class="text-h6">เลือกนัดหมายที่ต้องการส่งออกใบนัด</v-card-title>
            <v-card-text>
              <v-select v-model="selectedAppointmentId" :items="appointmentHistory.map(a=>({title:`HN: ${a.hn_number||'-'} - วันที่: ${formatDate(a.appointment_date)}`, value:a.id}))" label="เลือกนัดหมาย" item-title="title" item-value="value" outlined/>
            </v-card-text>
            <v-card-actions>
              <v-spacer/>
              <v-btn text @click="exportDialog=false">ยกเลิก</v-btn>
              <v-btn color="#3B5F6D" dark @click="exportAppointmentPDF" :disabled="!selectedAppointmentId"><v-icon left>mdi-printer</v-icon>ส่งออก</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

        <!-- Edit Dialog -->
        <v-dialog v-model="editDialog" max-width="600px">
          <v-card>
            <v-card-title class="text-h6">แก้ไขการนัดหมาย</v-card-title>
            <v-card-text>
              <v-form ref="editAppointmentForm" v-model="editValid" lazy-validation>
                <v-row>
                  <v-col cols="12" md="6"><v-text-field v-model="editAppointment.hn_number" label="หมายเลข HN" prepend-icon="mdi-identifier" :rules="[v=>!!v||'กรุณากรอกหมายเลข HN']" required/></v-col>
                  <v-col cols="12" md="6"><v-text-field v-model="editAppointment.rights" label="สิทธิการรักษา" prepend-icon="mdi-shield-account" :rules="[v=>!!v||'กรุณากรอกสิทธิการรักษา']" required/></v-col>
                  <v-col cols="12" sm="6" md="6"><v-text-field v-model="editAppointment.appointment_date" label="วันที่นัดหมาย" prepend-icon="mdi-calendar" :rules="[v=>!!v||'กรุณาใส่วันที่นัดหมาย']" required outlined dense type="date"/></v-col>
                  <v-col cols="12" sm="6" md="6"><v-text-field v-model="editAppointment.appointment_time" label="เวลานัดหมาย" prepend-icon="mdi-clock" :rules="[v=>!!v||'กรุณาใส่เวลานัดหมาย']" required outlined dense type="time"/></v-col>
                  <v-col cols="12" md="6"><v-text-field v-model="editAppointment.reason" label="เหตุผลการนัดหมาย" prepend-icon="mdi-text-box-outline"/></v-col>
                  <v-col cols="12" md="6"><v-text-field v-model="editAppointment.appointed_by" label="แพทย์ผู้นัด / ผู้บันทึกนัด" prepend-icon="mdi-medical-bag"/></v-col>
                  <v-col cols="12" md="6"><v-text-field v-model="editAppointment.contact_location" label="สถานที่ติดต่อ" prepend-icon="mdi-map-marker-radius"/></v-col>
                  <v-col cols="12" md="6"><v-text-field v-model="editAppointment.diagnosis" label="วินิจฉัย" prepend-icon="mdi-stethoscope"/></v-col>
                  <v-col cols="12" md="6"><v-text-field v-model="editAppointment.other_details" label="รายละเอียดอื่นๆ (เช่น LAB/X-Ray)" prepend-icon="mdi-note-text-outline"/></v-col>
                  <v-col cols="12" md="6"><v-select v-model="editAppointment.status" :items="statusOptions" label="สถานะการนัดหมาย" prepend-icon="mdi-check-circle-outline" :rules="[v=>!!v||'กรุณาเลือกสถานะ']" required/></v-col>
                </v-row>
              </v-form>
            </v-card-text>
            <v-card-actions>
              <v-spacer/>
              <v-btn text @click="editDialog=false">ยกเลิก</v-btn>
              <v-btn color="#3B5F6D" dark @click="saveEditAppointment" :loading="editLoading" :disabled="!editValid"><v-icon left>mdi-content-save</v-icon>บันทึก</v-btn>
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
      drawer:false,
      patientName:'กำลังโหลด...',
      patientId:null,
      appointmentHistory:[],
      newAppointment:{
        hn_number:null,
        rights:null,
        reason:null,
        appointed_by:null,
        contact_location:null,
        other_details:null,
        diagnosis:null,
        status:'มาตามนัด'
      },
      datePicker:new Date().toISOString().substr(0,10),
      timePicker:new Date().toTimeString().substr(0,5),
      valid:false,
      loading:false,
      loadingData:false,
      statusOptions:['มาตามนัด','ไม่มาตามนัด','ส่งต่อรักษา','รอนัด'],
      headers:[
        { text:'วันที่/เวลา', value:'appointment_datetime' },
        { text:'HN', value:'hn_number' },
        { text:'สิทธิการรักษา', value:'rights' },
        { text:'เหตุผล', value:'reason' },
        { text:'แพทย์/ผู้บันทึก', value:'appointed_by' },
        { text:'สถานที่ติดต่อ', value:'contact_location' },
        { text:'วินิจฉัย', value:'diagnosis' },
        { text:'รายละเอียดอื่นๆ', value:'other_details' },
        { text:'สถานะ', value:'status' },
        { text:'Actions', value:'actions', sortable:false }
      ],
      chartInstance:null,
      chartColors:{ 'มาตามนัด':'#4CAF50','ไม่มาตามนัด':'#F44336','ส่งต่อรักษา':'#2196F3','รอนัด':'#FF9800' },
      exportDialog:false,
      selectedAppointmentId:null,
      editDialog:false,
      editAppointment:{},
      editValid:false,
      editLoading:false,
    };
  },
  mounted() {
    this.patientId = this.$route.query.patientId || null;
    if(this.patientId){ this.fetchPatientDetails(this.patientId); this.fetchAppointments(this.patientId); } else { this.patientName='ไม่พบผู้ป่วย'; }
  },
  watch:{
    '$route.query.patientId'(newId){
      this.patientId=newId||null;
      if(this.patientId){ this.fetchPatientDetails(this.patientId); this.fetchAppointments(this.patientId); } else { this.patientName='ไม่พบผู้ป่วย'; this.appointmentHistory=[]; if(this.chartInstance){this.chartInstance.destroy(); this.chartInstance=null;} }
    }
  },
  methods:{
    async fetchPatientDetails(id){
      try{
        const token=localStorage.getItem('userToken');
        const headers=token?{'x-auth-token':token}:{};
        const response=await axios.get(`https://healthcare-production-1567.up.railway.app/auth/${id}`,{headers});
        this.patientName=response.data.name||response.data.patient?.name||'ไม่พบชื่อผู้ป่วย';
      }catch(error){
        console.error(error);
        this.patientName='ไม่พบผู้ป่วย';
        await Swal.fire({title:'เกิดข้อผิดพลาด', text:'ไม่สามารถโหลดข้อมูลผู้ป่วยได้', icon:'error', confirmButtonColor:'#d33'});
        if(error.response?.status===401){ this.logout(); }
      }
    },
    async fetchAppointments(id){
      this.loadingData=true;
      try{
        const token=localStorage.getItem('userToken');
        const headers=token?{'x-auth-token':token}:{};
        const response=await axios.get(`https://healthcare-production-1567.up.railway.app/appointments?patientId=${id}`,{headers});
        this.appointmentHistory=response.data||[];
        this.renderChart();
      }catch(error){
        console.error(error);
        Swal.fire({title:'เกิดข้อผิดพลาด', text:'ไม่สามารถโหลดประวัติการนัดหมายได้', icon:'error', confirmButtonColor:'#d33'});
      }finally{ this.loadingData=false; }
    },
    formatDateTime(date,time){
      if(!date) return '-';
      return `${date} ${time||''}`;
    },
    formatDate(date){ return date||'-'; },
    getStatusColor(status){ return this.chartColors[status]||'#9E9E9E'; },
    renderChart(){
      if(this.chartInstance){ this.chartInstance.destroy(); this.chartInstance=null; }
      const statusCount={};
      this.appointmentHistory.forEach(a=>{ statusCount[a.status]=(statusCount[a.status]||0)+1; });
      const labels=Object.keys(statusCount);
      const data=labels.map(l=>statusCount[l]);
      const colors=labels.map(l=>this.chartColors[l]||'#9E9E9E');
      const ctx=document.getElementById('appointmentChart').getContext('2d');
      this.chartInstance=new Chart(ctx,{ type:'pie', data:{ labels,data, backgroundColor:colors }, options:{ responsive:true, plugins:{ legend:{ position:'bottom' } } } });
    },
    async addAppointment(){
      const isValid=this.$refs.appointmentForm.validate();
      if(!isValid) return;
      this.loading=true;
      try{
        const token=localStorage.getItem('userToken');
        const headers=token?{'x-auth-token':token}:{};
        const payload={ ...this.newAppointment, appointment_date:this.datePicker, appointment_time:this.timePicker, patientId:this.patientId };
        await axios.post('https://healthcare-production-1567.up.railway.app/appointments',payload,{headers});
        Swal.fire({title:'สำเร็จ', text:'เพิ่มการนัดหมายเรียบร้อย', icon:'success', confirmButtonColor:'#3085d6'});
        this.fetchAppointments(this.patientId);
        this.$refs.appointmentForm.reset();
      }catch(error){
        console.error(error);
        Swal.fire({title:'เกิดข้อผิดพลาด', text:'ไม่สามารถเพิ่มการนัดหมายได้', icon:'error', confirmButtonColor:'#d33'});
      }finally{ this.loading=false; }
    },
    openEditDialog(item){
      this.editAppointment={ ...item };
      this.editDialog=true;
    },
    async saveEditAppointment(){
      const isValid=this.$refs.editAppointmentForm.validate();
      if(!isValid) return;
      this.editLoading=true;
      try{
        const token=localStorage.getItem('userToken');
        const headers=token?{'x-auth-token':token}:{};
        await axios.put(`https://healthcare-production-1567.up.railway.app/appointments/${this.editAppointment.id}`,this.editAppointment,{headers});
        Swal.fire({title:'สำเร็จ', text:'แก้ไขการนัดหมายเรียบร้อย', icon:'success', confirmButtonColor:'#3085d6'});
        this.editDialog=false;
        this.fetchAppointments(this.patientId);
      }catch(error){
        console.error(error);
        Swal.fire({title:'เกิดข้อผิดพลาด', text:'ไม่สามารถแก้ไขการนัดหมายได้', icon:'error', confirmButtonColor:'#d33'});
      }finally{ this.editLoading=false; }
    },
    async deleteAppointment(id){
      const result=await Swal.fire({title:'ยืนยันลบ', text:'คุณต้องการลบการนัดหมายนี้หรือไม่?', icon:'warning', showCancelButton:true, confirmButtonColor:'#d33', cancelButtonColor:'#3085d6', confirmButtonText:'ลบ', cancelButtonText:'ยกเลิก'});
      if(result.isConfirmed){
        try{
          const token=localStorage.getItem('userToken');
          const headers=token?{'x-auth-token':token}:{};
          await axios.delete(`https://healthcare-production-1567.up.railway.app/appointments/${id}`,{headers});
          Swal.fire({title:'สำเร็จ', text:'ลบการนัดหมายเรียบร้อย', icon:'success', confirmButtonColor:'#3085d6'});
          this.fetchAppointments(this.patientId);
        }catch(error){
          console.error(error);
          Swal.fire({title:'เกิดข้อผิดพลาด', text:'ไม่สามารถลบการนัดหมายได้', icon:'error', confirmButtonColor:'#d33'});
        }
      }
    },
    openExportDialog(){ this.exportDialog=true; },
    async exportAppointmentPDF(){
      this.exportDialog=false;
      const appointment=this.appointmentHistory.find(a=>a.id===this.selectedAppointmentId);
      if(!appointment) return;
      const div=document.createElement('div');
      div.innerHTML=`
        <div style="padding:20px;font-family:sans-serif">
          <h2>ใบการนัดหมายผู้ป่วย</h2>
          <p><strong>HN:</strong> ${appointment.hn_number||'-'}</p>
          <p><strong>ชื่อผู้ป่วย:</strong> ${this.patientName}</p>
          <p><strong>วันที่/เวลา:</strong> ${appointment.appointment_date} ${appointment.appointment_time||''}</p>
          <p><strong>สิทธิการรักษา:</strong> ${appointment.rights||'-'}</p>
          <p><strong>เหตุผล:</strong> ${appointment.reason||'-'}</p>
          <p><strong>แพทย์/ผู้บันทึก:</strong> ${appointment.appointed_by||'-'}</p>
          <p><strong>สถานที่ติดต่อ:</strong> ${appointment.contact_location||'-'}</p>
          <p><strong>วินิจฉัย:</strong> ${appointment.diagnosis||'-'}</p>
          <p><strong>รายละเอียดอื่นๆ:</strong> ${appointment.other_details||'-'}</p>
          <p><strong>สถานะ:</strong> ${appointment.status||'-'}</p>
        </div>`;
      document.body.appendChild(div);
      const canvas=await html2canvas(div,{scale:2});
      const imgData=canvas.toDataURL('image/png');
      const pdf=new jsPDF();
      const imgProps=pdf.getImageProperties(imgData);
      const pdfWidth=pdf.internal.pageSize.getWidth();
      const pdfHeight=(imgProps.height * pdfWidth)/imgProps.width;
      pdf.addImage(imgData,'PNG',0,0,pdfWidth,pdfHeight);
      pdf.save(`Appointment-${appointment.hn_number||Date.now()}.pdf`);
      document.body.removeChild(div);
    },
    goToUserPage(){ this.$router.push('/user'); },
    goToAddPatient(){ this.$router.push('/add-patient'); },
    goToPatientInfo(){ this.$router.push('/patients'); },
    goToMapPage(){ this.$router.push('/map'); },
    logout(){ localStorage.removeItem('userToken'); this.$router.push('/login'); }
  }
};
</script>

<style scoped>
.v-data-table th{ background-color:#E0F7FA; }
.v-data-table .v-chip{ font-weight:bold; }
@media(max-width:960px){
  .v-card-title{ font-size:1rem; }
  .v-btn{ font-size:0.8rem; }
  .v-text-field input{ font-size:0.9rem; }
}
</style>
