//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract VolcanoCoin {
    uint public totalSupply = 10_000;
    address owner;

    event SupplyIncreased(uint increase);

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can execute this");
        _;
    }

    function increaseTotalSupply() public onlyOwner {
        uint increase = 1000;
        totalSupply += increase;
        emit SupplyIncreased(increase);
    }
}
