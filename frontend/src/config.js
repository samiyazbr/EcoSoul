export const CONTRACT_ADDRESS = "0xA9dAEbCD447DdA552a2A1835F9184Ea4790296F9"

export const CONTRACT_ABI = [
  {
    "inputs": [],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "owner",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "NFTMinted",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "weatherCondition",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "ecoScore",
        "type": "uint256"
      }
    ],
    "name": "NFTUpdated",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "getNFTState",
    "outputs": [
      {
        "components": [
          {
            "internalType": "uint256",
            "name": "ecoScore",
            "type": "uint256"
          },
          {
            "internalType": "string",
            "name": "weatherCondition",
            "type": "string"
          },
          {
            "internalType": "uint256",
            "name": "lastUpdate",
            "type": "uint256"
          }
        ],
        "internalType": "struct EcoSoulNFT.NFTState",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "mint",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "weatherCondition",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "ecoScore",
        "type": "uint256"
      }
    ],
    "name": "updateNFTState",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
]; 