// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract Dog is ERC721, ERC721Enumerable, ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIdCounter;
    string uri="";
    uint256 _MAX_SUPPLY= 10000;
    mapping(address=>bool) whiteList;
    bool preMintWindow=false;
    bool mintWindow=false;

    constructor() ERC721("Dog", "dog") {}

    function _baseURI() internal pure override returns (string memory) {
        return "http://baidu.com";
    }

    function preMint() public payable{
        require(preMintWindow, "preMintWindow not open");
        require(msg.value==0.001 ether, "you need send 0.001eth");
        require(totalSupply()< _MAX_SUPPLY, "out of supply");
        require(balanceOf(msg.sender)<1, "already preMint");
        require(whiteList[msg.sender], "you are not in whitelist");

        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _safeMint(msg.sender, tokenId);
        _setTokenURI(tokenId, uri);
    }

    function safeMint() public payable{
        require(mintWindow, "mintWindow not open");
        require(msg.value==0.005 ether, "you need send 0.005eth");
        require(totalSupply()< _MAX_SUPPLY, "out of supply");
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _safeMint(msg.sender, tokenId);
        _setTokenURI(tokenId, uri);
    }

    function setWindow(bool _preMintWindow, bool _mintWindow) public onlyOwner{
        preMintWindow = _preMintWindow;
        mintWindow = _mintWindow;
    }

    function setWhiteList(address[] calldata addres) public onlyOwner{
        for(uint256 i = 0; i<addres.length; i++) {
            whiteList[addres[i]] = true;
        }
    }

    // The following functions are overrides required by Solidity.

    function _beforeTokenTransfer(address from, address to, uint256 tokenId, uint256 batchSize)
        internal
        override(ERC721, ERC721Enumerable)
    {
        super._beforeTokenTransfer(from, to, tokenId, batchSize);
    }

    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}