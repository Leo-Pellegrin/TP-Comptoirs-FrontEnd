import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import CategorieView from '../views/CategorieView.vue'
import ProduitView from '../views/ProduitView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/categories',
      name: 'categories',
      component: CategorieView
    },
    {
      path: '/produits',
      name: 'produits',
      component: ProduitView
    }

  ]
})

export default router
