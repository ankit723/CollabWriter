'use client'
import { currentUser } from '@clerk/nextjs/server';
import { fetchUser } from '@/lib/actions/user.action';
import { redirect } from 'next/navigation';
import { fetchProject } from '@/lib/actions/document.action';
import Terminal from '@/components/forms/terminal';
import FileStructureTree from '@/components/cards/fileStructureTree';
import CodeEditor from '@/components/forms/codeEditor';
import { useUser } from '@clerk/nextjs';
import { useEffect, useState } from 'react';
import { Replace } from 'lucide-react';

const Page = ({params}:{params:{id:string}}) => {
  const {user}=useUser()
  const [selectedPath, setSeletedPath]=useState<any>("")
  useEffect(()=>{
    const fetchData=async()=>{
      const userInfo=await fetchUser(user?.id||"")
      const project=await fetchProject(params.id, userInfo?._id)
    }
    fetchData()
  })


  return (
    <div className=' main-container flex text-white-1'> 
        <div className="w-[290px] bg-black-3 h-full py-16 px-3">
            <FileStructureTree onSelect={(path:any)=>{
              console.log(path)
              setSeletedPath(path)
            }}/>
        </div>
        <div className="code-container w-full">
            <div className="editor h-[700px] bg-black-1">
                {selectedPath && selectedPath.replace("/", " ").replaceAll("/", " > ")}
                <CodeEditor />
            </div>
            <Terminal />
        </div>
    </div>
  )
}

export default Page