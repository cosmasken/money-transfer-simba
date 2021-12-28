import React from 'react'
import prisma from '../../lib/prisma';
import { getSession , useSession } from 'next-auth/client';
import Link from 'next/link';
import Loader from "react-loader-spinner";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import Header from '../../components/Head/Header';
import Navbar from '../../components/Navbar/Navbar'


export const getServerSideProps = async(context)=> {
    const session = await getSession(context)
    if (!session) {
      return {
        redirect: {
          destination: '/',
          permanent: false,
        },
      }
    } 
    const [balances , transactions] = await Promise.all([
        await prisma.account.findMany({
            where:{
                userId:session.user.id
            },
            select:{
                amount:true,
                currency:true,
            }
        }),
        await prisma.transaction.findMany({
            where:{
                to:session.user.id
            },
        }) 

    ])
    return {
      props: {balances , transactions}
    }
}


  const isSessionValid = (session) => {
    if (typeof session !== typeof undefined && session !== null && typeof session.user !== typeof undefined)
    {
        return true;
    }
    else
    {
        return false;
    }
}

    /** @param {import('next').InferGetServerSidePropsType<typeof getServerSideProps> } props */
    export default function MyTransactions({balances , transactions}) {
    const [session , loading] = useSession()
    if (!loading)
    {
        if (isSessionValid(session))
        {
            return (
                <>
                 <Header title="Transactions" />
                  <div className="h-screen">
                      <div className="grid grid-cols-1">
                           <Navbar session={session}/>
                          <div className="justify-between">
                          <div className="w-full h-full xl:w-8/12 mb-12 xl:mb-0 px-4 mx-auto mt-24">
                                <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded ">
                                    <div className="rounded-t mb-0 px-4 py-3 border-0">
                                        <div className="flex justify-between">
                                        <div className="relative w-full px-4 max-w-full flex-grow flex-1">
                                            <h3 className="font-semibold text-base text-blueGray-700">My Transactions</h3>
                                        </div>
                                        <div className="flex justify-end">
                                        {
                                            balances.map(balance=>{
                                                return(
                                                <div key={balance.id} className="mr-4">
                                                    <h2>{balance.currency} balance: <b>{balance.amount}</b></h2>
                                                </div>
                                                )
                                            })
                                        }
                                    </div>
                                        <div className="relative w-full px-4 max-w-full flex-grow flex-1 text-right">
                                            <Link href="/transactions/create">
                                                <a className="bg-indigo-500 text-white active:bg-indigo-600 text-xs font-bold uppercase px-4 py-2 rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150" >New Transaction</a>
                                            </Link>
                                        </div>
                                        </div>
                                    </div>
                            
                                    <div className="block w-full overflow-x-auto">
                                        {
                                           transactions.length > 0 ?
                                           <table className="items-center bg-transparent w-full border-collapse ">
                                            <thead>
                                                <tr>
                                                        <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                                                                From
                                                        </th>
                                                        <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                                                                Amount
                                                        </th>
                                                        <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                                                                Currency
                                                        </th>
                                                        <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                                                                Received Date
                                                        </th>
                                                </tr>
                                            </thead>                                
                                            <tbody>
                                                {
                                                    transactions.map(transaction =>{
                                                        return(
                                                            <tr key={transaction.id}>
                                                                <th className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left text-blueGray-700 ">
                                                                    {transaction.from}
                                                                </th>
                                                                <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 ">
                                                                    <span className="text-green-400 font-extrabold">{transaction.amount}</span>
                                                                </td>
                                                                <td className="border-t-0 px-6 align-center border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                                                                    {transaction.currency}
                                                                </td>
                                                                <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                                                                    <i className="fas fa-arrow-up text-emerald-500 mr-4"></i>
                                                                    {new Date(transaction.createdAt).toDateString()}
                                                                </td>
                                                             </tr>
                                                        )
                                                    })
                                                }
                                            </tbody>                                
                                        </table> :
                                            <div className="flex justify-center items-center">
                                                <div className="bg-red-200 px-16 py-4 mb-4 rounded-md">
                                                    <span className="text-red-800 font-extrabold">
                                                        Dear {session.user.names} You have received no money Yet
                                                    </span>
                                                </div>
                                            </div>
                                        }
                                    </div>
                                </div>
                            </div>
                          </div>
                      </div>
                  </div>
                </>
            )
        }
        else
        {
            return (
                <div className='wrapper'>
                    <p>You are not logged in</p>
                </div>
            )
        }
    }
    else
    {
        return(
            <div className = "h-screen px-auto flex justify-center items-center">
            <p className = "font-bold text-center text-red-500">Please wait...</p>
                     <Loader
                     type="Puff"
                     color="#F35D2D"
                     height={50}
                     className="ml-4"
                     width={50} />
          </div>
        )
    }
}
