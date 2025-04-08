<template>
  <div>
    <!-- Large Screen -->
    <v-card
      elevation="0"
      class="item__container my-0 py-0 hidden-sm-and-down"
      @click="
        item.name !== 'showMore'
          ? debouncedShowItem(item.routeParam)
          : showBulkItems('deals')
      "
      @mouseover="isHovering = true"
      @mouseleave="isHovering = false"
    >
      <v-img
        :elevation="isHovering ? 10 : 2"
        cover
        :src="
          item.defaultImage !== '' ? item.defaultImage : alternateDefaultImage
        "
        class="white--text align-end my-0 py-0"
        :aspect-ratio="1"
      >
      </v-img>
      <!-- Deal Tags -->
      <div class="item__deal" v-if="item.dealName">
        <v-chip
          style="z-index: 3"
          class="ma-1 py-0"
          x-small
          color="error darken-3"
          label
          text-color="white"
        >
          {{ item.dealName }}
        </v-chip>
      </div>
      <!-- Rating, Add to Cart & Favorites -->
      <div class="mx-0 px-1 py-1">
        <!-- Rating info, cart, favourite-->
        <v-row class="mx-0 my-0 py-0" align="start" justify="space-between">
          <!-- cart  -->
          <v-col class="text-left ma-0 px-0 py-2 d-flex">
            <v-btn
              @click.stop="handleAddToCart(item)"
              class="mx-1"
              small
              icon
              v-if="!item.stock.outOfStock"
            >
              <v-badge
                :content="itemQuantityByItemId(item._id)"
                :value="itemQuantityByItemId(item._id)"
                color="red darken-4"
                overlap
              >
                <v-icon>{{
                  item.stock.outOfStock ? 'mdi-cart-off' : 'mdi-cart-plus'
                }}</v-icon>
              </v-badge>
            </v-btn>
            <v-chip v-if="item.stock.outOfStock" color="gray" label small
              >Out of Stock</v-chip
            >
          </v-col>
          <v-spacer></v-spacer>
          <!-- rating -->
          <v-col class="text-left ma-0 pa-0 d-flex">
            <v-rating
              v-if="item.rating && item.rating.rateAvg > 0"
              readonly
              dense
              x-small
              half-increments
              color="yellow darken-4"
              :background-color="appDark ? 'grey lighten-3' : 'grey darken-3'"
              empty-icon="star_outline"
              full-icon="star"
              half-icon="star_half"
              length="5"
              :value="item.rating.rateAvg"
            ></v-rating>
            <p
              class="ma-0 pa-0 orange--text caption"
              v-if="item.rating && item.rating.rateCount > 0"
            >
              ({{ item.rating.rateCount }})
            </p>
          </v-col>

          <!-- cart, fav -->
          <v-col
            class="text-right ma-0 px-0 py-2 d-flex align-center justify-end"
          >
            <!-- favourite -->
            <v-btn
              @click.stop="handleAddToFavorites(item)"
              class="mx-1"
              small
              icon
            >
              <v-icon :color="favorited(item) ? 'red darken-4' : ''">
                {{ favorited(item) ? 'favorite' : 'favorite_border' }}
              </v-icon>
            </v-btn>
          </v-col>
        </v-row>
        <!-- Price and Discount -->
        <v-row class="mx-0 my-0 py-0" align="center" justify="space-between">
          <v-col v-if="item.price" class="text-left ma-0 pa-0">
            <span
              class="font-weight-bold cyan--text"
              :class="appDark ? 'text--lighten-3' : 'text--darken-3'"
              style="cursor: pointer"
            >
              {{ item.name }}
            </span>
            <p class="body-1 my-0 py-0 mx-0 px-0">
              <span
                v-if="item.discount > 0"
                class="my-0 py-0 text-h5 red--text"
              >
                -{{ item.discount }}%
              </span>
              <span
                class="body-2 my-0 py-0 mx-0 px-0"
                :class="item.discount > 0 ? 'ml-2' : ''"
              >
                {{ formattedPrice(item.price.value, item.discount, item.tax) }}
              </span>
            </p>
          </v-col>
        </v-row>
      </div>
    </v-card>

    <!-- Small Screen -->
    <v-card
      elevation="0"
      class="item__container my-0 py-0 hidden-md-and-up"
      @click="
        item.name !== 'showMore'
          ? debouncedShowItem(item.routeParam)
          : showBulkItems('deals')
      "
    >
      <v-img
        cover
        :src="
          item.defaultImage !== '' ? item.defaultImage : alternateDefaultImage
        "
        class="white--text align-end my-0 py-0"
        :aspect-ratio="1"
      >
      </v-img>
      <!-- Deal Tags -->
      <div class="item__deal" v-if="item.dealName">
        <v-chip
          style="z-index: 3"
          class="ma-1 py-0"
          x-small
          color="error darken-3"
          label
          text-color="white"
        >
          {{ item.dealName }}
        </v-chip>
      </div>
      <!-- Rating, Add to Cart & Favorites -->
      <div class="mx-0 px-1 py-2">
        <v-row class="ma-0 pa-0" justify="space-between">
          <!-- cart -->
          <v-col class="text-left ma-0 pa-0 d-flex">
            <v-btn
              @click.stop="handleAddToCart(item)"
              class="ma-0 pa-0"
              small
              icon
              v-if="!item.stock.outOfStock"
            >
              <v-badge
                :content="itemQuantityByItemId(item._id)"
                :value="itemQuantityByItemId(item._id)"
                color="red darken-4"
                overlap
              >
                <v-icon>{{
                  item.stock.outOfStock ? 'mdi-cart-off' : 'mdi-cart-plus'
                }}</v-icon>
              </v-badge>
            </v-btn>
            <v-chip v-if="item.stock.outOfStock" color="gray" label small
              >Out of Stock</v-chip
            >
          </v-col>
          <!-- Rating info -->
          <v-col class="text-left ma-0 pa-0 d-flex">
            <v-rating
              v-if="item.rating && item.rating.rateAvg > 0"
              readonly
              dense
              x-small
              half-increments
              color="yellow darken-4"
              :background-color="appDark ? 'grey lighten-3' : 'grey darken-3'"
              empty-icon="star_outline"
              full-icon="star"
              half-icon="star_half"
              length="5"
              :value="item.rating.rateAvg"
            ></v-rating>
            <p
              class="ma-0 pa-0 orange--text caption"
              v-if="item.rating && item.rating.rateCount > 0"
            >
              ({{ item.rating.rateCount }})
            </p>
          </v-col>
          <v-col class="text-right ma-0 pa-0 d-flex align-center justify-end">
            <v-btn
              @click.stop="handleAddToFavorites(item)"
              class="ma-0 pa-0"
              small
              icon
            >
              <v-icon :color="favorited(item) ? 'red darken-4' : ''">
                {{ favorited(item) ? 'favorite' : 'favorite_border' }}
              </v-icon>
            </v-btn>
          </v-col>
        </v-row>
        <!-- Price and Discount -->
        <v-row class="mx-0 my-0 py-0" align="center" justify="space-between">
          <v-col v-if="item.price" class="text-left ma-0 pa-0">
            <span
              class="font-weight-bold cyan--text"
              :class="appDark ? 'text--lighten-3' : 'text--darken-3'"
              style="cursor: pointer"
            >
              {{ item.name }}
            </span>
            <p class="body-1 my-0 py-0 mx-0 px-0">
              <span
                v-if="item.discount > 0"
                class="my-0 py-0 text-h5 red--text"
              >
                -{{ item.discount }}%
              </span>
              <span
                class="body-2 my-0 py-0 mx-0 px-0"
                :class="item.discount > 0 ? 'ml-2' : ''"
              >
                {{ formattedPrice(item.price.value, item.discount, item.tax) }}
              </span>
            </p>
          </v-col>
        </v-row>
      </div>
    </v-card>

    <v-row
      v-if="false"
      @click="
        item.name !== 'showMore'
          ? debouncedShowItem(item.routeParam)
          : showBulkItems('deals')
      "
      class="mx-0 my-0 py-0"
      justify="start"
    >
      <v-col align="start" class="my-0 py-0">
        <span
          class="font-weight-bold cyan--text"
          :class="appDark ? 'text--lighten-3' : 'text--darken-3'"
          style="cursor: pointer"
        >
          {{ item.name }}
        </span>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import _ from 'lodash';
