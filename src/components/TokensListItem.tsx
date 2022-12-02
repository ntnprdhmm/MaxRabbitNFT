import React from "react";

import "./TokensListItem.css";

type TokensListItemProps = {
  token: any;
};

function TokensListItem(props: TokensListItemProps) {
  const { token } = props;

  return (
    <div className="nft-container">
      <img className="nft-image" src={token.image} alt={token.name} />
      <div className="nft-title">{token.name}</div>
    </div>
  );
}

export default TokensListItem;
