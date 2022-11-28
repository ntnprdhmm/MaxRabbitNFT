const hre = require("hardhat");

async function main() {
  const maxRabbitFactory = await hre.ethers.getContractFactory("MaxRabbit");
  const contractOwner = await hre.ethers.getSigner(
    "0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199"
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
