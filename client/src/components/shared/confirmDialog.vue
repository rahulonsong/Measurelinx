<!-- Ediatable Dialog -->
<template>
  <v-dialog scrollable v-model="isDialog" persistent max-width="600px">
    <v-card style="overflow: hidden; width: 400px">
      <v-card-title
        class="error title font-weight-bold"
        :class="appDark ? 'darken-4 white--text' : 'lighten-4 black--text'"
        >{{ dialogHeading }}</v-card-title
      >
      <v-card-text
        class="font-weight-medium subtitle-2 mt-2"
        v-html="dialogText"
      ></v-card-text>
      <v-card-text class="font-weight-bold text-left mt-2" v-if="dialogText2">
        {{ dialogText2 }}
      </v-card-text>
      <v-card-actions class="mt-0">
        <v-row justify="center">
          <v-col v-if="dialogBtn1" cols="12" md="3" sm="3" class="text-center">
            <v-btn
              class="font-weight-bold ma-0 pa-0"
              color="red darken-1"
              text
              @click="confirmedNo"
              >{{ dialogBtn1 }}</v-btn
            >
          </v-col>
          <v-col v-if="dialogBtn2" cols="12" md="3" sm="3" class="text-center">
            <v-btn
              class="font-weight-bold ma-0 pa-0"
              color="green darken-1"
              text
              @click="confirmedYes"
              >{{ dialogBtn2 }}</v-btn
            >
          </v-col>
        </v-row>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapGetters } from 'vuex';
export default {
  props: [
    'isDialog',
    'dialogHeading',
    'dialogText',
    'dialogText2',
    'dialogBtn1',
    'dialogBtn2',
    'dialogResult',
    'dialogContext',
  ],

  computed: {
    ...mapGetters(['error', 'errorStatus', 'appDark']),
  },
  methods: {
    confirmedNo() {
      this.$emit('confirmedNo');
    },
    confirmedYes() {
      this.$emit('confirmedYes');
    },
  },
};
</script>
