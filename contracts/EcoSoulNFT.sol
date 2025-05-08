// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract EcoSoulNFT is ERC721, Ownable {
    struct NFTState {
        uint256 ecoScore;
        string weatherCondition;
        uint256 lastUpdate;
        string lastActivity;
    }

    mapping(uint256 => NFTState) public nftStates;
    uint256 private _tokenIdCounter;
    string private _baseTokenURI;

    // Constants for eco score calculation
    uint256 private constant BASE_SCORE = 100; // Base score for activities
    uint256 private constant SUNNY_MULTIPLIER = 120; // 20% bonus for sunny weather
    uint256 private constant RAINY_MULTIPLIER = 150; // 50% bonus for rainy weather

    // Activity multipliers
    uint256 private constant BIKING_MULTIPLIER = 100; // Base multiplier
    uint256 private constant WALKING_MULTIPLIER = 80; // 20% less than biking
    uint256 private constant PUBLIC_TRANSPORT_MULTIPLIER = 90; // 10% less than biking
    uint256 private constant RECYCLING_MULTIPLIER = 70; // 30% less than biking
    uint256 private constant PLANTING_MULTIPLIER = 150; // 50% more than biking

    event NFTMinted(address indexed owner, uint256 indexed tokenId);
    event NFTUpdated(uint256 indexed tokenId, string weatherCondition, uint256 ecoScore, string activity);

    constructor() ERC721("EcoSoul", "ECO") Ownable(msg.sender) {
        _tokenIdCounter = 0;
    }

    function mint(string memory activity) external {
        uint256 tokenId = _tokenIdCounter;
        _tokenIdCounter++;
        _safeMint(msg.sender, tokenId);
        
        // Calculate eco score based on weather condition and activity
        string memory weatherCondition = "sunny"; // Default to sunny
        uint256 ecoScore = calculateEcoScore(weatherCondition, activity);
        
        nftStates[tokenId] = NFTState({
            ecoScore: ecoScore,
            weatherCondition: weatherCondition,
            lastUpdate: block.timestamp,
            lastActivity: activity
        });

        emit NFTMinted(msg.sender, tokenId);
    }

    function calculateEcoScore(string memory weatherCondition, string memory activity) internal pure returns (uint256) {
        // Base score for activity
        uint256 score = BASE_SCORE;
        
        // Apply activity multiplier
        bytes32 activityHash = keccak256(bytes(activity));
        if (activityHash == keccak256(bytes("biking"))) {
            score = (score * BIKING_MULTIPLIER) / 100;
        } else if (activityHash == keccak256(bytes("walking"))) {
            score = (score * WALKING_MULTIPLIER) / 100;
        } else if (activityHash == keccak256(bytes("public_transport"))) {
            score = (score * PUBLIC_TRANSPORT_MULTIPLIER) / 100;
        } else if (activityHash == keccak256(bytes("recycling"))) {
            score = (score * RECYCLING_MULTIPLIER) / 100;
        } else if (activityHash == keccak256(bytes("planting"))) {
            score = (score * PLANTING_MULTIPLIER) / 100;
        }
        
        // Apply weather multipliers
        bytes32 weatherHash = keccak256(bytes(weatherCondition));
        if (weatherHash == keccak256(bytes("sunny"))) {
            score = (score * SUNNY_MULTIPLIER) / 100;
        } else if (weatherHash == keccak256(bytes("rainy"))) {
            score = (score * RAINY_MULTIPLIER) / 100;
        }
        
        return score;
    }

    function updateNFTState(uint256 tokenId, string memory weatherCondition, uint256 ecoScore, string memory activity) external onlyOwner {
        require(_ownerOf(tokenId) != address(0), "NFT does not exist");
        nftStates[tokenId].weatherCondition = weatherCondition;
        nftStates[tokenId].ecoScore = ecoScore;
        nftStates[tokenId].lastUpdate = block.timestamp;
        nftStates[tokenId].lastActivity = activity;
        
        emit NFTUpdated(tokenId, weatherCondition, ecoScore, activity);
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