import React, { useState } from "react";
import Header from "./Header";
import TokensContainer from "./TokensContainer";

function App() {
  const [address, setAddress] = useState<string>();

  const handleAddressChange = (_address: string): void => {
    setAddress(_address);
  };

  return (
    <div className="App">
      <Header onAddressChange={handleAddressChange} />
      <TokensContainer address={address} />
    </div>
  );
}

export default App;
