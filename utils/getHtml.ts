export default async function getHtml(url: string) {
    const response = await fetch(url, { credentials: 'include' });
    if (!response.ok) throw new Error(`Failed to load page: ${response.status}`);
    return await response.text();
  }