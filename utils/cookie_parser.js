export function parseCookie({ cookiesSet, tokenName }) {
  let match
  for (const cookie of cookiesSet) {
    const regex = new RegExp(`(?:^|; )${tokenName}=([^;]*)`)
    match = cookie.match(regex)
    if (match) {
      return `${tokenName}=${match[1]}`
    }
  }
  return null
}
