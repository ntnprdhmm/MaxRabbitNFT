// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/utils/Strings.sol";
import "./MaxRabbit.sol";

contract Marketplace {
    uint256 listingPrice = 0.0025 ether;

    mapping(uint16 => uint) public priceByTokenId;

    address tokenContract;
    MaxRabbit maxRabbit;

    event TokenListed(uint16 tokenId, uint256 price);
    event TokenUnlisted(uint16 tokenId);

    constructor(address _tokenContract) {
        tokenContract = _tokenContract;
        maxRabbit = MaxRabbit(tokenContract);
    }

    function getIsTokenAlreadyListed(
        uint16 tokenId
    ) internal view returns (bool) {
        if (priceByTokenId[tokenId] > 0) {
            return true;
        }
        return false;
    }

    modifier onlyTokenOwner(uint16 tokenId) {
        require(
            msg.sender == maxRabbit.ownerOf(tokenId),
            "Only the owner can list the token on the market"
        );
        _;
    }

    function buyToken(uint16 tokenId, address buyer) external payable {
        require(
            msg.value >= priceByTokenId[tokenId],
            "The amount sent is lower than the token price"
        );

        // send money ?
        maxRabbit.safeTransferFrom(address(this), buyer, tokenId);
        address owner = maxRabbit.ownerOf(tokenId);
        payable(owner).transfer(msg.value);

        _unlist(tokenId);
    }

    function listTokenInMarketplace(
        uint16 tokenId,
        uint256 price
    ) external payable onlyTokenOwner(tokenId) {
        require(price > 0, "Selling price must be at least 1 wei");
        require(
            msg.value >= listingPrice,
            string.concat(
                "Wrong listing price, must be ",
                Strings.toString(listingPrice)
            )
        );
        require(
            getIsTokenAlreadyListed(tokenId) == false,
            "This token is already listed in the marketplace"
        );
        require(
            address(this) == maxRabbit.getApproved(tokenId),
            "The owner must approve the marketplace"
        );

        priceByTokenId[tokenId] = price;

        emit TokenListed(tokenId, price);
    }

    function _unlist(uint16 tokenId) internal {
        if (priceByTokenId[tokenId] > 0) {
            delete priceByTokenId[tokenId];

            emit TokenUnlisted(tokenId);
        }
    }

    function unlist(uint16 tokenId) external onlyTokenOwner(tokenId) {
        _unlist(tokenId);
    }
}
