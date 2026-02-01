import fs from 'fs'
import path from 'path'
import { exec } from 'child_process' 
import AdmZip from 'adm-zip'
import sendMessage from "./sendMessage.js"

const handleMessage = async (msg) => {
    try {
        if (msg.type === 'PING') {
            sendMessage({ status: 'connected' })
        }
        else if (msg.type === 'PICK_FOLDER') {
            exec('zenity --file-selection --directory', (error, stdout, stderr) => {
                if (error) {
                    //  likely cancelled or zenity missing
                    sendMessage({ status: 'FOLDER_PICK_CANCELED' })
                    return
                }

                let selectedPath = stdout.trim()
                
                const commonAssets = ['Assets', 'assets', 'content', 'Content']
                let suggestion = selectedPath
                
                for (const sub of commonAssets) {
                    const check = path.join(selectedPath, sub)
                    if (fs.existsSync(check)) {
                        suggestion = check 
                        break
                    }
                }

                sendMessage({ 
                    status: 'FOLDER_PICKED', 
                    path: suggestion 
                })
            })
        }
        else if (msg.type === 'PROCESS_DOWNLOAD') {
            const { source, destination, moveAsset, unzipAsset, deleteAfterUnzip } = msg

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

                if (deleteAfterUnzip) {
                    try {
                        fs.unlinkSync(finalPath) 
                        finalStatus = "Unzipped & Cleaned up"
                    } catch (e) {
                        console.error("Failed to delete zip:", e)
                        finalStatus = "Unzipped (Cleanup failed)"
                    }
                }
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