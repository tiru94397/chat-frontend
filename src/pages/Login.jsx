import React, { useState } from 'react'
import axios from 'axios'

export default function Login({ onLogin }){
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [mode, setMode] = useState('login')

  const submit = async e => {
    e.preventDefault()
    const url = `http://localhost:4000/api/auth/${mode}`
    const res = await axios.post(url, { username, password })
    onLogin(res.data.token)
  }

  return (
    <div className="auth">
      <h2>{mode === 'login' ? 'Login' : 'Register'}</h2>
      <form onSubmit={submit}>
        <input value={username} onChange={e=>setUsername(e.target.value)} placeholder="username" />
        <input value={password} onChange={e=>setPassword(e.target.value)} type="password" placeholder="password" />
        <button type="submit">{mode === 'login' ? 'Login' : 'Register'}</button>
      </form>
      <button onClick={()=>setMode(mode==='login'?'register':'login')}>{mode==='login'?'Create account':'Have account?'}</button>
    </div>
  )
}
