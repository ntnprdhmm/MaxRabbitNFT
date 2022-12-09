import React, { useEffect, useState } from "react";
import TokensList from "./TokensList";
import TokenDetails from "./TokenDetails";
import { Token, Metadata } from "./tokens";

import { ethers } from "ethers";

// local copy of typechain-types (from /hardhat) because it's not possible to import from hardhat package
import {
  Marketplace__factory,
  MaxRabbit__factory,
} from "../typechain-types/factories/contracts";

const LISTING_PRICE_WEI = 2500000000000000;

type TokensContainerProps = {
  address: string | undefined;
};

function TokensContainer(props: TokensContainerProps) {
  const { address } = props;

  const [selectedTokenId, setSelectedTokenId] = useState<number>();
  const [tokensWithMetadata, setTokensWithMetadata] = useState<Token[]>([]);

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const maxRabbitContract = MaxRabbit__factory.connect(
    process.env.REACT_APP_MAX_CONTRACT_ADDRESS!,
    provider.getSigner()
  );
  const marketplaceContract = Marketplace__factory.connect(
    process.env.REACT_APP_MARKETPLACE_CONTRACT_ADDRESS!,
    provider.getSigner()
  );

  const getAllTokens = async () => {
    const totalSupplyHex = await maxRabbitContract.totalSupply();
    const totalSupply = parseInt(totalSupplyHex._hex, 16);

    const uriById = new Map<number, string>();
    for (let i = 0; i < totalSupply; i++) {
      const token = await maxRabbitContract.tokenByIndex(i);
      const tokenId = parseInt(token._hex, 16);
      const tokenURI: string = await maxRabbitContract.tokenURI(tokenId);
      uriById.set(tokenId, tokenURI);
    }

    const _tokensWithMetadata: Token[] = await Promise.all(
      Array.from(uriById.entries()).map(async ([id, uri]) => {
        const response = await fetch(uri);
        const metadata: Metadata = await response.json();

        const owner = await maxRabbitContract.ownerOf(id);

        const price = await marketplaceContract.priceByTokenId(id);

        return {
          ...metadata,
          id,
          uri,
          ownerId: owner,
          price: ethers.utils.formatEther(price),
        };
      })
    );
    setTokensWithMetadata(_tokensWithMetadata);
  };

  const handleMint = async (uri: string): Promise<void> => {
    await maxRabbitContract.safeMint(process.env.REACT_APP_OWNER_ADDRESS!, uri);
  };

  const unlistOnMarketplace = async (): Promise<void> => {
    await marketplaceContract.unlist(selectedTokenId!);
  };

  const listOnMarketplace = async (price: number): Promise<void> => {
    await maxRabbitContract.approve(
      process.env.REACT_APP_MARKETPLACE_CONTRACT_ADDRESS!,
      selectedTokenId!
    );

    const weiPrice = ethers.utils.parseUnits(price.toString(), "ether");
    await marketplaceContract.listTokenInMarketplace(
      selectedTokenId!,
      weiPrice,
      { value: LISTING_PRICE_WEI }
    );
  };

  const buy = async (): Promise<void> => {
    const token = tokensWithMetadata.find(({ id }) => id === selectedTokenId);
    if (!token) return;

    await marketplaceContract.buyToken(selectedTokenId!, address!, {
      value: ethers.utils.parseUnits(token.price, "ether"),
    });
  };

  const isContractOwner = address === process.env.REACT_APP_OWNER_ADDRESS;

  useEffect(() => {
    getAllTokens();
  }, []);

  if (selectedTokenId !== undefined) {
    const token = tokensWithMetadata.find(
      (token) => token.id === selectedTokenId
    )!;

    const isOwner =
      address?.toLocaleLowerCase() === token.ownerId.toLocaleLowerCase();

    return (
      <TokenDetails
        token={token}
        isOwner={isOwner}
        onClickReturn={() => setSelectedTokenId(undefined)}
        listOnMarketplace={listOnMarketplace}
        unlist={unlistOnMarketplace}
        buy={buy}
      />
    );
  }

  return (
    <TokensList
      tokens={tokensWithMetadata}
      isContractOwner={isContractOwner}
      mint={handleMint}
      handleClickOnToken={setSelectedTokenId}
    />
  );
}

export default TokensContainer;
