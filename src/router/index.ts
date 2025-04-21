import { createRouter, createWebHashHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import HomeView from '../views/HomeView.vue' // Tạo file này ở bước sau
import AboutView from '../views/AboutView.vue' // Tạo file này ở bước sau
import LoginLayout from "../layout/LoginLayout.vue"; // Cập nhật đường dẫn đúng
import NaiveLayout from '../components/NaiveLayout.vue' // Import Layout

const routes: Array<RouteRecordRaw> = [
  {
    path: '/login',
    name: 'Login',
    component: LoginLayout, // Sử dụng LoginLayout mới
    meta: { requiresAuth: false } // Đánh dấu route này không cần đăng nhập
  },
  {
    path: '/',
    component: NaiveLayout, // Sử dụng layout cho các route con bên trong
    redirect: '/home', // Chuyển hướng từ / sang /home
    meta: { requiresAuth: true }, // Đánh dấu các route con này cần đăng nhập
    children: [
      {
        path: 'home', // Sửa path thành tương đối
        name: 'Home',
        component: HomeView
      },
      {
        path: 'about',
        name: 'About',
        component: AboutView
      }
      // Thêm các route khác cần layout ở đây
    ]
  },
  // Có thể thêm route 404 ở đây
]

const router = createRouter({
  history: createWebHashHistory(), // Sử dụng hash history phù hợp với Electron
  routes
})

// Navigation Guard
router.beforeEach((to, from, next) => {
  const isLoggedIn = localStorage.getItem('loggedIn') === 'true';
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);

  if (requiresAuth && !isLoggedIn) {
    // Nếu route yêu cầu đăng nhập mà chưa đăng nhập -> về trang login
    next({ name: 'Login' });
  } else if (!requiresAuth && isLoggedIn && to.name === 'Login') {
    // Nếu đã đăng nhập mà vào trang login -> về trang chủ
    next({ name: 'Home' }); // Hoặc next('/')
  } else {
    // Các trường hợp khác cho phép đi tiếp
    next();
  }
});

export default router 