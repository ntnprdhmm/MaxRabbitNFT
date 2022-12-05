const { expect } = require("chai");
const hre = require("hardhat");

describe("Marketplace", () => {
  describe("listTokenInMarketplace", async () => {
    async function listTokenSetup() {
      const [owner] = await hre.ethers.getSigners();

      const maxRabbitFactory = await hre.ethers.getContractFactory("MaxRabbit");
      const maxRabbit = await maxRabbitFactory.deploy();

      const marketplaceFactory = await hre.ethers.getContractFactory(
        "Marketplace"
      );
      const marketplace = await marketplaceFactory.deploy(maxRabbit.address);

      await maxRabbit.safeMint(owner.getAddress(), "https://metadata_1.json");

      const tokenId = await maxRabbit.tokenOfOwnerByIndex(
        owner.getAddress(),
        0
      );

      return { marketplace, maxRabbit, tokenId };
    }

    describe("listTokenInMarketplace", () => {
      const price = hre.ethers.utils.parseEther("0.32");

      describe("When the token price is 0", () => {
        it("Throws because the price must be at least 1 wei", async () => {
          const { marketplace, maxRabbit, tokenId } = await listTokenSetup();

          await maxRabbit.approve(marketplace.address, tokenId);

          const options = { value: hre.ethers.utils.parseEther("0.0025") };
          const priceZero = hre.ethers.utils.parseEther("0");

          await expect(
            marketplace.listTokenInMarketplace(tokenId, priceZero, options)
          ).to.be.revertedWith("Selling price must be at least 1 wei");
        });
      });

      describe("When the ether sent for the listing is lower than 0.0025", () => {
        it("Throws because it should be greater or equal than the defined listing price", async () => {
          const { marketplace, maxRabbit, tokenId } = await listTokenSetup();

          await maxRabbit.approve(marketplace.address, tokenId);

          const options = { value: hre.ethers.utils.parseEther("0") };

          await expect(
            marketplace.listTokenInMarketplace(tokenId, price, options)
          ).to.be.revertedWith("Wrong listing price, must be 2500000000000000");
        });
      });

      describe("When the token owner didnt approved the marketplace", () => {
        it("Throws because the marketplace must be approved", async () => {
          const { marketplace, tokenId } = await listTokenSetup();

          const options = { value: hre.ethers.utils.parseEther("0.0025") };

          await expect(
            marketplace.listTokenInMarketplace(tokenId, price, options)
          ).to.be.revertedWith("The owner must approve the marketplace");
        });
      });

      describe("When the token is not listed yet", () => {
        it("list the token with the given price", async () => {
          const { marketplace, maxRabbit, tokenId } = await listTokenSetup();

          await maxRabbit.approve(marketplace.address, tokenId);

          const options = { value: hre.ethers.utils.parseEther("0.0025") };
          await marketplace.listTokenInMarketplace(tokenId, price, options);

          const listedPrice = await marketplace.priceByTokenId(tokenId);

          expect(listedPrice).to.be.equal(price);
        });
      });

      describe("When the token is already listed", () => {
        it("Throws because the token is already listed", async () => {
          const { marketplace, maxRabbit, tokenId } = await listTokenSetup();

          await maxRabbit.approve(marketplace.address, tokenId);

          const options = { value: hre.ethers.utils.parseEther("0.0025") };
          await marketplace.listTokenInMarketplace(tokenId, price, options);

          await expect(
            marketplace.listTokenInMarketplace(tokenId, price, options)
          ).to.be.revertedWith(
            "This token is already listed in the marketplace"
          );
        });
      });
    });
  });
});
