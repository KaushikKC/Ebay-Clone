import { MediaRenderer, useAcceptDirectListingOffer, useAddress, useBuyNow, useContract, useListing, useMakeBid, useMakeOffer, useNetwork, useNetworkMismatch, useOffers, useStorage } from '@thirdweb-dev/react';
import { UserCircleIcon } from '@heroicons/react/24/solid';
import { useRouter } from 'next/router';
import { ethers } from "ethers"
import { utils } from "ethers/lib/ethers"
// import network from "lib/thirdweb/network"
import network from "../../utils/network"
// import { useStore } from "components/header/Header"
import React, { useEffect, useState } from 'react'
import Header from '../../components/Header';
import { motion } from "framer-motion"
import { ListingType, NATIVE_TOKENS } from '@thirdweb-dev/sdk';
import Countdown from "react-countdown"
import toast, { Toaster } from 'react-hot-toast';
import { ThreeCircles } from 'react-loader-spinner';
import Image from 'next/image';
import Border from "../../Images/Border.jpg"
// import Zoom from 'react-reveal/Zoom';


type Props = {}

function ListiningPage({}: Props) {
    // const themeWhatever = useStore().themeName
    const router = useRouter();
    const address = useAddress()
    const {listiningId} = router.query as {listiningId: string};
    const [bidAmount, setBidAmount] = useState("")
    const [, switchNetwork] = useNetwork()
    const networkMismatch = useNetworkMismatch()
    const [minimumNextBid, setMinimumNextBid] = useState<{
        displayValue: string
        symbol: string
    }>()

    const {contract} = useContract(process.env.NEXT_PUBLIC_MARKETPLACE_CONTRACT,
        "marketplace"
        );
        const { mutate: makeBid } = useMakeBid(contract)
        const { data: offers } = useOffers(contract, listiningId)
        const { mutate: makeOffer } = useMakeOffer(contract)
        const { mutate: buyNow } = useBuyNow(contract)
        // const { data: listing, isLoading, error } = useListing(contract, listingId)
        const { mutate: acceptOffer } = useAcceptDirectListingOffer(contract)
        const { data: listining, isLoading, error} = useListing(contract, listiningId)
        useEffect(() => {
            if (!listiningId || !contract || !listining) return
            if (listining?.type === ListingType.Auction) {
                fetchMinNextBid()
            }
        }, [listiningId, contract, listining])
    
        const fetchMinNextBid = async () => {
            if (!listining || !contract) return
            const { displayValue, symbol } = await contract.auction.getMinimumNextBid(listiningId)
            setMinimumNextBid({
                displayValue: displayValue,
                symbol: symbol,
            })
        }

    

    const formatPlaceholder = () => {
        if (!listining) return
        if (listining.type === ListingType.Direct) {
            return "Enter Offer Amount"
        }
        if (listining.type === ListingType.Auction) {
            return Number(minimumNextBid?.displayValue) === 0
                ? "Enter Bid Amount"
                : `${minimumNextBid?.displayValue} ${minimumNextBid?.symbol} or more`
        }
        // improve bid amt
    }

    const buyNft = async () => {
        if (!address) {
            toast.error("Connect your wallet!")
            return
        }
        const notification = toast.loading("Buying NFT...")

        if (networkMismatch) {
            switchNetwork && switchNetwork(network)
            return
        }
        if (!listining || !contract || !listiningId) return

        await buyNow(
            {
                id: listiningId,
                buyAmount: 1,
                type: listining.type,
            },
            {
                onSuccess(data, variables, context) {
                    toast.success("NFT bought successfully!", {
                        id: notification,
                    })
                    console.log("SUCCESS: ", data, variables, context)
                    router.replace("/")
                },
                onError(error, variables, context) {
                    toast.error("Whoops something went wrong!", {
                        id: notification,
                    })
                    console.log("ERROR: ", error, variables, context)
                },
            }
        )
    }

    const createBidOrOffer = async () => {
        if (!address) {
            toast.error("Connect your wallet!")
            return
        }
        const notification = toast.loading("Placing Bid... ")
        try {
            if (networkMismatch) {
                switchNetwork && switchNetwork(network)
                return
            }
            //Direct
            if (listining?.type === ListingType.Direct) {
                if (listining.buyoutPrice.toString() === utils.parseEther(bidAmount).toString()) {
                    toast.loading("Buyout Price met, buying NFT...!", {
                        id: notification,
                    })
                    console.log("Buyout Price met, buying NFT...")
                    buyNft()
                    return
                }
                toast.loading("Buyout price not met, making offer...!", {
                    id: notification,
                })
                console.log("Buyout price not met, making offer...")
                await makeOffer(
                    {
                        quantity: 1,
                        listingId : listiningId,
                        pricePerToken: bidAmount,
                    },
                    {
                        onSuccess(data, variables, context) {
                            toast.success("Offer made successfully!", {
                                id: notification,
                            })
                            console.log("SUCCESS: ", data, variables, context)
                            setBidAmount("")
                        },
                        onError(error, variables, context) {
                            toast.error("Whoops something went wrong!", {
                                id: notification,
                            })
                            console.log("ERROR: ", error, variables, context)
                        },
                    }
                )
            }

            //Auction
            if (listining?.type === ListingType.Auction) {
                console.log("Placing Bid...")
                await makeBid(
                    {
                        listingId : listiningId,
                        bid: bidAmount,
                    },
                    {
                        onSuccess(data, variables, context) {
                            toast.success("Bid made successfully", {
                                id: notification,
                            })
                            console.log("SUCCESS: ", data, variables, context)
                            setBidAmount("")
                        },
                        onError(error, variables, context) {
                            toast.error("Whoops something went wrong!", {
                                id: notification,
                            })
                            console.log("ERROR: ", error, variables, context)
                        },
                    }
                )
            }
        } catch (error) {
            console.error(error)
        }
    }

    if (isLoading) 
        return (
            <div>
                <Header />
                <div className="text-center mx-auto">
          <ThreeCircles
        
  height="100"
  width="10000"
  color="#109adf"
  wrapperStyle={{}}
  wrapperClass=""
  visible={true}
  ariaLabel="three-circles-rotating"
  outerCircleColor=""
  innerCircleColor=""
  middleCircleColor=""
/>
          </div>
            </div>
        )

    if (!listining) {
        return <div>Listining Not Found</div>
    }
  return (
    <div>
        <Header />
        <motion.div
    initial={{ opacity: 0, scale: 0.5 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.5 }}
        >

        <main className='max-w-5xl mx-auto p-2 flex flex-col lg:flex-row space-y-10 space-x-5 pr-10'>
            <div className='p-10 drop-shadow-2xl border mx-auto lg:mx-0 max-w-md lg:max-w-xl'>
                
                <div>
                <MediaRenderer src={listining.asset.image} />
                </div>
                
            </div>
            <section className="flex-1 space-y-5 pb-20 lg:pb-0">
                    <div className=" -mt-6 text-center lg:mt-0 lg:text-left">
                        <h1 className="text-xl mb-4 font-bold text-yellow-400 drop-shadow-lg  md:text-4xl">
                            {listining.asset.name}
                        </h1>
                        <p className="text-sm font-semibold text-skin-accent md:text-lg">
                            {listining.asset.description}
                        </p>
                        <p className="flex items-center justify-center pb-5 text-xs text-skin-accent md:text-sm lg:justify-start">
                            {/* <UserCircleIcon className="h-5" /> */}
                            <span className="pr-1 text-skin-accent font-bold text-red-800">Owner:</span>{" "}
                            {listining.sellerAddress.slice(0, 5) +
                                "..." +
                                listining.sellerAddress.slice(-5)}
                        </p>
                    </div>
                    <div className="flex max-w-xl flex-col space-y-5 md:mx-auto">
                        <div className="flex flex-col items-center justify-center py-2 sm:flex-row sm:justify-between  md:space-x-10">
                            <div className="text-center sm:pl-20 sm:text-left lg:pl-0 ">
                                <p className="text-sm font-bold text-gray-700 md:text-2xl">
                                    {listining.type === ListingType.Direct
                                        ? "Direct Listing"
                                        : "Auction Listing"}
                                </p>
                                <div className="flex space-x-2 text-lg font-bold text-gray-700">
                                    <p>{listining.buyoutCurrencyValuePerToken.displayValue} </p>
                                    <p>{listining.buyoutCurrencyValuePerToken.symbol}</p>
                                </div>
                            </div>

                    <button className='col-start-2 mt-2 bg-blue-600 font-bold text-white rounded-full w-44 py-4 px-10'>Buy Now</button>
                </div>

               
                
                <div className="flex flex-col items-center justify-center py-2 sm:flex-row sm:justify-between md:space-x-10">
                            <div className="sm:pl-20 lg:pl-0">
                                <p className="text-center text-sm font-bold text-skin-accent sm:text-left md:text-left md:text-lg">
                                    {listining.type === ListingType.Direct
                                        ? "Make an Offer"
                                        : "Bid on this Auction"}
                                </p>
                                <div>
                                    {listining.type === ListingType.Auction && (
                                        <div className="text-center sm:text-left ">
                                            <p className="text-2xl font-bold text-skin-accent">
                                                {minimumNextBid?.displayValue}{" "}
                                                {minimumNextBid?.symbol}
                                            </p>
                                            <Countdown
                                                date={
                                                    Number(
                                                        listining.endTimeInEpochSeconds.toString()
                                                    ) * 1000
                                                }
                                            />
                                        </div>
                                    )}
                                </div>
                                <input
                                    className="mx-auto mt-2 rounded-lg border border-grayBorder bg-white p-2 focus:border-transparent focus:ring-grayBorder "
                                    type="text"
                                    onChange={(e) => setBidAmount(e.target.value)}
                                    placeholder={formatPlaceholder()}
                                />
                            </div>
                            <button
                                onClick={createBidOrOffer}
                                className="mt-4 w-32 rounded-md bg-blue-600 text-white  border-2 border-grayBorder bg-skin-button-accent-hover py-2 px-4 font-bold text-skin-muted hover:bg-skin-fill hover:text-skin-inverted md:mr-20 md:w-44 md:px-10"
                            >
                                {listining.type === ListingType.Direct ? "Offer" : "Bid"}
                            </button>
                        </div>
                    </div>
                    {listining.type === ListingType.Direct && offers && (
                        <div className="mx-auto flex flex-col justify-center gap-y-2 py-2  pt-5">
                            <div className="text-center bg-black p-3 rounded-md text-red-500  text-sm font-bold text-skin-accent md:text-lg">
                                {offers.length > 0 ? (
                                    <p className="">{offers.length} Offers</p>
                                ) : (
                                    <p className="">No offers</p>
                                )}
                            </div>
                            {offers.map((offer) => (
                                <div className="mx-auto flex w-full justify-center space-x-10 xs:px-10 lg:space-x-16">
                                    <div className="flex flex-col items-center md:flex-row md:space-x-3">
                                        <p className="items-center text-sm italic text-skin-accent">
                                            {offer.offerer.slice(0, 5) +
                                                "..." +
                                                offer.offeror.slice(-5)}
                                        </p>
                                        <div
                                            key={
                                                offer.listingId +
                                                offer.offeror +
                                                offer.totalOfferAmount.toString()
                                            }
                                            className="flex items-center space-x-2 text-sm font-semibold text-skin-accent md:text-lg"
                                        >
                                            <p>
                                                {ethers.utils.formatEther(offer.totalOfferAmount)}
                                            </p>
                                            <p> {NATIVE_TOKENS[network].symbol}</p>
                                        </div>
                                    </div>
                                    {listining.sellerAddress === address && (
                                        <button
                                            className="w-fit cursor-pointer items-center self-center rounded border-2 border-grayBorder bg-skin-button-accent-hover py-2 px-4 text-xs font-bold text-skin-muted hover:bg-skin-fill hover:text-skin-inverted md:h-10 md:py-0 md:text-sm"
                                            onClick={() => {
                                                if (!address) {
                                                    toast.error("Connect your wallet!")
                                                    return
                                                }
                                                const notification =
                                                    toast.loading("Placing Offer... ")
                                                acceptOffer(
                                                    {
                                                        listingId : listiningId,
                                                        addressOfOfferor: offer.offeror,
                                                    },
                                                    {
                                                        onSuccess(data, variables, context) {
                                                            toast.success(
                                                                "Offer accepted successfully",
                                                                {
                                                                    id: notification,
                                                                }
                                                            )
                                                            console.log(
                                                                "SUCCESS: ",
                                                                data,
                                                                variables,
                                                                context
                                                            )
                                                            router.replace("/")
                                                        },
                                                        onError(error, variables, context) {
                                                            toast.error(
                                                                "Whoops something went wrong!",
                                                                {
                                                                    id: notification,
                                                                }
                                                            )

                                                            console.log(
                                                                "ERROR: ",
                                                                error,
                                                                variables,
                                                                context
                                                            )
                                                        },
                                                    }
                                                )
                                            }}
                                        >
                                            Accept
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}

            </section>
        </main>
        </motion.div>
    </div>
  )
}

export default ListiningPage;