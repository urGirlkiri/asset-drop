import sendMessage from "./sendMessage.js"

const handleMessage = async (msg) => {
    try {
        if (msg.type === 'PING') {
            sendMessage({ status: 'connected' })
        }
        else if (msg.type === 'DOWNLOAD_AND_UNZIP') {
            // TODO: Fetch URL -> Write Stream -> Child_process('tar -xf...')

            sendMessage({ status: 'progress', percent: 10 })

            setTimeout(() => {
                sendMessage({
                    status: 'complete',
                    savedPath: msg.destination
                })
            }, 2000)
        }
    } catch (err) {
        sendMessage({ status: 'error', message: err.message })
    }
}

export default handleMessage