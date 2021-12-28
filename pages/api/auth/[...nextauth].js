import NextAuth from "next-auth";
import Providers from "next-auth/providers";
import prisma from "../../../lib/prisma";
import bcrypt  from 'bcryptjs'
let userAccount = null;

const configuration = {
    cookie: {
        secure: process.env.NODE_ENV && process.env.NODE_ENV === 'production',
    },
    session: {
        jwt: true,
        maxAge: 30 * 24 * 60 * 60
    },
    providers:[
        Providers.Credentials({
            id:'credentials',
            name:"Login",
            async authorize(credentials){
                const user = await prisma.user.findFirst({
                    where: {
                        email: credentials.email,
                    }
                });
                if(user !==null){
                    const checkUserPassword = await bcrypt.compare(credentials.password , user.password)
                    if(!checkUserPassword){
                        throw new Error("Invalid password");
                    }
                    userAccount = user;
                    return user;
                }else{
                    return null
                }
            }
        })
    ],
    callbacks:{
        async signIn(user){
            if(typeof user.id !== typeof undefined){
                return user;
            }else{
                return false
            }
        },
        async session(session , token){
            if(userAccount !== null){
                session.user = userAccount
            }
            else if (typeof token.user !== typeof undefined && (typeof session.user === typeof undefined 
                || (typeof session.user !== typeof undefined && typeof session.user.userId === typeof undefined)))
            {
                session.user = token.user;
            }
            else if (typeof token !== typeof undefined)
            {
                session.token = token;
            }
            return session;
        },
        async jwt(token, user, account, profile, isNewUser) {
            if (typeof user !== typeof undefined)
            {
                token.user = user;
            }
            return token;
        }
    }
}
export default (req, res) => NextAuth(req, res, configuration)