// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract KYC {
    address public owner;
    
    struct Customer {
        string name;
        string addressInfo;
        bool isVerified;
    }
    
    mapping(address => Customer) public customers;

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can call this function");
        _;
    }
    
    constructor() {
        owner = msg.sender;
    }

    function submitKYC(string memory name, string memory addressInfo) public {
        require(!customers[msg.sender].isVerified, "KYC is already verified for this address");
        customers[msg.sender] = Customer(name, addressInfo, true);
    }
}
