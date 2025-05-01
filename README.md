# EcoSoul - Dynamic NFT Project

EcoSoul is a Web3 application that mints dynamic NFTs based on climate-positive actions and real-time weather data. Each NFT represents a user's environmental impact and evolves based on their eco-friendly activities.

## Features

- Dynamic NFT minting
- Real-time weather condition updates
- Eco-score tracking
- Wallet integration with MetaMask
- Sepolia testnet deployment

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- MetaMask wallet
- Sepolia testnet ETH (for testing)
- WalletConnect Project ID

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/EcoSoul.git
cd EcoSoul
```

2. Install dependencies for both frontend and smart contracts:
```bash
# Install smart contract dependencies
npm install

# Install frontend dependencies
cd frontend
npm install
```

3. Create environment files:

Create `.env` in the root directory:
```bash
SEPOLIA_RPC_URL=your_sepolia_rpc_url
PRIVATE_KEY=your_wallet_private_key
ETHERSCAN_API_KEY=your_etherscan_api_key
```

Create `.env` in the frontend directory:
```bash
VITE_WALLET_CONNECT_PROJECT_ID=your_walletconnect_project_id
VITE_CONTRACT_ADDRESS=0xA9dAEbCD447DdA552a2A1835F9184Ea4790296F9
```

## Smart Contract Deployment

1. Compile the smart contract:
```bash
npx hardhat compile
```

2. Deploy to Sepolia testnet:
```bash
npx hardhat run scripts/deploy.js --network sepolia
```

## Running the Frontend

1. Start the development server:
```bash
cd frontend
npm run dev
```

2. Open your browser and navigate to:
```
http://localhost:5174
```

## Testing the Application

1. Connect your MetaMask wallet to the Sepolia testnet
2. Get Sepolia test ETH from a faucet
3. Connect your wallet to the application
4. Click "I biked 5km" to mint your first EcoSoul NFT

## Smart Contract Address

The current deployed contract address on Sepolia testnet:
```
0xA9dAEbCD447DdA552a2A1835F9184Ea4790296F9
```

## Contract Functions

- `mint()`: Mints a new EcoSoul NFT
- `updateNFTState(uint256 tokenId, string weatherCondition, uint256 ecoScore)`: Updates the NFT's state (owner only)
- `getNFTState(uint256 tokenId)`: Returns the current state of an NFT
- `setBaseURI(string baseURI)`: Sets the base URI for NFT metadata (owner only)

## Getting Started with Development

1. Get a WalletConnect Project ID:
   - Visit https://cloud.walletconnect.com/
   - Create a new project
   - Copy the Project ID to your frontend/.env file

2. Get Sepolia test ETH:
   - Visit a Sepolia faucet (e.g., https://sepoliafaucet.com/)
   - Request test ETH for your wallet address

3. Connect to Sepolia testnet in MetaMask:
   - Open MetaMask
   - Click on the network dropdown
   - Select "Sepolia test network"
   - If not listed, add it manually with:
     - Network Name: Sepolia
     - RPC URL: https://rpc.sepolia.org
     - Chain ID: 11155111
     - Currency Symbol: ETH

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- OpenZeppelin for the ERC721 implementation
- Hardhat for the development environment
- Wagmi and RainbowKit for wallet integration
- Vite for the frontend build tool 