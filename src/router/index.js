import Vue from 'vue';
import VueRouter from 'vue-router';
import vClickOutside from 'v-click-outside';
import HomePage from '../views/HomePage.vue';
import FlightPath from '../views/FlightPath.vue';

Vue.use(vClickOutside);
Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'HomePage',
    component: HomePage,
  },
  {
    path: '/place',
    name: 'flightpath',
    component: FlightPath,
    props: true,
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

export default router;
