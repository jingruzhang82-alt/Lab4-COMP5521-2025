//SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MyNFT is ERC721URIStorage, Ownable {
    uint256 private _tokenIdCounter;

    constructor() ERC721("COMP5521 Digital Collectible", "C5NFT") Ownable(msg.sender) {
        _tokenIdCounter = 1;
    }

    function safeMint(address to, string memory tokenURI) public onlyOwner {
        uint256 tokenId = _tokenIdCounter;
        _tokenIdCounter++;
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, tokenURI);
    }
    // 添加获取当前tokenId
    function getCurrentTokenId() public view returns (uint256) {
        return _tokenIdCounter;
    }
}