'use client'
import { fetchDocument, fetchProject } from '@/lib/actions/document.action'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import React, { useEffect } from 'react'
import TextDocCardOptions from '../shared/textDocCardOptions'

const DocumentCard = ({imgUrl, title, description, docId, type, isNew, userId, accessEmails, isPublic}:any) => {
  const router=useRouter()

  const handleClick=async()=>{
    //increase views
    if(isNew){
      if(type==="text"){
        await fetchDocument(docId, userId)
      }else{
        await fetchProject(docId, userId)
      }
      router.push(`/${type==="text"?"text-editor/documents":"code-editor/codes"}/${docId}`)
    }
    router.push(`/${type==="text"?"text-editor/documents":"code-editor/codes"}/${docId}`)
  }
  return (
      <div className={`cursor-pointer flex flex-col ${!isNew ? 'border-white-3 border-[1px]' : ''} hover:border-orange-1 rounded-lg p-4`}>
        <div className='flex items-start gap-4'>
          {!isNew && (
            <Image src={imgUrl} alt={title} width={50} height={50} className='aspect-square' onClick={handleClick} />
          )}
          <div className={`flex ${!isNew ? 'flex-col' : ''} flex-1`} onClick={handleClick}>
            <div className='flex justify-between'>
              <div className='flex flex-col'>
                <h1 className={`truncate font-bold text-white-2 ${!isNew ? 'text-16' : 'text-12 cursor-pointer'}`} onClick={handleClick}>
                  {title}
                </h1>
                <p className='text-12 truncate font-normal text-white-4'>{description}</p>
              </div>
              <div className='self-start'>
                {!isNew && (
                  <div >
                    <TextDocCardOptions
                      doc_id={docId}
                      titleProp={title}
                      descriptionProp={description}
                      accessEmailsProp={accessEmails}
                      isPublicProp={isPublic}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
}

export default DocumentCard;
