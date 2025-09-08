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
        <v-btn text @click="goToHomePage" class="hover-btn">
          <v-icon left>mdi-logout</v-icon>
          ออกจากระบบ
        </v-btn>
        <v-btn text @click="goToAddPatient" class="hover-btn">
          <v-icon left>mdi-account-plus</v-icon>
          เพิ่มผู้ป่วยใหม่
        </v-btn>
        <v-btn text @click="goToPatientInfo" class="hover-btn">
          <v-icon left>mdi-account-multiple</v-icon>
          ข้อมูลผู้ป่วย
        </v-btn>
        <v-btn text @click="goToMap" class="hover-btn">
          <v-icon left>mdi-map-marker-multiple</v-icon>
          แผนที่ผู้ป่วย
        </v-btn>
      </div>
    </v-app-bar>

    <!-- Navigation Drawer -->
    <v-navigation-drawer v-model="drawer" app temporary>
      <v-list dense>
        <v-list-item @click="goToHomePage" class="hover-drawer">
          <v-list-item-icon><v-icon>mdi-logout</v-icon></v-list-item-icon>
          <v-list-item-content><v-list-item-title>ออกจากระบบ</v-list-item-title></v-list-item-content>
        </v-list-item>
        <v-list-item @click="goToAddPatient" class="hover-drawer">
          <v-list-item-icon><v-icon>mdi-account-plus</v-icon></v-list-item-icon>
          <v-list-item-content><v-list-item-title>เพิ่มผู้ป่วยใหม่</v-list-item-title></v-list-item-content>
        </v-list-item>
        <v-list-item @click="goToPatientInfo" class="hover-drawer">
          <v-list-item-icon><v-icon>mdi-account-multiple</v-icon></v-list-item-icon>
          <v-list-item-content><v-list-item-title>ข้อมูลผู้ป่วย</v-list-item-title></v-list-item-content>
        </v-list-item>
        <v-list-item @click="goToMap" class="hover-drawer">
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
              <v-card-text>
                <!-- ตัวอย่างข้อมูลส่วนตัว -->
                <div><strong>ชื่อ:</strong> สมนึก</div>
                <div><strong>อีเมล:</strong> example@mail.com</div>
                <div><strong>เบอร์โทร:</strong> 0812345678</div>
                <v-divider class="my-2"></v-divider>
                <v-btn color="primary" @click="goToUserPage" class="hover-btn">แก้ไขข้อมูล</v-btn>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import Swal from 'sweetalert2'

export default {
  data() {
    return {
      drawer: false,
    }
  },
  methods: {
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
        if (result.isConfirmed) {
          this.$router.push('/')
        }
      })
    },
    goToAddPatient() { this.$router.push('/addpatient') },
    goToPatientInfo() { this.$router.push('/patientinfo') },
    goToMap() { this.$router.push('/map') },
    goToUserPage() { this.$router.push('/profile') },
  }
}
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

/* Responsive */
@media (max-width: 960px) {
  .v-toolbar__title { font-size: 1.1rem; }
  .v-btn { padding: 0 8px; font-size: 0.9rem; }
}

@media (max-width: 600px) {
  .v-toolbar__title { font-size: 1rem; }
  .v-btn { padding: 0 6px; font-size: 0.8rem; }
  .profile-card { padding: 12px; }
}
</style>
