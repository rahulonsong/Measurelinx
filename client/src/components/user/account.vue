<template>
  <v-container class="pa-0 pa-sm-2">
    <!-- Dialog to update profile-->
    <v-dialog v-model="updateProfileDialog" persistent max-width="600">
      <!-- Update profile Form -->
      <v-card dense class="mx-auto" max-width="600" style="overflow: hidden">
        <!-- Update Profile Title -->
        <v-card-title>
          <v-row>
            <v-col cols="12" sm="12" class="text-center mx-auto my-4 my-sm-10">
              <h2>Update Profile</h2>
            </v-col>
          </v-row>
        </v-card-title>
        <v-card-text>
          <v-form
            dense
            v-if="token"
            id="change-password--form"
            v-model="updateProfileIsFormValid"
            lazy-validation
            ref="updateProfileForm"
            class="my-0"
          >
            <!-- Email-->
            <v-row class="my-0">
              <v-col>
                <v-text-field
                  v-model="user.email"
                  dense
                  flat
                  solo
                  readonly
                  prepend-icon="mdi-email"
                  label="Email"
                  type="text"
                ></v-text-field>
              </v-col>
            </v-row>
            <!-- First Name -->
            <v-row class="my-0">
              <v-col class="my-0">
                <v-text-field
                  dense
                  v-model="firstName"
                  :rules="validationRules.required"
                  prepend-icon="mdi-account"
                  label="First Name"
                  type="text"
                  required
                ></v-text-field>
              </v-col>
            </v-row>
            <!-- Last Name -->
            <v-row class="my-0">
              <v-col class="my-0">
                <v-text-field
                  dense
                  v-model="lastName"
                  :rules="validationRules.required"
                  prepend-icon="mdi-account"
                  type="text"
                  label="Last Name"
                  required
                ></v-text-field>
              </v-col>
            </v-row>
            <!-- Confirm changing Password -->
            <v-row wrap class="ma-0 pa-0">
              <v-col class="ma-0 pa-0">
                <v-checkbox
                  v-model="changingPasswordActive"
                  label="I want to change password"
                ></v-checkbox>
              </v-col>
            </v-row>
            <!-- Old Password -->
            <v-row v-if="changingPasswordActive" class="my-0">
              <v-col class="my-0">
                <v-text-field
                  dense
                  v-model="oldPassword"
                  :rules="validationRules.required"
                  prepend-icon="mdi-lock"
                  :append-icon="showOldPassword ? 'mdi-eye' : 'mdi-eye-off'"
                  @click:append="showOldPassword = !showOldPassword"
                  :type="showOldPassword ? 'text' : 'password'"
                  label="Old Password"
                  required
                ></v-text-field>
              </v-col>
            </v-row>
            <!-- New Password -->
            <v-row v-if="changingPasswordActive" class="my-0">
              <v-col class="my-0">
                <v-text-field
                  dense
                  v-model="newPassword"
                  prepend-icon="mdi-lock"
                  :append-icon="showNewPassword ? 'mdi-eye' : 'mdi-eye-off'"
                  @click:append="showNewPassword = !showNewPassword"
                  :type="showNewPassword ? 'text' : 'password'"
                  label="New Password"
                  :rules="validationRules.password"
                  required
                ></v-text-field>
              </v-col>
            </v-row>
            <!-- Confirm new Password -->
            <v-row v-if="changingPasswordActive" class="my-0">
              <v-col class="my-0">
                <v-text-field
                  dense
                  v-model="confirmNewPassword"
                  prepend-icon="mdi-lock"
                  :append-icon="
                    showConfirmNewPassword ? 'mdi-eye' : 'mdi-eye-off'
                  "
                  @click:append="
                    showConfirmNewPassword = !showConfirmNewPassword
                  "
                  :type="showConfirmNewPassword ? 'text' : 'password'"
                  label="Confirm New Password"
                  :rules="confirmPassword"
                  required
                ></v-text-field>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-row justify="center" class="my-2">
            <!-- Save button -->
            <v-col cols="12" md="2" sm="6" class="text-center">
              <v-btn
                :light="!loading"
                small
                :disabled="loading || !updateProfileIsFormValid"
                @click="handleUpdateProfile"
                class="bold px-3 darken-3 white--text custom-transform-class text-none primary"
              >
                Update
                <v-spacer></v-spacer>
                <v-progress-circular
                  class="pl-2 pr-2 ml-2"
                  v-if="loading"
                  indeterminate
                  :size="16"
                ></v-progress-circular>
              </v-btn>
            </v-col>
            <v-col cols="12" md="2" sm="6" class="text-center">
              <v-btn
                class="custom-transform-class text-none darken-3 success"
                small
                @click="updateProfileDialog = false"
                >Cancel</v-btn
              >
            </v-col>
          </v-row>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- User Card -->
    <v-row justify="center" class="ma-0">
      <v-col class="pa-0 pa-sm-2">
        <v-card
          class="mx-auto mt-2 mt-sm-5"
          max-width="600"
          style="overflow: hidden"
        >
          <v-card-title>
            <!-- User Profile Title -->
            <v-row justify="center" class="ma-0">
              <v-col class="text-center pa-2">
                <h2 class="text-h5 text-sm-h4">User Profile</h2>
              </v-col>
            </v-row>
          </v-card-title>
          <v-container class="pa-2 pa-sm-4">
            <v-card-text
              style="overflow: hidden"
              v-if="user && token"
              class="px-2 px-sm-5 pt-4 pt-sm-10"
            >
              <!-- Email -->
              <v-row class="d-flex align-center justify-start my-1 my-sm-2">
                <v-col cols="4" class="d-flex align-center my-0 py-0">
                  <v-icon left small class="mr-1">mdi-email</v-icon>
                  <p class="subtitle-2 font-weight-regular my-0 py-0">Email:</p>
                </v-col>
                <v-col cols="8" class="d-flex align-center my-0 py-0 ml-auto">
                  <p class="my-0 py-0">
                    <strong>{{ user.email }}</strong>
                  </p>
                </v-col>
              </v-row>
              <!-- First Name -->
              <v-row class="d-flex align-center justify-start my-1 my-sm-2">
                <v-col cols="4" class="d-flex align-center my-0 py-0">
                  <v-icon left small class="mr-1">mdi-account</v-icon>
                  <p class="subtitle-2 font-weight-regular my-0 py-0">
                    First Name:
                  </p>
                </v-col>
                <v-col cols="8" class="d-flex align-center my-0 py-0 ml-0">
                  <p class="subtitle-2 my-0 py-0">
                    <strong>{{ user.firstName }}</strong>
                  </p>
                </v-col>
              </v-row>
              <!-- Last Name -->
              <v-row class="d-flex align-center justify-start my-1 my-sm-2">
                <v-col cols="4" class="d-flex align-center my-0 py-0">
                  <v-icon left small class="mr-1">mdi-account</v-icon>
                  <p class="subtitle-2 font-weight-regular my-0 py-0">
                    Last Name:
                  </p>
                </v-col>
                <v-col cols="8" class="d-flex align-center my-0 py-0 ml-auto">
                  <p class="subtitle-2 my-0 py-0">
                    <strong>{{ user.lastName }}</strong>
                  </p>
                </v-col>
              </v-row>
              <!-- Phone Verification -->
              <v-row class="d-flex align-center justify-start my-1 my-sm-2">
                <v-col cols="4" class="d-flex align-center my-0 py-0">
                  <v-icon left small class="mr-1"> mdi-phone </v-icon>
                  <p class="subtitle-2 font-weight-regular my-0 py-0">Phone:</p>
                </v-col>
                <v-col
                  cols="8"
                  class="d-flex align-center flex-wrap my-0 py-0 ml-auto"
                >
                  <p
                    v-if="user.cellNumber?.verified"
                    class="subtitle-2 my-0 py-0 mr-2"
                  >
                    <strong>
                      {{
                        user.cellNumber
                          ? `${user.cellNumber.countryCode}${user.cellNumber.number}`
                          : 'N/A'
                      }}
                    </strong>
                  </p>
                  <v-chip
                    :min-width="$vuetify.breakpoint.mdAndUp ? '140' : 'auto'"
                    :color="
                      user.cellNumber && user.cellNumber.verified
                        ? 'green'
                        : 'red'
                    "
                    small
                    class="my-1"
                  >
                    <v-icon left small>
                      {{
                        user.cellNumber && user.cellNumber.verified
                          ? 'mdi-check-circle'
                          : 'mdi-alert-circle'
                      }}
                    </v-icon>
                    <span class="d-none d-md-inline">
                      {{
                        user.cellNumber && user.cellNumber.verified
                          ? 'Verified'
                          : 'Not Verified'
                      }}
                    </span>
                  </v-chip>
                  <!-- Phone number verified -->
                  <v-btn
                    v-if="user.cellNumber?.verified"
                    x-small
                    @click="openAddCellNumber"
                    class="ml-1 ml-md-2"
                    icon
                  >
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on, attrs }">
                        <v-icon v-bind="attrs" v-on="on" small
                          >mdi-pencil</v-icon
                        >
                        <!-- Update icon -->
                      </template>
                      <span>Update Phone Number</span>
                    </v-tooltip>
                  </v-btn>
                  <!-- Phone NOT verified -->
                  <v-btn
                    v-else
                    x-small
                    color="secondary"
                    @click="openAddCellNumber"
                    class="ml-1 ml-md-2 secondary lighten-4"
                    icon
                  >
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on, attrs }">
                        <v-icon v-bind="attrs" v-on="on" small
                          >mdi-phone-check</v-icon
                        >
                        <!-- Verify icon -->
                      </template>
                      <span>Verify Phone Number</span>
                    </v-tooltip>
                  </v-btn>
                </v-col>
              </v-row>
            </v-card-text>
          </v-container>
          <!-- Update Profile -->
          <v-card-actions class="ma-0 pa-2 pa-sm-3">
            <v-row justify="center" class="ma-0">
              <v-col cols="12" class="pa-0 pa-sm-2 text-center">
                <v-btn
                  style="width: 100%; max-width: 500px"
                  text
                  class="app__button ma-0 px-0"
                  :class="appDark ? 'blue darken-4' : 'blue lighten-4'"
                  @click="initiateUpdateProfile"
                >
                  UPDATE PROFILE
                </v-btn>
              </v-col>
            </v-row>
          </v-card-actions>
          <div v-if="!user.masterAdmin">
            <v-divider class="mt-2 mt-sm-4"></v-divider>
            <div class="text-center py-1 py-sm-2 account-settings">
              <v-btn
                text
                x-small
                color="grey"
                class="text-none"
                @click="deleteAccountDialog = true"
              >
                <v-icon left size="16">mdi-delete-outline</v-icon>
                Delete account
              </v-btn>
            </div>
          </div>
        </v-card>
      </v-col>
    </v-row>
    <!-- Add Delete Account Dialog -->
    <v-dialog v-model="deleteAccountDialog" persistent max-width="500">
      <v-card>
        <v-card-title class="headline">
          <v-row justify="center">
            <v-col class="text-center">
              <h3>Delete Account</h3>
            </v-col>
          </v-row>
        </v-card-title>
        <v-card-text class="text-center pt-5">
          <v-icon color="error" size="64" class="mb-4">mdi-alert-circle</v-icon>
          <p class="text-h6 mb-4">
            Are you sure you want to delete your account?
          </p>
          <p class="subtitle-1">
            This action cannot be undone and will permanently delete:
          </p>
          <ul class="text-left subtitle-1 mx-auto" style="max-width: 300px">
            <li>Your profile information</li>
            <li>Order history</li>
            <li>Saved addresses</li>
            <li>Payment methods</li>
            <li>Reviews and ratings</li>
            <li>All other account data</li>
          </ul>
          <!-- Add confirmation input field -->
          <v-text-field
            v-model="deleteConfirmation"
            label="Type DELETE to confirm"
            :error-messages="deleteConfirmationError"
            class="mt-4"
            outlined
            dense
          ></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-row justify="center" class="my-2">
            <v-col cols="12" md="2" sm="6" class="text-center">
              <v-btn
                small
                :disabled="isLoading"
                @click="handleDeleteAccount"
                class="bold px-3 white--text custom-transform-class text-none error"
              >
                Delete
                <v-spacer></v-spacer>
                <v-progress-circular
                  class="pl-2 pr-2 ml-2"
                  v-if="isLoading"
                  indeterminate
                  :size="16"
                ></v-progress-circular>
              </v-btn>
            </v-col>
            <v-col cols="12" md="2" sm="6" class="text-center">
              <v-btn
                class="custom-transform-class text-none"
                small
                :disabled="isLoading"
                @click="closeDeleteDialog"
              >
                Cancel
              </v-btn>
            </v-col>
          </v-row>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'profile',
  data() {
    return {
      showConfirmNewPassword: false,
      confirmPassword: [
        (confirmation) =>
          confirmation === this.newPassword || 'Passwords must match',
      ],
      showOldPassword: false,
      showNewPassword: false,
      oldPassword: '',
      newPassword: '',
      firstName: '',
      lastName: '',
      confirmNewPassword: '',
      updateProfileDialog: false,
      updateProfileIsFormValid: false,
      changingPasswordActive: false,
      changingOrgActive: false,
      deleteAccountDialog: false,
      deleteConfirmation: '',
      deleteConfirmationError: '',
      isLoading: false,
    };
  },
  computed: {
    ...mapGetters([
      'error',
      'user',
      'token',
      'loading',
      'validationRules',
      'appDark',
    ]),
    progressing: {
      get() {
        return this.$store.getters.progressing;
      },
      set(value) {
        this.$store.commit('setProgressing', value);
      },
    },
  },
  methods: {
    initiateUpdateProfile() {
      this.clearUpdateProfileDialog();
      this.updateProfileDialog = true;
    },
    async handleUpdateProfile() {
      if (this.$refs.updateProfileForm.validate()) {
        this.updateProfileDialog = false;
        const payload = {
          updatingPassword: this.changingPasswordActive,
          email: this.user.email,
          firstName: this.firstName,
          lastName: this.lastName,
          oldPassword: this.oldPassword,
          newPassword: this.newPassword,
        };
        await this.$store.dispatch('updateUserProfile', payload);
        this.$nextTick(() => {
          if (this.$router.currentRoute.name !== 'account') {
            this.$router.push({ name: 'account' });
          }
        });
      } else {
        this.handleDialog(null, 'formNotValid');
      }
    },
    clearUpdateProfileDialog() {
      this.oldPassword = '';
      this.newPassword = '';
      this.firstName = this.user.firstName;
      this.lastName = this.user.lastName;
      this.confirmNewPassword = '';
      this.email = '';
      this.changingPasswordActive = false;
      this.changingOrgActive = false;
    },
    // Handling Dialogs
    handleDialog(content, context) {
      this.$store.dispatch('handleDialog', {
        content: content,
        context: context,
      });
    },
    openAddCellNumber() {
      this.$store.commit('setUserAccountPhoneVerificationFlag', true);
      if (this.$route.name !== 'addCellNumber') {
        this.$router.push({ name: 'addCellNumber' });
      }
    },
    closeDeleteDialog() {
      this.deleteAccountDialog = false;
      this.deleteConfirmation = '';
      this.deleteConfirmationError = '';
    },
    async handleDeleteAccount() {
      console.log('handleDeleteAccount reached');
      console.log('Delete confirmation:', this.deleteConfirmation);

      this.deleteConfirmationError = '';

      if (this.deleteConfirmation !== 'DELETE') {
        this.deleteConfirmationError = 'Please type DELETE to confirm';
        return;
      }

      try {
        this.isLoading = true;
        console.log('Dispatching deleteUserAccount action...');

        const response = await this.$store.dispatch('deleteUserAccount');
        console.log('Delete account response:', response);

        if (response && response.message) {
          this.closeDeleteDialog();
          if (this.$router.currentRoute.name !== 'signin') {
            this.$router.push({ name: 'signin' });
          }
        }
      } catch (error) {
        console.error('Error deleting account:', error);
        this.deleteConfirmationError =
          'An error occurred while deleting your account';
      } finally {
        this.isLoading = false;
      }
    },
  },
  mounted() {},
  created() {
    this.progressing = false;
  },
};
</script>

