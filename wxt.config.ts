import { defineConfig } from 'wxt';

export default defineConfig({
  modules: ['@wxt-dev/module-react', '@wxt-dev/auto-icons'],
  manifest: {
    name: 'Asset Drop',
    description: 'Download assets from any asset store into your game engine.',
    action: {
      default_title: 'Drop Assets Into Your Engine.',
    },
    browser_specific_settings: {
      gecko: {
        id: "asset-drop@assetdrop.io",
        // @ts-ignore
        data_collection_permissions: {
          required: ['none'],
          optional: [],
        }
      }
    }
  },
  autoIcons: {
    sizes: [16, 32, 48, 96, 128]
  },
});