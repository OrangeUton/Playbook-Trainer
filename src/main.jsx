import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './style.css'
import PlaybookTrainerPage from './pages/PlaybookTrainer.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <PlaybookTrainerPage />
  </StrictMode>,
)

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    const hadController = Boolean(navigator.serviceWorker.controller)
    let reloadedForUpdate = false

    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (hadController && !reloadedForUpdate) {
        reloadedForUpdate = true
        window.location.reload()
      }
    })

    navigator.serviceWorker.register(`${import.meta.env.BASE_URL}sw.js`)
      .then((registration) => {
        document.addEventListener('visibilitychange', () => {
          if (document.visibilityState === 'visible') registration.update()
        })
      })
  })
}
