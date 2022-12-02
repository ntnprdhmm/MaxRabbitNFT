import React from "react";
import { ethers } from "ethers";

import "./Header.css";

type HeaderProps = {
  onAddressChange: (address: string) => void;
};

function Header(props: HeaderProps) {
  const { onAddressChange } = props;

  if (typeof window.ethereum === "undefined") {
    console.log("MetaMask must be installed!");
  }

  const provider = new ethers.providers.Web3Provider(window.ethereum);

  const loginMetamask = async () => {
    const addresses = await provider.send("eth_requestAccounts", []);
    onAddressChange(addresses[0]);
  };

  return (
    <div>
      <div>
        <h1 className="title">MaxRabbit</h1>
      </div>
      <div className="subtitle">NFTs of the cuttest rabbit on earth.</div>
      <button
        className="button button-green"
        id="button-metamask"
        onClick={loginMetamask}
      >
        Login with Metamask
      </button>
    </div>
  );
}

export default Header;
