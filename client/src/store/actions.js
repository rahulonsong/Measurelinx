// Importing Apollo client
import { defaultClient as apolloClient } from '../main';
// var db = firebase.firestore();
import router from '../router/index';
import axios from '../shared/axios';
import { gqlActions } from './gqlActions';
import { gqlQueries } from '../graphql/queries';
import Cookies from 'js-cookie';
import { gqlMutations } from '../graphql/mutations';

const user = {
  // creating a user
  signUserUp: async ({ state, commit, dispatch }, payload) => {
    // Initializing server action
    commit('setIgnoreApolloStoreReset', true);
    await dispatch('initializeServerAction');
    // Removing Cookies entries
    dispatch('removeCookies');
    let userPayload = {
      userInput: {
        email: payload.email,
        password: payload.password,
        firstName: payload.firstName,
        lastName: payload.lastName,
        subscribedToNewsletter: payload.subscribedToNewsletter,
      },
    };
    try {
      let userResponse = await dispatch('createUser', userPayload);
      userResponse = { ...(await dispatch('removeTypename', userResponse)) };
      // If error already encountered from gql action, quit function
      if (state.error) return;
      // Set UserId
      commit('setUserId', userResponse.userId);
      // Set Userverification Context
      commit('setUserVerificationContext', 'emailVerification');
      // Pushing app to OTP verification page
      if (router.currentRoute.name !== 'userVerification') {
        router.push({ name: 'userVerification' });
      }
      // Ending server action
      dispatch('endServerAction');
    } catch (error) {
      commit('setIgnoreApolloStoreReset', false);
      dispatch('handleCatchError', error);
    }
  },
  removeCookies: ({ state, commit, dispatch }) => {
    Cookies.remove('papiloomToken', { path: '/' });
    Cookies.remove('papiloomTokenExpiryTime', { path: '/' });
  },

  startApp: async ({ state, commit, dispatch }, payload) => {
    try {
      // Get current user if not available
      // execute Initiate App
      if (
        state.user ||
        Cookies.get(
          'papiloomToken' || dispatch('getCookieValue', 'papiloomToken')
        )
      ) {
        // getting current user
        await dispatch('getCurrentUser');
        if (this.error) {
          await dispatch('initializeApp');
          dispatch('clearError');
          return;
        }
        commit('setLoading', false);
        commit('setProgressing', false);
      }
      // Initializing App
      await dispatch('initializeApp');
    } catch (error) {
      if (router.currentRoute.name !== 'signin') {
        router.push({ name: 'signin' });
      }
    }
  },
  // verifying a user
  verifyUser: async ({ state, commit, dispatch }, payload) => {
    // Initializing server action
    commit('setIgnoreApolloStoreReset', true);
    await dispatch('initializeServerAction');
    // Removing Cookies entries
    dispatch('removeCookies');

    let userPayload = {
      userOtpInput: {
        userId: payload.userId,
        otp: payload.otp,
      },
    };
    try {
      let userResponse = await dispatch('verifyUserGql', userPayload);
      userResponse = { ...(await dispatch('removeTypename', userResponse)) };
      // If error already encountered from gql action, quit function
      if (state.error) return;
      // Setting User and explicitly setting userId
      commit('setUser', userResponse.user);
      commit('setUserId', userResponse.user._id);
      // Setting tokena nd expiry
      dispatch('setTokenInfo', userResponse);
      // If error already encountered from gql action, quit function
      if (state.error) return;
      // storing the existing cart items
      let existingCartItems = state.cart.items;
      if (existingCartItems.length) {
        dispatch('mergeCartItems', existingCartItems);
        // Set user cart
        commit('setCart', state.user.cart);
        await dispatch('updateCart');
      } else {
        // Set user cart
        commit('setCart', userResponse.user.cart);
      }
      await dispatch('initializeApp');
      // Directing App to Home page
      if (router.currentRoute.name !== 'home') {
        router.push({
          name: 'home',
        });
      }
      // Ending server action
      dispatch('endServerAction');
    } catch (error) {
      commit('setIgnoreApolloStoreReset', false);
      dispatch('handleCatchError', error);
    }
  },
  // Verify a user for password reset
  verifyUserForPasswordReset: async ({ state, commit, dispatch }, payload) => {
    // Initializing server action
    commit('setIgnoreApolloStoreReset', true);
    await dispatch('initializeServerAction');
    // Removing Cookies entries
    dispatch('removeCookies');

    let userPayload = {
      resetPasswordOtpInput: {
        email: payload.email,
        otp: payload.otp,
      },
    };
    try {
      let userResponse = await dispatch(
        'verifyUserForPasswordResetGql',
        userPayload
      );
      userResponse = { ...(await dispatch('removeTypename', userResponse)) };
      // If error already encountered from gql action, quit function
      if (state.error) return;
      // Setting User
      if (userResponse && !userResponse.isVerified) return;
      commit('setUserId', userResponse.userId);
      commit('setResetPasswordActive', true);

      // Directing App to reset password page
      if (router.currentRoute.name !== 'resetPassword') {
        router.push({
          name: 'resetPassword',
        });
      }
      // Ending server action
      dispatch('endServerAction');
    } catch (error) {
      commit('setResetPasswordActive', false);
      commit('setIgnoreApolloStoreReset', false);
      dispatch('handleCatchError', error);
    }
  },
  // Resetting user password
  resetPassword: async ({ state, commit, dispatch }, payload) => {
    // Initializing server action
    commit('setIgnoreApolloStoreReset', true);
    await dispatch('initializeServerAction');
    // Removing Cookies entries
    dispatch('removeCookies');
    let userPayload = {
      resetPasswordInput: {
        newPassword: payload.newPassword,
        userId: payload.userId,
      },
    };
    try {
      let userResponse = await dispatch('resetPasswordGql', userPayload);
      // If error already encountered from gql action, quit function
      if (state.error) return;
      // Setting User
      commit('setUser', userResponse.user);
      // Setting tokena nd expiry
      dispatch('setTokenInfo', userResponse);
      // If error already encountered from gql action, quit function
      if (state.error) return;
      // storing the existing cart items
      let existingCartItems = state.cart.items;
      if (existingCartItems.length) {
        dispatch('mergeCartItems', existingCartItems);
        // Set user cart
        commit('setCart', state.user.cart);
        await dispatch('updateCart');
      } else {
        // Set user cart
        commit('setCart', userResponse.user.cart);
      }
      await dispatch('initializeApp');
      // Directing App to Home page
      if (router.currentRoute.name !== 'home') {
        router.push({
          name: 'home',
        });
      }
      // reset sresetPasswordpage
      commit('setResetPasswordActive', false);
      // Ending server action
      dispatch('endServerAction');
    } catch (error) {
      commit('setResetPasswordActive', false);
      commit('setIgnoreApolloStoreReset', false);
      dispatch('handleCatchError', error);
    }
  },
  // sending OTP
  sendOtp: async ({ state, commit, dispatch }, payload) => {
    // Initializing server action
    await dispatch('initializeServerAction');
    let userPayload = {
      sendOtpInput: {
        userId: payload.userId,
        email: payload.email,
        context: payload.context,
      },
    };
    try {
      let userResponse = await dispatch('sendOtpGql', userPayload);
      // If error already encountered from gql action, quit function
      if (state.error) return;
      if (payload.context === 'resetPassword') {
        // Directing App to reset password page
        if (router.currentRoute.name !== 'userVerification') {
          router.push({
            name: 'userVerification',
          });
        }
      }
      // Ending server action
      dispatch('endServerAction');
    } catch (error) {
      dispatch('handleCatchError', error);
    }
  },
  // send Phone OTP
  // sending Phone OTP
  sendPhoneOtp: async ({ state, commit, dispatch }, payload) => {
    // Initializing server action
    await dispatch('initializeServerAction');
    try {
      let userResponse = await dispatch('sendPhoneOtpGql', payload);
      // If error already encountered from gql action, quit function
      if (state.error) return;

      // Ending server action
      dispatch('endServerAction');
    } catch (error) {
      dispatch('handleCatchError', error);
    }
  },
  // verify user phone
  // verifying Phone OTP
  verifyUserPhone: async ({ state, commit, dispatch }, payload) => {
    // Initializing server action
    await dispatch('initializeServerAction');
    try {
      let userResponse = await dispatch('verifyUserPhoneGql', payload);
      userResponse = { ...(await dispatch('removeTypename', userResponse)) };
      // If error already encountered from gql action, quit function
      if (state.error) return;

      if (userResponse.message === 'Phone number verified successfully') {
        if (state.user && state.user) {
          // state.user.cellNumber.verified = true;
          state.user = { ...userResponse.loginData.user };
        }
      }
      // Handle user signin if authenticated
      if (userResponse.message === 'Phone number authenticated successfully') {
        //  perform signin operation
        dispatch('setUserDetails', userResponse.loginData);
      }
      // Ending server action
      dispatch('endServerAction');
      return;
    } catch (error) {
      dispatch('handleCatchError', error);
    }
  },
  // Logging in a user
  signUserIn: async ({ state, commit, dispatch, getters }, payload) => {
    commit('setIgnoreApolloStoreReset', true);
    // Initializing server action
    await dispatch('initializeServerAction');

    // Getting user data
    try {
      let userResponse = await dispatch('signIn', payload);
      userResponse = { ...(await dispatch('removeTypename', userResponse)) };
      // If error already encountered from gql action, quit function
      if (state.error) return;

      // Handle email verification case
      if (
        userResponse.message &&
        userResponse.message === 'Please verify your email before logging in.'
      ) {
        commit('setUserId', userResponse.userId);
        commit('setUserVerificationContext', 'emailVerification');
        if (router.currentRoute.name !== 'userVerification') {
          router.push({ name: 'userVerification' });
          dispatch('endServerAction');
          return;
        }
      }

      // Set user details and initialize app
      await dispatch('setUserDetails', userResponse);
      if (state.error) {
        dispatch('endServerAction');
        return;
      }

      await dispatch('initializeApp');

      // Handle navigation after successful login
      const intendedRoute = state.intendedRoute;
      if (intendedRoute) {
        // Clear the intended route before navigation
        commit('clearIntendedRoute');
        router.push(intendedRoute);
      } else if (router.currentRoute.name === 'signin') {
        // Only redirect to home if currently on signin page
        router.push({ name: 'home' });
      }

      // Ending server action
      dispatch('endServerAction');
    } catch (error) {
      commit('setIgnoreApolloStoreReset', false);
      dispatch('handleCatchError', error);
    }
  },
  // set user Details
  setUserDetails: async ({ state, commit, dispatch, getters }, payload) => {
    if (payload) {
      const response = payload;
      // Removing Cookies entries
      dispatch('removeCookies');
      // Exit if error is encountered in server
      if (state.error) {
        return;
      }
      // checking if user is verified
      if (response.user) {
        //Getting token info
        // Set token info
        dispatch('setTokenInfo', response);
        if (!state.isReLoggingIn) {
          if (
            response.user.addresses &&
            response.user.addresses.length === 1 &&
            response.user.addresses[0] == undefined
          ) {
            response.user.addresses.pop();
          }
          // Set user
          commit('setUser', response.user);
          // set theme
          dispatch('setAppTheme');
          // storing the existing cart items
          let existingCartItems = state.cart.items;
          if (existingCartItems.length) {
            dispatch('mergeCartItems', existingCartItems);
            // Set user cart
            commit('setCart', state.user.cart);
            await dispatch('updateCart');
          } else {
            // Set user cart
            commit('setCart', response.user.cart);
          }
          // Setting Logo
          if (response.user.logo) {
            if (response.user.logo.path) {
              commit(
                'setLogoImageURL',
                getters.serverDomain + response.user.logo.path
              );
            }
          }
          // setting organization
          if (response.user.organization) {
            if (response.user.organization.organizationName) {
              commit(
                'setOrganizationName',
                response.user.organization.organizationName
              );
            }
          }
        }
        // Initiating app actions
        commit('setReLogInDialog', false);
        commit('setIsReLoggingIn', false);
        commit('setNumberOfOrderPages', response.user.numberOfOrderPages);
      }
      // User not verified
      else {
        // Set UserId
        if (response.userId) {
          commit('setUserId', response.userId);
          // Pushing app to OTP verification page
          if (router.currentRoute.name !== 'userVerification') {
            router.push({ name: 'userVerification' });
          }
        }
      }
    }
  },
  getCurrentUser: async ({ state, commit, dispatch, getters }) => {
    commit('setIgnoreApolloStoreReset', true);
    await dispatch('initializeServerAction');

    try {
      let user = await dispatch('getCurrentUserGql');
      if (state.error) return;
      // console.log('user:', user); // Debugging Log
      user = { ...(await dispatch('removeTypename', user)) };

      if (user.addresses?.length === 1 && user.addresses[0] == undefined) {
        user.addresses.pop();
      }

      commit('setUser', user);

      if (user.numberOfOrderPages) {
        commit('setNumberOfOrderPages', user.numberOfOrderPages);
      }

      dispatch('setAppTheme');
      commit('setCart', user.cart);

      if (user.logo?.path) {
        commit('setLogoImageURL', getters.serverDomain + user.logo.path);
      }

      if (user.organization?.organizationName) {
        commit('setOrganizationName', user.organization.organizationName);
      }

      // ✅ Check if user is logged in via Google or Facebook
      if (user.googleId) {
        commit('setSocialLoginProvider', 'google');
      } else if (user.facebookId) {
        commit('setSocialLoginProvider', 'facebook');
      }
      // ✅ Finalize server action
      dispatch('endServerAction');
    } catch (error) {
      commit('setIgnoreApolloStoreReset', false);
      dispatch('handleCatchError', error);
    }
  },
  // signing out a user
  signUserOut: async ({ state, commit, dispatch }) => {
    try {
      // Determine the correct server domain dynamically
      const serverDomain =
        process.env.NODE_ENV === 'production'
          ? process.env.VUE_APP_SERVER_DOMAIN
          : process.env.VUE_APP_SERVER_DOMAIN_DEV;

      // Ensure there's no double slash issue
      const logoutUrl = `${serverDomain.replace(/\/$/, '')}/logout`;

      console.log('Logout URL:', logoutUrl); // Debugging Log

      // Initializing server action
      commit('setIgnoreApolloStoreReset', true);
      await dispatch('initializeServerAction');

      // Call the backend logout API
      await axios.get(logoutUrl, {
        withCredentials: true, // Ensures cookies are included in the request
      });

      // Removing frontend cookies manually
      dispatch('removeCookies');

      // Reset Vuex state
      commit('resetState');
      commit('setUser', null);
      commit('setToken', '');

      // Ensure all Apollo client data is reset
      await dispatch('signoutUser');

      commit('setInitializeAppComplete', false);

      // If error already encountered from gql action, quit function
      if (state.error) return;

      // Resetting App variables & Reinitializing App
      await dispatch('initializeApp');
    } catch (error) {
      commit('setIgnoreApolloStoreReset', false);
      dispatch('handleCatchError', error);
      console.error('Logout error:', error);
    }
  },
  // Updating User
  updateUserProfile: async ({ state, commit, dispatch }, payload) => {
    // Initializing server action
    await dispatch('initializeServerAction');

    let userPayload = {
      userUpdateInput: {
        email: payload.email,
        oldPassword: payload.oldPassword,
        newPassword: payload.newPassword,
        firstName: payload.firstName,
        lastName: payload.lastName,
      },
    };
    // Deleting password if not updating
    if (!payload.updatingPassword) {
      delete userPayload.userUpdateInput.oldPassword;
      delete userPayload.userUpdateInput.newPassword;
    }
    try {
      // Updating Organization if requested
      if (payload.updatingOrganization) {
        let organizationPayload = {
          organizationId: state.user.organization._id,
          organizationInput: {
            organizationName: payload.organizationName,
          },
        };
        let organizationResponse = await dispatch(
          'updateOrganizationData',
          organizationPayload
        );
        // If error already encountered from gql action, quit function
        if (state.error) return;
        // Setting Organization
        commit('setOrganizationName', organizationResponse.organizationName);
      }
      let userResponse = await dispatch('updateUser', userPayload);
      userResponse = { ...(await dispatch('removeTypename', userResponse)) };
      // If error already encountered from gql action, quit function
      if (state.error) return;
      if (!userResponse) return;
      // Setting User
      dispatch('setUserDetails', userResponse);
      // commit('setUser', userResponse.user);
      // Setting token and expiry
      dispatch('setTokenInfo', userResponse);
      commit('setSnackBarText', 'User Profile Updated!');
      commit('setSnackBar', true);
      // Ending server action
      dispatch('endServerAction');

      return;
    } catch (error) {
      dispatch('handleCatchError', error);
    }
  },
  // Update User Poperties
  updateUserProperties: async ({ state, commit, dispatch }, payload) => {
    // Initializing silent server action
    await dispatch('initializeSilentServerAction');
    // Updating rating
    try {
      let message = await dispatch('updateUserPropertiesGql', payload);
      // If error already encountered from gql action, quit function
      if (state.error) return;
      // Ending server action
      dispatch('endServerAction');
      // Setting snackBar
      dispatch('setSnackBarText', { text: 'Preferences updated!' });
      return;
    } catch (error) {
      dispatch('handleCatchError', error);
    }
  },
  // Update user info
  updateUserInfo: async ({ state, commit, dispatch }, payload) => {
    // Initializing server action
    await dispatch('initializeServerAction');
    // Updating UserInfo
    try {
      // Server action
      let userInfo = await dispatch('updateUserInfoGql', payload);
      userInfo = { ...(await dispatch('removeTypename', userInfo)) };
      // If error already encountered from gql action, quit function
      if (state.error) return;
      // Ending server action
      dispatch('endServerAction');
      // Setting Snackbar
      switch (payload.context) {
        case 'addToFavorites':
          dispatch('setSnackBar', {
            snackBarText: 'Added to Favorites!',
            targetRequired: null,
            targetText: null,
            targetLink: null,
          });
          break;

        default:
          break;
      }
      return userInfo;
    } catch (error) {
      dispatch('handleCatchError', error);
    }
  },
  // Updating ItemArray
  updateItemArray: async ({ state, commit, dispatch }, payload) => {
    // Initializing server action
    await dispatch('initializeSilentServerAction');
    // Updating ItemArray
    try {
      // Server action
      let itemArray = await dispatch('updateItemArrayGql', payload);
      // If error already encountered from gql action, quit function
      if (state.error) return;
      // Ending server action
      dispatch('endServerAction');
      // Setting Snackbar
      dispatch('setSnackBar', {
        snackBarText: itemArray.message,
        targetRequired: null,
        targetText: null,
        targetLink: null,
      });
      return itemArray;
    } catch (error) {
      dispatch('handleCatchError', error);
    }
  },
  // Adding a Subscriber
  subscribeUser: async ({ state, commit, dispatch }, payload) => {
    // Initializing server action
    await dispatch('initializeServerAction');
    state.progressing = true;
    // Adding subscriber
    try {
      // adding subscriber
      let subscribeUser = await dispatch('subscribeUserGql', payload);
      // If error already encountered from gql action, quit function
      if (state.error) return;
      // Ending server action
      dispatch('endServerAction');
      dispatch('setSnackBarText', { text: subscribeUser.message });
      return subscribeUser;
    } catch (error) {
      dispatch('handleCatchError', error);
    }
  },
  // UNSUBSCRIBING A USER
  unsubscribeUser: async ({ state, commit, dispatch }, payload) => {
    // Initializing server action
    await dispatch('initializeServerAction');
    state.progressing = true;
    // unsubscribing a user
    try {
      // adding subscriber
      let unsubscribeUser = await dispatch('unsubscribeUserGql', payload);
      // If error already encountered from gql action, quit function
      if (state.error) return;
      // Ending server action
      dispatch('endServerAction');
      dispatch('setSnackBarText', { text: unsubscribeUser.message });
      return unsubscribeUser;
    } catch (error) {
      dispatch('handleCatchError', error);
    }
  },
  // setting token info
  setTokenInfo: ({ state, commit, dispatch }, payload) => {
    let userResponse = payload;
    const token = userResponse.token;
    const tokenExpiryPeriod = userResponse.tokenExpiration;

    // Set cookie with token
    Cookies.set('papiloomToken', token, {
      expires: tokenExpiryPeriod,
      secure: process.env.NODE_ENV === 'production', // Ensure secure in production
      sameSite: 'Lax', // or 'Strict' based on requirement
    });
    commit('setToken', token);

    // Calculate expiry time
    let date = new Date();
    date.setDate(date.getDate() + tokenExpiryPeriod);
    const tokenExpiryTime = date.toISOString();

    Cookies.set('papiloomTokenExpiryTime', tokenExpiryTime, {
      expires: tokenExpiryPeriod,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Lax',
    });
  },

  // Clearing ReLogin Dialog
  clearReLogInDialog: ({ state, commit, dispatch }) => {
    state.reLogInDialog = false;
    state.reLogInDialogHeading = 'You are about to be Logged Out';
    state.reLogInText =
      "Your session is about to expire in 30 minutes. Please click on 'Re-Login' to stay logged in. Otherwise, you will be logged out in 30 minutes from now.";
    state.isReLogInFormValid = true;
    state.displayReLogInPassword = false;
    state.reLogInPassword = '';
  },
  // Getting reasons for unbsubscribing
  getReasonsForUnsubscribing: async ({ state, commit, dispatch }, payload) => {
    // Initializing server action
    await dispatch('initializeServerAction');
    // Getting StatesProvinces
    try {
      // Server action
      let reasonsForUnsubscribing = await dispatch(
        'getCategoryListGql',
        payload
      );
      // If error already encountered from gql action, quit function
      if (state.error) return;
      // Ending server action
      dispatch('endServerAction');
      return reasonsForUnsubscribing;
    } catch (error) {
      dispatch('handleCatchError', error);
    }
  },
  submitContactRequest: async ({ state, commit, dispatch }, payload) => {
    // Initializing server action
    await dispatch('initializeServerAction');
    // submitting contact request
    try {
      // Server action
      let contactRequestConfirmation = await dispatch(
        'submitContactRequestGql',
        payload
      );
      // If error already encountered from gql action, quit function
      if (state.error) return;
      // Ending server action
      dispatch('endServerAction');
      return contactRequestConfirmation;
    } catch (error) {
      dispatch('handleCatchError', error);
    }
  },
  deleteUserAccount: async ({ state, commit, dispatch }) => {
    try {
      console.log('Initializing account deletion...'); // Debug log

      // Initializing server action
      commit('setIgnoreApolloStoreReset', true);
      await dispatch('initializeServerAction');

      const response = await dispatch('deleteUserAccountGql', {
        userId: state.user._id,
      });

      console.log('Delete account response:', response); // Debug log

      // If error already encountered from gql action, quit function
      if (state.error) return;

      if (response && response.message) {
        console.log('Account deleted, cleaning up application state...'); // Debug log

        // Remove cookies
        dispatch('removeCookies');

        // Reset Vuex state
        commit('resetState');
        commit('setUser', null);
        commit('setToken', '');

        // Reset Apollo store
        await dispatch('signoutUser');

        // Reset app initialization flags
        commit('setInitializeAppComplete', false);
        commit('setIgnoreApolloStoreReset', false);

        // Reinitialize App
        await dispatch('startApp');

        console.log('Application state cleaned and reinitialized'); // Debug log

        return response;
      }

      // Ending server action
      dispatch('endServerAction');
    } catch (error) {
      console.error('Error in deleteUserAccount:', error); // Debug log
      commit('setIgnoreApolloStoreReset', false);
      dispatch('handleCatchError', error);
    }
  },
  // Verify email using token from email link
  verifyEmailWithToken: async ({ state, commit, dispatch }, payload) => {
    // Initializing server action
    commit('setIgnoreApolloStoreReset', true);
    await dispatch('initializeServerAction');
    // Removing Cookies entries
    dispatch('removeCookies');

    // Check if we need to use the dev or production URL
    const baseUrl =
      process.env.NODE_ENV === 'production'
        ? process.env.VUE_APP_BASE_URL
        : process.env.VUE_APP_BASE_URL_DEV;

    // Prepare payload with userId and token (which is the OTP)
    let userPayload = {
      userOtpInput: {
        userId: payload.userId,
        otp: payload.token,
        context: 'emailVerification', // Explicitly set the context to ensure correct verification
      },
    };

    console.log('Sending verification payload:', userPayload);

    try {
      // Call the same mutation used for OTP verification
      let userResponse = await dispatch('verifyUserGql', userPayload);

      // Check if we have any GraphQL errors in the state
      if (state.error) {
        console.error('Error state detected:', state.error);
        throw new Error(state.error);
      }

      // Check if we have a valid response
      if (!userResponse) {
        console.error('Error verifying email: Invalid response from server');
        throw new Error('Email verification failed. No response from server.');
      }

      userResponse = { ...(await dispatch('removeTypename', userResponse)) };

      // Setting User and explicitly setting userId
      if (userResponse.user) {
        commit('setUser', userResponse.user);
        commit('setUserId', userResponse.user._id);

        // Setting token and expiry
        dispatch('setTokenInfo', userResponse);

        // Set user cart
        if (userResponse.user.cart) {
          commit('setCart', userResponse.user.cart);
        }
      } else {
        console.error('Error: User object missing in response');
        throw new Error('Email verification failed. Invalid user data.');
      }

      // Initialize app (loads necessary data)
      await dispatch('initializeApp');

      // Return success to component
      return { success: true };
    } catch (error) {
      console.error('Email verification error:', error);
      commit('setIgnoreApolloStoreReset', false);
      dispatch('handleCatchError', error);
      throw error; // Rethrow to component
    } finally {
      // Ending server action
      dispatch('endServerAction');
    }
  },
};
// App general actions
const common = {
  // Initialize App
  initializeApp: async ({ state, commit, dispatch }) => {
    // Initializing server action
    await dispatch('initializeServerAction');
    console.log('Initializing App');
    // Getting App Initialization Data
    const { data } = await apolloClient.query({
      query: gqlQueries.GET_APP_INITIALIZATION_DATA,
      // variables: payload,
    });
    const { getAppInitializationData } = data;
    commit('setInitializeAppComplete', false);
    await dispatch('endServerAction'); // Ending server action
    const cleanedData = await dispatch(
      'removeTypename',
      getAppInitializationData
    );
    commit('setAlphaResources', cleanedData.alphaResources);
    commit(
      'setConstructorAlphaResources',
      cleanedData.constructorAlphaResources
    );
    commit('setItems', cleanedData.items);
    commit('setPages', cleanedData.pages);
    commit('setItemModels', cleanedData.itemModels);
    commit('setUnitMatrices', cleanedData.unitMatrices);
    commit('setItemCategories', cleanedData.itemCategories);
    commit('setCountryPhoneCodes', cleanedData.countryPhoneCodes);
    commit('setOrderStatusCodes', cleanedData.orderStatusCodes);
    commit(
      'setUserItemCategories',
      cleanedData.userItemCategories.pairedStringList
    );
    commit('setAppEnv', cleanedData.appEnv);
    commit('setAppMenus', cleanedData.appMenus);
    if (
      Object.keys(state.homePageCarousel).length === 0 &&
      state.homePageCarousel.constructor === Object
    ) {
      commit('setHomePageCarousel', cleanedData.homePageCarousel);
      state.homePageCarousel = await dispatch(
        'sanitizeResource',
        state.homePageCarousel
      );
    }
    if (
      Object.keys(state.homePageData).length === 0 &&
      state.homePageData.constructor === Object
    ) {
      commit('setHomePageData', cleanedData.homePageData);
      state.homePageData = await dispatch(
        'santizePageResources',
        state.homePageData
      );
    }
    commit('setDealItems', cleanedData.dealItems);
    commit('setAppTags', cleanedData.appTags);
    commit('setStatesProvinces', cleanedData.statesProvinces);

    // Get home Page Data
    commit('setHomePageDataReceived', true);
    // Get home carousel Data
    await dispatch('setHomePageCarouselImages');
    // get Deal Items
    // await dispatch('getDealItems');

    // Set Home Screen Data
    await dispatch('setHomeScreenData');
    // get app tags
    // await dispatch('getAnceptTags');
    // Assign tags
    await dispatch('assignAppTags');
    // Categorizing resources
    await dispatch('categorizeResources');
    // Setting completion status
    commit('setInitializeAppComplete', true);
  },
  setHomeScreenData: async ({ state, commit, dispatch }) => {
    // set item category data
    state.homeScreenData.itemCategoryData = [];
    state.itemCategories.forEach((category) => {
      let itemCategoryObject = {
        name: category.name,
        items: [
          ...state.items.filter((item) => item.category === category.name),
        ],
      };
      if (
        state.items.filter((item) => item.category === category.name).length ===
        20
      ) {
        itemCategoryObject.items.push({ name: 'showMore' });
      }
      state.homeScreenData.itemCategoryData.push(itemCategoryObject);
    });
    if (state.user) {
      // Set user array items- Ordered Items, favorites, Recently viewedItems
      // const userItemCategories = await dispatch('getPairedStringListGql', {
      //   pairedStringListName: 'userItemPairList',
      // });

      state.homeScreenData.userItemCategoryData = [];
      state.userItemCategories.forEach((category) => {
        state.homeScreenData.userItemCategoryData.push({
          name: category.stringValue,
          items: state.user[category.key],
        });
      });
    }
  },
  setAppTheme: ({ state, commit, dispatch }) => {
    if (state.user && state.user.isDarkTheme) {
      commit('setAppDark', true);
      // state.appDark = true;
    }
  },
  // Getting menus
  getAppMenus: async ({ state, commit, dispatch }, payload) => {
    // Initializing server action
    await dispatch('initializeServerAction');
    // Getting Pages
    try {
      // Server action
      let menus = await dispatch('getAppMenusGql', payload);
      menus = await dispatch('removeTypename', menus);
      // If error already encountered from gql action, quit function
      if (state.error) return;
      // Ending server action
      dispatch('endServerAction');
      // setting pages
      commit('setAppMenus', menus);
      commit('setAppMenusReceived', true);
      return menus;
    } catch (error) {
      dispatch('handleCatchError', error);
    }
  },
  // add menu
  addMenu: async ({ state, commit, dispatch }, payload) => {
    // Initializing server action
    await dispatch('initializeServerAction');
    // Adding Menu
    try {
      let menu = await dispatch('addMenuGql', payload);
      menu = await dispatch('removeTypename', menu);
      if (state.error) return; // If error already encountered from gql action, quit function
      dispatch('endServerAction'); // Ending server action
      // Setting Snackbar
      dispatch('setSnackBar', {
        snackBarText: 'Menu created successfully!',
        targetRequired: null,
        targetText: null,
        targetLink: null,
      });
      return menu;
    } catch (error) {
      dispatch('handleCatchError', error);
    }
  },
  // update menu
  updateMenu: async ({ state, commit, dispatch }, payload) => {
    // Initializing server action
    await dispatch('initializeServerAction');
    // Updating Menu
    try {
      let menu = await dispatch('updateMenuGql', payload);
      menu = await dispatch('removeTypename', menu);
      if (state.error) return; // If error already encountered from gql action, quit function
      dispatch('endServerAction'); // Ending server action
      // Setting Snackbar
      dispatch('setSnackBar', {
        snackBarText: 'Menu updated successfully!',
        targetRequired: null,
        targetText: null,
        targetLink: null,
      });
      return menu;
    } catch (error) {
      dispatch('handleCatchError', error);
    }
  },
  // delette menu
  deleteMenu: async ({ state, commit, dispatch }, payload) => {
    // Initializing server action
    await dispatch('initializeServerAction');
    // Deleting Menu
    try {
      const messageData = await dispatch('deleteMenuGql', payload);
      if (state.error) return; // If error already encountered from gql action, quit function
      dispatch('endServerAction'); // Ending server action
      // Setting Snackbar
      dispatch('setSnackBar', {
        snackBarText: messageData.message,
        targetRequired: null,
        targetText: null,
        targetLink: null,
      });
    } catch (error) {
      dispatch('handleCatchError', error);
    }
  },
};
// Resource Actions
const resource = {
  // get Alpha Resources
  getAlphaResources: async ({ state, commit, dispatch }) => {
    // Initializing server action
    await dispatch('initializeServerAction');
    try {
      // Getting the resurces from database
      let alphaResources = await dispatch('getAlphaResourcesGql');
      // If error already encountered from gql action, quit function
      if (state.error) return;
      state.alphaResources = alphaResources;

      // updating data received flag
      // commit("setResourceDataReceived", true);
      // Ending server action
      dispatch('endServerAction');
    } catch (error) {
      dispatch('handleCatchError', error);
    }
  },
  // get Alpha Resources
  getConstructorAlphaResources: async ({ state, commit, dispatch }) => {
    // Initializing server action
    await dispatch('initializeServerAction');
    try {
      // Getting the resources from database
      let constructorAlphaResources = await dispatch(
        'getConstructorAlphaResourcesGql'
      );
      // If error already encountered from gql action, quit function
      if (state.error) return;
      state.constructorAlphaResources = constructorAlphaResources;

      // updating data received flag
      // commit("setResourceDataReceived", true);
      // Ending server action
      dispatch('endServerAction');
    } catch (error) {
      dispatch('handleCatchError', error);
    }
  },
  getSingleAlphaResource: async ({ state, commit, dispatch }, payload) => {
    // Initializing server action
    await dispatch('initializeServerAction');
    try {
      // Getting the resources from database
      let alphaResource = await dispatch('getSingleAlphaResourceGql', payload);
      // removing __typenmae
      alphaResource = { ...(await dispatch('removeTypename', alphaResource)) };
      if (state.error)
        // If error already encountered from gql action, quit function
        return;
      alphaResource = dispatch('sanitizeResource', alphaResource);
      // updating data received flag
      commit('setResourceDataReceived', true);
      // Ending server action
      dispatch('endServerAction');
      return alphaResource;
    } catch (error) {
      dispatch('handleCatchError', error);
    }
  },
  // Upload resource image
  uploadResourceImage: async ({ state, commit, dispatch }, payload) => {
    // Initializing server action
    await dispatch('initializeServerAction');
    state.progressing = true;
    // Updating the resource Image
    try {
      // Uploading new logo
      let imageUrl = await dispatch('uploadResourceImageGql', {
        file: payload.image,
      });
      // If error already encountered from gql action, quit function
      if (state.error) return;
      dispatch('setSnackBarText', { text: 'Image Uploaded!' });
      state.loading = false;
      state.progressing = false;
      return imageUrl;
    } catch (error) {
      dispatch('handleCatchError', error);
    }
  },
  // Upload resource image
  uploadResourceImage2: async ({ state, commit, dispatch }, payload) => {
    // Initializing server action
    await dispatch('initializeServerAction');
    // Uploading image
    try {
      const response = await axios.post('upload/resourceimage', payload.image, {
        headers: {
          'Content-Type': 'multipart/form-data',
          common: state.axiosConfig.headers.common,
        },
      });
      // Ending server action
      dispatch('endServerAction');
      // Setting snackBar
      dispatch('setSnackBarText', { text: 'Image Uploaded!' });
      return response.data;
    } catch (error) {
      dispatch('handleCatchError', error);
    }
  },
  // Adding Alpha resource
  addAlphaResource: async ({ state, commit, dispatch }, payload) => {
    // Initializing server action
    await dispatch('initializeServerAction');
    state.progressing = true;
    // Adding Alpha resource
    try {
      // Uploading new logo
      let alphaResource = await dispatch('addAlphaResourceGql', payload);
      // If error already encountered from gql action, quit function
      if (state.error) return;
      // Ending server action
      dispatch('endServerAction');
      dispatch('setSnackBarText', { text: 'Resource created!' });
      return alphaResource;
    } catch (error) {
      dispatch('handleCatchError', error);
    }
  },
  // Updating Alpha resource
  updateAlphaResource: async ({ state, commit, dispatch }, payload) => {
    // Initializing server action
    await dispatch('initializeServerAction');
    state.progressing = true;
    // Updating Alpha resource
    try {
      // Uploading new logo
      let alphaResource = await dispatch('updateAlphaResourceGql', payload);
      // If error already encountered from gql action, quit function
      if (state.error) return;
      // Ending server action
      dispatch('endServerAction');
      // Setting snackBar
      dispatch('setSnackBarText', { text: 'Resource updated!' });
      return alphaResource;
    } catch (error) {
      dispatch('handleCatchError', error);
    }
  },
  // Deleting Alpha Resource
  deleteAlphaResource: async ({ state, commit, dispatch }, payload) => {
    // Initializing server action
    await dispatch('initializeServerAction');
    // Deleting Alpha resource
    try {
      // Deleting new logo
      const messageData = await dispatch('deleteAlphaResourceGql', payload);
      // If error already encountered from gql action, quit function
      if (state.error) return;
      // Ending server action
      dispatch('endServerAction');
      // Setting snackBar
      dispatch('setSnackBarText', { text: messageData.message });
      return;
    } catch (error) {
      dispatch('handleCatchError', error);
    }
  },
  // Disabling Alpha Resource
  disableAlphaResource: async ({ state, commit, dispatch }, payload) => {
    // Initializing server action
    await dispatch('initializeServerAction');
    state.progressing = true;
    // Deleting Alpha resource
    try {
      // Deleting new logo
      const messageData = await dispatch('disableAlphaResourceGql', payload);
      // If error already encountered from gql action, quit function
      if (state.error) return;
      // Ending server action
      dispatch('endServerAction');
      // Setting snackBar
      dispatch('setSnackBarText', { text: messageData.message });
      return;
    } catch (error) {
      dispatch('handleCatchError', error);
    }
  },
  // Categorize resources
  categorizeResources: ({ state, commit, dispatch }) => {
    // Categorizing resources
    // SHS
    let generalAlphaResources = state.alphaResources.filter(
      (resource) => resource.category === 'General'
    );
    let generalResources = [...generalAlphaResources];
    commit('setGeneralResources', generalResources);

    // Process Analyzer
    let processAnalyzerAlphaResources = state.alphaResources.filter(
      (resource) => resource.category === 'Process Analyzer'
    );
    let processAnalyzerResources = [...processAnalyzerAlphaResources];
    commit('setProcessAnalyzerResources', processAnalyzerResources);
    // Process Calculation
    let processCalculationAlphaResources = state.alphaResources.filter(
      (resource) => resource.category === 'Process Calculation'
    );
    let processCalculationResources = [...processCalculationAlphaResources];
    commit('setProcessCalculationResources', processCalculationResources);
    if (
      state.user &&
      (state.user.admin || state.user.resourceCreator) &&
      state.constructorAlphaResources.length > 0
    ) {
      // COnstructor Resources
      let constructorAlphaResources = state.constructorAlphaResources.filter(
        (resource) => resource.category === 'Constructor'
      );
      let constructorResources = [...constructorAlphaResources];
      commit('setConstructorResources', constructorResources);
    }
  },
  // get App Tags
  getAnceptTags: async ({ state, commit, dispatch }) => {
    // Initializing server action
    await dispatch('initializeServerAction');
    try {
      // Getting the App tags from database
      let appTags = await dispatch('getAnceptTagsGql');
      // If error already encountered from gql action, quit function
      if (state.error) return;
      state.appTags = appTags;
      // Ending server action
      dispatch('endServerAction');
    } catch (error) {
      dispatch('handleCatchError', error);
    }
  },
  // Assigning different tag lists
  assignAppTags: ({ state, commit, dispatch }) => {
    let appTags = state.appTags;
    let resourceTagList = appTags.find(
      (tagList) => tagList.listName === 'Resource Tags'
    );
    // Setting Resource Tags
    commit('setAppResourceTags', resourceTagList.tagList);
  },
  // Deleting Alpha Resource
  deleteAlphaResourceImage: async ({ state, commit, dispatch }, payload) => {
    // Initializing server action
    await dispatch('initializeServerAction');
    // performing backend operation
    try {
      const messageData = await dispatch(
        'deleteAlphaResourceImageGql',
        payload
      );
      // If error already encountered from gql action, quit function
      if (state.error) return;
      // Ending server action
      dispatch('endServerAction');
      // Setting snackBar
      dispatch('setSnackBarText', { text: messageData.message });
      return;
    } catch (error) {
      dispatch('handleCatchError', error);
    }
  },
};
// Reviews
const review = {
  // Adding review
  addReview: async ({ state, commit, dispatch }, payload) => {
    // Initializing server action
    await dispatch('initializeServerAction');
    // Adding Review
    try {
      // Uploading new logo
      let review = await dispatch('addReviewGql', payload);
      // If error already encountered from gql action, quit function
      if (state.error) return;
      // Ending server action
      dispatch('endServerAction');
      // Setting snackBar
      dispatch('setSnackBarText', { text: 'Review created!' });
      return review;
    } catch (error) {
      dispatch('handleCatchError', error);
    }
  },
  // Updating Review
  updateReview: async ({ state, commit, dispatch }, payload) => {
    // Initializing server action
    await dispatch('initializeServerAction');
    // Updating ItemModel
    try {
      // Uploading new logo
      let review = await dispatch('updateReviewGql', payload);
      // If error already encountered from gql action, quit function
      if (state.error) return;
      // Ending server action
      dispatch('endServerAction');
      // Setting snackBar
      dispatch('setSnackBarText', { text: 'Review updated!' });
      return review;
    } catch (error) {
      dispatch('handleCatchError', error);
    }
  },
  // Adding rating
  addRating: async ({ state, commit, dispatch }, payload) => {
    // Initializing server action
    await dispatch('initializeServerAction');
    // Adding Rating
    try {
      // Uploading rating
      let rating = await dispatch('addRatingGql', payload);
      // If error already encountered from gql action, quit function
      if (state.error) return;
      // Ending server action
      dispatch('endServerAction');
      // Setting snackBar
      dispatch('setSnackBarText', { text: 'Rating created!' });
      return rating;
    } catch (error) {
      dispatch('handleCatchError', error);
    }
  },
  // Updating Review
  updateRating: async ({ state, commit, dispatch }, payload) => {
    // Initializing server action
    await dispatch('initializeServerAction');
    // Updating rating
    try {
      // Uploading rating
      let rating = await dispatch('updateRatingGql', payload);
      // If error already encountered from gql action, quit function
      if (state.error) return;
      // Ending server action
      dispatch('endServerAction');
      // Setting snackBar
      dispatch('setSnackBarText', { text: 'Rating updated!' });
      return rating;
    } catch (error) {
      dispatch('handleCatchError', error);
    }
  },
  // Updating Review
  incrementFoundHelpful: async ({ state, commit, dispatch }, payload) => {
    // Initializing silent server action
    await dispatch('initializeSilentServerAction');
    // Updating rating
    try {
      // Uploading rating
      let message = await dispatch('incrementFoundHelpfulGql', payload);
      // If error already encountered from gql action, quit function
      if (state.error) return;
      // Ending server action
      dispatch('endServerAction');
      // Setting snackBar
      dispatch('setSnackBarText', { text: 'Rating updated!' });
      return;
    } catch (error) {
      dispatch('handleCatchError', error);
    }
  },
  // Get reviews by user
  getReviewsByUser: async ({ state, commit, dispatch, getters }) => {
    // Initializing server action
    await dispatch('initializeServerAction');
    // Server action
    try {
      // Uploading rating
      let reviews = await dispatch('getReviewsByUserGql');
      // If error already encountered from gql action, quit function
      if (state.error) return;
      // Ending server action
      dispatch('endServerAction');
      // Inserting imageUrl
      reviews.forEach((review) => {
        review.item.images.forEach((image) => {
          image.imageUrl = getters.serverDomain + image.imageLink;
        });
      });
      state.user.reviewsByUser = reviews;
      commit('setReviewsByUserDataReceived', true);
      return;
    } catch (error) {
      dispatch('handleCatchError', error);
    }
  },
};
// Address
const address = {
  // Adding Address
  addAddress: async ({ state, commit, dispatch }, payload) => {
    // Initializing server action
    await dispatch('initializeServerAction');
    // Adding Address
    try {
      // Server action
      let address = await dispatch('addAddressGql', payload);
      // If error already encountered from gql action, quit function
      if (state.error) return;
      // Ending server action
      dispatch('endServerAction');
      // Setting Snackbar
      dispatch('setSnackBar', {
        snackBarText: 'Address created!',
        targetRequired: null,
        targetText: null,
        targetLink: null,
      });
      return address;
    } catch (error) {
      dispatch('handleCatchError', error);
    }
  },
  // Updating Address
  updateAddress: async ({ state, commit, dispatch }, payload) => {
    // Initializing server action
    await dispatch('initializeServerAction');
    // Updating Address
    try {
      // Server action
      let address = await dispatch('updateAddressGql', payload);
      // If error already encountered from gql action, quit function
      if (state.error) return;
      // Ending server action
      dispatch('endServerAction');
      // Setting Snackbar
      dispatch('setSnackBar', {
        snackBarText: 'Address updated!',
        targetRequired: null,
        targetText: null,
        targetLink: null,
      });
      return address;
    } catch (error) {
      dispatch('handleCatchError', error);
    }
  },
  // Deleting Address
  deleteAddress: async ({ state, commit, dispatch }, payload) => {
    // Initializing server action
    await dispatch('initializeServerAction');
    // Deleting Address
    try {
      // Server action
      const messageData = await dispatch('deleteAddressGql', payload);
      // If error already encountered from gql action, quit function
      if (state.error) return;
      // Ending server action
      dispatch('endServerAction');
      // Setting Snackbar
      dispatch('setSnackBar', {
        snackBarText: messageData.message,
        targetRequired: null,
        targetText: null,
        targetLink: null,
      });
      return address;
    } catch (error) {
      dispatch('handleCatchError', error);
    }
  },
  // Getting Addresses
  getAddressesByUser: async ({ state, commit, dispatch }, payload) => {
    // Initializing server action
    await dispatch('initializeServerAction');
    // Getting Addresses
    try {
      // Server action
      let addresses = await dispatch('getAddressesByUserGql', payload);
      // If error already encountered from gql action, quit function
      if (state.error) return;
      // Ending server action
      dispatch('endServerAction');
      return addresses;
    } catch (error) {
      dispatch('handleCatchError', error);
    }
  },
  // Getting States Provinces
  getStatesProvinces: async ({ state, commit, dispatch }, payload) => {
    // Initializing server action
    await dispatch('initializeServerAction');
    // Getting StatesProvinces
    try {
      // Server action
      let statesProvinces = await dispatch('getCategoryListGql', payload);
      // If error already encountered from gql action, quit function
      if (state.error) return;
      // Ending server action
      dispatch('endServerAction');
      return statesProvinces;
    } catch (error) {
      dispatch('handleCatchError', error);
    }
  },
};
// BOM/Items/Item Models/Categories/payment/orders
const bom = {
  // get Item Models
  getItemModels: async ({ state, commit, dispatch }) => {
    // Initializing server action
    await dispatch('initializeServerAction');
    try {
      // Getting the resuult from database
      let result = await dispatch('getItemModelsGql');
      // If error already encountered from gql action, quit function
      if (state.error) return;
      state.itemModels = result;

      // Ending server action
      dispatch('endServerAction');
    } catch (error) {
      dispatch('handleCatchError', error);
    }
  },
  getSingleItemModel: async ({ state, commit, dispatch }, payload) => {
    // Initializing server action
    await dispatch('initializeServerAction');
    try {
      // Getting the itemmodels from database
      let itemModel = await dispatch('getSingleItemModelGql', payload);
      // removing __typenmae
      itemModel = { ...(await dispatch('removeTypename', itemModel)) };
      // If error already encountered from gql action, quit function
      if (state.error) return;
      // Add imageURL field for each image
      if (itemModel.images.length) {
        itemModel.images.forEach((el) => {
          if (el.imageLink) {
            el.imageUrl = el.imageLink;
          }
        });
      }
      // Add imageURL field for deafult image
      // updating data received flag
      commit('setItemModelDataReceived', true);
      // Ending server action
      dispatch('endServerAction');
      return itemModel;
    } catch (error) {
      dispatch('handleCatchError', error);
    }
  },
  // Adding ItemModel
  addItemModel: async ({ state, commit, dispatch }, payload) => {
    // Initializing server action
    await dispatch('initializeServerAction');
    // Adding ItemModel
    try {
      // Uploading new logo
      let itemModel = await dispatch('addItemModelGql', payload);
      // If error already encountered from gql action, quit function
      if (state.error) return;
      // Ending server action
      dispatch('endServerAction');
      // Setting snackBar
      dispatch('setSnackBarText', { text: 'Item model created!' });
      return itemModel;
    } catch (error) {
      dispatch('handleCatchError', error);
    }
  },
  // Updating ItemModel
  updateItemModel: async ({ state, commit, dispatch }, payload) => {
    // Initializing server action
    await dispatch('initializeServerAction');
    // Updating ItemModel
    try {
      // Uploading new logo
      let itemModel = await dispatch('updateItemModelGql', payload);
      // If error already encountered from gql action, quit function
      if (state.error) return;
      // Ending server action
      dispatch('endServerAction');
      // Setting snackBar
      dispatch('setSnackBarText', { text: 'Item model updated!' });
      return itemModel;
    } catch (error) {
      dispatch('handleCatchError', error);
    }
  },
  // Disabling Item Model
  disableItemModel: async ({ state, commit, dispatch }, payload) => {
    // Initializing server action
    await dispatch('initializeServerAction');
    // Disabling Item Model
    try {
      // Deleting new logo
      const messageData = await dispatch('disableItemModelGql', payload);
      // If error already encountered from gql action, quit function
      if (state.error) return;
      // Ending server action
      dispatch('endServerAction');
      // Setting snackBar
      dispatch('setSnackBarText', { text: messageData.message });
      return;
    } catch (error) {
      dispatch('handleCatchError', error);
    }
  },
  // get Items
  getItems: async ({ state, commit, dispatch }) => {
    // Initializing server action
    await dispatch('initializeServerAction');
    try {
      // Getting the resuult from database
      let result = await dispatch('getItemsGql');
      // If error already encountered from gql action, quit function
      if (state.error) return;
      state.items = result;
      // Ending server action
      dispatch('endServerAction');
    } catch (error) {
      dispatch('handleCatchError', error);
    }
  },
  // get All Category Items
  getAllCategoryItems: async ({ state, commit, dispatch }, payload) => {
    // Initializing server action
    await dispatch('initializeServerAction');
    try {
      const gqlPayload = {
        itemCategoryInput: {
          itemCategoryName: payload.itemCategoryName,
        },
      };
      // Getting the resuult from database
      let result = await dispatch('getAllCategoryItemsGql', gqlPayload);
      // If error already encountered from gql action, quit function
      if (state.error) return;

      return result;
      // Ending server action
      dispatch('endServerAction');
    } catch (error) {
      dispatch('handleCatchError', error);
    }
  },
  // get App Env
  getAppEnv: async ({ state, commit, dispatch }) => {
    // Initializing server action
    await dispatch('initializeServerAction');
    try {
      // Getting the resuult from database
      let result = await dispatch('getAppEnvGql');
      // If error already encountered from gql action, quit function
      if (state.error) return;
      state.appEnv = result;
      // Ending server action
      dispatch('endServerAction');
    } catch (error) {
      dispatch('handleCatchError', error);
    }
  },
  // get Deal Items
  getDealItems: async ({ state, commit, dispatch }) => {
    // Initializing server action
    await dispatch('initializeServerAction');
    try {
      // Getting the resuult from database
      let result = await dispatch('getDealItemsGql');
      // If error already encountered from gql action, quit function
      if (state.error) return;
      state.dealItems = result;
      // Ending server action
      dispatch('endServerAction');
    } catch (error) {
      dispatch('handleCatchError', error);
    }
  },
  // get Deal Items
  getAllDealItems: async ({ state, commit, dispatch }) => {
    // Initializing server action
    await dispatch('initializeServerAction');
    try {
      // Getting the resuult from database
      let result = await dispatch('getAllDealItemsGql');
      // If error already encountered from gql action, quit function
      if (state.error) return;
      return result;
      // Ending server action
      dispatch('endServerAction');
    } catch (error) {
      dispatch('handleCatchError', error);
    }
  },
  // get single item
  getSingleItem: async ({ state, commit, dispatch }, payload) => {
    // Initializing server action
    await dispatch('initializeServerAction');
    try {
      // Getting the Unitsingle item  from database
      let item = await dispatch('getSingleItemGql', payload);
      // /removing _typename
      item = { ...(await dispatch('removeTypename', item)) };
      // If error already encountered from gql action, quit function
      if (state.error) return;
      // Add imageURL field for each image
      if (item.images.length) {
        item.images.forEach((el) => {
          if (el.imageLink) {
            el.imageUrl = el.imageLink;
          }
        });
      }
      // Converting Default Image URL with
      // if (item.defaultImage !== "") {
      //   item.defaultImage = item.defaultImage;
      // }
      // updating data received flag
      commit('setItemDataReceived', true);
      // Ending server action
      dispatch('endServerAction');
      return item;
    } catch (error) {
      dispatch('handleCatchError', error);
    }
  },
  // Adding Item
  addItem: async ({ state, commit, dispatch }, payload) => {
    // Initializing server action
    await dispatch('initializeServerAction');
    // Adding Item
    try {
      // Uploading new logo
      let item = await dispatch('addItemGql', payload);
      // If error already encountered from gql action, quit function
      if (state.error) return;
      // Ending server action
      dispatch('endServerAction');
      // Setting snackBar
      dispatch('setSnackBarText', { text: 'Item created!' });
      return item;
    } catch (error) {
      dispatch('handleCatchError', error);
    }
  },
  // Updating Item
  updateItem: async ({ state, commit, dispatch }, payload) => {
    // Initializing server action
    await dispatch('initializeServerAction');
    // Updating Item
    try {
      // Uploading image
      let item = await dispatch('updateItemGql', payload);
      // If error already encountered from gql action, quit function
      if (state.error) return;
      // Ending server action
      dispatch('endServerAction');
      // Setting snackBar
      dispatch('setSnackBarText', { text: 'Item updated!' });
      return item;
    } catch (error) {
      dispatch('handleCatchError', error);
    }
  },
  // Disabling Item
  disableItem: async ({ state, commit, dispatch }, payload) => {
    // Initializing server action
    await dispatch('initializeServerAction');
    // Disabling Item
    try {
      // Deleting Image
      const messageData = await dispatch('disableItemGql', payload);
      // If error already encountered from gql action, quit function
      if (state.error) return;
      // Ending server action
      dispatch('endServerAction');
      // Setting snackBar
      dispatch('setSnackBarText', { text: messageData.message });
      return;
    } catch (error) {
      dispatch('handleCatchError', error);
    }
  },

  // Upload item Model image
  uploadItemModelImage: async ({ state, commit, dispatch }, payload) => {
    // Initializing server action
    await dispatch('initializeServerAction');
    state.progressing = true;
    // Uploading image
    try {
      // Uploading new logo
      let imageUrl = await dispatch('uploadItemModelImageGql', {
        file: payload.image,
      });
      // If error already encountered from gql action, quit function
      if (state.error) return;
      // Ending server action
      dispatch('endServerAction');
      // Setting snackBar
      dispatch('setSnackBarText', { text: 'Image Uploaded!' });
      return imageUrl;
    } catch (error) {
      dispatch('handleCatchError', error);
    }
  },
  // Upload item model image via axios
  uploadItemModelImage2: async ({ state, commit, dispatch }, payload) => {
    // Initializing server action
    await dispatch('initializeServerAction');
    // Uploading image
    try {
      const response = await axios.post(
        'upload/itemmodelimage',
        payload.image,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            common: state.axiosConfig.headers.common,
          },
        }
      );
      // Ending server action
      dispatch('endServerAction');
      // Setting snackBar
      dispatch('setSnackBarText', { text: 'Image Uploaded!' });
      return response.data;
    } catch (error) {
      dispatch('handleCatchError', error);
    }
  },
  // Upload item image
  uploadItemImage: async ({ state, commit, dispatch }, payload) => {
    // Initializing server action
    await dispatch('initializeServerAction');
    // Uploading image
    try {
      // Uploading new logo
      let imageUrl = await dispatch('uploadItemImageGql', {
        file: payload.image,
      });
      // If error already encountered from gql action, quit function
      if (state.error) return;
      // Ending server action
      dispatch('endServerAction');
      // Setting snackBar
      dispatch('setSnackBarText', { text: 'Image Uploaded!' });
      return imageUrl;
    } catch (error) {
      dispatch('handleCatchError', error);
    }
  },
  // Upload item image via axios
  uploadItemImage2: async ({ state, commit, dispatch }, payload) => {
    // Initializing server action
    await dispatch('initializeServerAction');
    // Uploading image
    try {
      const response = await axios.post('upload/itemimage', payload.image, {
        headers: {
          'Content-Type': 'multipart/form-data',
          common: state.axiosConfig.headers.common,
        },
      });
      // Ending server action
      dispatch('endServerAction');
      // Setting snackBar
      dispatch('setSnackBarText', { text: 'Image Uploaded!' });
      return response.data;
    } catch (error) {
      dispatch('handleCatchError', error);
    }
  },
  // Deleting ItemModel image
  deleteItemModelImage: async ({ state, commit, dispatch }, payload) => {
    // Initializing server action
    await dispatch('initializeServerAction');
    // performing backend operation
    try {
      const messageData = await dispatch('deleteItemModelImageGql', payload);
      // If error already encountered from gql action, quit function
      if (state.error) return;
      // Ending server action
      dispatch('endServerAction');
      // Setting snackBar
      dispatch('setSnackBarText', { text: messageData.message });
      return;
    } catch (error) {
      dispatch('handleCatchError', error);
    }
  },
  // Deleting Item image
  deleteItemImage: async ({ state, commit, dispatch }, payload) => {
    // Initializing server action
    await dispatch('initializeServerAction');
    // performing backend operation
    try {
      const messageData = await dispatch('deleteItemImageGql', payload);
      // If error already encountered from gql action, quit function
      if (state.error) return;
      // Ending server action
      dispatch('endServerAction');
      // Setting snackBar
      dispatch('setSnackBarText', { text: messageData.message });
      return;
    } catch (error) {
      dispatch('handleCatchError', error);
    }
  },
  // set Default item Model
  setDefaultActiveItemModel: ({ state, commit, dispatch }) => {
    commit('setActiveItemModel', {
      name: 'Item Model Name appears here...',
      description: 'Item Model description appears here...',
      category: '',
      subCategory: '',
      group: '',
      tags: [],
      images: [],
      specs: [],
    });
  },
  // Updating cart
  updateCart: async ({ state, commit, dispatch }) => {
    // Setting payload
    // updating the database
    const payload = {
      cartInput: {
        cartId: state.user.cart._id,
        items: state.cart.items.map((el) => {
          return { item: el.item._id, quantity: el.quantity };
        }),
        subTotal: state.cart.subTotal,
        promotion: state.cart.promotion,
        promoCode: state.cart.promoCode,
        billingAddress: state.cart.billingAddress,
        shippingAddress: state.cart.shippingAddress,
        tax: state.cart.tax,
        total: state.cart.total,
        currency: state.cart.currency,
        user: state.user._id,
      },
      context: 'update',
    };
    // Initializing silent server action
    await dispatch('initializeSilentServerAction');
    // Updating server
    try {
      let cart = await dispatch('updateCartGql', payload);
      cart = { ...(await dispatch('removeTypename', cart)) };
      // If error already encountered from gql action, quit function
      if (state.error) return;
      // Ending server action
      dispatch('endServerAction');
      commit('setCart', cart);
      // Setting snackBar
      dispatch('setSnackBarText', { text: 'Cart updated!' });
      return;
    } catch (error) {
      dispatch('handleCatchError', error);
    }
  },
  // Getting ItemCategories
  getItemCategories: async ({ state, commit, dispatch }, payload) => {
    // Initializing server action
    await dispatch('initializeServerAction');
    // Getting Pages
    try {
      // Server action
      let ItemCategories = await dispatch('getItemCategoriesGql', payload);
      ItemCategories = await dispatch('removeTypename', ItemCategories);
      // If error already encountered from gql action, quit function
      if (state.error) return;
      // Ending server action
      dispatch('endServerAction');
      // setting categories
      commit('setItemCategories', ItemCategories);
      return ItemCategories;
    } catch (error) {
      dispatch('handleCatchError', error);
    }
  },
  // add ItemCategory
  addItemCategory: async ({ state, commit, dispatch }, payload) => {
    // Initializing server action
    await dispatch('initializeServerAction');
    // Adding ItemCategory
    try {
      let ItemCategory = await dispatch('addItemCategoryGql', payload);
      ItemCategory = await dispatch('removeTypename', ItemCategory);
      if (state.error) return; // If error already encountered from gql action, quit function
      dispatch('endServerAction'); // Ending server action
      // Setting Snackbar
      dispatch('setSnackBar', {
        snackBarText: 'ItemCategory created successfully!',
        targetRequired: null,
        targetText: null,
        targetLink: null,
      });
      return ItemCategory;
    } catch (error) {
      dispatch('handleCatchError', error);
    }
  },
  // update ItemCategory
  updateItemCategory: async ({ state, commit, dispatch }, payload) => {
    // Initializing server action
    await dispatch('initializeServerAction');
    // Updating ItemCategory
    try {
      let ItemCategory = await dispatch('updateItemCategoryGql', payload);
      ItemCategory = await dispatch('removeTypename', ItemCategory);
      if (state.error) return; // If error already encountered from gql action, quit function
      dispatch('endServerAction'); // Ending server action
      // Setting Snackbar
      dispatch('setSnackBar', {
        snackBarText: 'ItemCategory updated successfully!',
        targetRequired: null,
        targetText: null,
        targetLink: null,
      });
      return ItemCategory;
    } catch (error) {
      dispatch('handleCatchError', error);
    }
  },
  // delete ItemCategory
  deleteItemCategory: async ({ state, commit, dispatch }, payload) => {
    // Initializing server action
    await dispatch('initializeServerAction');
    // Deleting ItemCategory
    try {
      const messageData = await dispatch('deleteItemCategoryGql', payload);
      if (state.error) return; // If error already encountered from gql action, quit function
      dispatch('endServerAction'); // Ending server action
      // Setting Snackbar
      dispatch('setSnackBar', {
        snackBarText: messageData.message,
        targetRequired: null,
        targetText: null,
        targetLink: null,
      });
    } catch (error) {
      dispatch('handleCatchError', error);
    }
  },
  // get Orders
  getOrders: async ({ state, commit, dispatch }, payload) => {
    // Initializing server action
    await dispatch('initializeServerAction');
    try {
      // Dispatch the GraphQL query with the prepared payload
      let result = await dispatch('getOrdersGql', payload);

      // If an error is already encountered from gql action, quit function
      if (state.error) return;

      // Update the orders in the state
      const { orders, numberOfOrderPages } = result;
      commit('setFilteredOrders', orders);
      state.numberOfOrderPages = numberOfOrderPages;
      // Set the orders received flag to true
      commit('setOrdersByUserReceived', true);

      // Ending server action
      dispatch('endServerAction');
    } catch (error) {
      // Handle any errors that occur during the process
      dispatch('handleCatchError', error);
    }
  },

  // get Orders By Admin
  getOrdersByAdmin: async ({ state, commit, dispatch }) => {
    // Initializing server action
    await dispatch('initializeServerAction');
    try {
      // Getting the result from database
      let result = await dispatch('getOrdersByAdminGql');
      // If error already encountered from gql action, quit function
      if (state.error) return;
      state.ordersForAdmin = [...result];
      // Setting orders received flag to true
      commit('setOrdersByAdminReceived', true);
      // Ending server action
      dispatch('endServerAction');
    } catch (error) {
      dispatch('handleCatchError', error);
    }
  },
  // update order statuses by admin
  updateOrderStatusesByAdmin: async ({ state, commit, dispatch }, payload) => {
    // Initializing server action
    await dispatch('initializeServerAction');
    try {
      // Updating orders
      await dispatch('updateOrderStatusesByAdminGQL', payload);
      // If error already encountered from gql action, quit function
      if (state.error) return;

      // Setting snackbar
      dispatch('setSnackBarText', {
        text: 'Order statuses updated successfully!',
        color: 'success',
      });

      // Ending server action
      dispatch('endServerAction');
    } catch (error) {
      dispatch('handleCatchError', error);
    }
  },
};
const page = {
  // Getting Pages
  getPages: async ({ state, commit, dispatch }, payload) => {
    // Initializing server action
    await dispatch('initializeServerAction');
    // Getting Pages
    try {
      // Server action
      let pages = await dispatch('getPagesGql', payload);
      pages = await dispatch('removeTypename', pages);
      // If error already encountered from gql action, quit function
      if (state.error) return;
      // Ending server action
      dispatch('endServerAction');
      // setting pages
      commit('setPages', pages);
      return pages;
    } catch (error) {
      dispatch('handleCatchError', error);
    }
  },
  // Getting single Page
  getSinglePage: async ({ state, commit, dispatch }, payload) => {
    // Initializing server action
    await dispatch('initializeServerAction');
    // Getting single Page
    try {
      // Server action
      let page = await dispatch('getSinglePageGql', payload);

      // removing __typenmae
      page = { ...(await dispatch('removeTypename', page)) };
      // If error already encountered from gql action, quit function
      commit('setActivePageDataReceived', true);
      if (state.error) return;
      // Ending server action
      dispatch('endServerAction');
      // injecting resourceDataReceived flag for each column
      if (page.pageRows.length) {
        page = dispatch('santizePageResources', page);
      }
      return page;
    } catch (error) {
      dispatch('handleCatchError', error);
    }
  },
  // Adding Page
  addPage: async ({ state, commit, dispatch }, payload) => {
    // Initializing server action
    await dispatch('initializeServerAction');
    // Adding Page
    try {
      // Server action
      let page = await dispatch('addPageGql', payload);
      // If error already encountered from gql action, quit function
      if (state.error) return;
      // Ending server action
      dispatch('endServerAction');
      // Setting Snackbar
      dispatch('setSnackBar', {
        snackBarText: 'Page created!',
        targetRequired: null,
        targetText: null,
        targetLink: null,
      });
      return page;
    } catch (error) {
      dispatch('handleCatchError', error);
    }
  },
  // Updating Page
  updatePage: async ({ state, commit, dispatch }, payload) => {
    // Initializing server action
    await dispatch('initializeServerAction');
    // Updating Page
    try {
      // Server action
      let page = await dispatch('updatePageGql', payload);
      // If error already encountered from gql action, quit function
      if (state.error) return;
      // Ending server action
      dispatch('endServerAction');
      // Setting Snackbar
      dispatch('setSnackBar', {
        snackBarText: 'Page updated!',
        targetRequired: null,
        targetText: null,
        targetLink: null,
      });
      return page;
    } catch (error) {
      dispatch('handleCatchError', error);
    }
  },
  // Disable page
  disablePage: async ({ state, commit, dispatch }, payload) => {
    // Initializing server action
    await dispatch('initializeServerAction');
    // Disabling Page
    try {
      // Deleting Image
      const messageData = await dispatch('disablePageGql', payload);
      // If error already encountered from gql action, quit function
      if (state.error) return;
      // Ending server action
      dispatch('endServerAction');
      // Setting snackBar
      dispatch('setSnackBarText', { text: messageData.message });
      return;
    } catch (error) {
      dispatch('handleCatchError', error);
    }
  },
  // get Home Page Data
  getHomePageData: ({ state, commit, dispatch }, payload) => {
    state.homePageDataReceived = true;
  },
  setHomePageCarouselImages: ({ state, commit, dispatch }, payload) => {
    if (
      state.homePageCarousel &&
      state.homePageCarousel.content &&
      state.homePageCarousel.content.length
    ) {
      state.homePageCarouselImages = [];
      state.homePageCarousel.content.forEach((content) => {
        state.homePageCarouselImages.push({
          src: content.imageUrl,
          text: content.contentDetail ? content.contentDetail : '',
        });
      });
    }
    state.homPageCarouselReceived = true;
  },
  // itemcategory page data
  // get item category page  Results
  getSingleCategoryGroupItems: async ({ state, commit, dispatch }, payload) => {
    // Initializing server action
    await dispatch('initializeSilentServerAction');

    try {
      // Sewtting Search in progress
      // commit('setItemPageDataReceived', false);
      // Getting the resuult from database
      let itemPageData = await dispatch(
        'getSingleCategoryGroupItemsGql',
        payload
      );
      // If error already encountered from gql action, quit function
      if (state.error) return;
      // Ending server action
      dispatch('endServerAction');
      itemPageData = { ...(await dispatch('removeTypename', itemPageData)) };
      // Setting store data
      commit('setItemPageData', itemPageData);

      // setting search page and number of pages
      commit(
        'setItemPageNumberOfPages',
        Math.ceil(
          state.itemPageData.totalItems /
            parseInt(process.env.VUE_APP_ITEMS_PER_PAGE)
        )
      );
      if (state.itemPageNumber > state.itemPageNumberOfPages) {
        commit('setItemPageNumber', 1);
      }

      // Seet search progress to false
      commit('setItemPageDataReceived', true);
      return itemPageData;
    } catch (error) {
      commit('setItemPageDataReceived', true);
      dispatch('handleCatchError', error);
    }
  },
  // Sending bulk email
  sendBulkEmail: async ({ state, commit, dispatch }, payload) => {
    await dispatch('initializeServerAction');
    try {
      const response = await dispatch('sendBulkEmailGql', payload);
      if (response.success) {
        dispatch('setSnackBar', {
          snackBarText: 'Email sent successfully!',
          targetRequired: null,
          targetText: null,
          targetLink: null,
        });
      } else {
        throw new Error(response.message);
      }
      dispatch('endServerAction');
      return response;
    } catch (error) {
      dispatch('handleCatchError', error);
    }
  },
};
// search
const search = {
  // get item search Results
  getItemSearchResults: async ({ state, commit, dispatch }, payload) => {
    // Initializing server action
    await dispatch('initializeSilentServerAction');

    try {
      // Sewtting Search in progress
      commit('setSearchInProgress', true);
      // Getting the resuult from database
      let searchResults = await dispatch('getItemSearchResultsGql', payload);
      // If error already encountered from gql action, quit function
      if (state.error) return;
      // Ending server action
      dispatch('endServerAction');
      searchResults = {
        ...searchResults,
      };

      // Setting store data
      commit('setItemSearchResultsData', searchResults);

      // Setting optionSpecs
      commit(
        'setOptionSpecs',
        state.itemSearchResultsData.specs.filter(
          (spec) => spec.specValueType === 'options'
        )
      );
      // Removing any null values from the specOptions

      state.optionSpecs = state.optionSpecs.map((spec) => {
        if (
          spec.specOptions.includes(null) ||
          spec.specOptions.includes('null')
        ) {
          spec.specOptions = spec.specOptions.filter(
            (option) => option !== null && option !== 'null'
          );
        }
        return spec;
      });

      // Adding Option index for each option
      state.optionSpecs = state.optionSpecs.map((spec) => {
        return {
          ...spec,
          userSelectedOptions: spec.specOptions.map((option, index) => {
            return {
              [`option${index}`]: false,
              [`option${index}Text`]: option,
            };
          }),
        };
      });

      // Setting minmax Specs
      commit(
        'setMinMaxSpecs',
        state.itemSearchResultsData.specs.filter(
          (spec) => spec.specValueType !== 'options'
        )
      );
      state.minMaxSpecs = [
        ...state.minMaxSpecs.map((spec) => {
          return {
            ...spec,
            userMinValue: parseFloat(spec.minValue),
            userMaxValue: parseFloat(spec.maxValue),
          };
        }),
      ];
      // Setting Item Search Categories
      commit(
        'setItemSearchCategories',
        state.itemSearchResultsData.categories.map((cat, index) => {
          return {
            [`option${index}`]: false,
            [`option${index}Text`]: cat,
          };
        })
      );
      // Settig coloors
      // removing null colors
      state.itemSearchResultsData.colors =
        state.itemSearchResultsData.colors.filter(
          (color) => color !== null && color !== 'null' && color !== 'Null'
        );
      commit(
        'setItemSearchColors',
        state.itemSearchResultsData.colors.map((color, index) => {
          return {
            [`option${index}`]: false, // This boolean can be used to track selection state
            [`option${index}Text`]: color, // The actual color text
          };
        })
      );

      // setting sizes
      commit(
        'setItemSearchSizes',
        state.itemSearchResultsData.sizes.map((size, index) => {
          return {
            [`option${index}`]: false, // This boolean can be used to track selection state
            [`option${index}Text`]: size, // The actual size text
          };
        })
      );

      // setting search page and number of pages
      commit('setItemSearchPage', 1);
      commit(
        'setItemSearchNumberOfPages',
        Math.ceil(
          state.itemSearchResultsData.totalItems /
            parseInt(process.env.VUE_APP_ITEMS_PER_PAGE)
        )
      );

      // Seet search progress to false
      commit('setSearchInProgress', false);
      return searchResults;
    } catch (error) {
      commit('setSearchInProgress', false);
      dispatch('handleCatchError', error);
    }
  },
  // get item Adavanced search Results
  getItemAdavncedSearchResults: async (
    { state, commit, dispatch },
    payload
  ) => {
    // Initializing server action
    await dispatch('initializeSilentServerAction');
    // preparing the dispatch
    let refinedOptionSpecs = [
      ...state.optionSpecs.map((spec) => {
        return {
          ...spec,
          userSelectedOptions: spec.userSelectedOptions.map((option, index) => {
            if (option[`option${index}`] === true) {
              return option[`option${index}Text`];
            }
          }),
        };
      }),
    ];
    // Removing Undefined for un-checkd options
    refinedOptionSpecs = [
      ...refinedOptionSpecs.map((spec) => {
        return {
          ...spec,
          userSelectedOptions: spec.userSelectedOptions.filter(
            (option) => option !== undefined
          ),
        };
      }),
    ];
    // Removing a spec when no option has been checked.
    refinedOptionSpecs = [
      ...refinedOptionSpecs.filter((spec) => {
        return spec.userSelectedOptions.length > 0;
      }),
    ];

    // removing max min spec when the user has not modified the min max values
    let refinedMinMaxSpecs = [
      ...state.minMaxSpecs.filter((spec) => {
        return (
          parseFloat(spec.userMinValue) !== parseFloat(spec.minValue) ||
          parseFloat(spec.userMaxValue) !== parseFloat(spec.maxValue)
        );
      }),
    ];
    // sanitizing min max values
    refinedMinMaxSpecs = [
      ...refinedMinMaxSpecs.map((spec) => {
        return {
          ...spec,
          userMinValue: parseFloat(spec.userMinValue),
          userMaxValue: parseFloat(spec.userMaxValue),
        };
      }),
    ];
    // Combinng option and min max specs
    let refinedSpecs = [...refinedOptionSpecs, ...refinedMinMaxSpecs];

    // removing the field count from the spec
    refinedSpecs.forEach((spec) => {
      delete spec.count;
    });
    // categories
    let refinedCategories = [
      ...state.itemSearchCategories.map((cat, index) => {
        if (cat[`option${index}`]) {
          return cat[`option${index}Text`];
        }
      }),
    ];
    // removing undefined categories
    refinedCategories = [
      ...refinedCategories.filter((cat) => cat !== undefined),
    ];

    // Colors
    let refinedColors = [
      ...state.itemSearchColors.map((color, index) => {
        if (color[`option${index}`]) {
          return color[`option${index}Text`];
        }
      }),
    ];
    // removing undefined Colors
    refinedColors = [...refinedColors.filter((color) => color !== undefined)];

    // Sizes
    let refinedSizes = [
      ...state.itemSearchSizes.map((size, index) => {
        if (size[`option${index}`]) {
          return size[`option${index}Text`];
        }
      }),
    ];
    // removing undefined Colors
    refinedSizes = [...refinedSizes.filter((size) => size !== undefined)];

    // removing the field __typename
    refinedSpecs.map((spec) => {
      if (spec.__typename) {
        delete spec.__typename;
      }
    });
    // /Setting advancedc search payload
    const searchPayload = {
      searchInput: {
        searchText: payload.searchText,
        specs: refinedSpecs,
        categories: refinedCategories,
        colors: refinedColors,
        sizes: refinedSizes,
        page: payload.page,
        price: {
          minPrice: parseFloat(state.itemMinPrice),
          maxPrice: parseFloat(state.itemMaxPrice),
          isAscendingOrder:
            state.isAscendingOrder !== undefined
              ? state.isAscendingOrder
              : state.itemPriceSortOrder === 'asc',
        },
      },
    };
    // Querying hte database
    try {
      // Sewtting Search in progress
      // commit("setSearchInProgress", true);
      // Getting the resuult from database
      let searchResults = await dispatch(
        'getItemAdvancedSearchResultsGql',
        searchPayload
      );
      // If error already encountered from gql action, quit function
      if (state.error) return;
      // Ending server action
      dispatch('endServerAction');
      searchResults = {
        ...searchResults,
      };

      // Setting store data
      commit('setItemSearchResultsData', searchResults);
      // Setting pagination

      commit(
        'setItemSearchNumberOfPages',
        Math.ceil(
          state.itemSearchResultsData.totalItems /
            parseInt(process.env.VUE_APP_ITEMS_PER_PAGE)
        )
      );
      if (state.itemSearchPage > state.itemSearchNumberOfPages) {
        commit('setItemSearchPage', 1);
      }
      // Seet search progress to false
      // commit("setSearchInProgress", false);
      return searchResults;
    } catch (error) {
      commit('setSearchInProgress', false);
      dispatch('handleCatchError', error);
    }
  },
};
// payment
const payment = {
  // generate Stripe PaymentUrl
  generateStripePaymentUrl: async ({ state, commit, dispatch }, payload) => {
    // Setting payload
    // updating the database
    // Initializing silent server action
    await dispatch('initializeSilentServerAction');
    // Updating server
    try {
      let url = await dispatch('generateStripePaymentUrlGql', payload);
      // If error already encountered from gql action, quit function
      if (state.error) return;
      // Ending server action
      dispatch('endServerAction');
      // Setting snackBar
      // dispatch("setSnackBarText", { text: "payment url!" });
      return url;
    } catch (error) {
      dispatch('handleCatchError', error);
    }
  },
  // generate Razor PaymentUrl
  generateRazorPaymentUrl: async ({ state, commit, dispatch }, payload) => {
    // Setting payload
    // updating the database
    // Initializing silent server action
    await dispatch('initializeSilentServerAction');
    // Updating server
    try {
      let url = await dispatch('generateRazorPaymentUrlGql', payload);
      // If error already encountered from gql action, quit function
      if (state.error) return;
      // Ending server action
      dispatch('endServerAction');
      // Setting snackBar
      // dispatch("setSnackBarText", { text: "payment url!" });
      return url;
    } catch (error) {
      dispatch('handleCatchError', error);
    }
  },
  // check promo code
  checkPromoCode: async ({ state, commit, dispatch }, payload) => {
    // Setting payload
    // updating the database
    // Initializing silent server action
    await dispatch('initializeSilentServerAction');
    // Updating server
    try {
      let promoCodeInfo = await dispatch('checkPromoCodeGql', payload);
      // If error already encountered from gql action, quit function
      if (state.error) return;
      // Ending server action
      dispatch('endServerAction');
      // Setting snackBar
      // dispatch("setSnackBarText", { text: "payment url!" });
      return promoCodeInfo;
    } catch (error) {
      dispatch('handleCatchError', error);
    }
  },
};
// Dialogs
const dialogs = {
  // Handling Dialog
  handleDialog: ({ state, commit, dispatch }, payload) => {
    commit('setLoading', false);
    commit('setProgressing', false);
    // Checking for compo data
    let compo;
    if (payload.compo) {
      compo = payload.compo;
    }
    // Checking for other content
    let content;
    if (payload.content) {
      content = payload.content;
      commit('setTempData', content);
    }
    const dialogContext = payload.context;
    // assigning context
    switch (dialogContext) {
      case 'aboutToBeLoggedOut':
        state.dialogContext = 'aboutToBeLoggedOut';
        break;
      case 'formNotValid':
        state.dialogContext = 'formNotValid';
        break;
      case 'passwordsNotMatching':
        state.dialogContext = 'passwordsNotMatching';
        break;
      default:
        break;
    }
    // Performing actions
    switch (dialogContext) {
      case 'aboutToBeLoggedOut':
        state.tempData = content;
        state.reLogInText = `Your session is about to expire in ${
          state.tempData.timeRemainingInMinutes
        } ${
          state.tempData.timeRemainingInMinutes === 'a' ? 'minute' : 'minutes'
        }. Click on 'Re-Login' to stay logged in. Otherwise, you will be logged out ${
          state.tempData.timeRemainingInMinutes === 'a'
            ? 'in a minute'
            : 'in ' + state.tempData.timeRemainingInMinutes + ' minutes'
        } minutes from now. Ensure that you save your work in advance.`;
        state.reLogInDialog = true;
        break;
      case 'formNotValid':
        state.dialogTipsHeading = 'Form Not Valid';
        state.dialogTipsText =
          'This form is not valid, please complete all required fields!';
        state.dialogTipsBtn1 = '';
        state.dialogTipsBtn2 = 'Dismiss';
        state.dialogTableOn = false;
        state.isDialogTips = true;
        break;
      case 'passwordsNotMatching':
        state.dialogHeading = 'passwords must match!';
        state.dialogText = 'password and confirm passoword fields must match';
        state.dialogBtn1 = 'Cancel';
        state.dialogBtn2 = 'Yes';
        state.isDialog = true;
        break;

      default:
        break;
    }
  },
  // Clearing dialog
  clearDialog: async ({ state, commit, dispatch }, payload) => {
    const result = payload.result;
    state.dialogResult = result;
    const dialogContext = state.dialogContext;

    if (result === 'yes') {
      switch (dialogContext) {
        default:
          break;
      }
    }
    commit('setLoading', false);
    commit('setProgressing', false);
    // clearing dialog controls
    state.dialogHeading = '';
    state.isDialog = false;
    state.dialogText = '';
    state.dialogText2 = '';
    state.dialogBtn1 = '';
    state.dialogBtn2 = '';
    state.isDialogTips = false;
    state.dialogTipsHeading = '';
    state.dialogTipsText = '';
    state.dialogTipsText2 = '';
    state.dialogTipsBtn1 = '';
    state.dialogTipsBtn2 = '';
    state.dialogContext = '';
    state.dialogResult = '';
    state.activeIndex = '';
  },
};
// Miscellaneous/Dialogs/initialize/end server/ catch error
const miscellaneous = {
  // clearing Error
  clearError: ({ state, commit, dispatch }) => {
    commit('clearError');
  },
  // Handling catch error
  handleCatchError: async ({ state, commit, dispatch }, error, source) => {
    if (error.message.includes(':')) {
      error.message = error.message.split(':')[1];
    }
    commit('setError', error);
    // Redirecting to Sign in ifnot authenticated
    if (
      error.message === 'Unauthenticated' ||
      error.message === 'Authentication required!'
    ) {
      await dispatch('signUserOut');
      // Redirecting to sign in
      if (router.currentRoute.name !== 'signin') {
        router.push({ name: 'signin' });
      }
    }
    state.loading = false;
    state.progressing = false;
  },
  // Initialize Server action
  initializeServerAction: async ({ state, commit, dispatch }) => {
    commit('setLoading', true);
    commit('setProgressing', true);
    if (
      !(
        state.error &&
        state.error.message &&
        state.error.message === 'Invalid credentials!'
      )
    ) {
      commit('clearError');
    }
    const token =
      Cookies.get('papiloomToken') ||
      dispatch('getCookieValue', 'papiloomToken');
    const config = {
      headers: {
        common: {
          Authorization: `Bearer ${token}`,
        },
      },
      withCredentials: true, // Ensure this is set to true
    };
    commit('setAxiosConfig', config);
  },

  initializeSilentServerAction: async ({ state, commit, dispatch }) => {
    commit('clearError');
  },
  // Initialize Local action
  initializeLocalAction: ({ state, commit, dispatch }) => {
    commit('setLoading', true);
    commit('setProgressing', true);
    commit('clearError');
  },
  // Ending server action
  endServerAction: ({ state, commit, dispatch }, payload) => {
    state.loading = false;
    state.progressing = false;
  },
  // Ending Local action
  endLocalAction: ({ state, commit, dispatch }) => {
    state.loading = false;
    state.progressing = false;
  },
  // Setting snackBar
  setSnackBarText: ({ state, commit, dispatch }, payload) => {
    commit('setSnackBarText', payload.text);
    commit('setTargetRequired', false);
    commit('setTargetText', '');
    commit('setTargetLink', '');
    commit('setSnackBar', true);
  },
  // Setting Snackbar
  setSnackBar: ({ state, commit, dispatch }, payload) => {
    // Assign snackbar parameters
    state.snackBarText = payload.snackBarText;
    state.targetRequired = payload.targetRequired;
    state.targetText = payload.targetText;
    state.targetLink = payload.targetLink;
    // show snackbar
    commit('setSnackBar', true);
    // // show snackbar
    // commit('setSnackBar', true);
  },
  // removing typename
  removeTypename: ({ state, commit, dispatch }, payload) => {
    // Define the recursive function within the action
    function removeTypename(obj) {
      if (Array.isArray(obj)) {
        return obj.map(removeTypename); // Recurse on array elements
      } else if (obj !== null && typeof obj === 'object') {
        // Create a copy of the object with __typename removed
        const cleanedObj = { ...obj };
        delete cleanedObj['__typename'];

        // Recurse on object properties
        for (const key in cleanedObj) {
          cleanedObj[key] = removeTypename(cleanedObj[key]);
        }

        return cleanedObj;
      } else {
        return obj; // Return unchanged for non-objects
      }
    }

    const obj = payload;
    return removeTypename(obj);
  },
  // merge Cart Items
  mergeCartItems: ({ state, commit, dispatch }, payload) => {
    // Define the recursive function within the action
    function mergeCartItems(cartItems) {
      if (cartItems.length) {
        cartItems.forEach((itemEl) => {
          // chek if user cart already has this item. IF yes, increment the quantity
          const matchingItem = state.user.cart.items.find(
            (el) => itemEl.item._id === el.item._id
          );
          if (matchingItem) {
            // get index of that item in user.cart.items
            const itemIndex = state.user.cart.items.indexOf(matchingItem);
            state.user.cart.items[itemIndex].quantity += itemEl.quantity;
          } else {
            state.user.cart.items.push(itemEl);
          }
        });
      }
    }

    const existingCartItems = payload;
    return mergeCartItems(existingCartItems);
  },
  santizePageResources: ({ state, commit, dispatch }, payload) => {
    function santizePageResources(page) {
      // col1
      page.pageRows.forEach((row) => {
        if (row.col1.exists) {
          row.col1.resourceDataReceived = true;
          row.col1.expanded = false;
          row.col1.limitedHeight = process.env.VUE_APP_PAGE_RESOURCE_HEIGHT;
          // Add imageURL field for each content
          if (row.col1.resource.content.length) {
            row.col1.resource.content.forEach((content) => {
              if (content.imageLink) {
                content.imageUrl = content.imageLink;
              }
            });
          }
        }
        // col2
        if (row.col2.exists) {
          row.col2.resourceDataReceived = true;
          row.col2.expanded = false;
          row.col2.limitedHeight = process.env.VUE_APP_PAGE_RESOURCE_HEIGHT;
          // Add imageURL field for each content
          if (row.col2.resource.content.length) {
            row.col2.resource.content.forEach((content) => {
              if (content.imageLink) {
                content.imageUrl = content.imageLink;
              }
            });
          }
        }
        // col3
        if (row.col3.exists) {
          row.col3.resourceDataReceived = true;
          row.col3.expanded = false;
          row.col3.limitedHeight = process.env.VUE_APP_PAGE_RESOURCE_HEIGHT;
          // Add imageURL field for each content
          if (row.col3.resource.content.length) {
            row.col3.resource.content.forEach((content) => {
              if (content.imageLink) {
                content.imageUrl = content.imageLink;
              }
            });
          }
        }
      });
      return page;
    }
    const page = payload;
    return santizePageResources(page);
  },
  sanitizeResource: ({ state, commit, dispatch }, payload) => {
    function sanitizeResource(alphaResource) {
      // Add imageURL field for each content
      if (alphaResource.content.length) {
        alphaResource.content.forEach((content) => {
          if (content.imageLink) {
            content.imageUrl = content.imageLink;
          }
        });
      }
      // Add to constructor resource if applicable
      let matchingResource;
      matchingResource = state.constructorAlphaResources.find(
        (resource) => resource._id === alphaResource._id
      );
      // if found, add it to the constructor resources
      if (
        matchingResource &&
        matchingResource.resourceRouteParam !== 'Home-Page-Carousel'
      ) {
        // find index in the construcot resources array
        const mathcingIndex =
          state.constructorAlphaResources.indexOf(matchingResource);
        if (mathcingIndex >= 0) {
          alphaResource['dataReceived'] = true;
          state.constructorAlphaResources[mathcingIndex] = alphaResource;
        }
      }
      return alphaResource;
    }
    const alphaResource = payload;
    return sanitizeResource(alphaResource);
  },
  // Vuex action for extracting a cookie value
  getCookieValue: ({ state, commit, dispatch }, cookieName) => {
    // Define the getCookie function within the action
    function getCookie(name) {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop().split(';').shift();
      return null; // Return null if cookie not found
    }
    // Call the function with the provided cookieName
    const cookieValue = getCookie(cookieName);

    // Return the cookie value
    return cookieValue;
  },
};
// Unit Corrections
const units = {
  // get Unit matrices
  getUnitMatrices: async ({ state, commit, dispatch }) => {
    // Initializing server action
    await dispatch('initializeServerAction');
    try {
      // Getting the projects from database
      let result = await dispatch('getUnitMatricesGql');
      // If error already encountered from gql action, quit function
      if (state.error) return;
      commit('setUnitMatrices', result);
      // Ending server action
      dispatch('endServerAction');
    } catch (error) {
      dispatch('handleCatchError', error);
    }
  },
  // Mapping Units and unit Matrices
  initializeUnitMatrices: async ({ state, commit, dispatch }) => {
    // getting unit Matrices
    await dispatch('getUnitMatrices');
    // setting units and matrices
    // Time
    // Matrix
    commit(
      'setTimeUnitsMatrix',
      state.unitMatrices.find(
        (el) => el.propertyName === 'Time' && el.type === 'direct'
      ).conversionMatrix
    );
    // Units array
    commit(
      'setTimeUnits',
      state.timeUnitsMatrix.map((el) => el.unit)
    );
    // Vol Flowrate
    // Matrix
    commit(
      'setVolFlowRateUnitsMatrix',
      state.unitMatrices.find(
        (el) =>
          el.propertyName === 'Volumetric Flowrate' && el.type === 'direct'
      ).conversionMatrix
    );
    // Units array
    commit(
      'setVolumetricFlowrateUnits',
      state.volFlowRateUnitsMatrix.map((el) => el.unit)
    );

    // Density
    // Matrix
    commit(
      'setDensityUnitsMatrix',
      state.unitMatrices.find(
        (el) => el.propertyName === 'Density' && el.type === 'direct'
      ).conversionMatrix
    );
    // Units array
    commit(
      'setDensityUnits',
      state.densityUnitsMatrix.map((el) => el.unit)
    );

    // Length
    // Matrix 1
    commit(
      'setLengthUnitsMatrix',
      state.unitMatrices.find(
        (el) => el.propertyName === 'Length' && el.type === 'direct'
      ).conversionMatrix
    );
    // Matrix 2
    commit(
      'setLengthUnitsMatrix2',
      state.unitMatrices.find(
        (el) => el.propertyName === 'Length2' && el.type === 'direct'
      ).conversionMatrix
    );
    // Units array
    commit(
      'setLengthUnits',
      state.lengthUnitsMatrix.map((el) => el.unit)
    );
    // Volume
    // Matrix
    commit(
      'setVolumeUnitsMatrix',
      state.unitMatrices.find(
        (el) => el.propertyName === 'Volume' && el.type === 'direct'
      ).conversionMatrix
    );
    // Units array
    commit(
      'setVolumeUnits',
      state.volumeUnitsMatrix.map((el) => el.unit)
    );
    // Velocity
    // Matrix
    commit(
      'setVelocityUnitsMatrix',
      state.unitMatrices.find(
        (el) => el.propertyName === 'Velocity' && el.type === 'direct'
      ).conversionMatrix
    );
    // Units array
    commit(
      'setVelocityUnits',
      state.velocityUnitsMatrix.map((el) => el.unit)
    );
    // Pressure Difference
    // Matrix
    commit(
      'setPressureDiffUnitsMatrix',
      state.unitMatrices.find(
        (el) =>
          el.propertyName === 'Pressure Difference' && el.type === 'direct'
      ).conversionMatrix
    );
    // Units array
    commit(
      'setPressureDiffUnits',
      state.pressureDiffUnitsMatrix.map((el) => el.unit)
    );
    // Stress
    // Matrix
    commit(
      'setStressUnitsMatrix',
      state.unitMatrices.find(
        (el) => el.propertyName === 'Stress' && el.type === 'direct'
      ).conversionMatrix
    );
    // Units array
    commit(
      'setStressUnits',
      state.stressUnitsMatrix.map((el) => el.unit)
    );

    // Viscosity
    // Matrix
    commit(
      'setViscosityUnitsMatrix',
      state.unitMatrices.find(
        (el) => el.propertyName === 'Viscosity' && el.type === 'direct'
      ).conversionMatrix
    );
    // Units array
    commit(
      'setViscosityUnits',
      state.viscosityUnitsMatrix.map((el) => el.unit)
    );
  },
  // Correcting flow rate basedon Unit
  flowRateCorrected: (
    { state, commit, dispatch },
    { flowRate, flowRateUnit }
  ) => {
    // let flowRate = payload.flowRate;
    // let flowRateUnit = payload.flowRateUnit;
    let correctedFlowRate;
    correctedFlowRate =
      parseFloat(flowRate) *
      state.volFlowRateUnitsMatrix.find((el) => {
        return el.unit === flowRateUnit;
      }).value;
    return correctedFlowRate;
  },
};

