import { defineStore } from "pinia";
import genreService from "@/services/genre.service";

export const useGenreStore = defineStore("genre", {
  state: () => ({
    genres: [],
  }),

  actions: {
   async getAllGenre(params) {

    try {

        const response =
            await genreService.getAllGenres(params);

        this.genres = response.data.items;

    } catch (error) {

        console.error(
            "Lỗi lấy danh sách thể loại:",
            error
        );
    }
}
  },
});
