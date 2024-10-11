export default function getMonth({ index, lang }) {
  const month = new Date(2024, index - 1).toLocaleString(lang ?? 'en-US', {
    month: 'long'
  })
  return month.charAt(0).toLocaleUpperCase() + month.slice(1).toLowerCase()
}
