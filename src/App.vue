<script setup lang="ts">
import { ref, provide, computed, onMounted, watch } from 'vue'
import NaiveLayout from './components/NaiveLayout.vue'
import { NConfigProvider, NMessageProvider, NDialogProvider, NNotificationProvider, NLoadingBarProvider, NGlobalStyle, darkTheme, lightTheme } from 'naive-ui'
import type { GlobalTheme } from 'naive-ui'

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
            <NaiveLayout />
          </n-loading-bar-provider>
        </n-notification-provider>
      </n-dialog-provider>
    </n-message-provider>
  </n-config-provider>
</template>

<style>
/* CSS toàn cục nếu cần thiết */
body {
  margin: 0;
  padding: 0;
  /* height: 100vh; Không cần thiết khi layout gốc là absolute */
}
#app {
  /* height: 100%; Không cần thiết khi layout gốc là absolute */
  font-family: sans-serif; /* Thêm font mặc định */
}
</style>
