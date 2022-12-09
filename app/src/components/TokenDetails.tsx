import React, { useState } from "react";
import { Token } from "./tokens";

import "./TokenDetails.css";

type TokenDetailsProps = {
  token: Token;
  onClickReturn: () => void;
  unlist: () => void;
  buy: () => void;
  listOnMarketplace: (price: number) => void;
  isOwner: boolean;
};

function TokenDetails(props: TokenDetailsProps) {
  const { onClickReturn, token, isOwner, listOnMarketplace, unlist, buy } =
    props;
  const [price, setPrice] = useState<number>(0);

  const handlePriceChange = (e: any) => {
    setPrice(e.target.value);
  };

  const handleClickListMarketplace = (e: any) => {
    listOnMarketplace(price);
  };

  const isOnMarketplace = !!(token.price !== "0.0");

  return (
    <div className="token-details-container">
      <div className="column">
        <img
          className="token-details-image"
          src={token.image}
          alt={token.name}
        />
      </div>
      <div className="column">
        <div className="token-details-name">{token.name}</div>
        <div className="token-details-description">{token.description}</div>
        <div className="token-details-owner">Owned by {token.ownerId}</div>
        {token.attributes.length && (
          <div className="token-details-attributes">
            {token.attributes.map(({ trait_type, value }: any, i: number) => (
              <div className="token-details-attribute" key={i}>
                <span>{trait_type}</span> {value}
              </div>
            ))}
          </div>
        )}
        <div>
          <button className="button button-white" onClick={onClickReturn}>
            Back to list
          </button>
        </div>
        {isOwner && !isOnMarketplace && (
          <div className="form-list-marketplace">
            <button
              className="button button-green"
              onClick={handleClickListMarketplace}
            >
              List on Marketplace
            </button>
            <input
              type="text"
              placeholder="Price in ETH"
              onChange={handlePriceChange}
              value={price}
            />
          </div>
        )}
        {!isOwner && isOnMarketplace && (
          <div className="form-buy">
            <button className="button button-green" onClick={buy}>
              Buy {token.price} ETH
            </button>
          </div>
        )}
        {isOwner && isOnMarketplace && (
          <div className="form-unlist-marketplace">
            <button className="button button-red" onClick={unlist}>
              Remove from marketplace
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default TokenDetails;