import { mapGetters } from 'vuex';
import AlternateDefaultImage from '@/assets/images/alternateDefaultImage.webp';

export default {
  name: 'itemImage',
  data() {
    return {
      alternateDefaultImage: AlternateDefaultImage,
      isHovering: false,
    };
  },
  props: ['item'],
  methods: {
    showItem(routeParam) {
      this.$router.push({
        name: 'itemViewer',
        params: { itemName: routeParam },
      });
    },
    showBulkItems(category) {
      this.$router.push({ name: 'bulkitems', params: { category } });
    },
    async handleAddToCart(item) {
      if (!item.stock.outOfStock) {
        if (!this.isItemInCart(item)) {
          this.snackBarText = 'Item added to Cart';
          this.cart.items.push({
            item: {
              _id: item._id,
              name: item.name,
              defaultImage: item.defaultImage,
              price: item.price,
              tax: item.tax,
              discount: item.discount,
            },
            quantity: 1,
          });
          if (this.user && this.token) {
            await this.updateCart();
          }
          this.enableSnackBar(true, 'View Cart', '/cart');
        } else {
          await this.incrementQuantity(item);
        }
      }
    },
    isItemInCart(item) {
      const itemIncart = this.cart.items.find((el) => el.item._id === item._id);
      return itemIncart ? true : false;
    },
    async incrementQuantity(item) {
      if (item.maximumOrderQuantity <= this.itemQuantityByItem(item)) {
        alert(
          'Sorry! This is the maximum quantity that can be ordered at this point.'
        );
        return;
      }
      const itemInCartIndex = this.cart.items.indexOf(
        this.cart.items.find((el) => el.item._id === item._id)
      );
      if (itemInCartIndex != -1) {
        this.cart.items[itemInCartIndex].quantity++;
      }
      await this.updateCart();
    },
    enableSnackBar(targetRequired, targetText, targetLink) {
      this.targetRequired = targetRequired;
      this.targetText = targetText;
      this.targetLink = targetLink;
      const snackBarText = this.snackBarText;
      this.$store.dispatch('setSnackBar', {
        snackBarText,
        targetRequired,
        targetText,
        targetLink,
      });
    },
    async updateCart() {
      try {
        await this.$store.dispatch('updateCart');
      } catch (error) {
        // Handle error
      }
    },
    async handleAddToFavorites(item) {
      if (!this.user || !this.token || !this.user.favorites) {
        if (this.$route.name !== 'signin') {
          this.$router.push({ name: 'signin' });
        }
        return;
      }
      if (!this.favorited(item)) {
        this.snackBarText = 'Item added to favorites';
        this.user.favorites.push(item);
        const payload = {
          itemId: item._id,
          operation: 'add',
          arrayType: 'favorites',
        };
        await this.$store.dispatch('updateItemArray', payload);
      } else {
        const index = this.user.favorites.indexOf(
          this.user.favorites.find((favItem) => favItem._id === item._id)
        );
        const payload = {
          itemId: item._id,
          operation: 'remove',
          arrayType: 'favorites',
        };
        this.user.favorites.splice(index, 1);
        await this.$store.dispatch('updateItemArray', payload);
      }
    },
    favorited(currentItem) {
      if (this.user && this.token && this.user.favorites) {
        const itemInFavorites = this.user.favorites.find(
          (item) => item._id === currentItem._id
        );
        return itemInFavorites ? true : false;
      } else {
        return false;
      }
    },
    itemQuantityByItem(item) {
      let itemIncart;
      if (this.cart && this.cart.items) {
        itemIncart = this.cart.items.find((el) => el.item._id === item._id);
      }
      return itemIncart ? itemIncart.quantity : 0;
    },
    itemQuantityByItemId(itemId) {
      let itemIncart;
      if (this.cart && this.cart.items) {
        itemIncart = this.cart.items.find((el) => el.item._id === itemId);
      }
      return itemIncart ? itemIncart.quantity : 0;
    },
    formattedPrice(value, discount, tax) {
      if (this.appCurrencyText === 'inr') {
        // For INR: Include tax in base price, then apply discount
        const price = parseFloat(
          Math.trunc(value * (1 + tax / 100) * (1 - discount / 100) * 100) / 100
        );
        return `${this.appCurrency}${price.toFixed(2)}`;
      } else {
        // For CAD: Apply discount to base price
        const price = Math.round(value * (1 - discount / 100) * 100) / 100;
        return `${this.appCurrency}${price.toFixed(2)}`;
      }
    },
  },
  computed: {
    ...mapGetters([
      'user',
      'token',
      'appThemeFontColor',
      'appLightBackground',
      'itemSearchResultsData',
      'appDark',
      'currentSale',
      'progressing',
      'cart',
      'appCurrencyIconText',
      'appCurrency',
      'appCurrencyText',
    ]),
  },
  created() {
    this.debouncedShowItem = _.debounce(this.showItem, 1000);
  },
};
</script>

<style scoped>
.item__container {
  cursor: pointer;
  transition: box-shadow 0.3s ease;
}
.item__container:hover {
  box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.1);
}
.item__deal {
  position: absolute;
  top: 10px;
  left: 10px;
}
.item__actions {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
