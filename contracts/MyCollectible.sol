// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

// 1. Import what you need. Notice we only need three things.
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title MyCollectible
 * @dev The modern, simple, and correct way to create an ERC721 NFT.
 * - Inherits from ERC721URIStorage (which includes ERC721) and Ownable.
 */
// 2. Inherit from ERC721URIStorage and Ownable.
//    You do NOT need to list ERC721 here, as ERC721URIStorage already includes it.
//    This is the key simplification that avoids all the override errors.
contract MyCollectible is ERC721URIStorage, Ownable {
    // 3. Use a simple uint256 for the counter. It's safe and gas-efficient.
    uint256 private _nextTokenId;

    // 4. The constructor.
    constructor() ERC721("My Collectible", "MCB") Ownable(msg.sender) {}

    /**
     * @dev Mints a new NFT.
     */
    function safeMint(address to, string memory uri) public onlyOwner {
        uint256 tokenId = _nextTokenId;
        _nextTokenId++;
        
        // _safeMint comes from ERC721
        _safeMint(to, tokenId);
        // _setTokenURI comes from ERC721URIStorage
        _setTokenURI(tokenId, uri);
    }
}