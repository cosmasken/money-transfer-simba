import {React , useState} from 'react'
import { useSession } from 'next-auth/client'
import prisma from '../../lib/prisma';
import { getSession } from 'next-auth/client';
import axios from 'axios';
import { useRouter } from 'next/router'
import Link from 'next/link';
import Loader from "react-loader-spinner";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import Header from '../../components/Head/Header';
import UserSelect from '../../components/Form/UserSelect';
import FormInput from '../../components/Form/FormInput';
import CurrencySelect from '../../components/Form/CurrencySelect';
import FormButton from '../../components/Form/FormButton';
import FormErrorMessage from '../../components/Form/FormErrorMessage'
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
    const [balances , availableUsers] = await Promise.all([
        await prisma.account.findMany({
            where:{
                userId:session.user.id
            },
            select:{
                amount:true,
                currency:true,
            }
        }),
        await prisma.user.findMany({
            where:{
             NOT:{
                 id:session.user.id
             }
            },
            select:{
                id:true,
                names:true,
                email:true
            }
        }) 

    ])
    return {
      props: {balances , availableUsers}
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
    export default function CreateTransaction({ availableUsers}) {
        const [receiver , setReceiver] = useState('')
        const [amount , setAmount] = useState('')
        const [fromCurrency , setFromCurrency] = useState('')
        const [toCurrency , setToCurrency] = useState('')
        const [hasError , setHasError] = useState(false)
        const [errorMessage , setErrorMessage] = useState('')
        const [isLoading , setIsLoading] = useState(false)
        const [session , loading] = useSession()
        const currencies = ['USD','EUR','NGN']
        const router = useRouter()
        const performTransaction = async(e) =>{
            e.preventDefault()
            e.stopPropagation();
            setIsLoading(true)
            try {
                const response = await axios.post('/api/transactions/create',{
                    receiver:receiver,
                    amountToSend:amount,
                    fromCurrency:fromCurrency,
                    toCurrency:toCurrency,
                    authenticatedUser:session.user
                })
                if(response.data.status == 200){
                    router.push("/transactions");
                }
            } catch (error) {
              if(error.response.status !==200){
                let errorMessage = error.response.data.message
                setIsLoading(false)
                setHasError(true)
                setErrorMessage(errorMessage)
              }
            }
        }
        function hideMessage(){
            setHasError(false)
        }   

    if (!loading)
    {
        if (isSessionValid(session))
        {
            return (
                <>
                 <Header title="Create Transaction" />
                  <div className="h-screen">
                      <div className="grid grid-cols-1">
                         <Navbar session={session}/>
                          <div className="justify-between">
                             <div className="justify-center items-center flex">
                             {
                                 availableUsers.length > 0 ?
                                 <form onSubmit={performTransaction}  className="bg-white shadow-md rounded px-8 pt-6 pb-8 mt-12">
                                <span className="text-2xl font-bold mb-4">Money Transfer Application</span>
                                {
                                    hasError &&
                                    <FormErrorMessage hideMessage={hideMessage} errorMessage={errorMessage} />
                                }
                                <div className="mt-8">
                                   <UserSelect 
                                   availableUsers={availableUsers}
                                   label="Receiver Names"
                                   onChange={e=>setReceiver(e.target.value)}
                                   />

                                   <FormInput
                                    label="Amount to Send"
                                    onChange={e=>setAmount(e.target.value)}
                                    placeholder="enter the amount to send"
                                    type="number"
                                    value={amount}
                                   />

                                   <CurrencySelect
                                    availableCurrencies={currencies}
                                    label="Select Currency From"
                                    onChange={e=>setFromCurrency(e.target.value)}

                                   />
                                   <CurrencySelect
                                    availableCurrencies={currencies}
                                    label="Select Currency To"
                                    onChange={e=>setToCurrency(e.target.value)}

                                   />

                                    <FormButton
                                     buttonLabel={isLoading ? "Please wait...":"Send Money"}
                                    link="/transactions"
                                    linkLabel="my transactions"
                                    />


                                </div>
                            </form>:
                            <>
                               <div className="items-center mt-20 bg-red-300 p-4 rounded-md">
                                   <span className="text-md text-red-600 font-bold">Dear {session.user.names} , There are no users to send money to!</span>
                                <Link  href="/transactions">
                                    <a className="text-md text-blue-500 hover:text-blue-900 font-bold"> return to my transactions</a>
                                </Link>
                              </div>
                            </>
                             }
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
