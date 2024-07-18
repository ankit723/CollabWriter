'use client'
import React, { useEffect, useRef, useState } from 'react'
import { Terminal as XTerminal } from '@xterm/xterm'
import '@xterm/xterm/css/xterm.css'

const Terminal = ({ pId, isDarkMode ,bgcolor}: any) => {
    const [projectId, setProjectId] = useState<any>(pId)
    const terminalRef = useRef<HTMLDivElement | null>(null)
    const wsRef = useRef<WebSocket | null>(null)
    const termRef = useRef<XTerminal | null>(null)
    const [showTerminal, setShowTerminal] = useState(true)
    const [backgroundColor, setBackgroundColor] = useState<string>(`bg-${bgcolor}`);

    useEffect(() => {
        setShowTerminal(false)
        setTimeout(() => {
            setShowTerminal(true)
        }, 200)
        setBackgroundColor(`bg-${bgcolor}`);
    }, [isDarkMode,bgcolor])

    useEffect(() => {
        if (showTerminal && terminalRef.current) {
            if (termRef.current) {
                termRef.current.dispose()
                termRef.current = null
            }

            const term = new XTerminal({
                theme: {
                    background: `bg-${bgcolor}`,
                    foreground: isDarkMode ? "rgb(255, 255, 255)" : "rgb(0, 0, 0)",
                },
                rows: 14,
                cols: 88,
                fontFamily: 'Courier New',
                fontSize: 14,
            })

            term.open(terminalRef.current)
            termRef.current = term

            if (term.element) {
                term.element.style.padding = "20px"
            }

            document.getElementsByClassName('xterm-viewport')[0].classList.add('no-scrollbar')

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
        }

        return () => {
            if (termRef.current) {
                termRef.current.dispose()
                termRef.current = null
            }
            if (wsRef.current) {
                wsRef.current.close()
                wsRef.current = null
            }
        }
    }, [projectId, isDarkMode, showTerminal,bgcolor])

    useEffect(() => {
        setProjectId(pId)
    }, [pId])

    return (
        <>
            {showTerminal && <div id='terminal' ref={terminalRef}></div>}
        </>
    )
}

export default Terminal
