import { defineConfig } from 'wxt'

export default defineConfig({
  modules: ['@wxt-dev/module-react', '@wxt-dev/auto-icons'],

  imports: {
    dirs: ['stores']
  },

  manifest: (env) => ({
    name: 'Asset Drop',
    description: 'Download assets from any asset store into your game engine.',
    permissions: [
      ...(env.browser === 'firefox' ? [] : ['sidePanel']),
      'nativeMessaging', 'downloads'
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