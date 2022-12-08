import React from "react";
import TokensListItem from "./TokensListItem";
import MintForm from "./MintForm";
import { Token } from "./tokens";

type TokensListProps = {
  tokens: Token[];
  mint: (uri: string) => void;
  isContractOwner: boolean;
  handleClickOnToken: (id: number) => void;
};

function TokensList(props: TokensListProps) {
  const { tokens, mint, isContractOwner, handleClickOnToken } = props;

  return (
    <>
      {isContractOwner && <MintForm mint={mint} />}
      <div className="all-nft-container">
        {tokens.map((token) => (
          <TokensListItem
            key={token.id}
            token={token}
            onTokenClick={handleClickOnToken}
          />
        ))}
      </div>
    </>
  );
}

export default TokensList;