const download = {
  // Download calendar
  downloadCalendar: async ({ state, commit, dispatch }) => {
    // Initializing server action
    await dispatch('initializeServerAction');
    // axios config
    // Requesting Backend for file
    try {
      let response = await axios.get('download/calendar', {
        responseType: 'arraybuffer',
        headers: { common: state.axiosConfig.headers.common },
      });
      // Downloading the file
      dispatch('downloadFile', {
        response: response,
        // type: "application/pdf",
      });

      // Ending server action
      dispatch('endServerAction');
    } catch (error) {
      // convert and set error
      dispatch('setDownloadFileError', {
        originalError: error,
      });
    }
  },

  downloadInvoice: async ({ state, commit, dispatch }, payload) => {
    // Initializing server action
    await dispatch('initializeServerAction');
    try {
      // Requesting the signed URL for the invoice
      const response = await axios.get(`/download/invoice/${payload.id}`, {
        headers: state.axiosConfig.headers.common,
      });
      const { signedUrl } = response.data;

      // Instead of trying to fetch the PDF with axios (which can cause CORS issues),
      // simply open the signed URL in a new tab to let the browser handle the download
      window.open(signedUrl, '_blank');

      // Ending server action
      dispatch('endServerAction');
    } catch (error) {
      // Convert and set error
      dispatch('setDownloadFileError', {
        originalError: error,
      });
      alert('Failed to download invoice.');
    }
  },
  downloadFile({ commit, state, dispatch }, payload) {
    const { response, type, filename } = payload;

    // Create a new Blob object with the correct MIME type
    const newBlob = new Blob([response.data], { type });

    // IE doesn't allow using a blob object directly as link href
    // instead it is necessary to use msSaveOrOpenBlob
    if (window.navigator && window.navigator.msSaveOrOpenBlob) {
      window.navigator.msSaveOrOpenBlob(newBlob, filename);
      return;
    }

    // Create a link pointing to the ObjectURL containing the blob.
    const data = window.URL.createObjectURL(newBlob);
    const link = document.createElement('a');
    link.href = data;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    setTimeout(() => {
      // For Firefox it is necessary to delay revoking the ObjectURL
      window.URL.revokeObjectURL(data);
    }, 100);
  },

  // convert Error from arrayt buffer to JSOM
  setDownloadFileError({ commit, state, dispatch }, payload) {
    // get original errorupload
    const originalError = payload.originalError;
    if (originalError.response && originalError.response.status === 401) {
      return dispatch('handleCatchError', {
        message: 'Unauthenticated Request',
      });
    }
    try {
      let decodedString = String.fromCharCode.apply(
        null,
        new Uint8Array(originalError.response.data)
      );

      let newError = JSON.parse(decodedString);
      if (originalError.response.data) {
        dispatch('handleCatchError', newError);
      }
    } catch (error) {
      dispatch('handleCatchError', error);
    }
  },
  // Get all return labels for an order
  getReturnLabels: async ({ state, commit, dispatch }, payload) => {
    // Initializing server action
    await dispatch('initializeServerAction');
    try {
      // console.log(`Fetching return labels for order: ${payload.orderId}`);

      // Get fresh token for authentication
      const token = Cookies.get('papiloomToken') || '';

      // Requesting the return labels with explicit authentication
      const response = await axios.get(`/return-labels/${payload.orderId}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });

      // Ending server action
      dispatch('endServerAction');

      // console.log('Return labels response:', response.data);

      // Return the labels data
      return response.data;
    } catch (error) {
      console.error('Error fetching return labels:', error);

      // Ending server action on error
      dispatch('endServerAction');

      // Handle error and dispatch error action
      dispatch('handleCatchError', {
        message: error.response?.data?.error || 'Failed to fetch return labels',
      });

      // Return empty array to avoid component errors
      return { returnLabels: [] };
    }
  },

  // Generate a new return label for an order
  generateReturnLabel: async ({ state, commit, dispatch }, payload) => {
    // Initializing server action
    await dispatch('initializeServerAction');
    try {
      // console.log(
      //   `Generating return label for order: ${payload.orderId} with items:`,
      //   payload.items
      // );

      // Get the order ID
      const orderId = String(payload.orderId).trim();
      const url = `/generate/return-label/${orderId}`;
      // console.log(`Sending request to: ${url}`);

      // Use the configured axios instance which already includes withCredentials and token
      const response = await axios.post(url, { items: payload.items });

      // console.log('Return label generation response:', response.data);

      // If there's a signedUrl, directly open it for download
      if (response.data.signedUrl) {
        window.open(response.data.signedUrl, '_blank');
      }

      // Ending server action
      dispatch('endServerAction');

      // If there's a returnLabelUrl in the response, update it in the store
      if (response.data.returnLabelUrl) {
        commit('setReturnLabelUrl', {
          orderId: payload.orderId,
          returnLabelUrl: response.data.returnLabelUrl,
        });
      }

      // Return the complete response data so the component has access to the URLs
      return response.data;
    } catch (error) {
      console.error('Error generating return label:', error);

      // Log detailed error information for debugging
      if (error.response) {
        // console.log('Error status:', error.response.status);
        // console.log('Error data:', error.response.data);
        // console.log('Error headers:', error.response.headers);
      } else if (error.request) {
        // console.log('Error request:', error.request);
      } else {
        // console.log('Error message:', error.message);
      }

      // Ending server action on error
      dispatch('endServerAction');

      // Handle error based on status code
      if (error.response && error.response.status === 404) {
        dispatch('handleCatchError', {
          message:
            'Return label API endpoint not found. Please contact support.',
        });
      } else if (error.response && error.response.status === 403) {
        dispatch('handleCatchError', {
          message:
            'Not authorized to generate return label. Please login again.',
        });
      } else {
        // Handle other error and dispatch error action
        dispatch('handleCatchError', {
          message:
            error.response?.data?.error || 'Failed to generate return label',
        });
      }

      // Re-throw the error so the component can handle it
      throw error;
    }
  },
};

// Consolidating app actions
const actions = {
  ...user,
  ...address,
  ...common,
  ...resource,
  ...review,
  ...bom,
  ...page,
  ...search,
  ...payment,
  ...dialogs,
  ...miscellaneous,
  ...units,
  ...download,
};

export default {
  // gql Actions
  ...gqlActions,
  // App Actions
  ...actions,
};
