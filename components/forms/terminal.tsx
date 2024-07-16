'use client'
import React, { useEffect, useRef,useState } from 'react'
import {Terminal as XTerminal} from '@xterm/xterm'
import '@xterm/xterm/css/xterm.css'

const ws = new WebSocket(process.env.NEXT_PUBLIC_SOCKET_BACKEND_URL || 'ws://localhost:5001');

const Terminal = () => {
    const terminalRef:any=useRef()
    const isRendered=useRef(false);
    const [isDarkMode] = useState(() =>
        typeof window !== 'undefined' ? localStorage.getItem('theme') === 'dark' : false
      );

    useEffect(()=>{
        if(isRendered.current) return
        isRendered.current=true;
        const term=new XTerminal({
            theme:{
                background:isDarkMode?"rgb(16 17 20 )":"rgb(239, 238, 235)",
                foreground: isDarkMode ? "rgb(255, 255, 255)" : "rgb(0, 0, 0)",
            },
            rows:14,
            cols:88,
            fontFamily: 'Courier New',
            fontSize: 14,
        });
        term.open(terminalRef?.current)
        if(term.element){
            term.element.style.padding="20px"
        }

        document.getElementsByClassName('xterm-viewport')[0].classList.add('custom-scrollbar')

        term.onData((data:any)=>{
            console.log(data)
            ws.send(JSON.stringify({ type: 'terminal:write', data: data }));
        })

        ws.onmessage=(event)=>{
            const message=JSON.parse(event.data)
            if(message.type==='terminal:data'){
                console.log(message)
                term.write(message.data)
            }
        }

        
    }, [ws])

    return (
        <div id='terminal py-10' ref={terminalRef}></div>
    )
}

export default Terminal 