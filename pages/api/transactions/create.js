import prisma from "../../../lib/prisma";
const CC = require('currency-converter-lt')

export default async (req, res) =>{
    try {
        const { receiver , amountToSend , fromCurrency,toCurrency ,authenticatedUser } = req.body
   
    if(!receiver || !amountToSend ||!fromCurrency || !toCurrency){
        res.status(400).json({
            "message":"Please Fill All Fields"
        })
        return;
    }
    
    if(amountToSend < 10){
        res.status(400).json({
            "message":"Minimum amount to send is 10"
        })
        return;
    }

    
    const accountToChargeMoney = await prisma.account.findFirst({
        where:{
            userId:authenticatedUser.id,
            AND:{
                currency:fromCurrency
            }
        },
        select:{
            amount:true
        }
    }) 
    
    const accountToSendMoneyTo = await prisma.account.findFirst({
        where:{
            userId:receiver,
            AND:{
                currency:toCurrency
            }
        },
        select:{
            amount:true
        }
    }) 

    
    if(accountToChargeMoney.amount < amountToSend){
        res.status(400).json({
            "message":`your ${fromCurrency} amount is only ${accountToChargeMoney.amount}`
        })
        return;
    }
   
    let currencyConverter = new CC({sender:fromCurrency , receiver:toCurrency , amount:parseFloat(amountToSend)});
    let convertedAmount = await currencyConverter.convert()

    
    const createQuery = await prisma.transaction.create({
        data:{
            sender:authenticatedUser.names,
            receiver:receiver,
            amount:convertedAmount,
            currency:toCurrency
        }
    })

    
    const updatedSenderAmount = accountToChargeMoney.amount - amountToSend
    const updateSenderQuery = await prisma.account.updateMany({
        where:{
            userId:authenticatedUser.id,
            AND:{
                currency:fromCurrency
            }
        },
        data:{
            amount:updatedSenderAmount
        }
    }) 

    const updatedReceiverAmount = accountToSendMoneyTo.amount + convertedAmount
    const updateReceiverQuery = await prisma.account.updateMany({
        where:{
            userId:receiver,
            AND:{
                currency:toCurrency
            }
        },
        data:{
            amount:updatedReceiverAmount
        }
    })
    
    res.status(200).send({status:200 , message:"Transaction Done Successfully"})
    } catch (error) {
        res.status(500).json({
            "message":"an Error occured..please try again"
        })
        return;
    }
}