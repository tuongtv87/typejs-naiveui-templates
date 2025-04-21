<template>
  <n-layout position="absolute" style="height: 100vh; width: 100vw; overflow: hidden;">
    <n-split direction="horizontal" :default-size="0.5" :disabled="true" style="height: 100%;">
      <template #1>
        <div class="left-panel">
          <div class="left-content">
            <n-avatar
              round
              :size="80"
              src="https://07akioni.oss-cn-beijing.aliyuncs.com/07akioni.jpeg" 
              style="margin-bottom: 20px; background-color: rgba(255,255,255,0.2);" 
            />
            <h1 class="app-title">tuongtv2</h1>
            <p class="tagline">Manage multiple profile without worrying about detection</p>
          </div>
          <n-button text class="theme-toggle-button" @click="handleToggleTheme">
            <template #icon>
              <n-icon size="20">
                <MoonOutline v-if="isLightTheme" />
                <SunnyOutline v-else />
              </n-icon>
            </template>
          </n-button>
        </div>
      </template>
      <template #2>
        <div class="right-panel">
          <div v-if="isRegistering" class="register-form-wrapper">
            <h2 class="welcome-title">Welcome to Genlogin</h2>
            <p class="welcome-subtitle">One step signup to get 5 profiles free!</p>

            <n-form ref="registerFormRef" :model="registerForm" :rules="registerRules" @submit.prevent="handleRegister" style="margin-top: 30px;">
              <n-form-item-row path="email" label="Email">
                <n-input v-model:value="registerForm.email" placeholder="Email" size="large" />
              </n-form-item-row>
              <n-form-item-row path="password" label="Password">
                <n-input
                  type="password"
                  show-password-on="mousedown"
                  v-model:value="registerForm.password"
                  placeholder="Password"
                  size="large"
                />
              </n-form-item-row>
              <n-form-item-row path="confirmPassword" label="Confirm password">
                <n-input
                  type="password"
                  show-password-on="mousedown"
                  v-model:value="registerForm.confirmPassword"
                  placeholder="Confirm password"
                  size="large"
                />
              </n-form-item-row>

              <n-button type="primary" attr-type="submit" block :loading="loading" @click="handleRegister" size="large">
                Submit
              </n-button>

              <n-alert v-if="registerErrorMsg" title="Registration Failed" type="error" closable @close="registerErrorMsg = ''" style="margin-top: 20px;">
                {{ registerErrorMsg }}
              </n-alert>
            </n-form>

            <p class="signup-link">
              Already have a Genlogin account? <n-button text type="primary" @click="toggleRegistering">Login</n-button>
            </p>
          </div>

          <div v-else class="login-form-wrapper">
            <h2 class="welcome-title">Welcome back</h2>
            <p class="welcome-subtitle">Continue to Automator</p>

            <n-form ref="formRef" :model="loginForm" :rules="rules" @submit.prevent="handleLogin" style="margin-top: 30px;">
              <n-form-item-row path="username" label="Email / Username">
                <n-input v-model:value="loginForm.username" placeholder="your.email@example.com" @keydown.enter="handleLogin" size="large" />
              </n-form-item-row>
              <n-form-item-row path="password" label="Password">
                <n-input
                  type="password"
                  show-password-on="mousedown"
                  v-model:value="loginForm.password"
                  placeholder="Enter your password"
                  @keydown.enter="handleLogin"
                  size="large"
                />
              </n-form-item-row>

              <n-row :gutter="[0, 24]" style="margin-top: 10px; margin-bottom: 20px;">
                <n-col :span="12">
                  <n-checkbox v-model:checked="rememberMe">
                    Remember me
                  </n-checkbox>
                </n-col>
                <n-col :span="12" style="text-align: right;">
                  <n-button text type="primary">
                    Forgot password?
                  </n-button>
                </n-col>
              </n-row>

              <n-button type="primary" attr-type="submit" block :loading="loading" @click="handleLogin" size="large">
                Submit
              </n-button>

              <n-alert v-if="errorMsg" title="Login Failed" type="error" closable @close="errorMsg = ''" style="margin-top: 20px;">
                {{ errorMsg }}
              </n-alert>
            </n-form>

            <p class="signup-link">
              New to Genlogin? <n-button text type="primary" @click="toggleRegistering">Get started</n-button>
            </p>
          </div>
        </div>
      </template>
    </n-split>
  </n-layout>
