<template>
  <v-app>
    <!-- App Bar -->
    <v-app-bar app color="#3B5F6D" dark elevation="4">
      <v-app-bar-nav-icon @click="drawer = !drawer" class="d-md-none"></v-app-bar-nav-icon>
      <v-toolbar-title class="font-weight-bold">
        <v-icon left>mdi-account</v-icon>
        ข้อมูลส่วนตัว
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <!-- Desktop Buttons -->
      <div class="d-none d-md-flex">
        <v-btn text @click="logout" class="hover-btn">
          <v-icon left>mdi-logout</v-icon>
          ออกจากระบบ
        </v-btn>
        <v-btn text @click="$router.push('/addpatient')" class="hover-btn">
          <v-icon left>mdi-account-plus</v-icon>
          เพิ่มผู้ป่วยใหม่
        </v-btn>
        <v-btn text @click="$router.push('/patientinfo')" class="hover-btn">
          <v-icon left>mdi-account-multiple</v-icon>
          ข้อมูลผู้ป่วย
        </v-btn>
        <v-btn text @click="$router.push('/map')" class="hover-btn">
          <v-icon left>mdi-map-marker-multiple</v-icon>
          แผนที่ผู้ป่วย
        </v-btn>
      </div>
    </v-app-bar>

    <!-- Navigation Drawer -->
    <v-navigation-drawer v-model="drawer" app temporary>
      <v-list dense>
        <v-list-item @click="logout" class="hover-drawer">
          <v-list-item-icon><v-icon>mdi-logout</v-icon></v-list-item-icon>
          <v-list-item-content><v-list-item-title>ออกจากระบบ</v-list-item-title></v-list-item-content>
        </v-list-item>
        <v-list-item @click="$router.push('/addpatient')" class="hover-drawer">
          <v-list-item-icon><v-icon>mdi-account-plus</v-icon></v-list-item-icon>
          <v-list-item-content><v-list-item-title>เพิ่มผู้ป่วยใหม่</v-list-item-title></v-list-item-content>
        </v-list-item>
        <v-list-item @click="$router.push('/patientinfo')" class="hover-drawer">
          <v-list-item-icon><v-icon>mdi-account-multiple</v-icon></v-list-item-icon>
          <v-list-item-content><v-list-item-title>ข้อมูลผู้ป่วย</v-list-item-title></v-list-item-content>
        </v-list-item>
        <v-list-item @click="$router.push('/map')" class="hover-drawer">
          <v-list-item-icon><v-icon>mdi-map-marker-multiple</v-icon></v-list-item-icon>
          <v-list-item-content><v-list-item-title>แผนที่ผู้ป่วย</v-list-item-title></v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <!-- Main Content -->
    <v-main>
      <v-container fluid>
        <v-row justify="center">
          <v-col cols="12" md="8">
            <v-card elevation="4" class="pa-4 profile-card">
              <v-card-title class="font-weight-bold">
                <v-icon left>mdi-account-circle</v-icon>
                ข้อมูลส่วนตัวของคุณ
              </v-card-title>
              <v-card-text v-if="user">
                <div><strong>ชื่อ:</strong> {{ user.first_name }} {{ user.last_name }}</div>
                <div><strong>อีเมล:</strong> {{ user.email }}</div>
                <div><strong>เบอร์โทร:</strong> {{ user.phone }}</div>
                <v-divider class="my-2"></v-divider>
                <v-btn color="primary" @click="$router.push('/profile')" class="hover-btn">แก้ไขข้อมูล</v-btn>
              </v-card-text>
              <v-card-text v-else>
                กำลังโหลดข้อมูล...
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import axios from 'axios';
import { showErrorAlert, showSuccessAlert } from '../utils/sweetAlert';

export default {
  data() {
    return {
      drawer: false,
      user: null,
    };
  },
  mounted() {
    const userId = localStorage.getItem('userId');
    if (userId) this.fetchUser(userId);
    else this.$router.push('/');
  },
  methods: {
    async fetchUser(userId) {
      try {
        const res = await axios.get(`https://healthcare-production-1567.up.railway.app/auth/users/${userId}`);
        if (res.data?.user) this.user = res.data.user;
        else showErrorAlert('ไม่พบข้อมูลผู้ใช้งาน');
      } catch (err) {
        console.error(err);
        showErrorAlert('เกิดข้อผิดพลาดในการโหลดข้อมูลผู้ใช้งาน');
      }
    },
    logout() {
      localStorage.removeItem('userId');
      showSuccessAlert('ออกจากระบบเรียบร้อย').then(() => this.$router.push('/'));
    }
  }
};
</script>

<style scoped>
.profile-card {
  transition: all 0.3s ease;
  border-radius: 8px;
}
.profile-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
}

.hover-btn {
  transition: all 0.2s ease;
}
.hover-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 3px 8px rgba(0,0,0,0.1);
}

.hover-drawer {
  transition: all 0.2s ease;
}
.hover-drawer:hover {
  background: rgba(59, 95, 109, 0.1);
}
</style>
