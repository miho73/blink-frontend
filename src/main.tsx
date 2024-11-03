import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './css/root.scss'
import App from './views/App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
