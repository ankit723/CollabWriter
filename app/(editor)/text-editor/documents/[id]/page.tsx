import TextEditor from '@/components/forms/textEditor'
import { currentUser } from '@clerk/nextjs/server';
import { fetchUser } from '@/lib/actions/user.action';
import { redirect } from 'next/navigation';
import React from 'react'
import { fetchDocument } from '@/lib/actions/document.action';

const Page = async({params}:{params:{id:string}}) => {
  const user = await currentUser();
  if (!user) {
    redirect('/sign-in');
  }

  const userInfo = await fetchUser(user.id);
  if (!userInfo) {
    redirect('/onboarding');
  }

  const documentInfo=await fetchDocument(params.id, userInfo._id)

  return (
    <div>
      <TextEditor id={params.id} userData={userInfo} documentData={documentInfo}/>
    </div>
  )
}

export default Page
