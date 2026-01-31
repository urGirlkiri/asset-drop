export default function connectToHost() {    
    let nativePort: any = browser.runtime.connectNative('io.assetdrop.host')

    nativePort.onMessage.addListener((msg: any) => {
      console.log("📩 Received from Host:", msg)
    })

    nativePort.onDisconnect.addListener(() => {
      if (browser.runtime.lastError) {
        console.error("❌ Disconnected Error:", browser.runtime.lastError.message)
      } else {
        console.log("🔌 Native Host disconnected cleanly.")
      }
    })

    console.log("jiyee iyee")
    nativePort.postMessage({ type: 'PING' }) 

    return nativePort
}