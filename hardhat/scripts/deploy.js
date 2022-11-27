const hre = require("hardhat");

async function main() {
  const MaxRabbit = await hre.ethers.getContractFactory("MaxRabbit");
  const lock = await MaxRabbit.deploy();

  await lock.deployed();

  console.log(`MaxRabbit deployed to ${lock.address}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
