import { create } from 'zustand'

const useStore = create((set) => ({
  product: null,
  sale: null,
  setProduct: (product) => set({ product }),
  setSale: (sale) => set({ sale }),
}))

export default useStore
