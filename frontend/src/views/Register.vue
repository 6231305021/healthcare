<script>
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { showSuccessAlert, showErrorAlert } from '../utils/sweetAlert';
import * as API from '../api'; // <-- เรียกใช้ api.js

export default {
  data() {
    return {
      citizenId: '',
      firstName: '',
      lastName: '',
      phone: '',
      email: '',
      location: '',
      latitude: '',
      longitude: '',
      password: '',
      confirmPassword: '',
      showPassword: false,
      showConfirmPassword: false,
      valid: false,
      loading: false,
      map: null,
      marker: null,
      snackbar: { show: false, text: '', color: '' },
      rules: {
        required: v => !!v || 'กรุณากรอกข้อมูล',
        email: v => /.+@.+\..+/.test(v) || 'อีเมลไม่ถูกต้อง',
        phone: v => /^0\d{9}$/.test(v) || 'เบอร์ไม่ถูกต้อง',
        citizenId: v => /^\d{13}$/.test(v) || 'ต้องมี 13 หลัก',
        min: v => v.length >= 6 || 'รหัสผ่านอย่างน้อย 6 ตัวอักษร',
        match: v => v === this.password || 'รหัสผ่านไม่ตรงกัน',
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

      this.latitude = 13.736717;
      this.longitude = 100.523186;
    },

    goToCurrentLocation() {
      if (!navigator.geolocation) {
        this.showSnackbar('เบราว์เซอร์ของคุณไม่รองรับ Geolocation', 'error');
        return;
      }
      this.showSnackbar('กำลังค้นหาตำแหน่งปัจจุบัน...', 'info');

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;

          this.map.setView([lat, lng], 16);
          this.marker.setLatLng([lat, lng]);

          this.latitude = lat.toFixed(6);
          this.longitude = lng.toFixed(6);

          this.showSnackbar('พบตำแหน่งปัจจุบันแล้ว', 'success');
        },
        (error) => {
          const messages = {
            1: 'ปฏิเสธการเข้าถึงตำแหน่ง',
            2: 'ไม่สามารถระบุตำแหน่งได้',
            3: 'หมดเวลาการค้นหาตำแหน่ง',
          };
          this.showSnackbar(messages[error.code] || 'เกิดข้อผิดพลาดในการค้นหาตำแหน่ง', 'error');
        },
        { enableHighAccuracy: true, timeout: 10000 }
      );
    },

    async register() {
      const { valid } = await this.$refs.form.validate();
      if (!valid) {
        showErrorAlert('กรุณากรอกข้อมูลให้ครบและถูกต้อง');
        return;
      }

      this.loading = true;
      try {
        const payload = {
          citizenId: this.citizenId,
          firstName: this.firstName,
          lastName: this.lastName,
          phone: this.phone,
          email: this.email,
          location: this.location,
          latitude: this.latitude,
          longitude: this.longitude,
          password: this.password,
        };
        console.log('Register payload:', payload);

        const res = await API.createPatient(payload); // <-- เรียก api.js

        console.log('Register response:', res);

        if (res.message) {
          await showSuccessAlert(res.message);
          this.$router.push('/');
        } else {
          showErrorAlert('สมัครสมาชิกไม่สำเร็จ');
        }
      } catch (err) {
        console.error('Registration error:', err);
        showErrorAlert(err.message || 'เกิดข้อผิดพลาดในการสมัครสมาชิก');
      } finally {
        this.loading = false;
      }
    },

    showSnackbar(text, color) {
      this.snackbar.text = text;
      this.snackbar.color = color;
      this.snackbar.show = true;
    },
  },
};
</script>
