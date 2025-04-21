<template>
  <n-layout position="absolute" style="height: 100vh; width: 100vw; overflow: hidden;">
    <n-split direction="horizontal" :default-size="0.5" :disabled="true" style="height: 100%;">
      <template #1>
        <div class="left-panel">
          <div class="left-content">
            <!-- Placeholder cho Logo -->
            <n-avatar
              round
              :size="80"
              src="https://07akioni.oss-cn-beijing.aliyuncs.com/07akioni.jpeg" 
              style="margin-bottom: 20px; background-color: rgba(255,255,255,0.2);" 
            />
            <h1 class="app-title">tuongtv2</h1>
            <p class="tagline">Manage multiple profile without worrying about detection</p>
          </div>
          <!-- Nút chuyển theme ở góc dưới -->
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
          <div class="login-form-wrapper">
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
              New to Genlogin? <n-button text type="primary">Get started</n-button>
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
  NRow, NCol, NCheckbox, NAvatar, NIcon, NSplit
} from 'naive-ui';
import type { FormInst, FormRules, GlobalTheme } from 'naive-ui';
import type { Ref } from 'vue';
import { SunnyOutline, MoonOutline } from '@vicons/ionicons5';

const router = useRouter();
const formRef = ref<FormInst | null>(null);
const loading = ref(false);
const errorMsg = ref('');
const rememberMe = ref(false);

// Keys cho localStorage
const usernameStorageKey = 'rememberedUsername';
const passwordStorageKey = 'rememberedPassword';
const rememberMeStorageKey = 'rememberMe';

const loginForm = reactive({
  username: '',
  password: '',
});

const rules: FormRules = {
  username: [{ required: true, message: 'Please input username or email', trigger: 'blur' }],
  password: [{ required: true, message: 'Please input password', trigger: 'blur' }],
};

const correctUsername = import.meta.env.VITE_LOGIN_USER;
const correctPassword = import.meta.env.VITE_LOGIN_PASS;

const handleLogin = (e?: Event | KeyboardEvent) => {
  if (e) e.preventDefault();
  formRef.value?.validate((errors) => {
    if (!errors) {
      loading.value = true;
      errorMsg.value = '';
      setTimeout(() => {
        if (loginForm.username === correctUsername && loginForm.password === correctPassword) {
          // Đăng nhập thành công
          localStorage.setItem('loggedIn', 'true');
          if (rememberMe.value) {
            // Lưu thông tin nếu Remember Me được check
            localStorage.setItem(usernameStorageKey, loginForm.username);
            localStorage.setItem(passwordStorageKey, loginForm.password); // Lưu ý: Lưu password dạng text là không an toàn!
            localStorage.setItem(rememberMeStorageKey, 'true');
          } else {
            // Xóa thông tin nếu Remember Me không được check
            localStorage.removeItem(usernameStorageKey);
            localStorage.removeItem(passwordStorageKey);
            localStorage.removeItem(rememberMeStorageKey);
          }
          router.push('/');
        } else {
          errorMsg.value = 'Incorrect username or password.';
        }
        loading.value = false;
      }, 500);
    } else {
      console.log(errors);
    }
  });
};

const toggleTheme = inject<() => void>('toggleTheme');
const currentTheme = inject<Ref<GlobalTheme>>('currentTheme');

const handleToggleTheme = () => {
  if (toggleTheme) {
    toggleTheme();
  }
};

const isLightTheme = computed(() => currentTheme?.value.name === 'light');

// Đọc thông tin đã lưu khi component mount
onMounted(() => {
  const savedUsername = localStorage.getItem(usernameStorageKey);
  const savedPassword = localStorage.getItem(passwordStorageKey);
  const wasRemembered = localStorage.getItem(rememberMeStorageKey) === 'true';

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
.login-form-wrapper {
  width: 100%;
  max-width: 500px;
}

/* Đảm bảo các phần tử khác không gây ra overflow */
.welcome-title {
  font-size: 1.875rem;
  font-weight: 600;
  color: var(--text-color-1);
  margin-bottom: 5px;
}

.welcome-subtitle {
  font-size: 1rem;
  color: var(--text-color-2);
  margin-bottom: 20px;
}

.signup-link {
  margin-top: 30px;
  text-align: left;
  font-size: 0.875rem;
  color: var(--text-color-2);
}

.signup-link n-button {
  font-size: 0.875rem; /* Cùng kích thước với 'New to Genlogin?' */
}

:deep(.n-input .n-input__input-el) {
  text-align: left !important;
  font-size: 1.1rem;
  padding: 12px;
}

:deep(.n-form-item-row .n-form-item-label) {
  color: var(--text-color-2);
  font-weight: 500;
}

.theme-toggle-button {
  position: absolute;
  bottom: 50px;
  left: 50px;
  color: white !important;
  font-size: 1.2rem;
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  width: 60px;
  height: 60px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.n-form-item-row {
  margin-bottom: 20px;
}

.n-button {
  font-size: 1.1rem;
  padding: 12px 24px;
}

.n-row {
  justify-content: space-between;
}

.n-col:first-child {
  text-align: left; /* Căn trái cho Remember me */
}

.n-col:last-child {
  text-align: right !important; /* Căn phải cho Forgot password? */
}

.welcome-title, .welcome-subtitle {
  text-align: left; /* Căn trái cho Welcome back và Continue to Automator */
}

.n-col:last-child n-button {
  color: white !important; /* Màu chữ trắng */
  transition: color 0.3s ease; /* Thêm hiệu ứng chuyển màu */
}

.n-col:last-child n-button:hover {
  color: var(--primary-color); /* Màu khi hover */
}

:root[data-theme='dark'] .n-col:last-child n-button:hover {
  color: var(--primary-color-light); /* Màu khi hover trong dark theme */
}

:root[data-theme='light'] .n-col:last-child n-button:hover {
  color: var(--primary-color-dark); /* Màu khi hover trong light theme */
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