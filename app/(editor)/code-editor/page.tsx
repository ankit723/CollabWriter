import DocumentCard from '@/components/cards/documentCard';
import { fetchDocumentsByUserId } from '@/lib/actions/document.action';
import { fetchUser } from '@/lib/actions/user.action';
import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { v4 as uuidv4 } from 'uuid';
import TopNavbar from '@/components/shared/topNavbar';


const Page = async () => {
  const user = await currentUser();
  if (!user) {
    redirect('/sign-in');
  }

  const userInfo = await fetchUser(user.id);
  if (!userInfo) {
    redirect('/onboarding');
  }

  const documents = await fetchDocumentsByUserId(userInfo._id.toString(), "code");

  return (
    <div className="">
      <TopNavbar />
      <div className='mt-9 flex flex-col gap-9 flex-1 px-4 sm:px-14'>
        <section className='flex flex-col gap-5 max-sm:px-4'>

          
          <div className="flex justify-between items-center">
            <h1 className="text-10 font-bold text-white-1">Your Projects</h1>
         
             <DocumentCard  title={"+ Add new project"} docId={uuidv4()} type={"code"} isNew={true} userId={userInfo._id.toString()} />
          </div>

          <div className="flex flex-col gap-4 overflow-y-auto no-scrollbar" style={{ maxHeight: '500px' }}>
          {documents.map((document:any) => (
              <DocumentCard key={document.id.toString()} imgUrl={"/icons/addCodingIcon.png"} title={document.title} description={document.description} docId={document.id.toString()} type={"code"} isNew={false} userId={userInfo._id.toString()} accessEmails={document.allowedUsers} isPublic={document.isPublic}/>
            ))}
          </div>
        </section>
      </div>
    </div>
    
  );
}

export default Page;
