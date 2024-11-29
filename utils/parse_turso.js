export default function parseTurso({ rows = [[]], columns = [] }) {
  if (rows.length === 0) {
    return []
  }

  return rows.map((row) => {
    return row.reduce(
      (acc, cur, i) => ({
        ...acc,
        [columns[i]]: cur
      }),
      {}
    )
  })
}
