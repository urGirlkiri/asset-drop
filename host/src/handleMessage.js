import fs from 'fs'
import path from 'path'
import AdmZip from 'adm-zip'
import sendMessage from "./sendMessage.js"

const handleMessage = async (msg) => {
    try {
        if (msg.type === 'PING') {
            sendMessage({ status: 'connected' })
        }
        else if (msg.type === 'PROCESS_DOWNLOAD') {
            const { source, destination, moveAsset, unzipAsset } = msg

            if (!fs.existsSync(source)) {
                throw new Error(`Source file not found: ${source}`)
            }

            if (!fs.existsSync(destination)) {
                fs.mkdirSync(destination, { recursive: true })
            }

            const filename = path.basename(source)
            const finalPath = path.join(destination, filename)
            
            let finalStatus = "Moved successfully" 

            if (moveAsset) {
                fs.copyFileSync(source, finalPath)
                fs.unlinkSync(source) 
            } else {
                fs.copyFileSync(source, finalPath)
            }

            if (unzipAsset && filename.toLowerCase().endsWith('.zip')) {
                const zip = new AdmZip(finalPath)
                
                const folderName = path.parse(filename).name
                
                const extractPath = path.join(destination, folderName)

                zip.extractAllTo(extractPath, true) 
                
                finalStatus = "Moved and Unzipped successfully"
            }

            sendMessage({ 
                status: 'PROCESS_DOWNLOAD', 
                message: finalStatus, 
                originalFile: filename,
                destination: destination 
            })
        }
    } catch (err) {
        sendMessage({ status: 'error', message: err.message })
    }
}

export default handleMessage;