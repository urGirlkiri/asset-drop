import fs from 'fs';
import path from 'path';
import https from 'https';
import child_process from 'child_process';

const sendMessage = (msg) => {
    const buffer = Buffer.from(JSON.stringify(msg))
    const header = Buffer.alloc(4)
    header.writeUInt32LE(buffer.length, 0)
    process.stdout.write(header)
    process.stdout.write(buffer)
}

process.stdin.on('readable', () => {
    let input = []
    let chunk
    while (chunk = process.stdin.read()) {
        input.push(chunk)
    }
    input = Buffer.concat(input)

    const loop = () => {
        if (input.length < 4) return
        const msgLen = input.readUInt32LE(0)
        if (input.length < 4 + msgLen) return

        const content = input.slice(4, 4 + msgLen)
        const obj = JSON.parse(content.toString())

        handleMessage(obj)

        input = input.slice(4 + msgLen)
        loop()
    }
    loop()
})

const handleMessage = async (msg) => {
    try {
        if (msg.type === 'PING') {
            sendMessage({ status: 'connected', version: '1.0.0' })
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