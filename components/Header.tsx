import React from 'react'
import {  useAddress, useDisconnect, useMetamask } from "@thirdweb-dev/react";
import Link from 'next/link';
import {
    BellIcon,
    ShoppingCartIcon,
    ChevronDownIcon,
    MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import Image from 'next/image';

type Props = {}

export default function Header({}: Props) {
    const connectWithMetamask = useMetamask();
    const disconnect = useDisconnect();
    const address = useAddress();


  return (
    <div className='max-w-6xl mx-auto p-2'>
        <nav className='flex justify-between'>
            <div className='flex items-center space-x-3 text-sm'>
                {address ? (
                    <button onClick={disconnect} className='connectWalletBtn'>Hi, {address.slice(0,4) + "..." + address.slice(-4)}</button>
                ) : (
                    <button onClick={connectWithMetamask} className='connectWalletBtn'>Connect your wallet</button>
                )
                }

                <p className='headerLink'>Daily Deals</p>
                <p className='headerLink'>Help & Contact</p>
            </div>

            <div className='flex items-center space-x-6 text-sm'>
                <p className='headerLink w-8' >Ship to</p>
                <p className='headerLink'>Sell</p>
                <p className='headerLink'>Watchlist</p>

                <Link href="/addItem" className='flex items-center hover:link'>
                    Add to inventory 
                    <ChevronDownIcon className='h-4' />
                </Link>

                <BellIcon />
                <ShoppingCartIcon />
            </div>
        </nav>

        <hr  className='mt-2'/>

        <section className='flex items-center space-x-2py-5'>
            <div className='h-16 w-16 sm:w-28 md:w-44 cursor-pointer flex-shrink-0'>
                <Link href="/">
                    <Image 
                    className='h-full w-full object-contain'
                    alt="Thirdweb Logo"
                    src="https://links.papareact.com/bdb"
                    width={100}
                    height={100}
                    />
                </Link>
            </div>

            <button className='hidden lg:flex items-center space-x-2 w-20'>
                <p className='text-gray-600 text-sm'>Shop by Category</p>
                <ChevronDownIcon className='h-4 flex-shrink-0'/>
            </button>

            <div className='flex items-center space-x-2 mx-1 px-2 md:px-5 py-2
            border-black border-2 flex-1'>
                <MagnifyingGlassIcon className='w-5 text-gray-400'/>
                <input className='flex-1 outline-none' placeholder='Search for Anything' type="text" />
            </div>

            <button className='hidden sm:inline bg-blue-600 text-white px-5 mx-1
            md:px-10 py-2 border-2 border-blue-600'>Search</button>

            <Link href="">
                <button className='border-2 border-blue-600 px-5 md:px-10 py-2
                text-blue-600 hover:bg-blue-600/50 hover:text-white'>List item</button>
            </Link>
        </section>

        <hr />

        <section className='flex py-3 space-x-6 text-xs md:text-sm
        whitespace-nowrap justify-center'>
            <p className='Link'>Home</p>
            <p className='Link'>Electronics</p>
            <p className='Link'>Computers</p>
            <p className='Link hidden sm:inline'>Video Games</p>
            <p className='Link hidden sm:inline'>Home & Garden</p>
            <p className='Link hidden md:inline'>Health & beauty</p>
            <p className='Link hidden lg:inline'>Collectibles and Art</p>
            <p className='Link hidden lg:inline'>Music</p>
            <p className='Link hidden lg:inline'>Deals</p>
            <p className='Link hidden xl:inline'>Other</p>
            <p className='Link'>More</p>
        </section>
    </div>
  )
}