//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

contract VolcanoCoin {
    uint public totalSupply = 10_000;
    address public owner;
    mapping(address => uint) public balances;
    mapping(address => Payment[]) public payments;

    event SupplyIncreased(uint increase);
    event Transfer(uint amount, address recipient);

    struct Payment {
        uint amount;
        address recipient;
    }

    constructor() {
        owner = msg.sender;
        balances[msg.sender] = totalSupply;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can execute this");
        _;
    }

    function increaseTotalSupply() public onlyOwner {
        uint increase = 1000;
        totalSupply += increase;
        balances[msg.sender] += increase;
        emit SupplyIncreased(increase);
    }

    function transfer(uint amount, address recipient) public {
        require(balances[msg.sender] >= amount, "Balance not enough to make a transfer");
        balances[msg.sender] -= amount;
        balances[recipient] += amount;
        payments[msg.sender].push(Payment(amount, recipient));
        emit Transfer(amount, recipient);
    }
}
