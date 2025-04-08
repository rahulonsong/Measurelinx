<template>
  <!-- Payment -->
  <v-row class="ma-0 pa-0">
    <v-col class="ma-0 pa-0">
      <!-- Payment Info-->
      <v-card-text class="mx-0 px-0 mb-1">
        <div class="pb-1">
          <v-card
            class="mx-3 py-1"
            style="border: 1px solid grey;"
          >
            <v-row
              class="ma-0 pa-0"
              justify="center"
            >
              <!-- Payment -->
              <v-col
                cols="12"
                md="12"
                sm="12"
                class="ma-0 pa-0"
                align="start"
              >
                <v-card-text class="my-1 py-1">
                  <!-- title order aspect -->
                  <v-row class="ma-0 pa-0">
                    <v-col class="ma-0 pa-0">
                      <p class="subtitle-1 font-weight-bold ma-0 pa-0">Payment Details</p>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col>
                      <div>
                        <div id="card-element"></div>
                        <button @click="submitPayment">Place Order</button>
                      </div>
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-col>
            </v-row>
          </v-card>
        </div>
      </v-card-text>
    </v-col>
  </v-row>
</template>