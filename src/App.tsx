import React, { useState } from "react";
import { ethers } from "ethers";
import MaxRabbitArtifact from "./MaxRabbit.json";

import "./App.css";

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

function App() {
  const [address, setAddress] = useState<string>();
  const [allTokensFetchInitiated, setAllTokensFetchInitiated] =
    useState<boolean>(false);
  const [tokensWithMetadata, setTokensWithMetadata] = useState<
    TokenWithMetadata[]
  >([]);

  if (typeof window.ethereum === "undefined") {
    console.log("MetaMask must be installed!");
  }

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const maxRabbitContract = new ethers.Contract(
    process.env.REACT_APP_MAX_CONTRACT_ADDRESS!,
    MaxRabbitArtifact.abi,
    provider.getSigner()
  );

  const loginMetamask = async () => {
    const addresses = await provider.send("eth_requestAccounts", []);
    setAddress(addresses[0]);
  };

  const handleMintSubmit = async (event: any) => {
    event.preventDefault();
    const data = new FormData(event.target);
    const uri = data.get("uri");

    if (uri && maxRabbitContract) {
      await maxRabbitContract.safeMint(
        process.env.REACT_APP_OWNER_ADDRESS,
        uri
      );
    }
  };

  const getAllTokens = async () => {
    const totalSupply = await maxRabbitContract.totalSupply();
    const count = parseInt(totalSupply._hex, 16);

    const uriById = new Map<number, string>();
    for (let i = 0; i < count; i++) {
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

    setTokensWithMetadata(_tokensWithMetadata);
  };

  const isOwner =
    address !== undefined && address === process.env.REACT_APP_OWNER_ADDRESS;

  if (maxRabbitContract && !allTokensFetchInitiated) {
    setAllTokensFetchInitiated(true);
    getAllTokens();
  }

  console.log("refresh");

  return (
    <div className="App">
      <div>
        <div>
          <h1 className="title">MaxRabbit</h1>
        </div>
        <div className="subtitle">NFTs of the cuttest rabbit on earth.</div>
      </div>
      <button className="button" id="button-metamask" onClick={loginMetamask}>
        Login with Metamask
      </button>

      {isOwner && (
        <div className="mint-form-container">
          <div>Mint a new NFT</div>
          <form className="mint-form" onSubmit={handleMintSubmit}>
            <label htmlFor="uri">URI</label>
            <input type="text" name="uri" placeholder="enter metadata uri..." />
          </form>
        </div>
      )}

      <div className="all-nft-container">
        {tokensWithMetadata.map((token) => (
          <div className="nft-container">
            <img className="nft-image" src={token.image} alt={token.name} />
            <div className="nft-title">{token.name}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
