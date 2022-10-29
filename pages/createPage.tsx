import { useAddress, useContract, MediaRenderer, useNetwork, useNetworkMismatch, useOwnedNFTs, useCreateAuctionListing, useCreateDirectListing, useActiveListings } from '@thirdweb-dev/react'
import { ChainId, NFT, NATIVE_TOKENS, NATIVE_TOKEN_ADDRESS } from '@thirdweb-dev/sdk';
import Router from 'next/router';
import React, { FormEvent, useState } from 'react'
import { ThreeCircles } from 'react-loader-spinner';
import Fotter from '../components/Fotter';
import Header from '../components/Header'
import network from '../utils/network';

type Props = {}

function createPage({}: Props) {
    const address = useAddress();
    const {contract} = useContract(
        process.env.NEXT_PUBLIC_MARKETPLACE_CONTRACT,
        "marketplace"
    );

    const [selectNft, setSelectedNft] = useState<NFT>();

    const {contract: collectContract} = useContract(
        process.env.NEXT_PUBLIC_NFT_CONTRACT,
        "nft-collection"
    );

    const ownedNfts = useOwnedNFTs(collectContract,address);

    const networkMissmatch = useNetworkMismatch();
    const [, switchNetwork] = useNetwork();
    const {data : listings, isLoading: loadingListining } = useActiveListings(contract);

    const {mutate: createDirectListing, isLoading,error} = useCreateDirectListing(contract);

    const {mutate: createAuctionListing, isLoading : isLoadingDirect,error: iserrorDirect} = useCreateAuctionListing(contract);

    const handleCreateListining = async (e: FormEvent<HTMLFormElement>) => {

        e.preventDefault();
        if (networkMissmatch) {
            switchNetwork && switchNetwork(network);
            return;
        }

        if (!selectNft) return;

        const target = e.target as typeof e.target & {
            elements: {listinigType: {value:string}; price: {value:string}};
        }

        const {listinigType, price} = target.elements;
        

        if (listinigType.value == 'directListing'){
            createDirectListing({
                assetContractAddress: process.env.NEXT_PUBLIC_NFT_CONTRACT!,
                tokenId : selectNft.metadata.id,
                currencyContractAddress: NATIVE_TOKEN_ADDRESS,
                listingDurationInSeconds: 60 * 60 * 24 * 7,
                quantity: 1,
                buyoutPricePerToken: price.value,
                startTimestamp: new Date()
            }, {
                onSuccess(data, variable, context) {
                    console.log("SUCCESS", data, variable, context);
                    Router.push("/")
                },
                onError(error, variable, context) {
                    console.log("ERROR", error, variable, context);
                }
            })
        }

        if (listinigType.value === "auctionListing" ) {
            createAuctionListing({
                assetContractAddress: process.env.NEXT_PUBLIC_NFT_CONTRACT!,
                tokenId : selectNft.metadata.id,
                currencyContractAddress: NATIVE_TOKEN_ADDRESS,
                listingDurationInSeconds: 60 * 60 * 24 * 7,
                quantity: 1,
                buyoutPricePerToken: price.value,
                startTimestamp: new Date(),
                reservePricePerToken: 0,
            }, {
                onSuccess(data, variable, context) {
                    console.log("SUCCESS", data, variable, context);
                    Router.push("/")
                },
                onError(error, variable, context) {
                    console.log("ERROR", error, variable, context);
                }
            });
        }
    }

    console.log(selectNft);

    console.log("owned Nft's",ownedNfts)

  return (
    <div>
        <Header />

        <main className='max-w-6xl mx-auto p-10 pt-2'>
            <h1 className='text-4xl font-bold mb-4'>List an <span className='text-blue-600 drop-shadow'>Item</span></h1>
            <h2 className='text-xl font-semibold mb-3'>Select the Item you would like to sell</h2>

            <hr className='mb-5'/>

            <p className='mb-3'>Below you will find the NFt's you own in your wallet</p>

            {loadingListining ? (
        //   <p className='text-center animate-pulse text-blue-500'>Loading</p> 
          <div className="text-center mx-auto">
          <ThreeCircles
        
  height="100"
  width="1000"
  color="#41b1ea"
  wrapperStyle={{}}
  wrapperClass=""
  visible={true}
  ariaLabel="three-circles-rotating"
  outerCircleColor=""
  innerCircleColor=""
  middleCircleColor=""
/>
          </div>
          
          ) : (
            <div className='flex overflow-x-scroll space-x-2 p-4'>
                {ownedNfts?.data?.map((nft) => (
                    <div onClick={() => setSelectedNft(nft)} className={`flex flex-col space-y-2 card min-w-fit border-2 bg-gray-100 ${nft.metadata.id === selectNft?.metadata.id ? "border-black " : "border-transparent"}`} key= {nft.metadata.id}>
                        <MediaRenderer className='h-48 rounded-lg' src={nft.metadata.image} />
                        <p className='text-lg truncate font-bold text-yellow-500 drop-shadow-sm'>{nft.metadata.name}</p>
                        <p className='text-xs truncate'>{nft.metadata.description}</p>
                    </div>
                    
            ))}
            </div>
          )}
            

            {selectNft && (
                <form onSubmit={handleCreateListining}>
                    <div className='flex flex-col p-10'>
                        <div className='grid grid-cols-2 gap-5'>
                            <label className='border-r font-light'>Direct Listing / Fixed Price</label>
                            <input type="radio" name='listingType' value="directListing" className="ml-auto h-10 w-10" />

                            <label className='border-r font-light'>Auction</label>
                            <input type="radio" name='listingType' value="auctionListing" className="ml-auto h-10 w-10"/>
                        
                            <label className='border-r font-light'>Price</label>
                            <input type="text" placeholder='0.05' name='price' className='bg-gray-100 p-5' /> 
                        </div>

                        <button className='bg-blue-600 text-white rounded-lg p-4 mt-8' type='submit'>Create Listinig</button>
                    </div>
                </form>
            )}
        </main>
        <Fotter />

    </div>
  )
}

export default createPage