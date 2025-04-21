<template>
  <n-layout position="absolute" style="height: 100vh; width: 100vw; overflow: hidden;">
    <n-layout has-sider style="height: 100%;">
      <n-layout-sider
        bordered
        show-trigger
        collapse-mode="width"
        :collapsed-width="64"
        :width="240"
        :native-scrollbar="false"
        style="height: 100vh; display: flex; flex-direction: column;"
      >
        <div class="sider-logo-section" style="height: 64px; display: flex; align-items: center; padding: 0 24px; flex-shrink: 0;">
          <img 
            src="@/assets/logo.png" 
            alt="Logo" 
            style="height: 32px; margin-right: 10px;"
          />
          <span style="font-size: 18px; font-weight: bold;">Tinker</span>
        </div>

        <div class="sider-menu-section" style="flex-grow: 1; overflow: auto;">
          <n-menu
            style="height: 100%;"
            :collapsed-width="64"
            :collapsed-icon-size="22"
            :options="menuOptions"
          />
        </div>
      </n-layout-sider>

      <n-layout style="height: 100vh;">
        <n-layout-header style="height: 64px; padding: 0 20px;">
          <n-space justify="space-between" align="center" style="height: 100%;">
            <div></div>
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

        <n-layout-content content-style="padding: 24px; height: calc(100vh - 64px);" :native-scrollbar="false">
          <router-view />
        </n-layout-content>
      </n-layout>
    </n-layout>
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
import {
  NLayout, NLayoutSider, NLayoutHeader, NLayoutContent, NMenu,
  NIcon, NButton, NSpace, NAvatar, NDropdown,
  type GlobalTheme, type DropdownOption
} from 'naive-ui'
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
    NLayout,
    NLayoutSider,
    NLayoutHeader,
    NLayoutContent,
    NMenu,
    NIcon,
    NButton,
    NSpace,
    NAvatar,
    NDropdown,
    SunnyOutline,
    MoonOutline,
    ChevronDownOutline
  },
  setup() {
    const toggleTheme = inject<() => void>('toggleTheme')
    const currentTheme = inject<Ref<GlobalTheme>>('currentTheme')
    const router = useRouter()
    const username = ref('')

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