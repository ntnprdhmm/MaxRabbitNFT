const { expect } = require("chai");
const hre = require("hardhat");

describe("Marketplace", () => {
  describe("listTokenInMarketplace", async () => {
    async function setup() {
      const [owner] = await hre.ethers.getSigners();

      const maxRabbitFactory = await hre.ethers.getContractFactory("MaxRabbit");
      const maxRabbit = await maxRabbitFactory.deploy();

      const marketplaceFactory = await hre.ethers.getContractFactory(
        "Marketplace"
      );
      const marketplace = await marketplaceFactory.deploy(maxRabbit.address);
      return { marketplace, maxRabbit, owner };
    }

    describe("listTokenInMarketplace", async () => {
      describe("When a token owner calls with his token and a price", () => {
        it("list the token with the given price ", async () => {
          const { marketplace, maxRabbit, owner } = await setup();

          await maxRabbit.safeMint(
            owner.getAddress(),
            "https://metadata_1.json"
          );

          const tokenId = await maxRabbit.tokenOfOwnerByIndex(
            owner.getAddress(),
            0
          );

          await maxRabbit.approve(marketplace.address, tokenId);

          const options = { value: hre.ethers.utils.parseEther("0.0025") };
          const price = hre.ethers.utils.parseEther("0.32");
          await marketplace.listTokenInMarketplace(
            tokenId,
            price,
            options
          );

          const listedPrice = await marketplace.priceByTokenId(tokenId);

          expect(listedPrice).to.be.equal(price);
        });
      });
    });
  });
});
