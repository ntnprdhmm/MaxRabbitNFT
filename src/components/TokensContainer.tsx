import React, { useEffect, useState } from "react";
import TokensList from "./TokensList";
import TokenDetails from "./TokenDetails";

import { ethers } from "ethers";
import MaxRabbitArtifact from "../MaxRabbit.json";

type Metadata = {
  description: string;
  external_url: string;
  image: string;
  name: string;
  attributes: {
    trait_type: string;
    value: string;
  }[];
};

type TokenWithMetadata = {
  id: number;
  uri: string;
  ownerId: string;
} & Metadata;

type TokensContainerProps = {
  address: string | undefined;
};

function TokensContainer(props: TokensContainerProps) {
  const { address } = props;

  // const [selectedTokenId, setSelectedTokenId] = useState<number>();
  const [tokensWithMetadata, setTokensWithMetadata] = useState<
    TokenWithMetadata[]
  >([]);

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const maxRabbitContract = new ethers.Contract(
    process.env.REACT_APP_MAX_CONTRACT_ADDRESS!,
    MaxRabbitArtifact.abi,
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

    const _tokensWithMetadata: TokenWithMetadata[] = await Promise.all(
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
    console.log(_tokensWithMetadata);
    setTokensWithMetadata(_tokensWithMetadata);
  };

  const handleMint = async (uri: string): Promise<void> => {
    await maxRabbitContract.safeMint(process.env.REACT_APP_OWNER_ADDRESS, uri);
  };

  const isContractOwner = address === process.env.REACT_APP_OWNER_ADDRESS;

  useEffect(() => {
    getAllTokens();
  }, []);

  /*
  if (selectedTokenId) {
    const token = tokensWithMetadata.find(
      (token) => token.id === selectedTokenId
    );
    return <TokenDetails token={token} />;
  }
  */

  return (
    <TokensList
      tokens={tokensWithMetadata}
      isContractOwner={isContractOwner}
      mint={handleMint}
    />
  );
}

export default TokensContainer;
