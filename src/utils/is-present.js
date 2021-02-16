const isPresent = (data) => {
  if ([undefined, null, ''].includes(data)) {
    return false
  }

  if (data.constructor === Object) {
    if (!Object.keys(data).length) {
      return false
    }
  } else if (data.constructor === Array) {
    if (!data.length) {
      return false
    }
  }

  return true
}

export default isPresent
