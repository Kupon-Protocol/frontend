import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import Home from './views/Home.vue'
import About from './views/About.vue'
import CreateNft from './views/CreateNft.vue'
import Profile from './views/Profile.vue'
import NftContractDetails from './views/NftContractDetails.vue'

// For info on using Vue Router with the Composition API, see https://next.router.vuejs.org/guide/advanced/composition-api.html

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/about',
    name: 'About',
    component: About,
  },
  {
    path: '/create',
    name: 'CreateNft',
    component: CreateNft,
  },
  {
    path: '/nft-contract/:nftAddress',
    name: 'NftContractDetails',
    component: NftContractDetails,
    props: true
  },
  {
    path: '/profile',
    name: 'Profile',
    component: Profile,
  },
  // Fallback route for handling 404s
  {
    path: '/:pathMatch(.*)*',
    name: '404',
    component: () => import('./views/Error404.vue'),
  },
]

const router = createRouter({
  // If app is not hosted at the domain root, make sure to pass the `base` input here: https://next.router.vuejs.org/api/#parameters
  history: createWebHistory(),
  routes,
})

export default router
