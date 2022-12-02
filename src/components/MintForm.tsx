import React from "react";

import "./MintForm.css";

type MintFormProps = {
  mint: (uri: string) => void;
};

function MintForm(props: MintFormProps) {
  const { mint } = props;

  const handleMintSubmit = (event: any) => {
    event.preventDefault();
    const data = new FormData(event.target);
    const uri = data.get("uri");

    if (uri) {
      mint(uri.toString());
    }
  };

  return (
    <div className="mint-form-container">
      <div>Mint a new NFT</div>
      <form className="mint-form" onSubmit={handleMintSubmit}>
        <label htmlFor="uri">URI</label>
        <input type="text" name="uri" placeholder="enter metadata uri..." />
      </form>
    </div>
  );
}

export default MintForm;
