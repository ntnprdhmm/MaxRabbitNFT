const path = require("path");
const hre = require("hardhat");
require("dotenv").config({
  path: path.join(__dirname, "../../app/", ".env"),
});

async function main() {
  const maxRabbitFactory = await hre.ethers.getContractFactory("MaxRabbit");
  const marketplaceFactory = await hre.ethers.getContractFactory("Marketplace");

  const contractOwner = await hre.ethers.getSigner(
    process.env.REACT_APP_OWNER_ADDRESS
  );

  const maxRabbit = await maxRabbitFactory.connect(contractOwner).deploy();
  await maxRabbit.deployed();
  console.log(`MaxRabbit deployed to ${maxRabbit.address}`);

  const marketplace = await marketplaceFactory
    .connect(contractOwner)
    .deploy(maxRabbit.address);
  await marketplace.deployed();
  console.log(`Marketplace deployed to ${marketplace.address}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
