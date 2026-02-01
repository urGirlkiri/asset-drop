export default function connectToHost() {
  let nativePort: any = browser.runtime.connectNative('io.assetdrop.host')

  nativePort.onMessage.addListener((msg: any) => {
    console.log(msg)
    if (msg.status === 'connected') {
      browser.runtime.sendMessage({ type: "PING", success: true }).catch(() => {})
    } else {
      browser.runtime.sendMessage({ type: "PING", success: false }).catch(() => {})
    }
  })

  nativePort.onDisconnect.addListener(() => {
    if (browser.runtime.lastError) {
      console.error("Native Host Error:", browser.runtime.lastError.message);
      
      browser.runtime.sendMessage({
        type: "PING",
        success: false,
        message: browser.runtime.lastError.message
      }).catch(() => {})
      
    } else {
      console.log("🔌 Native Host disconnected cleanly.")
    }
  })

  browser.runtime.onMessage.addListener((msg: any) => {
    if (msg.type === 'PING') {
      nativePort.postMessage({ type: 'PING' })
    }
  })

  nativePort.postMessage({ type: 'PING' })

  return nativePort
}