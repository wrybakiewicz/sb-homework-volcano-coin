//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract VolcanoCoin is ERC20, Ownable {
    mapping(address => Payment[]) public payments;

    struct Payment {
        uint amount;
        address recipient;
    }

    constructor() ERC20("VolcanoCoin", "VLC") {
        _mint(msg.sender, 10_000);
    }

    function increaseTotalSupply() public onlyOwner {
        _mint(msg.sender, 1000);
    }

    function _afterTokenTransfer(
        address from,
        address to,
        uint256 amount
    ) internal override {
        payments[from].push(Payment(amount, to));
    }
}