<style scoped>
/* Form Styles */
#change-password--form
  .v-input
  .v-input__control
  .v-input__slot
  .v-text-field__slot
  .v-label,
#change-password--form
  .v-input
  .v-input__control
  .v-input__slot
  .v-text-field__slot
  .v-label--active {
  font-size: 0.9em;
  font-weight: 500;
}

/* Card Styles */
.v-card {
  transition: all 0.3s ease;
  border-radius: 12px !important;
}

.v-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1) !important;
}

/* Profile Section Styles */
.text-h5,
.text-h4 {
  font-weight: 600 !important;
  position: relative;
  color: var(--v-primary-base) !important;
  margin-bottom: 1rem;
}

.text-h5::after,
.text-h4::after {
  content: '';
  position: absolute;
  bottom: -8px;
  left: 50%;
  transform: translateX(-50%);
  width: 60px;
  height: 3px;
  background: linear-gradient(
    45deg,
    var(--v-primary-base),
    var(--v-secondary-base)
  );
  border-radius: 3px;
}

/* Row Styles */
.v-row.d-flex.align-center {
  padding: 8px 0;
  transition: background-color 0.2s ease;
  border-radius: 8px;
}

.v-row.d-flex.align-center:hover {
  background-color: var(--v-secondary-lighten5);
}

