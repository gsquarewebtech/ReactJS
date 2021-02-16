const toBoolean = (data) => {
  if (!data) {
    return false
  }

  if (data.constructor === String) {
    data = data.toLowerCase()
    if (['1', 'yes', 'true'].includes(data)) {
      return true
    }
  }

  if (data.constructor === Number) {
    if (data === 1) {
      return true
    }
  }

  if (data.constructor === Boolean) {
    return data
  }

  return false
}

export default toBoolean
