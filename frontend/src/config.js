export const CONTRACT_ADDRESS = "0x25f163C5B32c053e3e6Cc39c95Cf2a8A305E96E4"

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
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "activity",
        "type": "string"
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
          },
          {
            "internalType": "string",
            "name": "lastActivity",
            "type": "string"
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
    "inputs": [
      {
        "internalType": "string",
        "name": "activity",
        "type": "string"
      }
    ],
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
      },
      {
        "internalType": "string",
        "name": "activity",
        "type": "string"
      }
    ],
    "name": "updateNFTState",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
]; 