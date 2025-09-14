<script>
import Swal from 'sweetalert2';
import L from 'leaflet';
import axios from 'axios';
import 'leaflet/dist/leaflet.css';
import { showSuccessAlert, showErrorAlert, showWarningAlert } from '../utils/sweetAlert';

export default {
  data() {
    return {
      drawer: false,
      patients: [],
      users: [],
      allUsers: [],
      map: null,
      markers: [],
      searchQuery: '',
      selectedUserDetails: null,
      searching: false,
      snackbar: { show: false, text: '', color: '' },
    };
  },
  methods: {
    goToUserPage() { this.$router.push('/profile'); },
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
      }).then((result) => { if (result.isConfirmed) this.$router.push('/') });
    },
    goToAddPatient() { this.$router.push('/Addpatient'); },
    goToPatientInfo() { this.$router.push('/patientinfo'); },

    async fetchPatients() {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_BASE}/patients`);
        this.patients = Array.isArray(res.data) ? res.data : res.data.patients || [];
        this.mergeAllUsers();
        this.showAllUserLocations();
      } catch (error) {
        console.error(error);
        showErrorAlert('โหลดข้อมูลผู้ป่วยล้มเหลว');
      }
    },

    async fetchUsers() {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_BASE}/users`);
        this.users = res.data.users || [];
        this.mergeAllUsers();
        this.showAllUserLocations();
      } catch (error) {
        console.error(error);
        showErrorAlert('โหลดข้อมูลผู้ใช้ล้มเหลว');
      }
    },

    mergeAllUsers() {
      const formattedPatients = this.patients
        .filter(p => p.latitude && p.longitude)
        .map(p => ({
          id: p.id,
          first_name: p.name,
          last_name: '',
          address: `${p.address_detail || ''}, ${p.subdistrict || ''}, ${p.district || ''}, ${p.province || ''}`.replace(/(,\s?)+$/, ''),
          latitude: p.latitude,
          longitude: p.longitude,
          isPatient: true,
          image_path: p.image_path,
          community_health_worker: p.community_health_worker
        }));
      this.allUsers = [...this.users, ...formattedPatients];
    },

    handleSearch() {
      if (!this.searchQuery.trim()) {
        showWarningAlert('กรุณากรอกข้อมูลที่ต้องการค้นหา');
        return;
      }
      this.searching = true;
      const query = this.searchQuery.trim().toLowerCase();
      const foundUser = this.allUsers.find(user => {
        const fullName = `${user.first_name || ''} ${user.last_name || ''}`.toLowerCase();
        const citizenId = user.citizen_id ? user.citizen_id.toString() : '';
        return fullName.includes(query) || citizenId === query;
      });

      if (foundUser && foundUser.latitude && foundUser.longitude) {
        this.selectedUserDetails = foundUser;
        this.map.setView([foundUser.latitude, foundUser.longitude], 15);
        this.markers.forEach(marker => { if (marker.user?.id === foundUser.id) marker.openPopup(); });
        showSuccessAlert('พบข้อมูลผู้ใช้');
      } else {
        this.selectedUserDetails = null;
        showWarningAlert('ไม่พบข้อมูลผู้ใช้');
      }
      this.searching = false;
    },

    showAllUserLocations() {
      this.markers.forEach(marker => marker.remove());
      this.markers = [];

      this.allUsers.forEach(user => {
        if (user.latitude && user.longitude) {
          const icon = user.isPatient && user.image_path
            ? L.icon({
                iconUrl: `${import.meta.env.VITE_API_BASE}/${user.image_path}`,
                iconSize: [50, 50], iconAnchor: [25, 25], popupAnchor: [0, -25], className: 'patient-marker'
              })
            : L.icon({
                iconUrl: 'https://cdn-icons-png.flaticon.com/512/149/149071.png',
                iconSize: [40, 40], iconAnchor: [20, 20], popupAnchor: [0, -20], className: 'default-marker'
              });

          const marker = L.marker([user.latitude, user.longitude], { icon });
          const popupContent = `
            <div class="popup-content">
              <h3>${user.first_name} ${user.last_name}</h3>
              ${user.isPatient && user.image_path ? `<img src="${import.meta.env.VITE_API_BASE}/${user.image_path}" alt="รูปผู้ป่วย">` : ''}
              <p><strong>ที่อยู่:</strong> ${user.address}</p>
              ${user.isPatient && user.community_health_worker ? `<p><strong>อสม.ที่รับผิดชอบ:</strong> ${user.community_health_worker}</p>` : ''}
            </div>
          `;
          marker.bindPopup(popupContent);
          marker.addTo(this.map);
          marker.user = user;
          this.markers.push(marker);
        }
      });
    },

    initMap() {
      this.map = L.map('map', { center: [15.8700, 100.9925], zoom: 6, zoomControl: true });
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '&copy; OpenStreetMap contributors', maxZoom: 19 }).addTo(this.map);
    },

    showSnackbar(text, color) {
      this.snackbar.text = text;
      this.snackbar.color = color;
      this.snackbar.show = true;
    }
  },

  mounted() {
    this.initMap();
    this.fetchUsers();
    this.fetchPatients();

    const lat = parseFloat(this.$route.query.lat);
    const lng = parseFloat(this.$route.query.lng);
    const name = this.$route.query.name || '';

    if (!isNaN(lat) && !isNaN(lng)) {
      this.map.setView([lat, lng], 15);
      L.marker([lat, lng])
        .addTo(this.map)
        .bindPopup(`<b>${name}</b>`)
        .openPopup();
    }
  }
};
</script>
