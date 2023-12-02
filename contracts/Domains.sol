//SPDX-License-Identifier: MIT

pragma solidity ^0.8.10;

import "hardhat/console.sol";
import { StringUtils } from "../libraries/StringUtils.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Base64.sol";


contract CasamaDomains is ERC721URIStorage {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    // TLD 
    string public TLD;

    // Owner
    address public owner;

    // NFT images as SVG
    string svgPartOne = '<svg xmlns="http://www.w3.org/2000/svg" width="270" height="270" fill="none"><path fill="url(#B)" d="M0 0h270v270H0z"/><defs><filter id="A" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse" height="270" width="270"><feDropShadow dx="0" dy="1" stdDeviation="2" flood-opacity=".225" width="200%" height="200%"/></filter></defs><text x="10" y="40" font-size="18" fill="#fff" filter="url(#A)" font-family="Plus Jakarta Sans,DejaVu Sans,Noto Color Emoji,Apple Color Emoji,sans-serif" font-weight="bold">Casama Name Service</text><defs><linearGradient id="B" x1="0" y1="0" x2="270" y2="270" gradientUnits="userSpaceOnUse"><stop stop-color="#e90831"/><stop offset="1" stop-color="#8f0b75" stop-opacity=".99"/></linearGradient></defs><text x="32.5" y="231" font-size="27" fill="#fff" filter="url(#A)" font-family="Plus Jakarta Sans,DejaVu Sans,Noto Color Emoji,Apple Color Emoji,sans-serif" font-weight="bold">';
    string svgPartTwo = '</text></svg>';


    // A mapping data type to store names
    mapping(string => address) public domains;
    mapping(address => string) public reverseDomains;

    // Quick hack for token gating
    mapping(address => bool) public tokenGated;

    // Record store mapping
    mapping(string => string) public records;

    // Events
    event DomainRegistered(string domain, address owner, uint256 tokenId);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function.");
        _;
    }

    constructor(string memory _tld) payable ERC721("Casama Name Service", "CNS"){
        TLD = _tld;
        console.log("%s name service is deployed", _tld);
        owner = msg.sender;
    }

    function price(string calldata name) public pure returns(uint) {
        uint len = StringUtils.strlen(name);
        require(len > 0, "Name is empty");
        if (len ==  3) {
            return 5 * 10**16; // 0.05 MATIC
        } else if (len == 4) {
            return 3 * 10 ** 16; // 0.03 MATIC
        } else {
            return 1 * 10 ** 16; // 0.01 MATIC
        }
    }

    function registerOther(string calldata _name, address _holder) public payable onlyOwner {
        require(domains[_name] == address(0), "Domain already registered");
        require(tokenGated[_holder] == false, "This address already has a token.");

        uint _price = price(_name);

        // Check if the sender has enough MATIC
        require(msg.value >= _price, "Not enough MATIC");

        // Combine the name passed into the function with the TLD;
        string memory _nameWithTld = string(abi.encodePacked(_name, ".", TLD));

        // Create the SVG for the NFT with the name
        string memory finalSvg = string(abi.encodePacked(svgPartOne, _nameWithTld, svgPartTwo));
        uint256 newRecordId = _tokenIds.current();
        uint256 length = StringUtils.strlen(_nameWithTld);
        string memory strLen = Strings.toString(length);

        console.log("Registering %s.%s on the contract with tokenID %d", _name, TLD, newRecordId);

        // Create the JSON Metadata of the NFT
        string memory json = Base64.encode(
            abi.encodePacked(
                '{"name": "',
                _nameWithTld,
                '", "description": "A Casama name service NFT", "image": "data:image/svg+xml;base64,',
                Base64.encode(bytes(finalSvg)),
                '", "length": "',
                strLen,
                '"}'
            )
        );

        string memory finalTokenUri = string(abi.encodePacked("data:application/json;base64,", json));

        console.log("\n--------------------------------------------------------");
        console.log("Final tokenURI", finalTokenUri);
        console.log("--------------------------------------------------------\n");

        _safeMint(_holder, newRecordId);
        _setTokenURI(newRecordId, finalTokenUri);
        domains[_name] = _holder;
        reverseDomains[_holder] = _name;
        tokenGated[_holder] = true;
        emit DomainRegistered(_name, _holder, newRecordId);

        _tokenIds.increment();
    }

    // A register function that adds their names to our mapping
    function registerSelf(string calldata _name) public payable {
        require(domains[_name] == address(0), "Domain already registered");
        require(tokenGated[msg.sender] == false, "You already have a token");
        uint _price = price(_name);

        // Check if the sender has enough MATIC
        require(msg.value >= _price, "Not enough MATIC");

        // Combine the name passed into the function with the TLD;
        string memory _nameWithTld = string(abi.encodePacked(_name, ".", TLD));

        // Create the SVG for the NFT with the name
        string memory finalSvg = string(abi.encodePacked(svgPartOne, _nameWithTld, svgPartTwo));
        uint256 newRecordId = _tokenIds.current();
        uint256 length = StringUtils.strlen(_nameWithTld);
        string memory strLen = Strings.toString(length);

        console.log("Registering %s.%s on the contract with tokenID %d", _name, TLD, newRecordId);

        // Create the JSON Metadata of the NFT
        string memory json = Base64.encode(
            abi.encodePacked(
                '{"name": "',
                _nameWithTld,
                '", "description": "A Casama name service NFT", "image": "data:image/svg+xml;base64,',
                Base64.encode(bytes(finalSvg)),
                '", "length": "',
                strLen,
                '"}'
            )
        );

        string memory finalTokenUri = string(abi.encodePacked("data:application/json;base64,", json));

        console.log("\n--------------------------------------------------------");
        console.log("Final tokenURI", finalTokenUri);
        console.log("--------------------------------------------------------\n");

        _safeMint(msg.sender, newRecordId);
        _setTokenURI(newRecordId, finalTokenUri);
        domains[_name] = msg.sender;
        reverseDomains[msg.sender] = _name;
        tokenGated[msg.sender] = true;
        emit DomainRegistered(_name, msg.sender, newRecordId);

        _tokenIds.increment();
    }

    // getter for tokenGate
    function getTokenGate(address _address) public view returns(bool) {
        return tokenGated[_address];
    }


    // getter for the domains mapping
    function getAddress(string calldata _name) public view returns (address) {
        return domains[_name];
    }
    
    // getter for the reverseDomains mapping
    function getName(address _address) public view returns (string memory) {
        return reverseDomains[_address];
    }

    function setRecord(string calldata _name, string calldata _record) public {
        require(domains[_name] == msg.sender, "Only owner can set record");
        records[_name] = _record;
    }

    function getRecord(string calldata _name) public view returns (string memory) {
        return records[_name];
    }

    function _afterTokenTransfer(address _from, address _to, uint256 _tokenId)
    internal
    override(ERC721)
    {
        super._afterTokenTransfer(_from, _to, _tokenId);
    }

    function _beforeTokenTransfer(address _from, address _to, uint256 _tokenId)
    internal
    override(ERC721) {
        require( _from == address(0), "Err: This is a Soulbound Token, and therefore cannot be transferred.");
        super._beforeTokenTransfer(_from, _to, _tokenId);
    }
}