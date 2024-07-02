import TextEditor from '@/components/forms/textEditor'
import { currentUser } from '@clerk/nextjs/server';
import { fetchUser } from '@/lib/actions/user.action';
import { redirect } from 'next/navigation';
import React from 'react'

const Page = async({params}:{params:{id:string}}) => {
  const user = await currentUser();
  if (!user) {
    redirect('/sign-in');
  }

  const userInfo = await fetchUser(user.id);
  if (!userInfo) {
    redirect('/onboarding');
  }

  return (
    <div>
      <TextEditor id={params.id} />
    </div>
  )
}

export default Page
