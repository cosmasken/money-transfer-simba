import FormInput from '../components/Form/FormInput'
import FormButton from '../components/Form/FormButton'
import Header from '../components/Head/Header'
import FormErrorMessage from '../components/Form/FormErrorMessage'
import { signIn } from "next-auth/client"
import { useRouter } from 'next/router'
import { useState } from 'react'


export default function Home() {
  const [email , setEmail] = useState('')
  const [password , setPassword] = useState('')
  const [hasError , setHasError] = useState(false)
  const [errorMessage , setErrorMessage] = useState('')
  const [isLoading , setIsLoading] = useState(false)
  const router = useRouter();

  function hideMessage(){
    setHasError(false)
  }

  const handleSubmit = (e) =>{
    e.preventDefault();
    e.stopPropagation();
    setIsLoading(true)
    if(email.trim() === "" || password.trim() === ""){
      setIsLoading(false)
      setHasError(true)
      setErrorMessage("Please provide all fields..");
      return;
    }
    signIn("credentials",{
      email,
      password,
      callbackUrl:`${window.location.origin}/transactions`,
      redirect:false
    }).then(function(result){
      if (result.error !== null)
            {
                if (result.status === 401)
                {
                  setIsLoading(false)
                    setHasError(true)
                    setErrorMessage("Invalid Credentials..");
                }
                else
                {
                   setIsLoading(false)
                    setHasError(true)
                    setErrorMessage(result.error);
                }
            }
            else
            {
                router.push(result.url);
            }
    })
  }

  return (
    <>
    <Header title="Home" />
     <div className="h-screen">
        <div className="grid grid-cols-1">
            <div className="justify-center items-center flex">
              <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mt-20">
                <span className="text-2xl font-bold mb-4">Welcome To SIMBA Money-App</span>
                {
                     hasError &&
                    <FormErrorMessage hideMessage={hideMessage} errorMessage={errorMessage} />
                 }
                <div className="mt-8">

                <FormInput
                  label="Email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={e=>setEmail(e.target.value)}
                />

                <FormInput
                  label="Password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={e=>setPassword(e.target.value)}
                />

                <FormButton
                buttonLabel={isLoading ? "Please wait...":"Sign In"}
                link="/register"
                linkLabel="No Account Yet?"
                isLoading = {isLoading}
                />

                </div>
              </form>
            </div>
            </div>
    </div>
    </>
  )
}
