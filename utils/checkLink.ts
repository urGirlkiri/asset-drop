export default function checkLink(link?: string) {
    if (!link) {
        return ("Format not supported. Please drop a valid URL.")
    }

    if (!link.startsWith('http://') && !link.startsWith('https://')) {
        return ("Invalid Link. Only HTTP/HTTPS URLs are supported.")
    }

    const url = new URL(link)

    if(!url.hostname.includes('.itch.io')){
        return ("Unsupported Store. Only itch.io is supported.")
    }

}