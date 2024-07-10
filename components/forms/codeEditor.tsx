'use client'
import {useState, useEffect} from 'react'
import AceEditor from "react-ace";

import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/theme-github";
import "ace-builds/src-noconflict/ext-language_tools";
import "ace-builds/src-noconflict/theme-monokai";
import "ace-builds/src-noconflict/theme-ambiance";
import "ace-builds/src-noconflict/theme-cloud9_night";

const ws = new WebSocket(process.env.NEXT_PUBLIC_SOCKET_BACKEND_URL || 'ws://localhost:5001');


const CodeEditor = ({path}:any) => {
    const [code, setCode]=useState<any>("")

    useEffect(()=>{
        if(code){
            const timer=setTimeout(()=>{
                console.log(code)
                ws.send(JSON.stringify({ type: 'file:change', data: {
                    path:path,
                    content:code
                } }));
            }, 5*1000)
            return()=>{
                clearTimeout(timer)
            }
        }
    }, [code])
    return (
        <div>
        <AceEditor
            width='100%'
            height='72vh'
            mode="javascript"
            theme="cloud9_night"
            value={code}
            onChange={e=>setCode(e)}
            name="UNIQUE_ID_OF_DIV"
            editorProps={{ $blockScrolling: true }}
        />
        </div>
    )
}

export default CodeEditor
