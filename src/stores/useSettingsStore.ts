import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { extensionStorage } from '@/utils/storage'


type DownloadOption = 'all' | 'first one'

interface SettingsState {
    moveAsset: boolean
    unzipAsset: boolean
    deleteAfterUnzip: boolean 
    downloadOption: 'all' | 'first one'
    
    setMoveAsset: (val: boolean) => void
    setUnzipAsset: (val: boolean) => void
    setDeleteAfterUnzip: (val: boolean) => void 
    setDownloadOption: (val: 'all' | 'first one') => void
}

export const defaultSettings = {
    moveAsset: true,
    unzipAsset: true,
    deleteAfterUnzip: false,
    downloadOption: 'first one' as DownloadOption
}


export const useSettingsStore = create<SettingsState>()(
    persist(
        (set) => ({
            moveAsset: defaultSettings.moveAsset,
            unzipAsset: defaultSettings.unzipAsset,
            deleteAfterUnzip: defaultSettings.deleteAfterUnzip, 
            downloadOption: defaultSettings.downloadOption,

            setMoveAsset: (val) => set({ moveAsset: val }),
            setUnzipAsset: (val) => set({ unzipAsset: val }),
            setDeleteAfterUnzip: (val) => set({ deleteAfterUnzip: val }),
            setDownloadOption: (val) => set({ downloadOption: val }),
        }),
        {
            name: 'asset-drop-settings',
            storage: createJSONStorage(() => extensionStorage),
        }
    )
)