/* Button Styles */
.app__button {
  border-radius: 8px !important;
  text-transform: none !important;
  letter-spacing: 0.5px !important;
  font-weight: 600 !important;
  transition: all 0.3s ease !important;
  position: relative;
  overflow: hidden !important;
}

.app__button::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 5px;
  height: 5px;
  background: rgba(255, 255, 255, 0.5);
  opacity: 0;
  border-radius: 100%;
  transform: scale(1, 1) translate(-50%);
  transform-origin: 50% 50%;
}

.app__button:hover::after {
  animation: ripple 1s ease-out;
}

/* Delete Account Section */
.account-settings {
  opacity: 0.8;
  transition: opacity 0.3s ease;
}

.account-settings:hover {
  opacity: 1;
}

/* Chip Styles */
.v-chip {
  transition: all 0.3s ease !important;
}

.v-chip:hover {
  transform: scale(1.05);
}

/* Dialog Styles */
.v-dialog .v-card {
  border-radius: 16px !important;
  overflow: hidden;
}

.v-dialog .v-card-title {
  background: linear-gradient(
    45deg,
    var(--v-primary-base),
    var(--v-secondary-base)
  );
  color: white !important;
  padding: 1.5rem !important;
}

.v-dialog .v-card-text {
  padding: 2rem !important;
}

/* Form Field Styles */
.v-text-field.v-text-field--outlined {
  border-radius: 8px;
}

.v-text-field.v-text-field--outlined:hover .v-input__slot {
  border-color: var(--v-primary-base) !important;
}

/* Animation Keyframes */
@keyframes ripple {
  0% {
    transform: scale(0, 0);
    opacity: 0.5;
  }
  20% {
    transform: scale(25, 25);
    opacity: 0.3;
  }
  100% {
    opacity: 0;
    transform: scale(40, 40);
  }
}

/* Responsive Adjustments */
@media (max-width: 600px) {
  .v-card {
    border-radius: 8px !important;
  }

  .v-dialog .v-card-title {
    padding: 1rem !important;
  }

  .v-dialog .v-card-text {
    padding: 1rem !important;
  }
}
</style>
