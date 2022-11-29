const hre = require("hardhat");
require("dotenv").config();

async function main() {
  const maxRabbitFactory = await hre.ethers.getContractFactory("MaxRabbit");
  const contractOwner = await hre.ethers.getSigner(
    process.env.REACT_APP_OWNER_ADDRESS
  );
  const maxRabbit = await maxRabbitFactory.connect(contractOwner).deploy();

  await maxRabbit.deployed();

  console.log(`MaxRabbit deployed to ${maxRabbit.address}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
