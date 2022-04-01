//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract VolcanoCoin {
    uint public totalSupply;

    constructor(uint _totalSupply) {
        totalSupply = _totalSupply;
    }

    function increaseTotalSupply() public {
        totalSupply += 1000;
    }
}
