# MaxRabbitNFT

WebApp + contract on ethereum blockchain, to buy ERC 721 tokens of my rabbit Max, just for fun.

## Requirements

Metamask installed on your browser.

## Run locally

### Setup Blockchain

- `npm install` to install dependencies
- copy/rename `.env.example` to `.env` (don't fill it yet)

On one tab of the terminal, run a local hardhat node

- `cd hardhat`
- `npm run start`

Then, on Metamask

- import one of the listed hardhat account (see the logs in the terminal)
- switch to localhost in Metamask (make sure the chain id is the correct one)

Open `.env` and set `REACT_APP_OWNER_ADDRESS` with the address you chose

One another tab of the terminal, deploy the contract

- `cd hardhat`
- `npm run compile`
- `npm run deploy` (The contracts owners will be the account you chose)

Copy the contract addresses, and set `REACT_APP_MAX_CONTRACT_ADDRESS` and `REACT_APP_MARKETPLACE_CONTRACT_ADDRESS` in `.env`

### Run the web App

- `cd app`
- `npm start`

### Mint the NFTs

- Upload the 4 images in ./images in IPFS
- Update the image paths in the 4 metadata files (still in ./images)
- Upload the 4 updated metadata files in IPFS

Login with Metamask into the web app to see the mint section.
Paste each metadata URI in the input to mint the NFTs
