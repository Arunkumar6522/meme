import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import mixpanel from 'mixpanel-browser'

// Initialize Mixpanel
mixpanel.init('8900a36f4f00575be8a2ddf74926ef2b', {
  debug: true,
  track_pageview: true,
  persistence: 'localStorage',
  autocapture: true,
  record_sessions_percent: 100,
})

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)