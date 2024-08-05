// import React from 'react'
// import { Button } from '@/components/ui/button'

// const page = async() => {
//   return (
//     <div className='mt-9 flex flex-col gap-9'>
//       <section className='flex flex-col gap-5'>
//         <h1 className='text-20 font-bold text-white-1'>Your Files</h1>

//         <div className="podcast_grid">
          
//         </div>
//       </section>
//     </div>
//   )
// }

// export default page



import React from 'react'
import { fetchDocumentsByUserId } from '@/lib/actions/document.action'
import { currentUser } from '@clerk/nextjs/server'
import DocumentCard from '@/components/cards/documentCard'
import TopNavbar from '@/components/shared/topNavbar'
import { v4 as uuidv4 } from 'uuid'
import { fetchUser } from '@/lib/actions/user.action'

const truncateString = (str: string, num: number) => {
  if (str.length > num) {
    return str.slice(0, num) + '...'
  } else {
    return str
  }
}

const Page = async () => {
  const user = await currentUser() || null
  
  let userInfo = null;
  let documents = [];
  let projects = [];
  
  if (user) {
    userInfo = await fetchUser(user.id);
  
    if (userInfo) {
      documents = await fetchDocumentsByUserId(userInfo._id.toString(), "text");
      projects = await fetchDocumentsByUserId(userInfo._id.toString(), "code");
    }
  }

  return (
    <div>
      <div className='mt-9 flex flex-col gap-9 flex-1 px-4 sm:px-14'>
        <section className='flex flex-col gap-5 max-sm:px-4'>
          <div className="flex justify-between items-center">
            <h1 className="text-20 font-bold text-white-1" >Your Files</h1>

          </div>
        
          {user ? (
            <>
              <div className="flex gap-4 overflow-x-auto no-scrollbar" style={{ maxHeight: '500px' }}>
                {documents.slice(0, 5).map((document: any) => (
                  <DocumentCard
                    key={document.id.toString()}
                    imgUrl={"https://google.oit.ncsu.edu/wp-content/uploads/sites/6/2021/01/Google_Docs.max-2800x2800-1.png"}
                    title={truncateString(document.title, 8)}
                    description={truncateString(document.description, 5)}
                    docId={document.id.toString()}
                    type={"text"}
                    isNew={false}
                    userId={userInfo._id.toString()}
                    accessEmails={document.allowedUsers}
                    isPublic={document.isPublic} />
                ))}
              </div>
              <div className="flex justify-between items-center">
                <h1 className="text-20 font-bold text-white-1">Your Projects</h1>
              </div>
              <div className="flex gap-4 overflow-x-auto no-scrollbar" style={{ maxHeight: '500px' }}>
                {projects.slice(0, 5).map((project: any) => (
                  <DocumentCard
                    key={project.id.toString()}
                    imgUrl={"/icons/addCodingIcon.png"}
                    title={truncateString(project.title, 8)}
                    description={truncateString(project.description, 5)}
                    docId={project.id.toString()}
                    type={"project"}
                    isNew={false}
                    userId={userInfo._id.toString()}
                    accessEmails={project.allowedUsers}
                    isPublic={project.isPublic} />
                ))}
              </div>
            </>
          ) : (
            ""
          )}
        </section>
      </div>
    </div>
  )
}

export default Page
