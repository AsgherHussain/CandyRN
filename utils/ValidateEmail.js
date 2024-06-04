export const validateEmail = value => {
  const pattern =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  const isValid = pattern.test(String(value).toLowerCase())
  return isValid
}

export const getTypeParams = filters => {
  const types = Object.entries(filters)
    .filter(([key, value]) => value.status)
    .map(([key, value]) => value.value)

  return types.join(",")
}

function arrayToQueryParams(arr) {
  let queryParams = ""
  arr.forEach(item => {
    queryParams += `${item[0]}=${encodeURIComponent(item[1])}&`
  })
  return queryParams.slice(0, -1)
}

export const getPayload = queryParams => {
  const falsyValues = [undefined, null, "", 0, false, "Invalid date", "null"]

  const payloadEntries = Object.entries(queryParams).filter(
    ([key, value]) =>
      !falsyValues.includes(value) || (key === "offset" && value === 0)
  )
  console.warn("payloadEntries", payloadEntries)
  const queryString = new URLSearchParams(payloadEntries).toString()

  return `?${arrayToQueryParams(payloadEntries)}`
}
