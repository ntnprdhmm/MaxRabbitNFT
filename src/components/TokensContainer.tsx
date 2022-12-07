import React, { useEffect, useState } from "react";
import TokensList from "./TokensList";
import TokenDetails from "./TokenDetails";
import { Token, Metadata } from "./tokens";

import { ethers } from "ethers";
import MaxRabbitArtifact from "../MaxRabbit.json";
import MarketplaceArtifact from "../Marketplace.json";

type TokensContainerProps = {
  address: string | undefined;
};

function TokensContainer(props: TokensContainerProps) {
  const { address } = props;

  const [selectedTokenId, setSelectedTokenId] = useState<number>();
  const [tokensWithMetadata, setTokensWithMetadata] = useState<Token[]>([]);

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const maxRabbitContract = new ethers.Contract(
    process.env.REACT_APP_MAX_CONTRACT_ADDRESS!,
    MaxRabbitArtifact.abi,
    provider.getSigner()
  );
  const marketplaceContract = new ethers.Contract(
    process.env.REACT_APP_MARKETPLACE_CONTRACT_ADDRESS!,
    MarketplaceArtifact.abi,
    provider.getSigner()
  );

  const getTokensOnSale = async () => {
    // const x = marketplaceContract.;
  };

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

        return {
          ...metadata,
          id,
          uri,
          ownerId: owner,
        };
      })
    );

    setTokensWithMetadata(_tokensWithMetadata);
  };

  const handleMint = async (uri: string): Promise<void> => {
    await maxRabbitContract.safeMint(process.env.REACT_APP_OWNER_ADDRESS, uri);
  };

  const isContractOwner = address === process.env.REACT_APP_OWNER_ADDRESS;

  useEffect(() => {
    getAllTokens();
  }, []);

  if (selectedTokenId !== undefined) {
    const token = tokensWithMetadata.find(
      (token) => token.id === selectedTokenId
    )!;
    return (
      <TokenDetails
        token={token}
        onClickReturn={() => setSelectedTokenId(undefined)}
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
