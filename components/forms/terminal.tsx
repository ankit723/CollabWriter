'use client'
import React, { useEffect, useRef, useState } from 'react'
import { Terminal as XTerminal } from '@xterm/xterm'
import '@xterm/xterm/css/xterm.css'

const Terminal = ({ pId }: any) => {
    const [projectId, setProjectId] = useState<any>(pId)
    const terminalRef: any = useRef()
    const isRendered = useRef(false)
    const wsRef = useRef<WebSocket>()

    useEffect(() => {
        setProjectId(pId)
    }, [pId])

    useEffect(() => {
        if (isRendered.current) return
        isRendered.current = true

        const term = new XTerminal({
            theme: {
                background: "rgb(16 17 20 )",
            },
            rows: 14,
            cols: 88,
            fontFamily: 'Courier New',
            fontSize: 14,
        })
        term.open(terminalRef?.current)
        if (term.element) {
            term.element.style.padding = "20px"
        }

        document.getElementsByClassName('xterm-viewport')[0].classList.add('custom-scrollbar')

        term.onData((data: any) => {
            if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
                wsRef.current.send(JSON.stringify({ type: 'terminal:write', data: data, projectId: projectId }))
            }
        })

        wsRef.current = new WebSocket(process.env.NEXT_PUBLIC_SOCKET_BACKEND_URL || 'ws://localhost:5001')

        wsRef.current.onopen = () => {
            console.log('WebSocket connection established')
            // Optionally, you could notify the server that the terminal is ready
        }

        wsRef.current.onmessage = (event) => {
            const message = JSON.parse(event.data)
            if (message.type === 'terminal:data' && message.projectId === projectId) {
                console.log('Terminal data:', message.data)
                term.write(message.data)
            }
        }

        wsRef.current.onclose = () => {
            console.log('WebSocket connection closed')
        }

        wsRef.current.onerror = (error) => {
            console.error('WebSocket error:', error)
        }
    }, [projectId])

    return (
        <div id='terminal py-10' ref={terminalRef}></div>
    )
}

export default Terminal
