import React from 'react'
import ReactDOM from 'react-dom'
import App from './app'

import '@styles/app.scss'
import 'flatpickr/dist/flatpickr.min.css'

const RootElement = document.getElementById('app')

if (RootElement) {
  ReactDOM.render(<App />, RootElement)
} else {
  throw new Error('Root Element does not exists')
}
