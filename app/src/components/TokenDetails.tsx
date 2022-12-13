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
      <div className="column column-details">
        <a id="backLink" href="javascript:void(0);" onClick={onClickReturn}>
          Back to list
        </a>
        <div className="token-id">MaxRabbit #{token.id}</div>
        <div className="token-description-container">
          <div className="token-description-title">Description</div>
          <div className="token-description">
            <div className="token-description-name">{token.name}</div>
            <div className="token-description-description">
              {token.description}
            </div>
          </div>
          <div className="token-description-owner-title">Owned By</div>
          <div className="token-description-owner-id">{token.ownerId}</div>
          {token.attributes.length && (
            <>
              <div className="token-description-attributes-title">
                Properties
              </div>
              <div className="token-description-attributes">
                {token.attributes.map(
                  ({ trait_type, value }: any, i: number) => (
                    <div className="token-description-attribute" key={i}>
                      <span>{trait_type}</span> {value}
                    </div>
                  )
                )}
              </div>
            </>
          )}
        </div>
        <div className="actions-container">
          {isOwner && !isOnMarketplace && (
            <div className="action-list-marketplace">
              <button
                className="button button-primary"
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
            <div className="action-buy">
              <button className="button button-primary" onClick={buy}>
                Buy {token.price} ETH
              </button>
            </div>
          )}
          {isOwner && isOnMarketplace && (
            <div className="action-unlist-marketplace">
              <button className="button button-secondary" onClick={unlist}>
                Remove from marketplace
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default TokenDetails;
