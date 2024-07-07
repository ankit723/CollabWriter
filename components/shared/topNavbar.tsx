import Image from 'next/image'
import Link from 'next/link'
import { Input } from '../ui/input'
import { currentUser } from '@clerk/nextjs/server'
import { fetchUser } from '@/lib/actions/user.action'

const TopNavbar = async() => {
    const user= await currentUser()
    const userInfo=await fetchUser(user?.id||"")
  return (
    <header className='grid grid-cols-3 justify-between items-center bg-dark-1 py-2 px-8'>
        <Link href="/" className='flex cursor-pointer items-center gap-1 max-lg:justify-center'>
          <Image src="/icons/logo.png" alt="Podcast Logo" width={30} height={30}/>
          <h1 className='text-17 font-extrabold text-white-1 max-lg:hidden'> <span className='text-24'>C</span>ollabWriter</h1>
        </Link>

        <div className="searchBar relative">
            <Image
                src="/icons/search.svg"
                alt="logo"
                width={20}
                height={20}
                className='absolute top-2 left-3'
            />
            <Input type='text' className='w-full bg-black-2 pl-10 py-3 rounded-lg border-none text-white-1' placeholder='Enter your file name'/>
        </div>

        {user?(<Link href={'/profile/edit'} className='w-full flex justify-end items-center'>
            <div className=" bg-[#ffffff08] px-6 rounded-lg py-1 flex items-center justify-center gap-3">
                <Image
                    src={userInfo?.image||user?.imageUrl}
                    alt="logo"
                    width={35}
                    height={35}
                    className='rounded-full'
                />

                <div className="flex-1 text-ellipsis">
                    <h4 className='text-small-semibold text-light-1 font-extrabold'>{userInfo?.name||user?.firstName}</h4>
                    <p className="text-small-medium text-gray-1">@{userInfo?.username || user?.username}</p>
                </div>

                <Image
                    src="/icons/edit.svg"
                    alt="logo"
                    width={20}
                    height={20}
                />
            </div>
        </Link>):""}

    </header>
  )
}

export default TopNavbar
