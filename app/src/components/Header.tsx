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
    <div className="header">
      <div className="header-banner">
        <div>
          <h1 className="header-banner-title">
            Max<span>Rabbit</span>
          </h1>
        </div>
        <button
          className="button button-secondary"
          id="button-metamask"
          onClick={loginMetamask}
        >
          Connect your wallet
        </button>
      </div>
      <div className="header-subtitle">NFTs of the cuttest rabbit on earth</div>
    </div>
  );
}

export default Header;
