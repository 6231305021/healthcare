<template>
  <v-app>
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
                <v-form ref="form" v-model="valid">
                  <v-text-field
                    v-model="user.first_name"
                    label="ชื่อ"
                    outlined
                    dense
                    :rules="[rules.required]"
                  />
                  <v-text-field
                    v-model="user.last_name"
                    label="นามสกุล"
                    outlined
                    dense
                    :rules="[rules.required]"
                  />
                  <v-text-field
                    v-model="user.phone"
                    label="เบอร์โทร"
                    outlined
                    dense
                    :rules="[rules.required, rules.phone]"
                  />
                  <v-text-field
                    v-model="user.email"
                    label="อีเมล"
                    outlined
                    dense
                    :rules="[rules.required, rules.email]"
                  />
                  <v-text-field
                    v-model="user.address"
                    label="ที่อยู่"
                    outlined
                    dense
                    :rules="[rules.required]"
                  />

                  <v-btn
                    color="primary"
                    class="mt-4"
                    :loading="loading"
                    @click="updateProfile"
                  >
                    <v-icon left>mdi-content-save</v-icon>
                    บันทึกข้อมูล
                  </v-btn>
                </v-form>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>

    <v-snackbar v-model="snackbar.show" :color="snackbar.color" top timeout="3000">
      {{ snackbar.text }}
      <template v-slot:action="{ attrs }">
        <v-btn text v-bind="attrs" @click="snackbar.show = false">ปิด</v-btn>
      </template>
    </v-snackbar>
  </v-app>
</template>

<script>
import { getUserById, updateUser } from '../api';
import { showSuccessAlert, showErrorAlert } from '../utils/sweetAlert';

export default {
  data() {
    return {
      user: { first_name:'', last_name:'', phone:'', email:'', address:'' },
      loading: false,
      valid: false,
      snackbar: { show: false, text: '', color: '' },
      rules: {
        required: v => !!v || 'กรุณากรอกข้อมูล',
        email: v => /.+@.+\..+/.test(v) || 'อีเมลไม่ถูกต้อง',
        phone: v => /^0\d{9}$/.test(v) || 'เบอร์โทรศัพท์ไม่ถูกต้อง',
      },
    };
  },
  async mounted() {
    await this.loadUser();
  },
  methods: {
    async loadUser() {
      try {
        const userId = localStorage.getItem('userId'); // สมมติเก็บ userId ไว้ตอน login
        const res = await getUserById(userId);
        this.user = res.data || {};
      } catch (err) {
        console.error(err);
        this.showSnackbar('ไม่สามารถโหลดข้อมูลผู้ใช้', 'error');
      }
    },
    async updateProfile() {
      if (!this.$refs.form.validate()) return;
      this.loading = true;
      try {
        const userId = localStorage.getItem('userId');
        await updateUser(userId, this.user);
        await showSuccessAlert('บันทึกข้อมูลสำเร็จ');
      } catch (err) {
        console.error(err);
        showErrorAlert(err.message || 'เกิดข้อผิดพลาดในการบันทึกข้อมูล');
      } finally {
        this.loading = false;
      }
    },
    showSnackbar(text, color) {
      this.snackbar.text = text;
      this.snackbar.color = color;
      this.snackbar.show = true;
    }
  }
};
</script>

<style scoped>
.profile-card { transition: all 0.3s ease; border-radius: 8px; }
.profile-card:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15); }
</style>
