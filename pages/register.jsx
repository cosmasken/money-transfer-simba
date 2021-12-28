import FormInput from '../components/Form/FormInput'
import FormButton from '../components/Form/FormButton'
import Header from '../components/Head/Header'
import FormErrorMessage from '../components/Form/FormErrorMessage'
import { signIn } from "next-auth/client"
import { useState } from 'react'
import { useRouter } from 'next/router'
import axios from 'axios'

export default function Signup() {
    const [names , setNames] = useState('')
    const [email , setEmail] = useState('')
    const [password , setPassword] = useState('')
    const [passwordConfirm , setPasswordConfim] = useState('')
    const [hasError , setHasError] = useState(false)
    const [errorMessage , setErrorMessage] = useState('')
    const [isLoading , setIsLoading] = useState(false)
    const router = useRouter();

    const submitData = async(e) =>{
        e.preventDefault()
        e.stopPropagation();
        setIsLoading(true)
        try {
            const response = await axios.post('/api/users/signup',{
                names:names,
                email:email,
                passwordConfirm:passwordConfirm,
                password:password
            })
            if(response.data.status == 200){
              signIn("credentials",{
                email,
                password,
                callbackUrl:`${window.location.origin}/transactions`,
                redirect:false
              }).then(function(result){
                  router.push(result.url);
              })
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
  return (
   <>
   <Header title="Sign up" />
      <div className="h-screen">
        <div className="grid grid-cols-1">
            <div className="justify-center items-center flex">
              <form onSubmit={submitData} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mt-8">
                  
                <span className="text-2xl font-bold mb-4">Signup To Send Money</span>
                 {
                     hasError &&
                     <FormErrorMessage hideMessage={hideMessage} errorMessage={errorMessage} />
                 }
                <div className="mt-8">
                <FormInput
                  label="Names"
                  type="text"
                  placeholder="Enter your Names"
                  value={names}
                  onChange={e=>setNames(e.target.value)}
                />
                <FormInput
                  label="Email"
                  type="email"
                  placeholder="Enter your Email"
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
                <FormInput
                  label="Password Confirmation"
                  type="password"
                  placeholder="Confirm your password"
                  value={passwordConfirm}
                  onChange={e=>setPasswordConfim(e.target.value)}
                />
                <FormButton
                buttonLabel={isLoading ? "Please wait...":"Sign Up"}
                link="/"
                linkLabel="Already Have an Account?"
                />
                </div>
              </form>
            </div>
            </div>
    </div>
   </>
  )
}
