// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/ReentrancyGuardUpgradeable.sol";

contract EncryptedBidContract is OwnableUpgradeable, ReentrancyGuardUpgradeable {
    struct EncryptedBid {
        string encryptedData; // Hex string of encrypted payload
        string iv;            // Hex string of AES IV
        uint256 timestamp;
    }

    // sessionId => bidderId => EncryptedBid
    mapping(string => mapping(string => EncryptedBid)) public encryptedSessionBids;

    // sessionId => list of bidderIds
    mapping(string => string[]) private sessionBidderIds;

    // sessionId => view window (in seconds)
    mapping(string => uint256) public sessionViewWindows;

    // Events
    event BidSubmitted(string sessionId, string bidderId);
    event SessionViewWindowSet(string sessionId, uint256 duration);

    function initialize() external initializer {
        __RewardManager_init();
    }

    function __RewardManager_init() internal initializer {
        __Context_init_unchained();
        __Ownable_init_unchained(_msgSender());
        __ReentrancyGuard_init_unchained();
    }

    /// @notice Set the viewing window for a specific session
    function setSessionViewWindow(string calldata sessionId, uint256 duration) external onlyOwner {
        require(duration > 0, "Duration must be positive");
        sessionViewWindows[sessionId] = duration;
        emit SessionViewWindowSet(sessionId, duration);
    }

    /// @notice Submit a bid for a session
    function submitBid(
        string calldata sessionId,
        string calldata bidderId,
        string calldata encryptedData,
        string calldata iv
    ) external onlyOwner {
        if (bytes(encryptedSessionBids[sessionId][bidderId].encryptedData).length == 0) {
            sessionBidderIds[sessionId].push(bidderId);
        }

        encryptedSessionBids[sessionId][bidderId] = EncryptedBid({
            encryptedData: encryptedData,
            iv: iv,
            timestamp: block.timestamp
        });

        emit BidSubmitted(sessionId, bidderId);
    }

    /// @notice Get a bid for a session & bidder (if within session's view window)
    function getBid(string calldata sessionId, string calldata bidderId)
        external
        view
        returns (EncryptedBid memory)
    {
        EncryptedBid memory bid = encryptedSessionBids[sessionId][bidderId];
        require(bid.timestamp != 0, "Bid does not exist");

        uint256 window = sessionViewWindows[sessionId];
        require(window > 0, "Session window not set");
        require(block.timestamp <= bid.timestamp + window, "Bid expired");

        return bid;
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
