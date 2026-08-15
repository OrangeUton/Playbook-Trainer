import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './style.css'
import PlaybookTrainerPage from './pages/PlaybookTrainer.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <PlaybookTrainerPage />
  </StrictMode>,
)
