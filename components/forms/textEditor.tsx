'use client'
import React, { useState, useEffect, useCallback } from 'react';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';
import { useUser } from '@clerk/nextjs';
import TextDocProperty from '../shared/textDocProperty';

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
  ['clean'], // Remove formatting button
];

const TextEditor = ({ id, userData, documentData }: { id: string, userData:any, documentData:any }) => {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [quill, setQuill] = useState<Quill | null>(null);
  console.log(userData)
  console.log(documentData)

  if(userData._id!=documentData.userId && !documentData.allowedUsers.includes(userData.email) && documentData.isPublic===false){
    return(
      <div className="w-full h-[90vh] text-red-400 font-extrabold text-heading3-bold flex justify-center items-center text-center">
        You have no access to this document or it is not publicly available! Please contact the owner!
      </div>
    )
  }

  useEffect(() => {
    const ws = new WebSocket(process.env.NEXT_PUBLIC_SOCKET_BACKEND_URL||'ws://localhost:5001');
    setSocket(ws);

    return () => {
      ws.close();
    };
  }, []);

  useEffect(() => {
    if (!socket || !quill) return;

    socket.onopen = () => {
      console.log('WebSocket open, requesting document');
      socket.send(JSON.stringify({ type: 'get-document', id: id }));
    };

    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      console.log('Received message:', message);
      if (message.type === 'load-document') {
        quill.setContents(message.data);
        quill.enable();
      } else if (message.type === 'receive-changes') {
        quill.updateContents(message.delta);
      }
    };

    return () => {
      socket.onmessage = null;
      socket.onopen = null;
    };
  }, [socket, quill, id]);

  useEffect(() => {
    if (!socket || !quill) return;

    const handler = (delta: any, oldDelta: any, source: any) => {
      if (source !== 'user') return;
      socket.send(JSON.stringify({ type: 'send-changes', delta }));
    };

    quill.on('text-change', handler);

    return () => {
      quill.off('text-change', handler);
    };
  }, [socket, quill]);

  useEffect(() => {
    if (!socket || !quill) return;

    const interval = setInterval(() => {
      socket.send(JSON.stringify({ type: 'save-document', data: quill.getContents(), id: id }));
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [socket, quill, id]);

  const wrapperRef = useCallback((wrapper: any) => {
    if (!wrapper) return;

    wrapper.innerHTML = '';
    const editor = document.createElement('div');
    wrapper.append(editor);

    const q = new Quill(editor, {
      theme: 'snow',
      modules: {
        toolbar: TOOLBAR_OPTIONS,
      },
    });

    q.disable();
    q.setText('Loading...');
    setQuill(q);

    const toolbar = wrapper.querySelector('.ql-toolbar');
    if (toolbar) {
      toolbar.style.color = '#fff'; // Set your desired text color
    }
  }, []);

  return (
    <div className="flex flex-col gap-9">
      <TextDocProperty doc_id={documentData.id}/>
      <section className="flex flex-col gap-5">
        <div className="editor-container" ref={wrapperRef}></div>

      </section>
    </div>
  );
};

export default TextEditor;
