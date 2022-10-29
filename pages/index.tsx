import type { NextPage } from 'next'
import Image from 'next/image';
import "react-multi-carousel/lib/styles.css";
import { ThreeCircles } from 'react-loader-spinner'
import meter1 from "../Images/img.webp"
import meter2 from "../Images/img1.webp"
import meter3 from "../Images/img2.webp"
import { motion } from "framer-motion"
import {
  useActiveListings,
  useContract,
  MediaRenderer,
} from '@thirdweb-dev/react';
import Header from '../components/Header'
import { ListingType } from '@thirdweb-dev/sdk';
import { BanknotesIcon, ClockIcon } from '@heroicons/react/24/outline';
import Carousel from 'react-multi-carousel';
import Fotter from '../components/Fotter';
const responsive = {
  superLargeDesktop: {
    // the naming can be any, depends on you.
    breakpoint: { max: 4000, min: 3000 },
    items: 1
  },
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 1
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 1
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 1
  }
};

const Home: NextPage = () => {
  const {contract} = useContract(process.env.NEXT_PUBLIC_MARKETPLACE_CONTRACT,
    "marketplace"
    );

  const { data: listings, isLoading: loadingListining } = useActiveListings(contract);
  console.log(listings)
  return (
    <div className="">
      <motion.div
    initial={{ opacity: 0, scale: 2 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.5 }}
      >
      <Header />
      <Carousel responsive={responsive} className="relative w-[100%] mx-auto  " autoPlay={true} rewindWithAnimation={true} rewind={true}>
            <div className='text-white font-semibold'>
                <div className='w-[100%] px-4 mb-5' >
                <Image src={meter1} alt='' />
                </div>
          
            </div>
            <div className='text-white font-semibold'>
                <div className='w-[100%] px-4 mb-5' >
                <Image src={meter3} alt=''/>
                </div>
                
            </div>
            <div className='text-white font-semibold'>
                <div className='w-[100%] px-4 mb-5' >
                <Image src={meter2} alt=''/>
                </div>
            
            </div>
            

        </Carousel>
      <main className='max-w-6xl mx-auto p-5'>
        {loadingListining ? (
          // <p className='text-center animate-pulse text-blue-500'>Loading</p> 
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
          
          <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 mx-auto'>
            {listings?.map((listining) => (
              <div className='flex flex-col card hover:scale-105 transition-all duration-150 ease-out' key={listining.id}>
                <div className='flex-1 flex flex-col pb-2 items-center'>
                  <MediaRenderer src={listining.asset.image}/>
                </div>

                <div className='pt-2 space-y-4'>
                  <div>
                    <h2 className='text-lg truncate'>{listining.asset.name}</h2>
                    <hr />
                    <p className='truncate text-sm text-gray-600 mt-2'>{listining.asset.description}</p>
                  </div>

                  <p>
                    <span className='font-bold'>{listining.buyoutCurrencyValuePerToken.displayValue}</span>{listining.buyoutCurrencyValuePerToken.symbol}
                  </p>
                  <div className={`flex items-center space-x-1 justify-end text-xs border w-fit ml-auto p-2 rounded-lg text-white ${
                    listining.type === ListingType.Direct ? "bg-blue-500" : "bg-red-500"}`}>
                    <p>
                      {listining.type == ListingType.Direct ? "Buy Now" : "Auction"}
                    </p>
                    {listining.type === ListingType.Direct ? (
                      <BanknotesIcon className="h-4" />
                    ) : (
                      <ClockIcon className="h-4" />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      <Fotter />
      </motion.div>
    </div>
  )
}

export default Home
