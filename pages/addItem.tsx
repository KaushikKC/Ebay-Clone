import { useAddress, useContract } from '@thirdweb-dev/react'
import { useRouter } from 'next/router';
import { env } from 'process';
import React, { FormEvent, useState } from 'react'
import Fotter from '../components/Fotter';
import Header from '../components/Header'

type Props = {}

function addItem({}: Props) {
    const address = useAddress();
    const router = useRouter();
    const [preview, setPreview] = useState<string>();
    const [image, setImage] = useState<File>();

    const { contract} = useContract(
        process.env.NEXT_PUBLIC_NFT_CONTRACT,
        'nft-collection'
    );

    console.log(contract)

    const mintNft = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!contract || !address) return;

        if (!image) {
            alert('Please Select an Image');
            return;
        }

        const target = e.target as typeof e.target & {
            name: {value: string}
            description: {value: string}
        }

        const metadata = {
            name : target.name.value,
            description : target.description.value,
            image: image,
        }

        try {
            const tx = await contract.mintTo(address, metadata);
            const receipt = tx.receipt;
            const tokenId = tx.id;
            const nft = await tx.data();

            console.log(receipt, tokenId, nft)
            router.push('/');

        } catch (error) {
            console.log(error)
        }
        
    }
  return (
    <div>
        <Header />
        <main className='max-w-6xl mx-auto p-10 border'>
            <h1 className='text-4xl font-bold'>Add an Item to the <span className='text-blue-600'>Marketplace</span> </h1>
            <h2 className='text-xl font-semibold pt-5'>Item Details</h2>
            <p className='pb-5'>
                By adding an item to the marketplace, you're essentially Minting an NDT of the item into your wallet which we can then list for sale!
            </p>

            <div className='flex flex-col justify-center items-center md:flex-row md:space-x-5 pt-5'>
                <img className='border h-80 object-contain' src={preview || "https://links.papareact.com/ucj"} alt="" />
            

            <form onSubmit={mintNft} className='flex flex-col flex-1 p-2 space-y-2'>
                <label className=''>Name of Item</label>
                <input 
                className='formField' 
                placeholder='Name of item...' 
                type="text"
                name='name'
                id='name' 
                />

                <label className=''>Discription</label>
                <input className='formField' placeholder='Enter Description' type="text"  name='description' id='description'/>

                <label className=''>Image of the Item</label>
                <input type="file" onChange={e => {
                    if (e.target.files?.[0]){
                        setPreview(URL.createObjectURL(e.target.files[0]));
                        setImage(e.target.files[0]);
                    }
                }}/>

                <button type='submit' className='bg-blue-600 font-bold text-white py-4 px-10 w-56 md:mt-auto mx-auto md:ml-auto rounded-full'>Add/Mint Item</button>
            </form>
            </div>
        </main>
        <Fotter />
    </div>
  )
}

export default addItem