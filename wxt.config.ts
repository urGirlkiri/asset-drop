import { defineConfig } from 'wxt'

export default defineConfig({
  modules: ['@wxt-dev/module-react', '@wxt-dev/auto-icons'],

  imports: {
    dirs: ['stores', 'scrapers']
  },

  manifest: (env) => ({
    name: 'Asset Drop',
    description: 'Download game assets directly into your project folder.',
    permissions: [
      ...(env.browser === 'firefox' ? [] : ['sidePanel']),
      'nativeMessaging', 'downloads', "storage"
    ],
    host_permissions: [
      "*://*.itch.io/*",
      "*://itch.io/*"
    ],

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
    },
    ...(env.browser === 'firefox' && {
      sidebar_action: {
        default_panel: "sidepanel.html",
        default_title: "Asset Drop",
        default_icon: "icons/32.png"
      }
    })
  }),
  autoIcons: {
    sizes: [16, 32, 48, 96, 128]
  },
})