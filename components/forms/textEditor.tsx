'use client'
import React, {useState, useEffect, useCallback, useRef} from 'react'
import Quill from "quill"
import "quill/dist/quill.snow.css"
import {io} from 'socket.io-client'

const TOOLBAR_OPTIONS = [
  [{ header: [1, 2, 3, 4, 5, 6, false] }],
  [{ font: [] }],
  [{ size: ['small', false, 'large', 'huge'] }], // Custom font sizes
  [{ list: 'ordered' }, { list: 'bullet' }],
  [{ indent: '-1' }, { indent: '+1' }], // Indent
  [{ direction: 'rtl' }], // Text direction
  ['bold', 'italic', 'underline', 'strike'], // Text formatting
  [{ color: [] }, { background: [] }], // Dropdown with defaults from theme
  [{ script: 'sub' }, { script: 'super' }], // Subscript/superscript
  [{ align: [] }],
  ['link', 'image', 'video'], // Add links, images, and videos
  ['blockquote', 'code-block'], // Blockquote and code block
  ['clean'] // Remove formatting button
];
const TextEditor = ({id}:any) => {

  const [socket, setSocket]=useState<any>(null)
  const [quill, setQuill]=useState<any>(null)

  useEffect(()=>{
    const s=io(process.env.NEXT_PUBLIC_SOCKET_BACKEND_URL||"http://localhost:3001")
    setSocket(s)

    return ()=>{
      s.disconnect()
    }
  }, [])
  
  useEffect(()=>{
    if(socket==null || quill==null) return;
    socket.once('load-document', (document:any)=>{
      quill.setContents(document)
      quill.enable()
    })
    socket.emit('get-document', id)

  }, [socket, quill, id])
  
  useEffect(()=>{
    if(socket==null || quill==null) return;
    const handler=(delta:any, oldDelta:any, source:any) => {
      if(source!=='user')return
      socket.emit("send-changes", delta)
    }
    quill.on('text-change', handler);

    return ()=>{
      quill.off('text-change', handler)
    }
  }, [socket, quill])


  useEffect(()=>{
    if(socket==null || quill==null) return;
    
    const interval=setInterval(()=>{
      socket.emit('save-document', quill.getContents())
    }, 1000)

    return()=>{
      clearInterval(interval)
    }
  }, [socket, quill])
  

  useEffect(()=>{
    if(socket==null || quill==null) return;
    const handler=(delta:any) => {
      quill.updateContents(delta)
    }
    socket.on('recieve-changes', handler);

    return ()=>{
      socket.off('recieve-changes', handler)
    }
  }, [socket, quill])

  const wrapperRef=useCallback((wrapper:any)=>{
    if(wrapper==null) return;

    wrapper.innerHTML=""
    const editor=document.createElement('div')
    wrapper.append(editor);
    const q=new Quill(editor, {
      theme:"snow", 
      modules: {
        toolbar: TOOLBAR_OPTIONS,
      },
    })
    q.disable()
    q.setText("Loading...")
    setQuill(q)
    const toolbar = wrapper.querySelector('.ql-toolbar');
    if (toolbar) {
      toolbar.style.color = '#fff'; // Set your desired text color
    }
  }, [])


  return (
    <div className='flex flex-col gap-9'>
      <section className='flex flex-col gap-5'>
        <div className="editor-container" ref={wrapperRef}></div>
      </section>
    </div>
  )
}

export default TextEditor
