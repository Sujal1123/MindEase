import { createRouter, createWebHistory } from "vue-router";
import Home from "../pages/Home.vue";
import Explore from "@/pages/Explore.vue";
import Login from "@/pages/Login.vue";
import Signup from "@/pages/Signup.vue";
import Profile from "@/pages/Profile.vue";
import Chat from "@/pages/Chat.vue";
import PatientProfile from "@/pages/PatientProfile.vue";
import PsychiatristDashboard from "@/pages/PsychiatristDashboard.vue";
import Account from "@/pages/Account.vue";
import SelfHelp from "@/pages/SelfHelp.vue";
import Posts from "@/pages/Posts.vue";

const routes = [
 { path: '/', name:Home, component: Home },
 { path: '/explore', component: Explore },
 { path: '/chat/:id', component: Chat },
 { path: '/login', component: Login },
 { path: '/signup', component: Signup },
 { path: '/profile/:id',name: 'Profile', component: Profile },
 { path: '/user/profile', component: PatientProfile},
 { path: '/dashboard', component: PsychiatristDashboard},
 { path: '/account', component: Account},
 { path: '/self-help', name: 'SelfHelp', component: SelfHelp},
 { path: '/posts', name: 'Posts', component: Posts}


];

const router = createRouter({
    history: createWebHistory(),
    routes
});

router.beforeEach((to, from, next) => {
  const publicPages = ['/login', '/signup'];
  const authRequired = !publicPages.includes(to.path);

  const stored = localStorage.getItem('user');
  let token = null;

  if (stored && stored !== 'undefined') {
    try {
      const userObj = JSON.parse(stored);
      token = userObj?.token;
    } catch (err) {
      console.error('Error parsing user from localStorage:', err);
    }
  }

  if (authRequired && !token) {
    return next('/login');
  }

  next();
});



export default router;
 