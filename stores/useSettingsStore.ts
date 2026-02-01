import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

type DownloadOption = 'all' | 'first one'

interface SettingsState {
    moveAsset: boolean,
    unzipAsset: boolean,
    downloadOption:  DownloadOption

}

export const defaultSettings = {
    moveAsset: true,
    unzipAsset: true,
    downloadOption: 'first one' as DownloadOption
}

export const useSettingsStore = create<SettingsState>()(
    persist(
        (set) => ({
            moveAsset: defaultSettings.moveAsset,
            unzipAsset: defaultSettings.unzipAsset,
            downloadOption: defaultSettings.downloadOption,

        }),
        {
            name: 'asset-drop-settings',
            storage: createJSONStorage(() => extensionStorage),
        }
    )
)