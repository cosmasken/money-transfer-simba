import React from 'react'

export default function FormErrorMessage({hideMessage , errorMessage}) {
    return (
        <div className="bg-red-500 mt-4 rounded-sm p-2">
            <div className="flex justify-between">
                <span className="text-center text-white font-semibold">
                    {errorMessage}
                </span>
                 <svg onClick={hideMessage} className="w-5 h-5 cursor-pointer text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
            </div>                
        </div>
    )
}
