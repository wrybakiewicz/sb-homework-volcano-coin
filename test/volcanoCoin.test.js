const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("VolcanoCoin", function () {
  it("Should return the new greeting once it's changed", async function () {
    const VolcanoCoin = await ethers.getContractFactory("VolcanoCoin");
    const volcanoCoin = await VolcanoCoin.deploy(1000);
    await volcanoCoin.deployed();

    expect(await volcanoCoin.totalSupply()).to.equal(1000);
  });
});
