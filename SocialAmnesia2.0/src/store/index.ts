/* eslint-disable no-param-reassign */
import Vue from "vue";
import Vuex from "vuex";
import Store from "electron-store";
import Twitter from "twitter-lite";
import constants from "./constants";

Vue.use(Vuex);

interface TimeRangeModel {
  Hours: number;
  Days: number;
  Weeks: number;
  Years: number;
}

const persistentStore = new Store();

// uncomment to manually clear persistent store
// persistentStore.clear();

const addOrRemoveItem = (whitelistedItems, itemId) => {
  if (whitelistedItems[itemId]) {
    whitelistedItems[itemId] = false;
  } else {
    whitelistedItems[itemId] = true;
  }
};

// "middleware" to ensure that both the persistent store
//  and the vuex store are updated properly
const updateStore = (state, marker, value) => {
  state[marker] = value;
  persistentStore.set(marker, value);
};

export default new Vuex.Store({
  state: {
    [constants.TWITTER_LOGGED_IN]:
      persistentStore.get(constants.TWITTER_LOGGED_IN) || false,
    [constants.TWITTER_SCREEN_NAME]:
      persistentStore.get(constants.TWITTER_SCREEN_NAME) || "",
    [constants.TWITTER_USER_ID]:
      persistentStore.get(constants.TWITTER_USER_ID) || "",
    [constants.USER_TWEETS]: persistentStore.get(constants.USER_TWEETS) || [],
    [constants.USER_FAVORITES]:
      persistentStore.get(constants.USER_FAVORITES) || [],
    [constants.TWITTER_USER_KEYS]:
      persistentStore.get(constants.TWITTER_USER_KEYS) || {},
    [constants.TWITTER_USER_CLIENT]: persistentStore.get(
      constants.TWITTER_USER_CLIENT
    )
      ? new Twitter(persistentStore.get(constants.TWITTER_USER_KEYS))
      : {},
    [constants.WHITELISTED_TWEETS]:
      persistentStore.get(constants.WHITELISTED_TWEETS) || {},
    [constants.WHITELISTED_FAVORITES]:
      persistentStore.get(constants.WHITELISTED_FAVORITES) || {},
    [constants.CURRENTLY_DELETING]: {
      totalItems: 0,
      itemsDeleted: 0
    },
    [constants.TWITTER_TIME_RANGE_ENABLED]:
      persistentStore.get(constants.TWITTER_TIME_RANGE_ENABLED) || false,
    [constants.TWITTER_TIME_RANGE]: persistentStore.get(
      constants.TWITTER_TIME_RANGE
    ) || {
      Hours: 0,
      Days: 0,
      Weeks: 0,
      Years: 0
    }
  },
  mutations: {
    [constants.LOGIN_TO_TWITTER](state) {
      updateStore(state, constants.TWITTER_LOGGED_IN, true);
    },
    [constants.UPDATE_TWITTER_SCREEN_NAME](state, screenName) {
      updateStore(state, constants.TWITTER_SCREEN_NAME, screenName);
    },
    [constants.UPDATE_TWITTER_USER_ID](state, userId) {
      updateStore(state, constants.TWITTER_USER_ID, userId);
    },
    [constants.UPDATE_USER_TWEETS](state, tweets) {
      updateStore(state, constants.USER_TWEETS, tweets);
    },
    [constants.UPDATE_USER_FAVORITES](state, favorites) {
      updateStore(state, constants.USER_FAVORITES, favorites);
    },
    [constants.UPDATE_TWITTER_USER_KEYS](state, keys) {
      updateStore(state, constants.TWITTER_USER_KEYS, keys);
    },
    [constants.UPDATE_TWITTER_USER_CLIENT](state, client) {
      updateStore(state, constants.TWITTER_USER_CLIENT, client);
    },
    [constants.UPDATE_WHITELISTED_TWEETS](state, tweetId) {
      addOrRemoveItem(state.whitelistedTweets, tweetId);
      persistentStore.set(
        constants.WHITELISTED_TWEETS,
        state.whitelistedTweets
      );
    },
    [constants.UPDATE_WHITELISTED_FAVORITES](state, tweetId) {
      addOrRemoveItem(state.whitelistedFavorites, tweetId);
      persistentStore.set(
        constants.WHITELISTED_FAVORITES,
        state.whitelistedFavorites
      );
    },
    [constants.INCREMENT_CURRENTLY_DELETING_ITEMS_DELETED](state) {
      state[constants.CURRENTLY_DELETING].itemsDeleted += 1;
    },
    [constants.RESET_CURRENTLY_DELETING_ITEMS_DELETED](state) {
      state[constants.CURRENTLY_DELETING].itemsDeleted = 0;
    },
    [constants.UPDATE_CURRENTLY_DELETING_TOTAL_ITEMS](state, totalItems) {
      state[constants.CURRENTLY_DELETING].totalItems = totalItems;
    },
    [constants.UPDATE_TWITTER_TIME_RANGE_ENABLED](state, enabled) {
      updateStore(state, constants.TWITTER_TIME_RANGE_ENABLED, enabled);
    },
    [constants.UPDATE_TWITTER_TIME_RANGE](state, timeRange: TimeRangeModel) {
      updateStore(state, constants.TWITTER_TIME_RANGE, timeRange);
    }
  },
  actions: {
    [constants.LOGIN_TO_TWITTER](store) {
      store.commit(constants.LOGIN_TO_TWITTER);
    },
    [constants.UPDATE_TWITTER_SCREEN_NAME](store, screenName) {
      store.commit(constants.UPDATE_TWITTER_SCREEN_NAME, screenName);
    },
    [constants.UPDATE_TWITTER_USER_ID](store, userId) {
      store.commit(constants.UPDATE_TWITTER_USER_ID, userId);
    },
    [constants.UPDATE_USER_TWEETS](store, tweets) {
      store.commit(constants.UPDATE_USER_TWEETS, tweets);
    },
    [constants.UPDATE_USER_FAVORITES](store, favorites) {
      store.commit(constants.UPDATE_USER_FAVORITES, favorites);
    },
    [constants.UPDATE_TWITTER_USER_KEYS](store, keys) {
      store.commit(constants.UPDATE_TWITTER_USER_KEYS, keys);
    },
    [constants.UPDATE_TWITTER_USER_CLIENT](store, client) {
      store.commit(constants.UPDATE_TWITTER_USER_CLIENT, client);
    },
    [constants.UPDATE_WHITELISTED_TWEETS](store, tweetId) {
      store.commit(constants.UPDATE_WHITELISTED_TWEETS, tweetId);
    },
    [constants.UPDATE_WHITELISTED_FAVORITES](store, favoriteId) {
      store.commit(constants.UPDATE_WHITELISTED_FAVORITES, favoriteId);
    },
    [constants.INCREMENT_CURRENTLY_DELETING_ITEMS_DELETED](store) {
      store.commit(constants.INCREMENT_CURRENTLY_DELETING_ITEMS_DELETED);
    },
    [constants.RESET_CURRENTLY_DELETING_ITEMS_DELETED](store) {
      store.commit(constants.RESET_CURRENTLY_DELETING_ITEMS_DELETED);
    },
    [constants.UPDATE_CURRENTLY_DELETING_TOTAL_ITEMS](store, totalItems) {
      store.commit(constants.UPDATE_CURRENTLY_DELETING_TOTAL_ITEMS, totalItems);
    },
    [constants.UPDATE_TWITTER_TIME_RANGE_ENABLED](store, enabled) {
      store.commit(constants.UPDATE_TWITTER_TIME_RANGE_ENABLED, enabled);
    },
    [constants.UPDATE_TWITTER_TIME_RANGE](store, timeRange: TimeRangeModel) {
      store.commit(constants.UPDATE_TWITTER_TIME_RANGE, timeRange);
    }
  },
  modules: {}
});
