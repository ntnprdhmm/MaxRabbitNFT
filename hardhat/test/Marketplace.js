const { expect } = require("chai");
const hre = require("hardhat");

describe("Marketplace", () => {
  describe("listTokenInMarketplace", async () => {
    async function listTokenSetup() {
      const [owner, buyer] = await hre.ethers.getSigners();

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

      return { marketplace, maxRabbit, tokenId, buyer, owner };
    }

    const price = hre.ethers.utils.parseEther("0.32");
    const priceZero = hre.ethers.utils.parseEther("0");

    describe("listTokenInMarketplace", () => {
      describe("When the token price is 0", () => {
        it("Throws because the price must be at least 1 wei", async () => {
          const { marketplace, maxRabbit, tokenId } = await listTokenSetup();

          await maxRabbit.approve(marketplace.address, tokenId);

          const options = { value: hre.ethers.utils.parseEther("0.0025") };

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

    describe("unlist", () => {
      describe("When the token is listed", () => {
        it("Removes the token from the list", async () => {
          const { marketplace, maxRabbit, tokenId } = await listTokenSetup();

          await maxRabbit.approve(marketplace.address, tokenId);

          const options = { value: hre.ethers.utils.parseEther("0.0025") };
          await marketplace.listTokenInMarketplace(tokenId, price, options);
          const listedPriceBeforeUnlist = await marketplace.priceByTokenId(
            tokenId
          );
          expect(listedPriceBeforeUnlist).to.be.equal(price);

          await marketplace.unlist(tokenId);

          const listedPriceAfterUnlist = await marketplace.priceByTokenId(
            tokenId
          );
          expect(listedPriceAfterUnlist).to.be.equal(priceZero);
        });
      });
    });

    describe("buyToken", () => {
      describe("When the token is not listed", () => {
        it("Throws", async () => {
          const { marketplace, tokenId, buyer } = await listTokenSetup();

          await expect(
            marketplace.buyToken(tokenId, buyer.address)
          ).to.be.revertedWith("The token you try to buy is not listed");
        });
      });

      describe("When the token is listed", () => {
        describe("When the ether sent is less than the price", () => {
          it("Throws", async () => {
            const { marketplace, maxRabbit, tokenId, buyer } =
              await listTokenSetup();

            await maxRabbit.approve(marketplace.address, tokenId);

            const listOptions = {
              value: hre.ethers.utils.parseEther("0.0025"),
            };
            await marketplace.listTokenInMarketplace(
              tokenId,
              price,
              listOptions
            );

            const buyerPrice = hre.ethers.utils.parseEther("0.20");
            const buyOptions = { value: buyerPrice };

            await expect(
              marketplace.buyToken(tokenId, buyer.address, buyOptions)
            ).to.be.revertedWith(
              "The amount sent is lower than the token price"
            );
          });
        });

        describe("When the ether sent is the seller price", () => {
          it("Transfers the token to the buyer and the ether to the seller, and removes the token from the marketplace listing", async () => {
            const { marketplace, maxRabbit, tokenId, buyer, owner } =
              await listTokenSetup();

            await maxRabbit
              .connect(owner)
              .approve(marketplace.address, tokenId);

            const listOptions = {
              value: hre.ethers.utils.parseEther("0.0025"),
            };
            await marketplace
              .connect(owner)
              .listTokenInMarketplace(tokenId, price, listOptions);

            const buyOptions = { value: price };
            await marketplace
              .connect(buyer)
              .buyToken(tokenId, buyer.address, buyOptions);

            const newOwner = await maxRabbit.ownerOf(tokenId);

            expect(newOwner).to.be.equal(buyer.address);

            const buyerBalance = await buyer.getBalance();
            const sellerBalance = await owner.getBalance();
            expect(buyerBalance).to.be.equal("9999679914380607624519"); // - token price - gas
            expect(sellerBalance).to.be.equal("10000256993674289749009"); // - list price - gas + token price

            const listedPrice = await marketplace.priceByTokenId(tokenId);
            expect(listedPrice).to.be.equal(0);
          });
        });
      });
    });
  });
});
