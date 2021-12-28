import React from 'react'
import Image from 'next/image'
import { signOut  } from 'next-auth/client';

export default function Navbar({session}) {
    return (
        <div className="flex p-4 bg-indigo-500 justify-between">
            <div className="flex">
                <Image src="/images/avatar.png" className="rounded-full bg-transparent" width={35} height={20}/>
            <h2 className="text-white ml-2 mt-2"> {session.user.names}</h2>
            </div>
            <button onClick={signOut} className="bg-white text-indigo-500 active:bg-indigo-600 text-xs font-bold uppercase px-4 py-2 rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150" type="button">Sign Out</button>
        </div>
    )
}
