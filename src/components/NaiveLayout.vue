<template>
  <n-layout position="absolute" style="overflow: hidden;">
    <n-layout-header bordered style="height: 64px;">
      <n-space justify="space-between" align="center" style="padding: 0 20px; height: 100%;">
        <span>Header Header Header</span>
        <n-space :size="30" align="center">
          <n-button text @click="handleToggleTheme" style="display: flex; align-items: center; justify-content: center;">
            <template #icon>
              <n-icon>
                <MoonOutline v-if="isLightTheme" />
                <SunnyOutline v-else />
              </n-icon>
            </template>
          </n-button>
          
          <!-- Menu người dùng -->
          <n-dropdown
            trigger="click"
            :options="userMenuOptions"
            @select="handleSelect"
            placement="bottom-end"
          >
            <n-button text>
              <n-space align="center">
                <n-avatar
                  round
                  size="small"
                  src="https://07akioni.oss-cn-beijing.aliyuncs.com/07akioni.jpeg"
                />
                <span>{{ username }}</span>
                <n-icon size="tiny"><ChevronDownOutline /></n-icon>
              </n-space>
            </n-button>
          </n-dropdown>
        </n-space>
      </n-space>
    </n-layout-header>
    <n-layout has-sider position="absolute" style="top: 64px; bottom: 64px;">
      <n-layout-sider
        bordered
        show-trigger
        collapse-mode="width"
        :collapsed-width="64"
        :width="240"
        :native-scrollbar="false"
      >
        <n-menu
          style="height: 100%;"
          :collapsed-width="64"
          :collapsed-icon-size="22"
          :options="menuOptions"
        />
      </n-layout-sider>
      <n-layout content-style="padding: 24px;" :native-scrollbar="false">
        <router-view />
      </n-layout>
    </n-layout>
    <n-layout-footer bordered position="absolute" style="height: 64px; bottom: 0;">
      Footer Footer Footer
    </n-layout-footer>
  </n-layout>
</template>

<script lang="ts">
import type { Component, Ref } from 'vue'
import { computed, inject, ref, onMounted } from 'vue'
import {
  BookOutline as BookIcon,
  PersonOutline as PersonIcon,
  WineOutline as WineIcon,
  SunnyOutline,
  MoonOutline,
  LogOutOutline,
  ChevronDownOutline,
  KeyOutline
} from '@vicons/ionicons5'
import { NIcon, NButton, NSpace, NAvatar, NDropdown } from 'naive-ui'
import type { GlobalTheme, DropdownOption } from 'naive-ui'
import { defineComponent, h } from 'vue'
import { useRouter, RouterView } from 'vue-router'

function renderIcon(icon: Component) {
  return () => h(NIcon, null, { default: () => h(icon) })
}

const menuOptions = [
  {
    label: 'Hear the Wind Sing',
    key: 'hear-the-wind-sing',
    icon: renderIcon(BookIcon)
  },
  {
    label: 'Pinball 1973',
    key: 'pinball-1973',
    icon: renderIcon(BookIcon),
    disabled: true,
    children: [
      {
        label: 'Rat',
        key: 'rat'
      }
    ]
  },
  {
    label: 'A Wild Sheep Chase',
    key: 'a-wild-sheep-chase',
    disabled: true,
    icon: renderIcon(BookIcon)
  },
  {
    label: 'Dance Dance Dance',
    key: 'Dance Dance Dance',
    icon: renderIcon(BookIcon),
    children: [
      {
        type: 'group',
        label: 'People',
        key: 'people',
        children: [
          {
            label: 'Narrator',
            key: 'narrator',
            icon: renderIcon(PersonIcon)
          },
          {
            label: 'Sheep Man',
            key: 'sheep-man',
            icon: renderIcon(PersonIcon)
          }
        ]
      },
      {
        label: 'Beverage',
        key: 'beverage',
        icon: renderIcon(WineIcon),
        children: [
          {
            label: 'Whisky',
            key: 'whisky'
          }
        ]
      },
      {
        label: 'Food',
        key: 'food',
        children: [
          {
            label: 'Sandwich',
            key: 'sandwich'
          }
        ]
      },
      {
        label: 'The past increases. The future recedes.',
        key: 'the-past-increases-the-future-recedes'
      }
    ]
  }
]

export default defineComponent({
  components: {
    RouterView,
    NIcon,
    NButton,
    NSpace,
    NAvatar,
    NDropdown,
    SunnyOutline,
    MoonOutline,
    LogOutOutline,
    ChevronDownOutline
  },
  setup() {
    const toggleTheme = inject<() => void>('toggleTheme')
    const currentTheme = inject<Ref<GlobalTheme>>('currentTheme')
    const router = useRouter()
    const username = ref('')

    // Lấy username từ localStorage khi component được mount
    onMounted(() => {
      username.value = localStorage.getItem('rememberedUsername') || 'User'
    })

    const userMenuOptions = computed<DropdownOption[]>(() => [
      {
        label: 'Change password',
        key: 'change-password',
        icon: renderIcon(KeyOutline)
      },
      {
        label: 'Logout',
        key: 'logout',
        icon: renderIcon(LogOutOutline)
      }
    ])

    const handleToggleTheme = () => {
      if (toggleTheme && currentTheme) {
        toggleTheme();
      }
    }

    const handleLogout = () => {
      localStorage.removeItem('loggedIn');
      router.push({ name: 'Login' });
    }

    const handleSelect = (key: string) => {
      if (key === 'logout') {
        handleLogout();
      } else if (key === 'change-password') {
        // Xử lý đổi mật khẩu (sẽ thực hiện sau)
        console.log('Change password clicked');
      }
    }

    const isLightTheme = computed(() => currentTheme?.value.name === 'light')

    return {
      menuOptions,
      handleToggleTheme,
      handleLogout,
      handleSelect,
      isLightTheme,
      username,
      userMenuOptions
    }
  }
})
</script>

<style scoped>
/* Bạn có thể thêm CSS tùy chỉnh ở đây nếu cần */
</style> 