import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { FOOTPRINT_MAX } from '@/mall/constants/userCenter'

const useUserStore = create(
  persist(
    (set, get) => ({
      favorites: [],
      followedShops: [],
      footprints: [],
      reviews: [],
      unreadMessages: 5,

      toggleFavorite: (id) => {
        const numId = Number(id)
        let added = false
        set((state) => {
          const exists = state.favorites.includes(numId)
          added = !exists
          return {
            favorites: exists
              ? state.favorites.filter((x) => x !== numId)
              : [...state.favorites, numId],
          }
        })
        return added
      },

      isFavorite: (id) => get().favorites.includes(Number(id)),

      toggleFollowShop: (shopId) => {
        const numId = Number(shopId)
        let added = false
        set((state) => {
          const exists = state.followedShops.includes(numId)
          added = !exists
          return {
            followedShops: exists
              ? state.followedShops.filter((x) => x !== numId)
              : [...state.followedShops, numId],
          }
        })
        return added
      },

      isFollowedShop: (shopId) => get().followedShops.includes(Number(shopId)),

      addFootprint: (id) => {
        const numId = Number(id)
        set((state) => {
          const next = [numId, ...state.footprints.filter((x) => x !== numId)]
          return { footprints: next.slice(0, FOOTPRINT_MAX) }
        })
      },

      addReview: (review) => {
        set((state) => ({
          reviews: [{ id: Date.now(), ...review }, ...state.reviews],
        }))
      },

      clearUnreadMessages: () => set({ unreadMessages: 0 }),
    }),
    { name: 'mall-user-center-storage' },
  ),
)

export default useUserStore
