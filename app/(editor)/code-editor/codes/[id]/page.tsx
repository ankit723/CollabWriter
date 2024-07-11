'use client'
import { currentUser } from '@clerk/nextjs/server';
import { fetchUser } from '@/lib/actions/user.action';
import { redirect } from 'next/navigation';
import { fetchProject } from '@/lib/actions/document.action';
import Terminal from '@/components/forms/terminal';
import FileStructureTree from '@/components/cards/fileStructureTree';
import CodeEditor from '@/components/forms/codeEditor';
import { useUser } from '@clerk/nextjs';
import { useCallback, useEffect, useState } from 'react';
import { Replace } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';



// selectedPath.replace("/", " ").replaceAll("/", " > ")

const ws = new WebSocket(process.env.NEXT_PUBLIC_SOCKET_BACKEND_URL || 'ws://localhost:5001');

const Page = ({params}:{params:{id:string}}) => {
  const {user}=useUser()
  const [selectedPath, setSeletedPath]=useState<any>("")
  const [project, setProject]=useState<any>("")

  useEffect(() => {
    const fetchData = async () => {
        const userInfo = await fetchUser(user?.id || "");
        const cProject = await fetchProject(params.id, userInfo?._id);
        setProject(cProject);
    };
    fetchData();
}, [params.id]);

useEffect(() => {
    if (project) {
      ws.send(JSON.stringify({ type: 'project:started', data: { id: project } }));
    }
}, [project]);


  return (
    <div className="">
      <div className="flex justify-between items-center text-white-1 px-10 py-2 bg-black-3" style={{borderBottom:"0.5px solid rgba(255, 255, 255, 0.4)"}}>
        <div className="">Project Name</div>
        <div className="">Search Bar</div>
        <div className="">File and Code Options</div>
      </div>
      <div className=' main-container flex text-white-1'> 
        <div className="w-[290px] bg-black-3 h-full py-3 px-3">
          <Link href="/" className='flex cursor-pointer items-center gap-1 pb-5 max-lg:justify-center'>
            <Image src="/icons/logo.png" alt="Podcast Logo" width={30} height={30}/>
            <h1 className='text-24 font-extrabold text-white max-lg:hidden'>CollabWriter</h1>
          </Link>

          <div className="">
            <FileStructureTree onSelect={(path:any)=>{
              console.log(path)
              setSeletedPath(path)
            }} pId={project}/>
          </div>
        </div>
        <div className="code-container w-full flex flex-col justify-between h-[95vh]">
          <div className="editor h-full bg-black-1">
            {selectedPath?
              <div className="h-full">
                <CodeEditor path={selectedPath} pId={project}/>
              </div>:""
            }
          </div>
          <Terminal />
        </div>
      </div>
    </div>
  )
}

export default Page