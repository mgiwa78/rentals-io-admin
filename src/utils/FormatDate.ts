const FormatDate = (oldDate: string) => {
  const originalDate = new Date(oldDate)
  return originalDate.toLocaleString()
}

export default FormatDate
