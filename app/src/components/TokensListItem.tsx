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
      <div className="nft-image-container">
        <img className="nft-image" src={token.image} alt={token.name} />
      </div>
      <div className="nft-infos-container">
        <div className="nft-id">MaxRabbit #{token.id}</div>
        <div className="nft-title">{token.name}</div>
        {token.price !== "0.0" && (
          <div className="nft-sale-price">{token.price} ETH</div>
        )}
        {token.price === "0.0" && (
          <div className="nft-not-on-sale">not on sale</div>
        )}
      </div>
    </div>
  );
}

export default TokensListItem;
