<template>
  <v-row class="my-0 py-0" style="width: 100%">
    <v-col class="my-0 py-0">
      <v-dialog v-model="addressDialog" persistent scrollable max-width="800px">
        <v-card max-width="800" max-height="800" style="overflow: hidden">
          <v-card-title
            class="font-weight-bold"
            :class="appDark ? 'cyan darken-4' : 'light-blue lighten-3'"
          >
            {{
              addressContext === 'add' ? 'Add a new address' : 'Update Address'
            }}
          </v-card-title>
          <!-- Address Data -->
          <v-card-text
            style="max-height: 800px"
            class="justify__text mx-0 py-0 px-0 my-0"
          >
            <v-container class="mx-0 py-0 px-0 my-0">
              <v-form
                :style="appThemeFontColor"
                v-model="isAddressFormValid"
                lazy-validation
                ref="userAddressForm"
                class="py-0 mb-0 mt-5 mx-5"
              >
                <!-- Type of Address Ignored for Canadian addresses-->
                <v-row class="my-0 py-0" justify="space-between" v-if="false">
                  <v-col class="my-0 py-0">
                    <v-radio-group v-model="activeAddress.category" row>
                      <v-row class="my-0 py-0" justify="space-around">
                        <v-col class="my-1 py-0" cols="12" md="6" sm="12">
                          <v-radio
                            label="Residential (9 AM to 9 PM)"
                            value="residential"
                          ></v-radio>
                        </v-col>
                        <v-col class="my-1 py-0" cols="12" md="6" sm="12">
                          <v-radio
                            label="Office (9 AM to 5 PM)"
                            value="office"
                          ></v-radio>
                        </v-col>
                      </v-row>
                    </v-radio-group>
                  </v-col>
                </v-row>
                <!-- Name -->
                <v-row class="my-0 py-0" justify="start">
                  <v-col
                    class="my-0 py-0 text-left"
                    align="center"
                    cols="12"
                    md="6"
                    sm="12"
                  >
                    <v-text-field
                      dense
                      outlined
                      class="my-0 py-0"
                      type="text"
                      style="font-size: 1.1em"
                      v-model="activeAddress.addresseeFirst"
                      :rules="validationRules.name"
                      placeholder="First Name"
                    >
                    </v-text-field>
                  </v-col>
                  <v-col
                    class="my-0 py-0 text-left"
                    align="center"
                    cols="12"
                    md="6"
                    sm="12"
                  >
                    <v-text-field
                      name="Last Name"
                      dense
                      outlined
                      class="my-0 py-0"
                      type="text"
                      style="font-size: 1.1em"
                      :rules="validationRules.name"
                      v-model="activeAddress.addresseeLast"
                      placeholder="Last Name"
                    >
                    </v-text-field>
                  </v-col>
                </v-row>
                <!-- Phone -->
                <v-row class="my-0 py-0 d-flex" justify="start">
                  <!-- Country Code -->
                  <v-col class="my-0 py-0 text-left" cols="4" sm="2" xs="3">
                    <v-text-field
                      dense
                      outlined
                      readonly
                      class="my-0 py-0"
                      style="font-size: 1.1em; min-width: 80px"
                      prepend-icon="phone"
                      placeholder="+1"
                      v-model="activeAddress.phoneNumber.countryCode"
                    ></v-text-field>
                  </v-col>
                  <!-- Phone Number -->
                  <v-col class="my-0 py-0 text-left" cols="8" sm="8" xs="8">
                    <v-text-field
                      name="Phone Number"
                      dense
                      outlined
                      :rules="validationRules.phoneNumber"
                      class="my-0 py-0 input-value__number"
                      type="text"
                      style="font-size: 1.1em"
                      v-model="activeAddress.phoneNumber.mobileNumber"
                      placeholder="Phone Number"
                    ></v-text-field>
                  </v-col>
                </v-row>
                <!-- Address Lines -->
                <v-row class="my-0 py-0" justify="start">
                  <!-- Line 1 -->
                  <v-col
                    class="my-0 py-0 text-left"
                    align="center"
                    cols="12"
                    md="6"
                    sm="12"
                  >
                    <v-text-field
                      dense
                      outlined
                      class="my-0 py-0"
                      :rules="validationRules.required"
                      style="font-size: 1.1em"
                      v-model="activeAddress.line1"
                      type="text"
                      placeholder="Address Line 1"
                    >
                    </v-text-field>
                  </v-col>
                  <!-- Line 2 -->
                  <v-col
                    class="my-0 py-0 text-left"
                    align="center"
                    cols="12"
                    md="6"
                    sm="12"
                  >
                    <v-text-field
                      dense
                      outlined
                      class="my-0 py-0"
                      type="text"
                      style="font-size: 1.1em"
                      v-model="activeAddress.line2"
                      placeholder="Address Line 2"
                    >
                    </v-text-field>
                  </v-col>
                </v-row>
                <!-- City, Province, Postal Code -->
                <v-row class="my-0 py-0" justify="start">
                  <!-- City -->
                  <v-col
                    class="my-0 py-0 text-left"
                    align="start"
                    cols="4"
                    md="4"
                    sm="4"
                  >
                    <v-text-field
                      dense
                      outlined
                      type="text"
                      :rules="validationRules.required"
                      class="my-0 py-0"
                      style="font-size: 1.1em"
                      v-model="activeAddress.cityTown"
                      placeholder="City / Town"
                    >
                    </v-text-field>
                  </v-col>
                  <!-- Province -->
                  <v-col
                    class="my-0 py-0 ml-0 pl-0 text-left"
                    align="center"
                    cols="4"
                    md="4"
                    sm="4"
                  >
                    <v-select
                      dense
                      outlined
                      :items="statesProvincesList"
                      :rules="validationRules.required"
                      class="my-0 py-0 input-value__number"
                      style="font-size: 1.1em"
                      v-model="activeAddress.stateProvince"
                      placeholder="Province"
                      :menu-props="{ bottom: true, offsetY: true }"
                    >
                    </v-select>
                  </v-col>
                  <!-- Postal Code -->
                  <v-col
                    class="my-0 py-0 ml-0 pl-0 text-left"
                    align="center"
                    cols="4"
                    md="4"
                    sm="4"
                  >
                    <v-text-field
                      dense
                      outlined
                      class="my-0 py-0 input-value__number"
                      type="text"
                      maxlength="7"
                      :rules="validationRules.postalCode"
                      style="font-size: 1.1em"
                      placeholder="Postal Code (e.g., A1A 1A1)"
                      v-model="activeAddress.postalCode"
                    >
                    </v-text-field>
                  </v-col>
                </v-row>
                <!-- Landmark -->
                <v-row class="my-0 py-0" justify="start" v-if="false">
                  <v-col
                    class="my-0 py-0 text-left"
                    align="center"
                    cols="12"
                    md="6"
                    sm="12"
                  >
                    <v-text-field
                      dense
                      outlined
                      class="my-0 py-0"
                      style="font-size: 1.1em"
                      v-model="activeAddress.landmark"
                      placeholder="Landmark"
                    >
                    </v-text-field>
                  </v-col>
                </v-row>
              </v-form>
            </v-container>
          </v-card-text>
          <!-- Buttons -->
          <v-card-actions>
            <v-row justify="center" class="my-2">
              <v-col md="2" sm="3" class="text-center">
                <v-btn
                  rounded
                  small
                  class="primary darken-4 font-weight-bold"
                  raised
                  color="blue"
                  @click="saveAddressDialog()"
                >
                  Submit
                </v-btn>
              </v-col>
              <v-col md="2" sm="3" class="text-center">
                <v-btn
                  rounded
                  small
                  class="error darken-4 font-weight-bold"
                  raised
                  @click="clearAddressDialog()"
                >
                  Cancel
                </v-btn>
              </v-col>
            </v-row>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-col>
  </v-row>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  computed: {
    ...mapGetters([
      'validationRules',
      'statesProvinces',
      'appDark',
      'appThemeFontColor',
      'user',
    ]),
    activeAddress: {
      get() {
        return this.$store.getters.activeAddress;
      },
      set(value) {
        this.$store.commit('setActiveAddress', value);
      },
    },
    addressContext: {
      get() {
        return this.$store.getters.addressContext;
      },
      set(value) {
        this.$store.commit('setAddressContext', value);
      },
    },
    addressDialog: {
      get() {
        return this.$store.getters.addressDialog;
      },
      set(value) {
        this.$store.commit('setAddressDialog', value);
      },
    },
    statesProvincesList() {
      if (this.statesProvinces) {
        return this.statesProvinces.categoryList;
      }
      return [];
    },
    isAddressFormValid: {
      get() {
        return this.$store.getters.isAddressFormValid;
      },
      set(value) {
        this.$store.commit('setIsAddressFormValid', value);
      },
    },
  },
  methods: {
    clearAddressDialog() {
      this.addressDialog = false;
      this.activeAddress = {
        category: 'residential',
        addresseeFirst: '',
        addresseeLast: '',
        line1: '',
        line2: '',
        landmark: '',
        stateProvince: 'Ontario',
        cityTown: '',
        country: 'Canada', // Default country
        postalCode: '',
        phoneNumber: {
          category: 'Mobile',
          countryCode: '+1', // Default for Canada
          areaCode: '', // Optional for landlines
          localNumber: '', // Optional for landlines
          mobileNumber: '', // Required for mobiles
        },
      };
      this.$refs.userAddressForm.resetValidation();
    },
    async saveAddressDialog() {
      if (this.$refs.userAddressForm.validate()) {
        const payload = {
          addressInput: {
            category: this.activeAddress.category,
            addresseeFirst: this.activeAddress.addresseeFirst,
            addresseeLast: this.activeAddress.addresseeLast,
            line1: this.activeAddress.line1,
            line2: this.activeAddress.line2,
            landmark: this.activeAddress.landmark,
            stateProvince: this.activeAddress.stateProvince,
            cityTown: this.activeAddress.cityTown,
            country: this.activeAddress.country,
            postalCode: this.activeAddress.postalCode,
            phoneNumber: {
              category: this.activeAddress.phoneNumber.category,
              countryCode: this.activeAddress.phoneNumber.countryCode,
              areaCode: this.activeAddress.phoneNumber.areaCode,
              localNumber: this.activeAddress.phoneNumber.localNumber,
              mobileNumber: this.activeAddress.phoneNumber.mobileNumber,
            },
          },
        };

        if (this.addressContext !== 'add') {
          payload.addressId = this.activeAddress._id;
        }
        delete payload.addressInput._id; // Ensure `_id` is removed when adding

        try {
          if (this.addressContext === 'add') {
            const address = await this.$store.dispatch('addAddress', payload);
            if (address) {
              const user = this.user;
              user.addresses.push(address);
              this.$store.commit('setUser', user);
              this.$emit('userAddressesUpdated');
            }
          } else {
            const address = await this.$store.dispatch(
              'updateAddress',
              payload
            );
            if (address) {
              const user = this.user;
              const existingAddress = user.addresses.find(
                (address) => address._id === payload.addressId
              );
              const index = user.addresses.indexOf(existingAddress);
              user.addresses.splice(index, 1, address);
              this.$store.commit('setUser', user);
              this.$emit('userAddressesUpdated');
            }
          }
        } catch (error) {
          console.error(error);
        } finally {
          this.clearAddressDialog();
        }
      } else {
        this.$store.dispatch('handleDialog', {
          context: 'formNotValid',
          content: null,
        });
      }
    },
  },
};
</script>
