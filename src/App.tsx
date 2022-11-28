import React, { useState } from "react";
import { ethers } from "ethers";
import MaxRabbitArtifact from "./MaxRabbit.json";

import "./App.css";

const maxContractAddress = "0x73511669fd4dE447feD18BB79bAFeAC93aB7F31f";
const ownerAddress = "0x8626f6940e2eb28930efb4cef49b2d1f2c9c1199";

function App() {
  const [address, setAddress] = useState<string>();
  const [maxRabbitContract, setMaxRabbitContract] = useState<ethers.Contract>();

  if (typeof window.ethereum !== "undefined") {
    console.log("MetaMask is installed!");
  }

  const provider = new ethers.providers.Web3Provider(window.ethereum);

  const loginMetamask = async () => {
    const addresses = await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();
    setAddress(addresses[0]);

    setMaxRabbitContract(new ethers.Contract(
      maxContractAddress,
      MaxRabbitArtifact.abi,
      signer
    ));
  };

  const handleMintSubmit = async (event: any) => {
    event.preventDefault();
    const data = new FormData(event.target);
    const uri = data.get("uri");

    if (uri && maxRabbitContract) {
      await maxRabbitContract.safeMint(ownerAddress, uri);
    }
  };

  const getAllTokens = async () => {
    if (maxRabbitContract) {
      const totalSupply = await maxRabbitContract.totalSupply();
      const count = parseInt(totalSupply._hex, 16);

      for (let i = 0; i < count; i++) {
        const token = await maxRabbitContract.tokenByIndex(i);
        const tokenId = parseInt(token._hex, 16);
        const tokenURI = await maxRabbitContract.tokenURI(tokenId);
        console.log("tokenURI", tokenURI);
      }
    }
  };

  const isOwner = address === ownerAddress;

  getAllTokens();

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
    </div>
  );
}

export default App;
