import scrapeItchIo from "@/scrapers/scrapeItchIo"

export default defineBackground(() => {
  browser.sidePanel && browser.sidePanel
    .setPanelBehavior({ openPanelOnActionClick: true })
    .catch((error) => console.error(error))

  browser.runtime.onInstalled.addListener(async (details) => {
    if (details.reason === 'install') {
      const defaultZustandState = {
        state: {
          ...defaultSettings
        },
        version: 0
      }

      await browser.storage.local.set({
        'asset-drop-settings': JSON.stringify(defaultZustandState)
      })
    }
  })

  const storageMap = new Map<number, object>()
  const activeDownloads = new Set<number>()
  let progressInterval: ReturnType<typeof setInterval> | null = null
  const nativePort = connectToHost()


  browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'PROCESS_ASSET') {

      scrapeItchIo(message.url)
        .then((result) => {
          browser.runtime.sendMessage({
            type: 'DOWNLOAD_STARTED',
            url: message.url,
            targetProject: message.targetProject
          }).catch(() => { })

          browser.downloads.download({
            url: result.url,
            conflictAction: 'uniquify',
            filename: `AssetDrop/${result.filename}`,
            saveAs: false
          }, (downloadId) => {
            if (browser.runtime.lastError) {
              console.error("Download failed:", browser.runtime.lastError)
              return
            }

            storageMap.set(downloadId, message.targetProject)
            activeDownloads.add(downloadId)
            startPolling()
          })
        })
        .catch((err) => {
          console.error("Automation Failed:", err)
          browser.runtime.sendMessage({
            type: 'DOWNLOAD_INTERRUPTED',
            error: "Could not auto-download: " + err.message
          }).catch(() => { })
        })
    }
  })

  const startPolling = () => {
    if (progressInterval) return

    progressInterval = setInterval(() => {
      if (activeDownloads.size === 0) {
        if (progressInterval) {
          clearInterval(progressInterval)
          progressInterval = null
        }
        return
      }

      activeDownloads.forEach((id) => {
        browser.downloads.search({ id }, (results) => {
          if (!results || !results[0]) {
            activeDownloads.delete(id)
            storageMap.delete(id)
            return
          }

          const item = results[0]

          if (item.state === 'in_progress') {
            const total = item.totalBytes
            const loaded = item.bytesReceived

            const percent = total > 0 ? Math.round((loaded / total) * 100) : 0

            browser.runtime.sendMessage({
              type: 'DOWNLOAD_PROGRESS',
              id: id,
              progress: percent,
              filename: item.filename.split(/[/\\]/).pop(),
              totalBytes: total,
              bytesReceived: loaded
            }).catch(() => {
            })
          }
        })
      })
    }, 200)
  }

  browser.downloads.onChanged.addListener((delta) => {
    const downloadId = delta.id
    const targetProject = storageMap.get(downloadId)

    if (!storageMap.has(downloadId) || !targetProject) return

    if (delta.state) {
      const currentState = delta.state.current

      if (currentState === 'complete') {
        browser.downloads.search({ id: downloadId }, async (results) => {
          if (results && results[0]) {
            const fullDownloadPath = results[0].filename

            const storageData = await browser.storage.local.get('asset-drop-settings')
            let moveAsset = defaultSettings.moveAsset
            let unzipAsset = defaultSettings.unzipAsset
            let deleteAfterUnzip = defaultSettings.deleteAfterUnzip 

            if (storageData['asset-drop-settings']) {
              const parsed = JSON.parse(storageData['asset-drop-settings'])
              if (parsed.state) {
                moveAsset = parsed.state.moveAsset
                unzipAsset = parsed.state.unzipAsset
                deleteAfterUnzip = parsed.state.deleteAfterUnzip
              }
            }

            browser.runtime.sendMessage({
              type: 'DOWNLOAD_COMPLETE',
              id: downloadId,
              filename: fullDownloadPath.split(/[/\\]/).pop()
            })

            if (nativePort && (moveAsset || unzipAsset)) {
              nativePort.postMessage({
                type: 'PROCESS_DOWNLOAD',
                source: fullDownloadPath,
                moveAsset,
                unzipAsset,
                deleteAfterUnzip,
                // @ts-ignore
                destination: targetProject,
              })
            }

            activeDownloads.delete(downloadId)
            storageMap.delete(downloadId)
          }
        })
      }
      else if (currentState === 'interrupted') {
        browser.runtime.sendMessage({
          type: 'DOWNLOAD_INTERRUPTED',
          id: downloadId,
          error: "Network error or User cancelled"
        }).catch(() => { })

        activeDownloads.delete(downloadId)
        storageMap.delete(downloadId)
      }
    }
  })
})