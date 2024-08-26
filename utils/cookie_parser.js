export function parseCookie(response) {
  const [cookie] = response.headers.getSetCookie()
  return cookie.split(';')[0]
}
