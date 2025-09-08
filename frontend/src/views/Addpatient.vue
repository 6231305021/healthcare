<template>
  <!-- template เดิมของคุณ ไม่ต้องแก้ -->
</template>

<script>
import Swal from 'sweetalert2'
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import axios from 'axios';
import { showSuccessAlert, showErrorAlert, showWarningAlert } from '../utils/sweetAlert';

// ✅ ดึง Base URL จาก .env
const API_PATIENT = import.meta.env.VITE_API_PATIENT || "http://localhost:8080/patient";

export default {
  data() {
    return {
      drawer: false,
      subdistrict: '',
      address_detail: '',
      name: '',
      age: '',
      gender: null,
      race: '',
      nationality: '',
      occupation: '',
      community_health_worker: '',
      illness_info: '',
      province: '',
      district: '',
      latitude: '',
      longitude: '',
      valid: false,
      loading: false,
      map: null,
      marker: null,
      genderOptions: ['ชาย', 'หญิง', 'อื่นๆ'],
      patientImage: null,
      imagePreview: null,
      snackbar: {
        show: false,
        text: '',
        color: '',
      },
      rules: {
        required: v => !!v || 'กรุณากรอกข้อมูล',
        number: v => /^\d+$/.test(v) || 'กรุณากรอกตัวเลขเท่านั้น',
        image: v => !v || v.size < 5000000 || 'ขนาดรูปภาพต้องไม่เกิน 5MB',
      },
    };
  },
  mounted() {
    this.initMap();
  },
  methods: {
    initMap() {
      this.map = L.map('map').setView([13.736717, 100.523186], 6);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
      }).addTo(this.map);

      this.marker = L.marker([13.736717, 100.523186], { draggable: true }).addTo(this.map);
      this.latitude = 13.736717;
      this.longitude = 100.523186;

      this.marker.on('dragend', () => {
        const { lat, lng } = this.marker.getLatLng();
        this.latitude = lat.toFixed(6);
        this.longitude = lng.toFixed(6);
      });

      this.map.on('click', (e) => {
        const { lat, lng } = e.latlng;
        this.marker.setLatLng([lat, lng]);
        this.latitude = lat.toFixed(6);
        this.longitude = lng.toFixed(6);
      });
    },

    async searchLocation() {
      if (!this.province && !this.district) {
        showWarningAlert('กรุณากรอกจังหวัดหรืออำเภอเพื่อค้นหา');
        return;
      }
      const query = `${this.subdistrict} ${this.district} ${this.province}`;
      try {
        const res = await axios.get(`https://nominatim.openstreetmap.org/search`, {
          params: { q: query, format: 'json', addressdetails: 1, limit: 1 },
        });

        if (res.data.length > 0) {
          const { lat, lon } = res.data[0];
          this.map.setView([lat, lon], 14);
          this.marker.setLatLng([lat, lon]);
          this.latitude = parseFloat(lat).toFixed(6);
          this.longitude = parseFloat(lon).toFixed(6);
          showSuccessAlert(`พบพิกัดของ ${query}`);
        } else {
          showWarningAlert('ไม่พบพิกัดที่ระบุ');
        }
      } catch (error) {
        showErrorAlert('เกิดข้อผิดพลาดในการค้นหาพิกัด');
      }
    },

    previewImage(file) {
      if (!file) {
        this.imagePreview = null;
        return;
      }
      const reader = new FileReader();
      reader.onload = e => { this.imagePreview = e.target.result; };
      reader.readAsDataURL(file);
    },

    async addPatient() {
      if (!this.$refs.form.validate()) {
        showErrorAlert('กรุณากรอกข้อมูลให้ครบถ้วนและถูกต้อง');
        return;
      }

      this.loading = true;
      try {
        const formData = new FormData();
        formData.append('name', this.name);
        formData.append('age', this.age);
        formData.append('gender', this.gender);
        formData.append('race', this.race);
        formData.append('nationality', this.nationality);
        formData.append('occupation', this.occupation);
        formData.append('community_health_worker', this.community_health_worker);
        formData.append('illness_info', this.illness_info);
        formData.append('province', this.province);
        formData.append('district', this.district);
        formData.append('subdistrict', this.subdistrict);
        formData.append('address_detail', this.address_detail);
        formData.append('latitude', this.latitude);
        formData.append('longitude', this.longitude);
        if (this.patientImage) formData.append('patientImage', this.patientImage);

        // ✅ ส่งข้อมูลผู้ป่วยผ่าน async function
        const res = await axios.post(API_PATIENT, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });

        await showSuccessAlert(res.data.message);
        this.$router.push('/patientinfo');
      } catch (err) {
        const errorMessage = err.response?.data?.message || 'เกิดข้อผิดพลาดในการบันทึกข้อมูล';
        showErrorAlert(errorMessage);
      } finally {
        this.loading = false;
      }
    },

    goToHomePage() {
      Swal.fire({
        title: 'คุณแน่ใจหรือไม่?',
        text: 'คุณต้องการออกจากระบบใช่หรือไม่',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'ใช่, ออกจากระบบ',
        cancelButtonText: 'ยกเลิก',
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
      }).then(result => {
        if (result.isConfirmed) this.$router.push('/');
      });
    },
    goToUserPage() { this.$router.push('/profile'); },
    goToPatientInfo() { this.$router.push('/patientinfo'); },
    goToMap() { this.$router.push('/map'); },
  },
};
</script>

<style scoped>
/* style เดิมของคุณ */
</style>
