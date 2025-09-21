import React, { useState } from 'react'
import Login from './pages/Login'
import Chat from './pages/Chat'

export default function App() {
  const [token, setToken] = useState(localStorage.getItem('token'))

  return token ? <Chat token={token} onLogout={() => { localStorage.removeItem('token'); setToken(null) }} /> : <Login onLogin={t => { localStorage.setItem('token', t); setToken(t) }} />
}
