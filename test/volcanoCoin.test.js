const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("VolcanoCoin", function () {
  it("should deploy contract and return total supply", async function () {
    const [owner] = await ethers.getSigners();
    const VolcanoCoin = await ethers.getContractFactory("VolcanoCoin");
    const volcanoCoin = await VolcanoCoin.deploy();
    await volcanoCoin.deployed();

    expect(await volcanoCoin.totalSupply()).to.equal(10000);
    expect(await volcanoCoin.owner()).to.equal(owner.address);
    expect(await volcanoCoin.balances(owner.address)).to.equal(10000);
  });

  it("should increase total supply", async function () {
    const [owner] = await ethers.getSigners();
    const VolcanoCoin = await ethers.getContractFactory("VolcanoCoin");
    const volcanoCoin = await VolcanoCoin.deploy();
    await volcanoCoin.deployed();

    const increaseTx = await volcanoCoin.increaseTotalSupply();

    expect(await volcanoCoin.totalSupply()).to.equal(11000);
    expect(increaseTx).to.emit(volcanoCoin, "SupplyIncreased").withArgs(1000);
    expect(await volcanoCoin.balances(owner.address)).to.equal(11000);
  });

  it("should not increase total supply if not executed by owner", async function () {
    const [owner, notOwner] = await ethers.getSigners();
    const VolcanoCoin = await ethers.getContractFactory("VolcanoCoin");
    const volcanoCoin = await VolcanoCoin.deploy();
    await volcanoCoin.deployed();

    await expect(volcanoCoin.connect(notOwner).increaseTotalSupply()).to.be.revertedWith("Only owner can execute this");
  });

  it("should change balances after transfer", async function () {
    const [owner, notOwner] = await ethers.getSigners();
    const VolcanoCoin = await ethers.getContractFactory("VolcanoCoin");
    const volcanoCoin = await VolcanoCoin.deploy();
    await volcanoCoin.deployed();

    const transfer = await volcanoCoin.transfer(6000, notOwner.address);

    expect(await volcanoCoin.totalSupply()).to.equal(10000);
    expect(transfer).to.emit(volcanoCoin, "Transfer").withArgs(6000, notOwner.address);
    expect(await volcanoCoin.balances(owner.address)).to.equal(4000);
    expect(await volcanoCoin.balances(notOwner.address)).to.equal(6000);
    const firstElement = await volcanoCoin.payments(owner.address, 0);
    expect(firstElement.recipient).to.equal(notOwner.address);
    expect(firstElement.amount).to.equal(6000);
    await expect(volcanoCoin.payments(owner.address, 1)).to.be.reverted;
    await expect(volcanoCoin.payments(notOwner.address, 0)).to.be.reverted;
  });

  it("should not transfer when balance not enough", async function () {
    const [owner, notOwner] = await ethers.getSigners();
    const VolcanoCoin = await ethers.getContractFactory("VolcanoCoin");
    const volcanoCoin = await VolcanoCoin.deploy();
    await volcanoCoin.deployed();

    await expect(volcanoCoin.transfer(11000, notOwner.address)).to.be.revertedWith("Balance not enough to make a transfer");
  });
});
