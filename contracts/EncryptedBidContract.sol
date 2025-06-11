// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract EncryptedBidContract {
    struct EncryptedBid {
        string encryptedData; // Hex string of encrypted payload
        string iv;            // Hex string of AES IV
    }

    // sessionId => bidderId => bid
    mapping(string => mapping(string => EncryptedBid)) public sessionBids;

    // sessionId => list of bidderIds
    mapping(string => string[]) private sessionBidderIds;

    // Event emitted when a bid is submitted
    event BidSubmitted(string sessionId, string bidderId);

    /// @notice Submit a bid for a given session
    function submitBid(
        string calldata sessionId,
        string calldata bidderId,
        string calldata encryptedData,
        string calldata iv
    ) external {
        // If it's a new bidder for the session, track the ID
        if (bytes(sessionBids[sessionId][bidderId].encryptedData).length == 0) {
            sessionBidderIds[sessionId].push(bidderId);
        }

        sessionBids[sessionId][bidderId] = EncryptedBid(encryptedData, iv);

        emit BidSubmitted(sessionId, bidderId);
    }

    /// @notice Get bid for a session and bidder
    function getBid(string calldata sessionId, string calldata bidderId)
        external
        view
        returns (EncryptedBid memory)
    {
        return sessionBids[sessionId][bidderId];
    }

    /// @notice Get all bidderIds for a session
    function getAllBidderIds(string calldata sessionId)
        external
        view
        returns (string[] memory)
    {
        return sessionBidderIds[sessionId];
    }
}
