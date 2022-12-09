import React from "react";
import { Token } from "./tokens";

import "./TokensListItem.css";

type TokensListItemProps = {
  token: Token;
  onTokenClick: (id: number) => void;
};

function TokensListItem(props: TokensListItemProps) {
  const { token, onTokenClick } = props;

  const handleClick = () => {
    onTokenClick(token.id);
  };

  return (
    <div className="nft-container" onClick={handleClick}>
      <img className="nft-image" src={token.image} alt={token.name} />
      <div className="nft-title">{token.name}</div>
      {token.price !== "0.0" && (
        <div className="nft-on-sale">ON SALE {token.price} ETH</div>
      )}
      {token.price === "0.0" && (
        <div className="nft-not-on-sale">NOT ON SALE</div>
      )}
    </div>
  );
}

export default TokensListItem;
