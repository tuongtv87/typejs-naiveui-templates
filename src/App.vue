<script setup lang="ts">
import { ref, provide, computed, onMounted, watch } from 'vue'
import { NConfigProvider, NMessageProvider, NDialogProvider, NNotificationProvider, NLoadingBarProvider, NGlobalStyle, darkTheme, lightTheme } from 'naive-ui'
import type { GlobalTheme } from 'naive-ui'
import { RouterView } from 'vue-router'

// Mặc định light theme
const _currentTheme = ref<GlobalTheme>(lightTheme)
const themeStorageKey = 'naive-ui-theme' // Key cho localStorage

// Key động dựa trên tên theme
const themeKey = computed(() => _currentTheme.value.name)

function toggleTheme() {
  // So sánh bằng tên
  _currentTheme.value = _currentTheme.value.name === 'light' ? darkTheme : lightTheme
}

// Đọc theme đã lưu khi component được mount
onMounted(() => {
  const savedThemeName = localStorage.getItem(themeStorageKey)
  if (savedThemeName === 'dark') {
    _currentTheme.value = darkTheme
  } else {
    _currentTheme.value = lightTheme // Mặc định là light nếu không có gì được lưu hoặc giá trị không hợp lệ
  }
})

// Lưu theme mới vào localStorage khi nó thay đổi
watch(_currentTheme, (newTheme) => {
  localStorage.setItem(themeStorageKey, newTheme.name)
})

provide('toggleTheme', toggleTheme)
provide('currentTheme', _currentTheme)
</script>

<template>
  <n-config-provider :theme="_currentTheme" :key="themeKey">
    <n-global-style />
    <n-message-provider>
      <n-dialog-provider>
        <n-notification-provider placement="bottom">
          <n-loading-bar-provider>
            <router-view />
          </n-loading-bar-provider>
        </n-notification-provider>
      </n-dialog-provider>
    </n-message-provider>
  </n-config-provider>
</template>

<style>
/* Reset box-sizing global */
*,
*::before,
*::after {
  box-sizing: border-box;
}

/* Áp dụng cho toàn bộ trang */
html, body {
  margin: 0;
  padding: 0;
  height: 100%; /* Đảm bảo body chiếm đủ chiều cao */
  overflow: hidden; /* Ngăn body cuộn */
}

/* CSS toàn cục nếu cần thiết */
body {
  /* Các style cũ của body đã được chuyển lên trên */
}
#app {
  font-family: sans-serif;
  height: 100vh; /* #app vẫn cần 100vh để làm gốc cho các layout con */
  width: 100vw; /* Đảm bảo #app chiếm đủ chiều rộng */
}

/* Override Naive UI dark theme text colors */
.n-config-provider[data-theme="dark"] {
  --text-color-base: #FFFFFF !important;
  --text-color-1: #FFFFFF !important;
  --text-color-2: rgba(255, 255, 255, 0.82) !important; /* Slightly less prominent for secondary text */
  --text-color-3: rgba(255, 255, 255, 0.52) !important; /* Even less prominent for tertiary/disabled text */
}

/* Specific override for tagline if needed (adjust selector if necessary) */
.n-config-provider[data-theme="dark"] .tagline {
  opacity: 1 !important; /* Ensure tagline is fully opaque */
}

/* Ensure menu item labels in dark theme are fully opaque */
.n-config-provider[data-theme="dark"] .n-menu .n-menu-item-content__title {
    color: #FFFFFF !important;
    opacity: 1 !important;
}

/* Ensure dropdown option labels in dark theme are fully opaque */
.n-config-provider[data-theme="dark"] .n-dropdown-option-body__label {
    color: #FFFFFF !important;
    opacity: 1 !important;
}

/* Ensure general button text in dark theme is fully opaque */
.n-config-provider[data-theme="dark"] .n-button .n-button__content {
    color: inherit !important; /* Inherit from parent or use specific color */
    opacity: 1 !important;
}

/* Ensure text button specifically */
.n-config-provider[data-theme="dark"] .n-button--text-type .n-button__content {
    color: #FFFFFF !important; /* White for text buttons */
    opacity: 1 !important;
}
</style>
