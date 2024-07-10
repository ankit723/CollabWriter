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
        <div className="w-[290px] bg-black-3 h-full py-10 px-3">
          <Link href="/" className='flex cursor-pointer items-center gap-1 pb-10 max-lg:justify-center'>
            <Image src="/icons/logo.png" alt="Podcast Logo" width={30} height={30}/>
            <h1 className='text-24 font-extrabold text-white max-lg:hidden'>CollabWriter</h1>
          </Link>

          <div className=" mt-5">
            <FileStructureTree onSelect={(path:any)=>{
              console.log(path)
              setSeletedPath(path)
            }}/>
          </div>
        </div>
        <div className="code-container w-full">
            <div className="editor h-[700px] bg-black-1">

                {selectedPath && selectedPath.replace("/", " ").replaceAll("/", " > ")}
                <CodeEditor path={selectedPath}/>
            </div>
            <Terminal />
        </div>
    </div>
  )
}

export default Page