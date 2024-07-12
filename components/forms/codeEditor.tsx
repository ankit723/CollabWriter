'use client'
import {useState, useEffect, useCallback} from 'react'
import AceEditor from "react-ace";

import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/theme-github";
import "ace-builds/src-noconflict/ext-language_tools";
import "ace-builds/src-noconflict/theme-monokai";
import "ace-builds/src-noconflict/theme-ambiance";
import "ace-builds/src-noconflict/theme-cloud9_night";

const ws = new WebSocket(process.env.NEXT_PUBLIC_SOCKET_BACKEND_URL || 'ws://localhost:5001');



const CodeEditor = ({path, pId}:any) => {
    const [code, setCode]=useState<any>("")
    const [selectedPathContent, setSelectedPathContent]=useState<any>("")
    const isSaved=selectedPathContent===code

    useEffect(()=>{
        if(code && !isSaved){
            const timer=setTimeout(()=>{
                console.log(code)
                ws.send(JSON.stringify({ type: 'file:change', data: {
                    path:path,
                    pId:pId,
                    content:code
                } }));
            }, 5)
            return()=>{
                clearTimeout(timer)
            }
        }
    }, [code])

    const getFileContents=useCallback(async()=>{
        if(!path)return;
        const response=await fetch(`http://localhost:5001/files/content?path=${path}&pId=${pId}`)
        const result=await response.json()
        setSelectedPathContent(result.content)
    }, [path])

    useEffect(()=>{
        if(path && selectedPathContent){
            setCode(selectedPathContent)
        }
    }, [path, selectedPathContent])

    useEffect(()=>{
        setCode("")
    }, [path])

    useEffect(()=>{
        if(path) getFileContents()
    }, [getFileContents, path])

    useEffect(()=>{
        ws.onmessage=async(event)=>{
            const message=JSON.parse(event.data)
            if(message.type==='file:refresh'){
                console.log('Changed')
                if(path) getFileContents()
            }
        }
    }, [getFileContents, path])

    return (
        <div style={{ height: '100%' }}>
        <AceEditor
            width='100%'
            height='100%'
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
