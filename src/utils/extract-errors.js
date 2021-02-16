const extractErrors = (error) => {
  if (error.constructor === Array) {
    return error
  } else if ('graphQLErrors' in error) {
    return error.graphQLErrors
  }
}

export default extractErrors
