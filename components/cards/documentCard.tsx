'use client'
import { fetchDocument } from '@/lib/actions/document.action'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import React, { useEffect } from 'react'

const DocumentCard = ({imgUrl, title, description, docId, type, isNew, userId}:any) => {
  const router=useRouter()

  const handleClick=async()=>{
    //increase views
    if(isNew){
      await fetchDocument(docId, userId)
      router.push(`/${type==="text"?"text-editor/documents":"code-editor/codes"}/${docId}`)
    }
    router.push(`/${type==="text"?"text-editor/documents":"code-editor/codes"}/${docId}`)
  }
  return (
    <div className='cursor-pointer' onClick={handleClick}>
        <figure className='flex flex-col gap-2'>
            <Image src={imgUrl} alt={title} width={174} height={174} className=' aspect-square h-fit w-full rounded-xl 2xl:size[200px] bg-white-1'/>
            <div className="flex flex-col">
                <h1 className='text-16 truncate font-bold text-white-1'>{title}</h1>
                <h2 className='text-12 truncate font-normal capitalize text-white-4'>{description}</h2>
            </div>
        </figure>
      
    </div>
  )
}

export default DocumentCard;