</template>

<script setup lang="ts">
import { ref, reactive, computed, inject, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import {
  NForm, NFormItemRow, NInput, NButton, NAlert,
  NRow, NCol, NCheckbox, NAvatar, NIcon, NSplit, NLayout
} from 'naive-ui';
import type { FormInst, FormRules, GlobalTheme } from 'naive-ui';
import type { Ref } from 'vue';
import { SunnyOutline, MoonOutline } from '@vicons/ionicons5';

// Truy cập API đã expose qua preload script (tạm thời không dùng)
// Đảm bảo bạn đã tạo electron/preload.ts và cấu hình nó trong main process
// và tạo src/electron.d.ts để có type checking
// const ipcRenderer = window.require ? window.require('electron').ipcRenderer : null; // Xóa cách cũ

const router = useRouter();
const formRef = ref<FormInst | null>(null);
const registerFormRef = ref<FormInst | null>(null);
const loading = ref(false);
const errorMsg = ref('');
const registerErrorMsg = ref('');
const rememberMe = ref(false);
const isRegistering = ref(false);

const loginForm = reactive({
  username: '',
  password: '',
});

const registerForm = reactive({
  email: '',
  password: '',
  confirmPassword: '',
});

const rules: FormRules = {
  username: [{ required: true, message: 'Please input username or email', trigger: 'blur' }],
  password: [{ required: true, message: 'Please input password', trigger: 'blur' }],
};

const registerRules: FormRules = {
  email: [{ required: true, message: 'Please input email', trigger: 'blur' }],
  password: [{ required: true, message: 'Please input password', trigger: 'blur' }],
  confirmPassword: [{ required: true, message: 'Please confirm your password', trigger: 'blur' }]
};

// Lấy lại thông tin đăng nhập admin từ biến môi trường
const correctUsername = import.meta.env.VITE_LOGIN_USER;
const correctPassword = import.meta.env.VITE_LOGIN_PASS;

const handleLogin = async (e?: Event | KeyboardEvent) => {
  // Bỏ qua kiểm tra API
  if (e) e.preventDefault();
  formRef.value?.validate(async (errors) => {
    if (!errors) {
      loading.value = true;
      errorMsg.value = '';
      try {
        // === Chỉ kiểm tra với biến môi trường ===
        const loginSuccess = loginForm.username === correctUsername && loginForm.password === correctPassword;

        // Giả lập độ trễ
        await new Promise(resolve => setTimeout(resolve, 500));

        if (loginSuccess) {
          localStorage.setItem('loggedIn', 'true');
          localStorage.setItem('rememberedUsername', loginForm.username);
          if (rememberMe.value) {
            localStorage.setItem('rememberedPassword', loginForm.password);
            localStorage.setItem('rememberMe', 'true');
          } else {
            localStorage.removeItem('rememberedPassword');
            localStorage.removeItem('rememberMe');
          }
          router.push('/');
        } else {
          errorMsg.value = 'Incorrect username or password.'; // Thông báo lỗi chuẩn
        }
        // === Kết thúc logic ===

      } catch (error: any) {
        console.error('Login error:', error);
        errorMsg.value = 'An error occurred during login.';
      } finally {
        loading.value = false;
      }
    } else {
      console.log(errors);
    }
  });
};

const handleRegister = async (e?: Event | KeyboardEvent) => {
  // Tạm thời bỏ qua kiểm tra window.electronAPI
  // if (!window.electronAPI) {
  //   registerErrorMsg.value = 'Electron API not available. Check preload script.';
  //   return;
  // }
  if (e) e.preventDefault();
  registerFormRef.value?.validate(async (errors) => {
    if (!errors) {
      loading.value = true;
      registerErrorMsg.value = '';
      if (registerForm.password !== registerForm.confirmPassword) {
        registerErrorMsg.value = 'Passwords do not match.';
        loading.value = false;
        return;
      }
      try {
        // === Tạm thời bỏ qua logic gọi IPC và ghi file ===
        // const result = await window.electronAPI.invoke('register-attempt', {
        //   email: registerForm.email,
        //   password: registerForm.password
        // });

        // === Logic đăng ký tạm thời ===
        console.log('Simulating registration for:', registerForm.email);
        // Giả lập thành công sau 1 giây
        await new Promise(resolve => setTimeout(resolve, 1000));
        const registrationSuccess = true; // Giả sử luôn thành công để test UI
        // const result = { success: registrationSuccess, message: '' };

        if (registrationSuccess) { // Sử dụng logic tạm thời
          toggleRegistering(); // Chuyển về màn hình login
        } else {
          registerErrorMsg.value = 'Registration failed (temporary check).';
        }
        // === Kết thúc logic tạm thời ===

      } catch (error: any) {
        console.error('Registration error (temporary):', error);
        registerErrorMsg.value = 'An error occurred during registration (temporary).';
      } finally {
        loading.value = false;
      }
    } else {
      console.log(errors);
    }
  });
};

const toggleRegistering = () => {
  isRegistering.value = !isRegistering.value;
};

const toggleTheme = inject<() => void>('toggleTheme');
const currentTheme = inject<Ref<GlobalTheme>>('currentTheme');

const handleToggleTheme = () => {
  if (toggleTheme) {
    toggleTheme();
  }
};

const isLightTheme = computed(() => currentTheme?.value.name === 'light');

onMounted(() => {
  const savedUsername = localStorage.getItem('rememberedUsername');
  const savedPassword = localStorage.getItem('rememberedPassword');
  const wasRemembered = localStorage.getItem('rememberMe') === 'true';

  if (wasRemembered && savedUsername && savedPassword) {
    loginForm.username = savedUsername;
    loginForm.password = savedPassword;
    rememberMe.value = true;
  }
});

</script>

<style scoped>
/* Đảm bảo các panel chiếm toàn bộ không gian có sẵn */
.left-panel {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #4f46e5, #7c3aed);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 40px;
  color: white;
  text-align: center;
  overflow: hidden;
  position: relative;
  border-bottom-right-radius: 200px; /* Bo tròn góc phải dưới */
}

.right-panel {
  width: 100%;
  height: 100%;
  background-color: #ffffff;
  background-color: var(--body-color);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40px;
  overflow-y: auto;
  overflow-x: hidden;
}

/* Đảm bảo login-form-wrapper không vượt quá kích thước tối đa */
.login-form-wrapper, .register-form-wrapper {
  width: 100%;
  max-width: 500px;
}

/* Đảm bảo các phần tử khác không gây ra overflow */
.welcome-title {
  font-size: 1.875rem;
  font-weight: 600;
  color: var(--text-color-1);
  margin-bottom: 5px;
  text-align: left; /* Căn trái cho Welcome back */
}

.welcome-subtitle {
  font-size: 1rem;
  color: var(--text-color-2);
  margin-bottom: 20px;
  text-align: left; /* Căn trái cho Continue to Automator */
}

.signup-link {
  margin-top: 30px;
  text-align: left;
  font-size: 0.875rem;
  color: var(--text-color-2);
}

.signup-link n-button {
  font-size: 0.875rem; /* Cùng kích thước với 'New to Genlogin?' */
  margin-left: 5px; /* Khoảng cách nhỏ giữa 'Genlogin?' và 'Get started' */
}

:deep(.n-input .n-input__input-el) {
  text-align: left !important;
  font-size: 1.1rem;
  padding: 0; /* Đặt padding bằng 0 */
}

:deep(.n-form-item-row .n-form-item-label) {
  color: var(--text-color-2);
  font-weight: 500;
}

.n-col:first-child {
  text-align: left; /* Căn trái cho Remember me */
}

.n-col:last-child {
  text-align: right !important; /* Căn phải cho Forgot password? */
}

.n-row {
  justify-content: space-between; /* Căn chỉnh Remember me và Forgot password */
}

.theme-toggle-button {
  position: absolute;
  bottom: 50px;
  left: 50px;
  color: white !important;
  font-size: 1.2rem;
  background-color: rgba(255, 255, 255, 0.2); /* Màu nền cho vòng tròn */
  border-radius: 50%; /* Tạo vòng tròn */
  width: 60px; /* Đặt kích thước vòng tròn */
  height: 60px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.tagline {
  font-size: 1.2rem; /* Tăng cỡ chữ */
  padding: 30px 50px;
  border: 1px solid rgba(255, 255, 255, 0.5); /* Đường viền bo tròn */
  border-radius: 25px; /* Tạo bo tròn */
  display: inline-block;
  margin-top: 10px;
  opacity: 0.8; /* Giảm độ đậm của chữ */
}
</style> 