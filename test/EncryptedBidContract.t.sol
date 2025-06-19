// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "forge-std/Test.sol";
import "../contracts/EncryptedBidContract.sol";

contract EncryptedBidContractTest is Test {
    EncryptedBidContract public contractInstance;
    address public owner = address(0xABCD);
    address public nonOwner = address(0x1234);

    string public sessionId = "S1";
    string public bidderId = "B1";
    string public encryptedData = "0xdeadbeef";
    string public iv = "0xbeefdead";
    uint256 public viewWindow = 86400; // 1 day

    function setUp() public {
        vm.startPrank(owner);
        contractInstance = new EncryptedBidContract();
        contractInstance.initialize();
        vm.stopPrank();
    }

    function testOwnerCanSetSessionViewWindow() public {
        vm.prank(owner);
        contractInstance.setSessionViewWindow(sessionId, viewWindow);

        (uint256 duration, uint256 startTime) = contractInstance.sessions(sessionId);
        assertEq(duration, viewWindow);
        assertGt(startTime, 0);
    }

    function testNonOwnerCannotSetSessionViewWindow() public {
        vm.expectRevert();
        vm.prank(nonOwner);
        contractInstance.setSessionViewWindow(sessionId, viewWindow);
    }

    function testCannotSetZeroDuration() public {
        vm.expectRevert("Duration must be positive");
        vm.prank(owner);
        contractInstance.setSessionViewWindow(sessionId, 0);
    }

    function testSubmitBidWorksBeforeExpiry() public {
        vm.startPrank(owner);
        contractInstance.setSessionViewWindow(sessionId, viewWindow);

        contractInstance.submitBid(sessionId, bidderId, encryptedData, iv);

        (string memory storedData, string memory storedIv, uint256 ts) = contractInstance.encryptedSessionBids(sessionId, bidderId);
        assertEq(storedData, encryptedData);
        assertEq(storedIv, iv);
        assertGt(ts, 0);

        vm.stopPrank();
    }

    function testCannotSubmitBidBeforeInitializingSession() public {
        vm.prank(owner);
        vm.expectRevert("Session not initialized");
        contractInstance.submitBid(sessionId, bidderId, encryptedData, iv);
    }

    function testCannotSubmitBidAfterExpiry() public {
        vm.startPrank(owner);
        contractInstance.setSessionViewWindow(sessionId, 100);
        vm.warp(block.timestamp + 101);

        vm.expectRevert("Session expired");
        contractInstance.submitBid(sessionId, bidderId, encryptedData, iv);
        vm.stopPrank();
    }

    function testGetBidWithinWindow() public {
        vm.startPrank(owner);
        contractInstance.setSessionViewWindow(sessionId, viewWindow);
        contractInstance.submitBid(sessionId, bidderId, encryptedData, iv);

        EncryptedBidContract.EncryptedBid memory bid = contractInstance.getBid(sessionId, bidderId);
        assertEq(bid.encryptedData, encryptedData);
        assertEq(bid.iv, iv);
        assertGt(bid.timestamp, 0);
        vm.stopPrank();
    }

    function testGetBidFailsIfBidDoesNotExist() public {
        vm.prank(owner);
        contractInstance.setSessionViewWindow(sessionId, viewWindow);

        vm.expectRevert("Bid does not exist");
        contractInstance.getBid(sessionId, bidderId);
    }

    function testGetBidFailsIfSessionExpired() public {
        vm.startPrank(owner);
        contractInstance.setSessionViewWindow(sessionId, 100);
        contractInstance.submitBid(sessionId, bidderId, encryptedData, iv);
        vm.warp(block.timestamp + 101);

        vm.expectRevert("Bid expired");
        contractInstance.getBid(sessionId, bidderId);
        vm.stopPrank();
    }

    function testGetAllBidderIds() public {
        vm.startPrank(owner);
        contractInstance.setSessionViewWindow(sessionId, viewWindow);
        contractInstance.submitBid(sessionId, bidderId, encryptedData, iv);
        contractInstance.submitBid(sessionId, "B2", encryptedData, iv);

        string[] memory bidders = contractInstance.getAllBidderIds(sessionId);
        assertEq(bidders.length, 2);
        assertEq(bidders[0], bidderId);
        assertEq(bidders[1], "B2");
        vm.stopPrank();
    }

    function testIsSessionActiveTrue() public {
        vm.prank(owner);
        contractInstance.setSessionViewWindow(sessionId, viewWindow);

        bool active = contractInstance.isSessionActive(sessionId);
        assertTrue(active);
    }

    function testIsSessionActiveFalseIfNotSet() public {
        bool active = contractInstance.isSessionActive(sessionId);
        assertFalse(active);
    }

    function testIsSessionActiveFalseAfterExpiry() public {
        vm.prank(owner);
        contractInstance.setSessionViewWindow(sessionId, 100);

        vm.warp(block.timestamp + 101);
        bool active = contractInstance.isSessionActive(sessionId);
        assertFalse(active);
    }
}
