import store from '../store';
import Cookies from 'js-cookie';

export default async (to, from, next) => {
  try {
    // Check if we have a stored intended route
    const hasIntendedRoute = store.getters.intendedRoute;

    // Check authentication status
    const isAuthenticated =
      store.getters.user ||
      Cookies.get('papiloomToken') ||
      (await store.dispatch('getCookieValue', 'papiloomToken'));

    // Handle user verification case
    if (store.getters.userId && !store.getters.user) {
      return next({ path: '/userVerification' });
    }

    // Handle unauthenticated users
    if (!isAuthenticated) {
      // Only set intended route if it's not the home page
      if (to.path !== '/' && to.name !== 'signin' && to.name !== 'signup') {
        store.commit('setIntendedRoute', to.fullPath);
        return next({ path: '/signin' });
      }
      return next();
    }

    // Handle authenticated users with intended route
    if (isAuthenticated && hasIntendedRoute && to.path === '/') {
      const intendedRoute = store.getters.intendedRoute;
      store.commit('setIntendedRoute', null); // Clear the intended route
      return next({ path: intendedRoute });
    }

    // Default case: allow navigation
    return next();
  } catch (error) {
    console.error('AuthGuard Error:', error);
    return next({ path: '/signin' });
  }
};
