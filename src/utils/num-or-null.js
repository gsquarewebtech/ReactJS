const numOrNull = (data, type = 'int') => {
  let number = null

  if (data && type === 'int') {
    number = parseInt(data)
  } else if (data && type === 'float') {
    number = parseFloat(data)
  }

  if (!isNaN(number)) {
    return number
  }

  return null
}

export default numOrNull
