import { useState, useEffect } from 'react'
import { WagmiConfig, createConfig, configureChains, useAccount, useContractRead, useContractWrite, useWaitForTransaction, useNetwork } from 'wagmi'
import { mainnet, sepolia } from 'wagmi/chains'
import { alchemyProvider } from 'wagmi/providers/alchemy'
import { publicProvider } from 'wagmi/providers/public'
import { getDefaultWallets, RainbowKitProvider, ConnectButton } from '@rainbow-me/rainbowkit'
import '@rainbow-me/rainbowkit/styles.css'
import { CONTRACT_ADDRESS, CONTRACT_ABI } from './config'

const { chains, publicClient } = configureChains(
  [mainnet, sepolia],
  [
    alchemyProvider({ apiKey: import.meta.env.VITE_ALCHEMY_API_KEY }),
    publicProvider()
  ]
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
  const [tokenIds, setTokenIds] = useState([])
  const [currentTokenId, setCurrentTokenId] = useState(null)
  const [nftState, setNftState] = useState(null)
  const [totalEcoScore, setTotalEcoScore] = useState(0)
  const [error, setError] = useState(null)
  const [debugInfo, setDebugInfo] = useState('')
  const [selectedActivity, setSelectedActivity] = useState('biking')
  const [showActivityForm, setShowActivityForm] = useState(false)
  const [previousActivity, setPreviousActivity] = useState('No activity yet')
  const [currentActivity, setCurrentActivity] = useState('No activity yet')

  const activities = [
    { id: 'biking', label: 'Biking (5km)', multiplier: '100%' },
    { id: 'walking', label: 'Walking (5km)', multiplier: '80%' },
    { id: 'public_transport', label: 'Public Transport', multiplier: '90%' },
    { id: 'recycling', label: 'Recycling', multiplier: '70%' },
    { id: 'planting', label: 'Planting Trees', multiplier: '150%' }
  ]

  // Contract read function to get NFT state
  const { data: nftData, refetch: refetchNFTState } = useContractRead({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'getNFTState',
    args: currentTokenId !== null ? [currentTokenId] : undefined,
    enabled: currentTokenId !== null && isConnected,
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
    onSuccess: (data) => {
      console.log('Mint transaction sent:', data)
      setDebugInfo(`Mint transaction sent: ${data.hash}`)
    },
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
      // Get the new token ID from the event logs
      const newTokenId = tokenIds.length
      setTokenIds(prev => [...prev, newTokenId])
      setCurrentTokenId(newTokenId)
      // Refetch NFT state after confirmation
      setTimeout(() => {
        refetchNFTState()
      }, 2000)
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
      const newEcoScore = parseInt(nftData.ecoScore.toString())
      
      setNftState({
        ecoScore: newEcoScore.toString(),
        weatherCondition: nftData.weatherCondition,
        lastUpdate: nftData.lastUpdate.toString(),
        lastActivity: nftData.lastActivity
      })
      // Add the new eco score to the total
      setTotalEcoScore(prev => prev + newEcoScore)
      setDebugInfo(`NFT state updated: Score ${nftData.ecoScore}, Weather ${nftData.weatherCondition}`)
    }
  }, [nftData])

  // Add a new effect to handle token ID changes
  useEffect(() => {
    if (currentTokenId !== null) {
      console.log('Token ID updated:', currentTokenId)
      setDebugInfo(`Token ID set to: ${currentTokenId}`)
      refetchNFTState()
    }
  }, [currentTokenId])

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
      // Update previous activity before minting new one
      if (currentActivity !== 'No activity yet') {
        setPreviousActivity(currentActivity)
      }
      setCurrentActivity(selectedActivity)
      // Mint new NFT with selected activity
      await mintNFT({
        args: [selectedActivity]
      })
    } catch (error) {
      console.error('Error minting NFT:', error)
      setError(error.message)
      setDebugInfo(`Error: ${error.message}`)
    }
  }

  const renderActivityForm = () => (
    <div className="mb-4">
      <label htmlFor="activity" className="block text-sm font-medium text-gray-700 mb-2">
        Select your eco-friendly activity:
      </label>
      <select
        id="activity"
        value={selectedActivity}
        onChange={(e) => setSelectedActivity(e.target.value)}
        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md"
      >
        {activities.map((activity) => (
          <option key={activity.id} value={activity.id}>
            {activity.label} (Score: {activity.multiplier})
          </option>
        ))}
      </select>
      <button
        onClick={handleEcoAction}
        disabled={isMinting || isConfirming}
        className={`mt-4 bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg transition-colors ${
          (isMinting || isConfirming) ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        {isMinting ? 'Minting...' : isConfirming ? 'Confirming...' : 'Record Activity'}
      </button>
    </div>
  )

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
                <div className="mb-4">
                  <p className="text-gray-600">Current Activity: {currentActivity}</p>
                  <p className="text-gray-600">Previous Activity: {previousActivity}</p>
                  <p className="text-gray-600">Current Eco Score: {nftState.ecoScore}</p>
                  <p className="text-xl font-semibold text-green-600 mt-2">
                    Total Eco Score: {totalEcoScore}
                  </p>
                </div>
                <div className="text-sm text-gray-500 space-y-1">
                  <p>Last updated: {new Date(parseInt(nftState.lastUpdate) * 1000).toLocaleString()}</p>
                  {currentTokenId !== null && (
                    <p>Token ID: {currentTokenId}</p>
                  )}
                </div>
                
                {showActivityForm ? (
                  renderActivityForm()
                ) : (
                  <button
                    onClick={() => setShowActivityForm(true)}
                    className="mt-4 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition-colors"
                  >
                    Record New Activity
                  </button>
                )}
              </div>
            ) : (
              <div className="text-center">
                <p className="text-gray-600 mb-4">No NFT minted yet</p>
                {renderActivityForm()}
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