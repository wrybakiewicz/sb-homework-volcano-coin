const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("VolcanoCoin", function () {
  it("should deploy contract and return total supply", async function () {
    const VolcanoCoin = await ethers.getContractFactory("VolcanoCoin");
    const volcanoCoin = await VolcanoCoin.deploy();
    await volcanoCoin.deployed();

    expect(await volcanoCoin.totalSupply()).to.equal(10000);
  });

  it("should increase total supply", async function () {
    const VolcanoCoin = await ethers.getContractFactory("VolcanoCoin");
    const volcanoCoin = await VolcanoCoin.deploy();
    await volcanoCoin.deployed();

    const increaseTx = await volcanoCoin.increaseTotalSupply();

    expect(await volcanoCoin.totalSupply()).to.equal(11000);
    expect(increaseTx).to.emit(volcanoCoin, "SupplyIncreased").withArgs(1000);
  });

  it("should not increase total supply if not executed by owner", async function () {
    const [owner, notOwner] = await ethers.getSigners();
    const VolcanoCoin = await ethers.getContractFactory("VolcanoCoin");
    const volcanoCoin = await VolcanoCoin.deploy();
    await volcanoCoin.deployed();

    await expect(volcanoCoin.connect(notOwner).increaseTotalSupply()).to.be.revertedWith("Only owner can execute this");
  });
});
