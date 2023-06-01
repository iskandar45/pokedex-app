export const sliceData = (data) => {
  const split = data.split("/")
  const last = split[split.length - 2]
  const res = last.padStart(3, "0")
  return res
}
