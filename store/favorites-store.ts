import { create } from "zustand"
import { persist } from "zustand/middleware"

export interface FavoritePair {
  base: string
  symbol: string
}

interface FavoritesState {
  favorites: FavoritePair[]
}

interface FavoritesActions {
  addFavorite: (pair: FavoritePair) => void
  removeFavorite: (pair: FavoritePair) => void
  toggleFavorite: (pair: FavoritePair) => void
  isFavorite: (pair: FavoritePair) => boolean
}

const initialState: FavoritesState = {
  favorites: [],
}

export interface FavoritesStore extends FavoritesState, FavoritesActions {}

export const useFavoritesStore = create<FavoritesStore>()(
  persist(
    (set, get) => ({
      ...initialState,
      addFavorite: (pair) =>
        set((state) => ({
          favorites: [...state.favorites, pair],
        })),
      removeFavorite: (pair) =>
        set((state) => ({
          favorites: state.favorites.filter(
            (fav) => !(fav.base === pair.base && fav.symbol === pair.symbol)
          ),
        })),

      toggleFavorite: (pair) => {
        if (get().isFavorite(pair)) {
          get().removeFavorite(pair)
        } else {
          get().addFavorite(pair)
        }
      },

      isFavorite: (pair) =>
        get().favorites.some(
          (fav) => fav.base === pair.base && fav.symbol === pair.symbol
        ),
    }),
    {
      name: "favorites-storage",
    }
  )
)
