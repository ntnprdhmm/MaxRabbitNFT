import React from "react";
import TokensListItem from "./TokensListItem";
import MintForm from "./MintForm";

type TokensListProps = {
  tokens: any[];
  mint: (uri: string) => void;
  isContractOwner: boolean;
};

function TokensList(props: TokensListProps) {
  const { tokens, mint, isContractOwner } = props;

  return (
    <>
      {isContractOwner && <MintForm mint={mint} />}
      <div className="all-nft-container">
        {tokens.map((token) => (
          <TokensListItem key={token.id} token={token} />
        ))}
      </div>
    </>
  );
}

export default TokensList;
