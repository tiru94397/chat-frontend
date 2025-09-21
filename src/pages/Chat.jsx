import React, { useState, useEffect, useRef } from 'react'
import io from 'socket.io-client'
import axios from 'axios'

const SOCKET_URL = 'https://chat-backend-m42o.onrender.com/'

export default function Chat({ token, onLogout }){
  const [me, setMe] = useState(null)
  const [users, setUsers] = useState([])
  const [activeUser, setActiveUser] = useState(null)
  const [messages, setMessages] = useState([])
  const [text, setText] = useState('')
  const socketRef = useRef()

  useEffect(()=>{
    // naive decode id from token (server sets id in payload)
    const payload = JSON.parse(atob(token.split('.')[1]))
    setMe({ id: payload.id })
    socketRef.current = io(SOCKET_URL)
    socketRef.current.emit('user:online', payload.id)

    socketRef.current.on('message:receive', msg => {
      setMessages(prev => [...prev, msg])
    })

    return ()=> socketRef.current.disconnect()
  }, [])

  useEffect(()=>{
    // fetch all users (simple approach)
    axios.get('http://localhost:4000/api/auth/users').then(r=>setUsers(r.data))
  }, [])

  const openChat = async user => {
    setActiveUser(user)
    const chatId = [me.id, user._id].sort().join('_')
    const res = await axios.get(`http://localhost:4000/api/messages/${chatId}`)
    setMessages(res.data)
  }

  const send = () => {
    if (!text.trim()) return
    const chatId = [me.id, activeUser._id].sort().join('_')
    socketRef.current.emit('send:message', { chatId, sender: me.id, receiver: activeUser._id, content: text })
    setText('')
  }

  return (
    <div className="chat-app">
      <aside className="contacts">
        <h3>Contacts</h3>
        {users.map(u=> <div key={u._id} onClick={()=>openChat(u)} className="contact">{u.username}</div>)}
        <button onClick={onLogout}>Logout</button>
      </aside>
      <main className="chat-window">
        {activeUser ? (
          <>
            <div className="messages">
              {messages.map(m=> <div key={m._id} className={`msg ${m.sender===me.id?'me':'them'}`}>{m.content}</div>)}
            </div>
            <div className="composer">
              <input value={text} onChange={e=>setText(e.target.value)} onKeyDown={e=>e.key==='Enter' && send()} />
              <button onClick={send}>Send</button>
            </div>
          </>
        ) : <div className="no-chat">Select a contact</div>}
      </main>
    </div>
  )
}
