import config from '@config'

const excelFetcher = (id) => {
  return new Promise((resolve, reject) => {
    fetch(`${config.API_URL}/upload/${id}`, {
      method: 'GET'
    }).then(res => {
      res.json().then(data => {
        resolve(data)
      })
    })
  })
}

export default excelFetcher
