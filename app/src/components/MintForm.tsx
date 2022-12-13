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
      <div className="mint-form-title">Mint a new MaxRabbit token:</div>
      <form className="mint-form" onSubmit={handleMintSubmit}>
        <input
          type="text"
          name="uri"
          placeholder="IPFS metadata json file URI"
        />
      </form>
    </div>
  );
}

export default MintForm;
