import { StateStorage } from 'zustand/middleware'

export const extensionStorage: StateStorage = {
  getItem: async (name: string): Promise<string | null> => {
    const result = await browser.storage.local.get(name)
    return result[name] || null
  },
  setItem: async (name: string, value: string): Promise<void> => {
    await browser.storage.local.set({ [name]: value })
  },
  removeItem: async (name: string): Promise<void> => {
    await browser.storage.local.remove(name)
  },
}