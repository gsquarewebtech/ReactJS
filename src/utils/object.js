const isObject = (object) => {
  if (object && typeof object === 'object') {
    return true
  }

  return false
}

const keys = (object) => {
  let result = []

  if (isObject(object)) {
    result = Object.keys(object)
  }

  return result
}

const length = (object) => {
  let length = 0

  if (isObject(object)) {
    length = Object.keys(object).length
  }

  return length
}

export default {
  isObject,
  keys,
  length
}
