
import Head from 'next/head'
import Image from 'next/image'
import { useState } from 'react'
import { Network, Alchemy } from 'alchemy-sdk'
import NFTCard from './components/NFTCard'

const Home = () => {
  const [wallet, setWalletAddress] = useState("")
  const [collection, setCollectionAddress] = useState("")
  const [NFTs, setNFTs] = useState([])
  const [fetchForCollection, setFetchForCollection] = useState(false)

  const fetchNFTs = async () => {
    let nfts
    console.log("fetching nfts...")
    const settings = {
      apiKey: "gd0hDV85Nk5pFlCXKCtCE3s6NOrWUgJb",
      network: Network.ETH_MAINNET
    }
    const alchemy = new Alchemy(settings)

    if (!collection.length) {
      nfts = await alchemy.nft.getNftsForOwner(wallet)
    } else {
      nfts = await alchemy.nft.getNftsForOwner(wallet, { contractAddresses: [collection] })
    }

    if (nfts) {
      console.log(nfts)
      setNFTs(nfts.ownedNfts)
    }
  }

  const fetchNFTsForCollection = async () => {
    console.log("fetching for collection nfts...")
    if (collection.length) {
      const settings = {
        apiKey: "gd0hDV85Nk5pFlCXKCtCE3s6NOrWUgJb",
        network: Network.ETH_MAINNET
      }
      const alchemy = new Alchemy(settings)

      const nfts = await alchemy.nft.getNftsForContract(collection)
      if (nfts) {
        console.log(nfts)
        setNFTs(nfts.nfts)
      }
    }
  }

  return (
    <div className="flex flex-col items-center justify-center py-8 gap-y-3">
      <div className="flex flex-col w-full justify-center items-center gap-y-2">
        <input disabled={fetchForCollection} className="w-2/5 bg-slate-100 py-2 px-2 rounded-lg text-gray-800 focus:outline-blue-300 disabled:bg-slate-50 disabled:text-gray-50" onChange={(e) => { setWalletAddress(e.target.value) }} value={wallet} type={"text"} placeholder="Add your wallet address"></input>
        <input className="w-2/5 bg-slate-100 py-2 px-2 rounded-lg text-gray-800 focus:outline-blue-300 disabled:bg-slate-50 disabled:text-gray-50" onChange={(e) => { setCollectionAddress(e.target.value) }} value={collection} type={"text"} placeholder="Add the collection address"></input>
        <label className="text-gray-600 "><input onChange={(e) => { setFetchForCollection(e.target.checked) }} type={"checkbox"} className="mr-2"></input>Fetch for collection</label>
        <button className={"disabled:bg-slate-500 text-white bg-blue-400 px-4 py-2 mt-3 rounded-sm w-1/5"} onClick={
          () => {
            if (fetchForCollection) {
              fetchNFTsForCollection()
            } else fetchNFTs()
          }
        }>Let's go! </button>
      </div>
      <div className='flex flex-wrap gap-y-12 mt-4 w-5/6 gap-x-2 justify-center'>
        {
          NFTs.length && NFTs.map(nft => {
            return (
              <NFTCard nft={nft}></NFTCard>
            )
          })
        }
      </div>
    </div>
  )
}

export default Home
