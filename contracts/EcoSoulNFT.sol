// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract EcoSoulNFT is ERC721, Ownable {
    struct NFTState {
        uint256 ecoScore;
        string weatherCondition;
        uint256 lastUpdate;
    }

    mapping(uint256 => NFTState) public nftStates;
    uint256 private _tokenIdCounter;
    string private _baseTokenURI;

    event NFTMinted(address indexed owner, uint256 indexed tokenId);
    event NFTUpdated(uint256 indexed tokenId, string weatherCondition, uint256 ecoScore);

    constructor() ERC721("EcoSoul", "ECO") Ownable(msg.sender) {
        _tokenIdCounter = 0;
    }

    function mint() external {
        uint256 tokenId = _tokenIdCounter;
        _tokenIdCounter++;
        _safeMint(msg.sender, tokenId);
        
        nftStates[tokenId] = NFTState({
            ecoScore: 0,
            weatherCondition: "sunny",
            lastUpdate: block.timestamp
        });

        emit NFTMinted(msg.sender, tokenId);
    }

    function updateNFTState(uint256 tokenId, string memory weatherCondition, uint256 ecoScore) external onlyOwner {
        require(_ownerOf(tokenId) != address(0), "NFT does not exist");
        nftStates[tokenId].weatherCondition = weatherCondition;
        nftStates[tokenId].ecoScore = ecoScore;
        nftStates[tokenId].lastUpdate = block.timestamp;
        
        emit NFTUpdated(tokenId, weatherCondition, ecoScore);
    }

    function _baseURI() internal view override returns (string memory) {
        return _baseTokenURI;
    }

    function setBaseURI(string memory baseURI) external onlyOwner {
        _baseTokenURI = baseURI;
    }

    function getNFTState(uint256 tokenId) external view returns (NFTState memory) {
        require(_ownerOf(tokenId) != address(0), "NFT does not exist");
        return nftStates[tokenId];
    }
} 