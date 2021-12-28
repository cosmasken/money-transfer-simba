import React from 'react'

export default function CurrencySelect({label , onChange , availableCurrencies}) {
    return (
        <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
                {label}
            </label>
            <select onChange={onChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"  >
                <option value="" selected>Select Currency..</option>
                {
                    availableCurrencies.map(currency=>{
                        return(
                            <option key={currency} value={currency}>{currency}</option>
                        )
                    })
                }
            </select>
        </div>
    )
}
