async function requestFinalDownloadUrl(apiUrl: string, csrfToken: string, referer: string) {
  const response = await fetch(apiUrl, {
    method: "POST",
    credentials: "include",
    headers: {
      "X-CSRF-Token": csrfToken,
      "Content-Type": "application/x-www-form-urlencoded",
      "Referer": referer
    }
  })

  const data = await response.json()
  if (!data.url) throw new Error("API response missing file URL")
  return data.url
}

export default async function scrapeItchIo(startUrl: string): Promise<{ url: string; filename: string }> {
  const baseUrl = startUrl.replace(/\/$/, '')
  const landingHtml = await getHtml(baseUrl)

  const csrfMatch = landingHtml.match(/<meta name="csrf_token" (?:value|content)="([^"]+)"/i)
  if (!csrfMatch) throw new Error("CSRF token not found on game page")
  const csrfToken = csrfMatch[1]

  const sessionResponse = await fetch(`${baseUrl}/download_url`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
      "X-Requested-With": "XMLHttpRequest"
    },
    body: `csrf_token=${encodeURIComponent(csrfToken)}`
  })

  const sessionData = await sessionResponse.json()
  if (!sessionData.url) throw new Error("Failed to create download session")

  const downloadPageUrl = sessionData.url
  const downloadHtml = await getHtml(downloadPageUrl)

  const filenameMatch = downloadHtml.match(/<strong[^>]*class=["']name["'][^>]*>(.*?)<\/strong>/i)
  const filename = filenameMatch ? filenameMatch[1].trim() : 'asset.zip'

  const uploadIdMatch = downloadHtml.match(/data-upload_id="(\d+)"/i)
  if (uploadIdMatch) {
    const uploadId = uploadIdMatch[1]
    const fileApiUrl = `${baseUrl}/file/${uploadId}?source=game_download`
    const url = await requestFinalDownloadUrl(fileApiUrl, csrfToken, downloadPageUrl)
    return { url, filename }
  }

  const formMatch = downloadHtml.match(/action="([^"]*\/file\/[^"]*)"/i)
  if (formMatch) {
    const fileApiUrl = formMatch[1].replace(/&amp;/g, '&')
    const pageCsrfMatch = downloadHtml.match(/<meta name="csrf_token" value="([^"]+)"/i)
    const finalCsrf = pageCsrfMatch ? pageCsrfMatch[1] : csrfToken

    const url = await requestFinalDownloadUrl(fileApiUrl, finalCsrf, downloadPageUrl)
    return { url, filename }
  }

  throw new Error("No valid download button found")
}
