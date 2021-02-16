import config from '@config'

const FileUploader = (input) => {
  return new Promise((resolve, reject) => {
    const body = new FormData()
    body.append('group', input.group)
    body.append('clientId', input.clientId)
    body.append('file', input.file)

    const headers = {
      Authorization: `Bearer ${localStorage.authToken}`
    }

    fetch(`${config.API_URL}/upload`, {
      method: 'POST',
      body,
      headers
    }).then(res => {
      res.json().then(data => {
        resolve(data)
      })
    }).catch(error => {
      reject(error)
    })
  })
}

export default FileUploader
