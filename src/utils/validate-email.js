const validateEmail = (email) => {
  const result = {
    ok: false
  }

  const regex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/

  if (regex.test(email)) {
    result.ok = true

    const blacklistedDomains = [
      'yahoo.com',
      'gmail.com',
      'mail.com',
      'hotmail.com'
    ]

    const domain = email.substring(email.lastIndexOf('@') + 1)

    if (blacklistedDomains.includes(domain)) {
      result.ok = false
      result.message = 'Email addresses from Gmail, Hotmail, Mail and Yahoo domains are not allowed.'
    }
  }

  return result
}

export default validateEmail
