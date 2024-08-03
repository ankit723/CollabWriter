// 'use client'
// import { fetchDocument, fetchProject } from '@/lib/actions/document.action'
// import Image from 'next/image'
// import { useRouter } from 'next/navigation'
// import React, { useEffect } from 'react'
// import TextDocCardOptions from '../shared/textDocCardOptions'

// const DocumentCard = ({imgUrl, title, description, docId, type, isNew, userId, accessEmails, isPublic}:any) => {
//   const router=useRouter()

//   const handleClick=async()=>{
//     //increase views
//     if(isNew){
//       if(type==="text"){
//         await fetchDocument(docId, userId)
//       }else{
//         await fetchProject(docId, userId)
//       }
//       router.push(`/${type==="text"?"text-editor/documents":"code-editor/codes"}/${docId}`)
//     }
//     router.push(`/${type==="text"?"text-editor/documents":"code-editor/codes"}/${docId}`)
//   }
//   return (
//     <div className='cursor-pointer relative' >
//         <figure className='flex flex-col border-[1px] border-white-3 hover:border-orange-1 rounded-lg relative' >
//             <Image src={imgUrl} alt={title} width={174} height={174} className=' aspect-square h-fit w-full 2xl:size[200px] border-[1px] border-white-3 hover:border-orange-1' onClick={handleClick}/>
//             <div className="flex flex-col border-[1px] border-white-3 hover:border-orange-1 w-full p-3">
//                 <h1 className='text-16 truncate font-bold text-white-2' onClick={handleClick}>{title}</h1>
//                 <div className="flex justify-between items-center relative">
//                   <h2 className='text-12 truncate font-normal capitalize text-white-4 w-1/2'>{description}</h2>
//                   <TextDocCardOptions doc_id={docId} titleProp={title} descriptionProp={description} accessEmailsProp={accessEmails} isPublicProp={isPublic} />
//                 </div>
//             </div>
//             </figure>
      
//     </div>
//   )
// }

// export default DocumentCard;

'use client';

import { fetchDocument, fetchProject } from '@/lib/actions/document.action';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react';
import TextDocCardOptions from '../shared/textDocCardOptions';

const DocumentCard = ({ imgUrl, title, description, docId, type, isNew, userId, accessEmails, isPublic, createdAt }) => {
  const router = useRouter();
  const [showOptions, setShowOptions] = useState(false);
  const optionsRef = useRef(null);

  const handleClick = async () => {
    if (isNew) {
      if (type === 'text') {
        await fetchDocument(docId, userId);
      } else {
        await fetchProject(docId, userId);
      }
      router.push(`/${type === 'text' ? 'text-editor/documents' : 'code-editor/codes'}/${docId}`);
    } else {
      router.push(`/${type === 'text' ? 'text-editor/documents' : 'code-editor/codes'}/${docId}`);
    }
  };

  const handleOutsideClick = (event) => {
    if (optionsRef.current && !optionsRef.current.contains(event.target)) {
      setShowOptions(false);
    }
  };

  useEffect(() => {
    if (showOptions) {
      document.addEventListener('click', handleOutsideClick);
    } else {
      document.removeEventListener('click', handleOutsideClick);
    }

    return () => {
      document.removeEventListener('click', handleOutsideClick);
    };
  }, [showOptions]);

  const calculateTimeDifference = (createdAt) => {
    const createdDate = new Date(createdAt);
    const now = new Date();
    const diffInMs = now.getTime() - createdDate.getTime();
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    return diffInHours;
  };

  const timeDiffInHours = calculateTimeDifference(createdAt);

  return (
    <div className={`cursor-pointer flex flex-col ${!isNew ? 'border-white-3 border-[1px]' : ''} hover:border-orange-1 rounded-lg p-4`}>
      <div className='flex items-start gap-4'>
        {!isNew && (
          <Image src={imgUrl} alt={title} width={50} height={50} className='aspect-square' onClick={handleClick} />
        )}
        <div className={`flex ${!isNew ? 'flex-col' : ''} flex-1`}>
          <div className='flex justify-between'>
            <div className='flex flex-col'>
              <h1 className={`truncate font-bold text-white-2 ${!isNew ? 'text-16' : 'text-12 cursor-pointer'}`} onClick={handleClick}>
                {title}
              </h1>
              <p className='text-12 truncate font-normal text-white-4'>{description}</p>
              {!isNew && <span className='text-12 text-gray-500'>Created {timeDiffInHours} hrs ago</span>}
            </div>
            <div className='self-start' ref={optionsRef}>
              {!isNew && (
                <div onClick={() => setShowOptions(!showOptions)}>
                  <TextDocCardOptions
                    doc_id={docId}
                    titleProp={title}
                    descriptionProp={description}
                    accessEmailsProp={accessEmails}
                    isPublicProp={isPublic}
                    showOptions={showOptions}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentCard;

