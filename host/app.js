import handleMessage from "./src/handleMssage.js"

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