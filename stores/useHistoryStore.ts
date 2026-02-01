import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { extensionStorage } from '@/utils/storage'

export interface HistoryItem {
  id: string
  filename: string
  url: string
  projectName: string
  destinationPath: string
  date: string
  size: string
  status: 'success' | 'failed'
  error?: string
}

interface HistoryState {
  items: HistoryItem[]
  addItem: (item: HistoryItem) => void
  clearHistory: () => void
  removeItem: (id: string) => void
}

export const useHistoryStore = create<HistoryState>()(
  persist(
    (set) => ({
      items: [],
      
      addItem: (item) => set((state) => ({ 
        items: [item, ...state.items].slice(0, 50) 
      })),

      removeItem: (id) => set((state) => ({
        items: state.items.filter((i) => i.id !== id)
      })),

      clearHistory: () => set({ items: [] }),
    }),
    {
      name: 'asset-drop-history',
      storage: createJSONStorage(() => extensionStorage),
    }
  )
)