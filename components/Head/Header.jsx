import React from 'react'
import Head from 'next/head'
export default function Header({title}) {
    return (
        <Head>
            <title>Money App | {title}</title>
        </Head>
    )
}
