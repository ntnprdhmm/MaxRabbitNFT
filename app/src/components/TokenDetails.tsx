import React from "react";
import { Token } from "./tokens";

import "./TokenDetails.css";

type TokenDetailsProps = {
  token: Token;
  onClickReturn: () => void;
};

function TokenDetails(props: TokenDetailsProps) {
  const { onClickReturn, token } = props;

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
        <div className="token-details-buttons">
          <button className="button button-white" onClick={onClickReturn}>
            Back to list
          </button>
          <button className="button button-green" onClick={onClickReturn}>
            Buy
          </button>
        </div>
      </div>
    </div>
  );
}

export default TokenDetails;
