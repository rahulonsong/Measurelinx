import Vue from 'vue';
import Router from 'vue-router';
import Home from '../views/home';
import AuthGuard from '../shared/AuthGuard';
import pageNotFound from '../components/shared/pageNotFound';
import AuthSuccess from '../shared/AuthSuccess.vue'; // ✅ Import new page
Vue.use(Router);

const router = new Router({
  mode: 'history',
  // base: process.env.BASE_URL,
  routes: [
    // ✅ OAuth Callback Route
    {
      path: '/auth-success',
      name: 'AuthSuccess',
      component: AuthSuccess,
      meta: { requiresAuth: false },
    },
    // Home
    {
      path: '/',
      name: 'home',
      // beforeEnter: AuthGuard,
      component: Home,
    },
    // Signin
    {
      path: '/signin',
      name: 'signin',
      component: () =>
        import(/* webpackChunkName: "signin" */ '@/components/auth/signin.vue'),
    },
    // Signup
    {
      path: '/signup',
      name: 'signup',
      component: () =>
        import(/* webpackChunkName: "signup" */ '@/components/auth/signup.vue'),
    },
    // Reset password
    {
      path: '/resetpassword',
      name: 'resetPassword',
      component: () =>
        import(
          /* webpackChunkName: "signup" */ '@/components/auth/resetPassword.vue'
        ),
    },
    // userVerification
    {
      path: '/userverification',
      name: 'userVerification',
      component: () =>
        import(
          /* webpackChunkName: "signup" */ '@/components/auth/userVerification.vue'
        ),
    },
    // Email verification link
    {
      path: '/verify-email/:userId/:token',
      name: 'verifyEmailLink',
      component: () =>
        import(
          /* webpackChunkName: "verify" */ '@/components/auth/verifyEmailLink.vue'
        ),
    },
    // Unsubscribe User
    {
      path: '/unsubscribe/:email',
      name: 'unsubscribe',
      component: () =>
        import(
          /* webpackChunkName: "signup" */ '@/components/auth/unsubscribe.vue'
        ),
    },
    // Profile
    {
      path: '/user/account',
      beforeEnter: AuthGuard,
      name: 'account',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () =>
        import(
          /* webpackChunkName: "profile" */ '@/components/user/account.vue'
        ),
    },
    // User Reviews
    {
      path: '/user/reviews',
      beforeEnter: AuthGuard,
      name: 'reviewsByUser',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('@/components/user/reviews.vue'),
    },
    // User Addresses
    {
      path: '/user/addresses',
      beforeEnter: AuthGuard,
      name: 'addressesByUser',
      component: () => import('@/components/user/addresses.vue'),
    },
    // User Orders
    {
      path: '/user/orders',
      beforeEnter: AuthGuard,
      name: 'ordersByUser',
      component: () => import('@/components/user/orders.vue'),
    },
    // User Order Updates
    {
      path: '/user/orders/manage',
      beforeEnter: AuthGuard,
      name: 'orderUpdatesByAdmin',
      component: () => import('@/components/user/manageOrders.vue'),
    },
    // User Order Details
    {
      path: '/user/order-details/:orderId',
      beforeEnter: AuthGuard,
      name: 'orderDetails',
      component: () => import('@/components/user/orderDetails.vue'),
    },
    // Return process
    {
      path: '/order/:orderId/return',
      beforeEnter: AuthGuard,
      name: 'returnProcess',
      component: () => import('@/components/user/returnProcess.vue'),
    },
    // Alpha Resource
    {
      path: '/resources/:resourceTitle',
      name: 'resource',
      // beforeEnter: AuthGuard,
      // route level code-splitting
      component: () =>
        import(
          /* webpackChunkName: "reosurce view" */ '@/components/resource/alphaResourceView.vue'
        ),
    },
    // manage Alpha resource
    {
      path: '/resources/alpharesource/manage',
      name: 'alphaResourceCreator',
      beforeEnter: AuthGuard,
      // route level code-splitting
      component: () =>
        import(
          /* webpackChunkName: "alphaResourceCreator" */ '@/components/resource/alphaResourceCreator.vue'
        ),
    },
    // Item model creator
    {
      path: '/items/itemmodel/manage',
      name: 'itemModelCreator',
      beforeEnter: AuthGuard,
      // route level code-splitting
      component: () =>
        import(
          /* webpackChunkName: "alphaResourceCreator" */ '@/components/itemModel/creator.vue'
        ),
    },
    // item Model Viewer
    {
      path: '/itemmodels/:itemModelName',
      name: 'itemModelViewer',
      // beforeEnter: AuthGuard,
      // route level code-splitting
      component: () =>
        import(
          /* webpackChunkName: "reosurce view" */ '@/components/itemModel/viewer.vue'
        ),
    },
    // Item  creator
    {
      path: '/items/item/manage',
      name: 'itemCreator',
      beforeEnter: AuthGuard,
      // route level code-splitting
      component: () =>
        import(
          /* webpackChunkName: "alphaResourceCreator" */ '@/components/item/creator.vue'
        ),
    },
    // item  Viewer
    {
      path: '/items/:itemName',
      name: 'itemViewer',
      // beforeEnter: AuthGuard,
      // route level code-splitting
      component: () =>
        import(
          /* webpackChunkName: "reosurce view" */ '@/components/item/viewer.vue'
        ),
    },
    // Page  creator
    {
      path: '/pages/edit/:pageName',
      name: 'pageCreator',
      beforeEnter: AuthGuard,
      // route level code-splitting
      component: () =>
        import(
          /* webpackChunkName: "page creator" */ '@/components/page/creator.vue'
        ),
    },
    // Page  Viewer
    {
      path: '/pages/:pageName',
      name: 'pageViewer',
      // beforeEnter: AuthGuard,
      // route level code-splitting
      component: () =>
        import(
          /* webpackChunkName: "page view" */ '@/components/page/viewer.vue'
        ),
    },
    // Menu Editor
    {
      path: '/menu/edit',
      name: 'menuEditor',
      beforeEnter: AuthGuard,
      // route level code-splitting
      component: () =>
        import(
          /* webpackChunkName: "page view" */ '@/components/menu/menuEditor.vue'
        ),
    },
    // Category Editor
    {
      path: '/category/edit',
      name: 'categoryEditor',
      beforeEnter: AuthGuard,
      // route level code-splitting
      component: () =>
        import(
          /* webpackChunkName: "page view" */ '@/components/category/categoryEditor.vue'
        ),
    },
    // Bulk Items
    {
      path: '/items/category/:category',
      name: 'bulkItems',
      // route level code-splitting
      component: () =>
        import(
          /* webpackChunkName: "bulkItems" */ '@/components/item/bulkItems.vue'
        ),
    },
    // Item Search Rsults
    {
      path: '/items/searchresults/:searchText',
      name: 'itemSearchResults',
      // route level code-splitting
      component: () =>
        import(
          /* webpackChunkName: "bulkItems" */ '@/components/search/itemSearchResults.vue'
        ),
    },
    // User Cart
    {
      path: '/cart',
      name: 'userCart',
      // beforeEnter: AuthGuard,
      // route level code-splitting
      component: () =>
        import(
          /* webpackChunkName: "reosurce view" */ '@/components/user/cart.vue'
        ),
    },
    // Checkout
    {
      path: '/checkout',
      name: 'checkout',
      beforeEnter: AuthGuard,
      // route level code-splitting
      component: () =>
        import(
          /* webpackChunkName: "reosurce view" */ '@/components/user/checkout.vue'
        ),
    },
    // order Confirmation
    {
      path: '/orderconfirmation',
      name: 'orderConfirmation',
      beforeEnter: AuthGuard,
      // route level code-splitting
      component: () =>
        import(
          /* webpackChunkName: "reosurce view" */ '@/components/user/orderConfirmation.vue'
        ),
    },
    // Order failure
    {
      path: '/orderfailed',
      beforeEnter: AuthGuard,
      name: 'orderFailure',
      component: () => import('@/components/user/orderFailure.vue'),
    },
    // Contact Us
    {
      path: '/contact-us',
      name: 'contactUs',
      // route level code-splitting
      component: () =>
        import(
          /* webpackChunkName: "reosurce view" */ '@/components/contact/contactUs.vue'
        ),
    },
    // Add Cell Number
    {
      path: '/add-cellnumber',
      name: 'addCellNumber',
      // route level code-splitting
      component: () =>
        import(
          /* webpackChunkName: "reosurce view" */ '@/components/cellNumber/addCellNumber.vue'
        ),
    },
    // Verify OTP
    {
      path: '/verify-otp',
      name: 'verifyOtp',
      // route level code-splitting
      component: () =>
        import(
          /* webpackChunkName: "reosurce view" */ '@/components/cellNumber/verifyOtp.vue'
        ),
    },
    // Worksheet
    {
      path: '/worksheet',
      name: 'worksheet',
      beforeEnter: AuthGuard,
      component: () =>
        import(
          /* webpackChunkName: "calculators" */ '@/components/worksheet.vue'
        ),
    },
    // and finally the default route, when none of the above matches:
    {
      path: '*',
      name: 'pageNotFound',
      component: pageNotFound,
    },
  ],
  scrollBehavior(to, from, savedPosition) {
    // always scroll to top
    return { top: 0 };
  },
});

// ✅ Middleware to check authentication before entering routes
router.beforeEach((to, from, next) => {
  if (from.name) {
    Vue.prototype.$previousRoute = from.name;
  }
  next();
});

export default router;
