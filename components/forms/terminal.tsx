'use client'
import React, { useEffect, useRef } from 'react'
import {Terminal as XTerminal} from '@xterm/xterm'
import '@xterm/xterm/css/xterm.css'

const ws = new WebSocket(process.env.NEXT_PUBLIC_SOCKET_BACKEND_URL || 'ws://localhost:5001');

const Terminal = () => {
    const terminalRef:any=useRef()
    const isRendered=useRef(false);

    useEffect(()=>{
        if(isRendered.current) return
        isRendered.current=true;
        const term=new XTerminal({
            theme:{
                background:"rgb(16 17 20 )",
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