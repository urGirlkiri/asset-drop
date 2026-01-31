export default defineBackground(() => {
  browser.sidePanel && browser.sidePanel
    .setPanelBehavior({ openPanelOnActionClick: true })
    .catch((error) => console.error(error))

  const storageMap = new Map<number, object>()
  const activeDownloads = new Set<number>()
  let progressInterval: ReturnType<typeof setInterval> | null = null
  const nativePort = connectToHost()

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

  browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'PROCESS_ASSET') {
      browser.downloads.download({
        url: message.url,
        conflictAction: 'uniquify',
        filename: `AssetDrop/${message.filename ?? 'asset'}`,
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
    }
  })

  browser.downloads.onChanged.addListener((delta) => {
    const downloadId = delta.id

    if (!storageMap.has(downloadId)) return

    if (delta.state) {
      const currentState = delta.state.current

      if (currentState === 'complete') {
        browser.downloads.search({ id: downloadId }, (results) => {
          if (results && results[0]) {
            const fullDownloadPath = results[0].filename
            console.log(fullDownloadPath)

            browser.runtime.sendMessage({
              type: 'DOWNLOAD_COMPLETE',
              id: downloadId,
              filename: fullDownloadPath.split(/[/\\]/).pop()
            })

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
        }).catch(() => {})

        activeDownloads.delete(downloadId)
        storageMap.delete(downloadId)
      }
    }
  })
})