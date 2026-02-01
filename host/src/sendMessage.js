// For sending messages to the browser

const sendMessage = (msg) => {
    const buffer = Buffer.from(JSON.stringify(msg))
    const header = Buffer.alloc(4)
    header.writeUInt32LE(buffer.length, 0)
    process.stdout.write(header)
    process.stdout.write(buffer)
}

export default sendMessage