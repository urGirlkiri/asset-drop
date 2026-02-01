export default function connectToHost() {
  let nativePort: any = browser.runtime.connectNative('io.assetdrop.host')

  nativePort.onMessage.addListener((msg: any) => {
    if (msg.status === 'connected') {
      browser.runtime.sendMessage({ type: "PING", success: true }).catch(() => { })
    }

    if (msg.status === 'PROCESS_DOWNLOAD') {
      browser.runtime.sendMessage({ ...msg, type: 'DOWNLOAD_PROCESSED' }).catch(() => { })
    }

    if (msg.status === 'FOLDER_PICKED') {
        browser.runtime.sendMessage({ 
            type: 'FOLDER_PICKED_RESULT', 
            path: msg.path 
        }).catch(() => {})
    }

    if (msg.status === 'error') {
      console.error("Native Host Reported Error:", msg.message)
      browser.runtime.sendMessage({ 
        type: 'DOWNLOAD_INTERRUPTED', 
        error: "Host Error: " + msg.message 
      }).catch(() => { })
    }
  })

  nativePort.onDisconnect.addListener(() => {
    if (browser.runtime.lastError) {
      console.error("Native Host Error:", browser.runtime.lastError.message)
      browser.runtime.sendMessage({
        type: "PING",
        success: false,
        message: browser.runtime.lastError.message
      }).catch(() => { })
    } else {
      console.log("🔌 Native Host disconnected cleanly.")
    }
  })

  browser.runtime.onMessage.addListener((msg: any) => {
    if (msg.type === 'PING') {
      nativePort.postMessage({ type: 'PING' })
    }

    if (msg.type === 'TRIGGER_FOLDER_PICKER') {
        try {
            nativePort.postMessage({ type: 'PICK_FOLDER' })
        } catch(e) { console.error(e) }
    }
  })

  nativePort.postMessage({ type: 'PING' })

  return nativePort
};