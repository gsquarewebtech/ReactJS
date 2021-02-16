const isArray = (array) => {
  if (array && array.constructor === Array) {
    return true
  }

  return false
}

const groupBy = (array, key) => {
  const result = {}

  if (isArray(array)) {
    for (let i = 0; i < array.length; i++) {
      const obj = array[i]

      if (!(obj[key] in result)) {
        result[obj[key]] = []
      }

      result[obj[key]].push(obj)
    }
  }

  return result
}

export default {
  isArray,
  groupBy
}
