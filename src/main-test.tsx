import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import ComponentReviewTest from './ComponentReviewTest.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ComponentReviewTest />
  </StrictMode>,
)
