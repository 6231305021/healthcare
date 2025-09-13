<template>
  <v-container class="fill-height py-2" fluid>
    <v-row align="center" justify="center">
      <v-col cols="12" md="10" lg="8">
        <v-card elevation="12" class="pa-3 rounded-xl asom-theme">
          <v-card-title class="text-h5 font-weight-bold mb-2 text-center">
            <v-icon left color="primary" size="24">mdi-account-plus</v-icon>
            สมัครสมาชิก อสม.
          </v-card-title>

          <v-form ref="form" v-model="valid" lazy-validation>
            <v-row dense>
              <!-- Personal Info -->
              <v-col cols="12" md="6">
                <v-card flat class="mb-3 pa-2 rounded-lg section-card">
                  <div class="text-subtitle-2 font-weight-bold mb-2 primary--text">
                    <v-icon left small>mdi-account</v-icon>
                    ข้อมูลส่วนตัว
                  </div>
                  
                  <v-text-field
                    v-model="form.first_name"
                    label="ชื่อ"
                    :rules="[rules.required]"
                    outlined
                    clearable
                    color="primary"
                    dense
                    class="mb-2"
                  />
                  <v-text-field
                    v-model="form.last_name"
                    label="นามสกุล"
                    :rules="[rules.required]"
                    outlined
                    clearable
                    color="primary"
                    dense
                    class="mb-2"
                  />
                  <v-text-field
                    v-model="form.citizen_id"
                    label="เลขบัตรประชาชน"
                    :rules="[rules.required, rules.citizenId]"
                    maxlength="13"
                    outlined
                    clearable
                    color="primary"
                    dense
                    class="mb-2"
                  />
                  <v-text-field
                    v-model="form.phone"
                    label="เบอร์โทรศัพท์"
                    :rules="[rules.required, rules.phone]"
                    maxlength="10"
                    outlined
                    clearable
                    color="primary"
                    dense
                    class="mb-2"
                  />
                </v-card>
              </v-col>

              <!-- Login Info -->
              <v-col cols="12" md="6">
                <v-card flat class="mb-3 pa-2 rounded-lg section-card login-card">
                  <div class="text-subtitle-2 font-weight-bold mb-2 primary--text">
                    <v-icon left small>mdi-lock</v-icon>
                    ข้อมูลการเข้าสู่ระบบ
                  </div>

                  <v-text-field
                    v-model="form.email"
                    label="อีเมล"
                    prepend-inner-icon="mdi-email"
                    :rules="[rules.required, rules.email]"
                    outlined
                    clearable
                    color="primary"
                    dense
                    class="mb-2"
                  />
                  <v-text-field
                    v-model="form.password"
                    label="รหัสผ่าน"
                    :type="showPassword ? 'text' : 'password'"
                    :append-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
                    @click:append="showPassword = !showPassword"
                    :rules="[rules.required, rules.min]"
                    outlined
                    clearable
                    color="primary"
                    dense
                    class="mb-2"
                  />
                  <v-text-field
                    v-model="form.confirm_password"
                    label="ยืนยันรหัสผ่าน"
                    :type="showConfirmPassword ? 'text' : 'password'"
                    :append-icon="showConfirmPassword ? 'mdi-eye-off' : 'mdi-eye'"
                    @click:append="showConfirmPassword = !showConfirmPassword"
                    :rules="[rules.required, rules.match]"
                    outlined
                    clearable
                    color="primary"
                    dense
                    class="mb-2"
                  />
                  <v-text-field
                    v-model="form.address"
                    label="ที่อยู่โดยละเอียด"
                    :rules="[rules.required]"
                    outlined
                    clearable
                    color="primary"
                    dense
                  />
                </v-card>
              </v-col>
            </v-row>

            <!-- Register Button -->
            <v-btn
              block
              color="primary"
              :loading="loading"
              :disabled="!valid"
              @click="register"
              class="mb-2 register-btn"
              elevation="4"
            >
              <v-icon left>mdi-account-check</v-icon>
              สมัครสมาชิก
            </v-btn>

            <v-btn text block color="grey" @click="$router.push('/')" class="back-btn hover-btn">
              <v-icon left small>mdi-arrow-left</v-icon>
              กลับไปหน้าเข้าสู่ระบบ
            </v-btn>
          </v-form>
        </v-card>
      </v-col>
    </v-row>

    <!-- Snackbar -->
    <v-snackbar
      v-model="snackbar.show"
      :color="snackbar.color"
      timeout="3000"
      top
    >
      {{ snackbar.text }}
      <template v-slot:action="{ attrs }">
        <v-btn text v-bind="attrs" @click="snackbar.show = false">
          ปิด
        </v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>

<script>
import { registerUser } from '../api';
import { showSuccessAlert, showErrorAlert } from '../utils/sweetAlert';

export default {
  data() {
    return {
      form: {
        first_name: '',
        last_name: '',
        citizen_id: '',
        phone: '',
        email: '',
        address: '',
        password: '',
        confirm_password: ''
      },
      valid: false,
      loading: false,
      showPassword: false,
      showConfirmPassword: false,
      snackbar: { show: false, text: '', color: '' },
      rules: {
        required: v => !!v || 'กรุณากรอกข้อมูล',
        email: v => /.+@.+\..+/.test(v) || 'อีเมลไม่ถูกต้อง',
        phone: v => /^0\d{9}$/.test(v) || 'เบอร์ไม่ถูกต้อง',
        citizenId: v => /^\d{13}$/.test(v) || 'ต้องมี 13 หลัก',
        min: v => v.length >= 6 || 'รหัสผ่านอย่างน้อย 6 ตัวอักษร',
        match: v => v === this.form.password || 'รหัสผ่านไม่ตรงกัน',
      }
    };
  },
  methods: {
    async register() {
      if (!this.$refs.form.validate()) return;
      this.loading = true;
      try {
        const { confirm_password, ...payload } = this.form;
        const res = await registerUser(payload);
        if (res?.message) {
          await showSuccessAlert(res.message);
          this.$router.push('/');
        }
      } catch (err) {
        console.error('Registration error:', err);
        showErrorAlert(err.message || 'เกิดข้อผิดพลาดในการสมัคร');
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>

<style scoped>
.register-btn { font-weight: 600; border-radius: 4px; height: 36px; }
.register-btn:hover { transform: translateY(-1px); box-shadow: 0 2px 8px rgba(76, 175, 80, 0.3); }
.back-btn { height: 32px; color: #2e7d32 !important; }
</style>
