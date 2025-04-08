<template>
  <v-container fluid class="mx-0 pa-0">
    <!-- New Address button -->
    <v-row v-if="!readonly" class="ma-0 pa-0">
      <v-col class="mt-5 mr-5 pa-0 text-right">
        <v-btn
          small
          class="blue app__button"
          :class="appDark ? 'darken-3' : 'lighten-4'"
          @click="$emit('add-new-address')"
        >
          <v-icon>add_business</v-icon>
          <span class="ml-2">New Address</span>
        </v-btn>
      </v-col>
    </v-row>

    <!-- Address Cards -->
    <v-row class="ma-0 pa-0">
      <v-col class="ma-0 pa-0">
        <v-card-text class="mx-0 px-0 mb-3" v-if="addresses.length">
          <div v-for="(address, index) in addresses" :key="'address' + index">
            <v-card
              :elevation="!readonly && isHovered ? 16 : 2"
              :class="{ 'on-hover': !readonly && isHovered }"
              class="mx-3 py-2"
              style="border: 1px solid grey"
              :hover="!readonly"
              @mouseenter="isHovered = true"
              @mouseleave="isHovered = false"
            >
              <v-row class="ma-0 pa-0" justify="start">
                <!-- Address Content -->
                <v-col cols="8" md="10" sm="10" class="ma-0 pa-0 text-left">
                  <v-card-text>
                    <v-row class="ma-0 pa-0">
                      <v-col class="ma-0 pa-0">
                        <p class="ma-0 pa-0">
                          {{ address.addresseeFirst }}
                          {{ address.addresseeLast }}
                        </p>
                        <p class="ma-0 pa-0">
                          {{ address.line1 }} {{ address.line2 }}
                        </p>
                        <p class="ma-0 pa-0">
                          {{ address.cityTown }}, {{ address.stateProvince }},
                          {{ address.postalCode }}
                        </p>
                        <p class="ma-0 pa-0">{{ address.country }}</p>
                        <p class="ma-0 pa-0">
                          {{ formatPhoneNumber(address.phoneNumber) }}
                        </p>
                        <p class="ma-0 pa-0" v-if="address.landmark">
                          Landmark: {{ address.landmark }}
                        </p>
                      </v-col>
                    </v-row>
                  </v-card-text>
                </v-col>

                <!-- Action Buttons -->
                <v-col
                  v-if="!readonly"
                  cols="4"
                  md="2"
                  sm="2"
                  class="d-flex justify-end align-center"
                >
                  <v-btn
                    icon
                    small
                    class="mr-2"
                    @click="$emit('edit-address', address)"
                  >
                    <v-icon>edit</v-icon>
                  </v-btn>
                  <v-btn icon small @click="$emit('delete-address', address)">
                    <v-icon>delete</v-icon>
                  </v-btn>
                </v-col>
              </v-row>
            </v-card>
          </div>
        </v-card-text>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'AddressCard',
  props: {
    addresses: {
      type: Array,
      required: true,
    },
    selectedAddressId: {
      type: String,
      default: null,
    },
    addressType: {
      type: String,
      required: true,
      validator: (value) => ['shipping', 'billing', 'all'].includes(value),
    },
    readonly: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      isHovered: false,
    };
  },
  computed: {
    ...mapGetters(['appDark']),
  },
  methods: {
    formatPhoneNumber(phoneNumber) {
      if (!phoneNumber) return '';
      const countryCode = phoneNumber.countryCode.replace(/^\+/, '');
      if (phoneNumber.category === 'Mobile') {
        return `+${countryCode}-(${phoneNumber.mobileNumber.substring(
          0,
          3
        )})-${phoneNumber.mobileNumber.substring(
          3,
          6
        )}-${phoneNumber.mobileNumber.substring(6, 10)}`;
      } else {
        return `+${countryCode}-${phoneNumber.areaCode}-${phoneNumber.localNumber}`;
      }
    },
  },
};
</script>

<style scoped>
.v-card.on-hover.theme--dark {
  background-color: rgba(35, 35, 35) !important;
}

.v-card.on-hover.theme--light {
  background-color: rgba(255, 255, 255) !important;
}
</style>
