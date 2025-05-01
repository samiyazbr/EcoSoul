import { useState, useEffect } from 'react'
import { WagmiConfig, createConfig, configureChains, useAccount, useContractRead, useContractWrite, useWaitForTransaction, useNetwork } from 'wagmi'
import { mainnet, sepolia } from 'wagmi/chains'
import { publicProvider } from 'wagmi/providers/public'
import { getDefaultWallets, RainbowKitProvider, ConnectButton } from '@rainbow-me/rainbowkit'
import '@rainbow-me/rainbowkit/styles.css'
import { CONTRACT_ADDRESS, CONTRACT_ABI } from './config'

const { chains, publicClient } = configureChains(
  [mainnet, sepolia],
  [publicProvider()]
)

const { connectors } = getDefaultWallets({
  appName: 'EcoSoul',
  projectId: 'YOUR_PROJECT_ID', // Get this from WalletConnect Cloud
  chains
})

const config = createConfig({
  autoConnect: true,
  publicClient,
  connectors
})

function NFTComponent() {
  const { address, isConnected } = useAccount()
  const { chain } = useNetwork()
  const [tokenId, setTokenId] = useState(null)
  const [nftState, setNftState] = useState(null)
  const [error, setError] = useState(null)
  const [debugInfo, setDebugInfo] = useState('')

  // Contract read function to get NFT state
  const { data: nftData, refetch: refetchNFTState } = useContractRead({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'getNFTState',
    args: tokenId ? [tokenId] : undefined,
    enabled: !!tokenId,
  })

  // Contract write function to mint NFT
  const { 
    write: mintNFT, 
    isLoading: isMinting,
    data: mintData 
  } = useContractWrite({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'mint',
    onError: (error) => {
      console.error('Minting error:', error)
      setError(error.message)
      setDebugInfo(`Error: ${error.message}`)
    }
  })

  // Wait for the mint transaction to be confirmed
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransaction({
    hash: mintData?.hash,
    onSuccess: (data) => {
      console.log('Mint transaction confirmed:', data)
      setDebugInfo(`Transaction confirmed: ${data.transactionHash}`)
      // After successful mint, we need to get the token ID
      // For now, we'll use a simple counter approach
      // In a production app, you'd want to listen to the NFTMinted event
      if (tokenId === null) {
        setTokenId(0) // First token
      } else {
        setTokenId(tokenId + 1) // Next token
      }
      // Refetch NFT state
      refetchNFTState()
    },
    onError: (error) => {
      console.error('Transaction error:', error)
      setError(error.message)
      setDebugInfo(`Transaction error: ${error.message}`)
    }
  })

  // Update NFT state when data changes
  useEffect(() => {
    if (nftData) {
      console.log('NFT Data received:', nftData)
      setNftState({
        ecoScore: nftData.ecoScore.toString(),
        weatherCondition: nftData.weatherCondition,
        lastUpdate: nftData.lastUpdate.toString(),
      })
      setDebugInfo(`NFT state updated: Score ${nftData.ecoScore}, Weather ${nftData.weatherCondition}`)
    }
  }, [nftData])

  // Check network
  useEffect(() => {
    if (chain) {
      setDebugInfo(`Connected to network: ${chain.name} (ID: ${chain.id})`)
      if (chain.id !== sepolia.id) {
        setError(`Please switch to Sepolia testnet. Current network: ${chain.name}`)
      } else {
        setError(null)
      }
    }
  }, [chain])

  const handleEcoAction = async () => {
    if (!isConnected) {
      setError('Please connect your wallet first')
      return
    }

    if (chain?.id !== sepolia.id) {
      setError('Please switch to Sepolia testnet')
      return
    }

    try {
      setError(null)
      setDebugInfo('Initiating mint transaction...')
      // Mint new NFT
      await mintNFT()
    } catch (error) {
      console.error('Error minting NFT:', error)
      setError(error.message)
      setDebugInfo(`Error: ${error.message}`)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-green-100">
      <div className="container mx-auto px-4 py-8">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-green-800">EcoSoul</h1>
          <ConnectButton />
        </header>

        <main className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-semibold mb-4">Your EcoSoul NFT</h2>
            
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {error}
              </div>
            )}

            {debugInfo && (
              <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded mb-4 text-sm">
                {debugInfo}
              </div>
            )}
            
            {!isConnected ? (
              <div className="text-center">
                <p className="text-gray-600 mb-4">Please connect your wallet to get started</p>
              </div>
            ) : nftState ? (
              <div className="text-center">
                <div className="text-6xl mb-4">
                  {nftState.weatherCondition === 'sunny' ? '🌻' : 
                   nftState.weatherCondition === 'rainy' ? '🌧️' : '🌱'}
                </div>
                <p className="text-gray-600">Eco Score: {nftState.ecoScore}</p>
                <p className="text-gray-500 text-sm mt-2">
                  Last updated: {new Date(parseInt(nftState.lastUpdate) * 1000).toLocaleString()}
                </p>
                {tokenId !== null && (
                  <p className="text-gray-500 text-sm mt-2">
                    Token ID: {tokenId}
                  </p>
                )}
              </div>
            ) : (
              <div className="text-center">
                <p className="text-gray-600 mb-4">No NFT minted yet</p>
                <button
                  onClick={handleEcoAction}
                  disabled={isMinting || isConfirming}
                  className={`bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg transition-colors ${
                    (isMinting || isConfirming) ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {isMinting ? 'Minting...' : isConfirming ? 'Confirming...' : 'I biked 5km'}
                </button>
                {mintData?.hash && (
                  <p className="text-sm text-gray-500 mt-2">
                    Transaction: {mintData.hash}
                  </p>
                )}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}

function App() {
  return (
    <WagmiConfig config={config}>
      <RainbowKitProvider chains={chains}>
        <NFTComponent />
      </RainbowKitProvider>
    </WagmiConfig>
  )
}

export default App
