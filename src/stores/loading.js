import { defineStore } from "pinia";

export const useLoadingStore = defineStore("loading", {
  state: () => ({
    requestCount: 0,
  }),
  getters: {
    loading: (state) => state.requestCount > 0,
  },
  actions: {
    show() {
      this.requestCount++;
    },

    hide() {
      if (this.requestCount > 0) {
        this.requestCount--;
      }
    },
    toggle() {
      if (this.requestCount > 0) {
        this.requestCount = 0;
      } else {
        this.requestCount = 1;
      }
    },
  },
});
