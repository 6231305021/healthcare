<template>
  <v-app>
    <v-app-bar app color="#3B5F6D" dark elevation="4">
      <v-app-bar-nav-icon @click="drawer = !drawer" class="d-md-none"></v-app-bar-nav-icon>
      <v-toolbar-title class="font-weight-bold">
        <v-icon left>mdi-account</v-icon>
        ข้อมูลส่วนตัว
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <div class="d-none d-md-flex">
        <v-btn text @click="logout">
          <v-icon left>mdi-logout</v-icon>
          ออกจากระบบ
        </v-btn>
        <v-btn text @click="goToAddPatient">
          <v-icon left>mdi-account-plus</v-icon>
          เพิ่มผู้ป่วยใหม่
        </v-btn>
        <v-btn text @click="goToPatientInfo">
          <v-icon left>mdi-account-multiple</v-icon>
          ข้อมูลผู้ป่วย
        </v-btn>
        <v-btn text @click="goToMap">
          <v-icon left>mdi-map-marker-multiple</v-icon>
          แผนที่ผู้ป่วย
        </v-btn>
      </div>
    </v-app-bar>

    <v-navigation-drawer v-model="drawer" app temporary>
      <v-list>
        <v-list-item @click="logout">
          <v-list-item-icon>
            <v-icon>mdi-logout</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>ออกจากระบบ</v-list-item-title>
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
            <v-icon>mdi-account-multiple</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>ข้อมูลผู้ป่วย</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item @click="goToMap">
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
      <v-container class="py-4">
        <v-card elevation="8" class="pa-4 rounded-lg">
          <v-card-title class="text-h6 font-weight-bold">
            ข้อมูลส่วนตัวของคุณ
          </v-card-title>
          <v-divider class="mb-4"></v-divider>
          <v-row>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="profile.firstName"
                label="ชื่อ"
                readonly
                outlined
                dense
              />
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="profile.lastName"
                label="นามสกุล"
                readonly
                outlined
                dense
              />
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="profile.email"
                label="อีเมล"
                readonly
                outlined
                dense
              />
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="profile.phone"
                label="เบอร์โทรศัพท์"
                readonly
                outlined
                dense
              />
            </v-col>
            <v-col cols="12">
              <v-textarea
                v-model="profile.location"
                label="ที่อยู่"
                readonly
                outlined
                dense
              />
            </v-col>
          </v-row>
        </v-card>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import axios from 'axios'
import Swal from 'sweetalert2'

export default {
  data() {
    return {
      drawer: false,
      profile: {
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        location: '',
      },
    }
  },
  mounted() {
    this.fetchProfile()
  },
  methods: {
    async fetchProfile() {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_USER}profile`, {
          withCredentials: true,
        })
        if (res.data) {
          this.profile = res.data
        }
      } catch (err) {
        console.error('Fetch profile error:', err.response?.data || err)
        Swal.fire('เกิดข้อผิดพลาด', 'ไม่สามารถดึงข้อมูลผู้ใช้ได้', 'error')
      }
    },
    logout() {
      Swal.fire({
        title: 'คุณแน่ใจหรือไม่?',
        text: 'คุณต้องการออกจากระบบใช่หรือไม่',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'ใช่, ออกจากระบบ',
        cancelButtonText: 'ยกเลิก',
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
      }).then((result) => {
        if (result.isConfirmed) {
          this.$router.push('/')
        }
      })
    },
    goToAddPatient() {
      this.$router.push('/addpatient')
    },
    goToPatientInfo() {
      this.$router.push('/patientinfo')
    },
    goToMap() {
      this.$router.push('/map')
    },
  },
}
</script>

<style scoped>
.v-card {
  background-color: #f5f5f5;
}

.v-card-title {
  color: #3b5f6d;
}

.v-text-field, .v-textarea {
  margin-bottom: 12px;
}
</style>
