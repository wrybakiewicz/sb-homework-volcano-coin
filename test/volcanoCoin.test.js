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
    expect(await volcanoCoin.balanceOf(owner.address)).to.equal(10000);
  });

  it("should increase total supply", async function () {
    const [owner] = await ethers.getSigners();
    const VolcanoCoin = await ethers.getContractFactory("VolcanoCoin");
    const volcanoCoin = await VolcanoCoin.deploy();
    await volcanoCoin.deployed();

    const increaseTx = await volcanoCoin.increaseTotalSupply();

    expect(await volcanoCoin.totalSupply()).to.equal(11000);
    await expect(increaseTx).to.emit(volcanoCoin, "Transfer")
        .withArgs('0x0000000000000000000000000000000000000000', owner.address, 1000);
    expect(await volcanoCoin.balanceOf(owner.address)).to.equal(11000);
  });

  it("should not increase total supply if not executed by owner", async function () {
    const [owner, notOwner] = await ethers.getSigners();
    const VolcanoCoin = await ethers.getContractFactory("VolcanoCoin");
    const volcanoCoin = await VolcanoCoin.deploy();
    await volcanoCoin.deployed();

    await expect(volcanoCoin.connect(notOwner).increaseTotalSupply()).to.be.revertedWith("Ownable: caller is not the owner");
  });

  it("should change balances after transfer", async function () {
    const [owner, notOwner] = await ethers.getSigners();
    const VolcanoCoin = await ethers.getContractFactory("VolcanoCoin");
    const volcanoCoin = await VolcanoCoin.deploy();
    await volcanoCoin.deployed();

    const transfer = await volcanoCoin.transfer(notOwner.address, 6000);

    expect(await volcanoCoin.totalSupply()).to.equal(10000);
    await expect(transfer).to.emit(volcanoCoin, "Transfer").withArgs(owner.address, notOwner.address, 6000);
    expect(await volcanoCoin.balanceOf(owner.address)).to.equal(4000);
    expect(await volcanoCoin.balanceOf(notOwner.address)).to.equal(6000);
    const paymentsForOwner = await volcanoCoin.getPayments(owner.address);
    expect(paymentsForOwner.length).to.equal(1);
    expect(paymentsForOwner[0].recipient).to.equal(notOwner.address);
    expect(paymentsForOwner[0].amount).to.equal(6000);
    const paymentsForNotOwner = await volcanoCoin.getPayments(notOwner.address);
    expect(paymentsForNotOwner.length).to.equal(0);
  });

  it("should not transfer when balance not enough", async function () {
    const [owner, notOwner] = await ethers.getSigners();
    const VolcanoCoin = await ethers.getContractFactory("VolcanoCoin");
    const volcanoCoin = await VolcanoCoin.deploy();
    await volcanoCoin.deployed();

    await expect(volcanoCoin.transfer(notOwner.address, 11000)).to.be.revertedWith("ERC20: transfer amount exceeds balance");
  });
});
