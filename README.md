# MaxRabbitNFT

WebApp + contract on ethereum blockchain, to buy ERC 721 tokens of my rabbit Max, just for fun.

## Requirements

Metamask installed on your browser.

## Run locally

- `npm install` to install dependencies 
- copy/rename `.env.example` to `.env` (don't fill it yet)

On one tab of the terminal, run a local hardhat node
- `npx hardhat node`

Then, on Metamask
- import one of the listed hardhat account (see the logs in the terminal)
- switch to localhost in Metamask (make sure the chain id is the correct one)

Open `.env` and set `OWNER_ADDRESS` with the address you chose

One another tab of the terminal, deploy the contract
- `npx hardhat compile`
- `npx hardhat run --network localhost hardhat/scripts/deploy.js`
The contract owner will be the account you chose

Copy the contract address, and set `MAX_CONTRACT_ADDRESS` in `.env`

Finally, run the web app with `npm run start`

## Mint

### IPFS

- Upload the 4 images in ./images in IPFS
- Update the image paths in the 4 metadata files (still in ./images)
- Upload the 4 updated metadata files in IPFS

Login with Metamask into the web app to see the mint section.
Paste each metadata URI in the input to mint the NFTs
