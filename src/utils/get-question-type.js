const getQuestionType = (type) => {
  let result = null
  const types = {
    'open ended': 1,
    'yes/no': 2,
    'yes/no with explanation': 3
  }
  type = type.toLowerCase()
  result = types[type]

  return result
}

export default getQuestionType
