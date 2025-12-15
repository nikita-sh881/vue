import { createRouter, createWebHistory } from 'vue-router'
import Home from '../Home.vue'
import Generator from '../Generator.vue'
import Library from '../Library.vue'
import Editor from '../Editor.vue'
import Export from '../Export.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: { title: 'Главная' }
  },
  {
    path: '/generator',
    name: 'Generator',
    component: Generator,
    meta: { title: 'Генератор палитр' }
  },
  {
    path: '/library',
    name: 'Library',
    component: Library,
    meta: { title: 'Библиотека палитр' }
  },
  {
    path: '/editor/:id?',
    name: 'Editor',
    component: Editor,
    props: true,
    meta: { title: 'Редактор палитры' }
  },
  {
    path: '/export',
    name: 'Export',
    component: Export,
    meta: { title: 'Экспорт палитры' }
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

// Устанавливаем заголовок страницы
router.beforeEach((to, from, next) => {
  const title = to.meta.title || 'Генератор цветовых палитр'
  document.title = `${title} | Vue Color Palette`
  next()
})

export default router
