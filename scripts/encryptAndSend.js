// === encryptAndSend.js ===

const crypto = require("crypto");
const { ethers, upgrades } = require("hardhat");
const { getAddress } = require('./saveaddress');
const dotenv = require("dotenv");

// Load environment variables
dotenv.config();

async function main() {
  // 1. Static Inputs
  const sessionId = "87";
  const bidderId = "430";
  const viewWindowInSeconds = 60 * 60 * 24 * 20; // 20 days

  // 2. Data to encrypt
  const data = JSON.stringify({
    id: 50,
    bid_id: 87,
    user_id: 430,
    user_type: "B",
    property_id: "946148a5-aab6-47fe-a520-10d3a414f8ae",
    base_price: "12000000.00",
    bid_increase_amount: "25000.00",
    bid_price: "12075000.00",
    bid_rank: 1,
    device_id: "eqe",
    createdAt: "2025-05-06T09:47:18.624Z",
    updatedAt: "2025-05-06T10:14:55.978Z"
  });

  // 3. Generate AES-256 key and IV
  const key = crypto.randomBytes(32); // Store securely for 20 days
  const iv = crypto.randomBytes(16);

  // 4. Encryption function
  function encryptData(data, key, iv) {
    const cipher = crypto.createCipheriv("aes-256-cbc", key, iv);
    let encrypted = cipher.update(data, "utf8", "hex");
    encrypted += cipher.final("hex");
    return encrypted;
  }

  const encryptedData = encryptData(data, key, iv);

  // 5. Logging
  console.log("Encrypted Data:", encryptedData);
  console.log("IV:", iv.toString("hex"));
  console.log("Secret Key (store securely for 20 days):", key.toString("hex"));


  try {
    // 7. Setup contract instance
    const encryptedBidContract = await ethers.getContractFactory("EncryptedBidContract");
    const encryptedBidContractAddr = await getAddress("EncryptedBidContract");
    const encryptedBidContractInst = await encryptedBidContract.attach(encryptedBidContractAddr);

    // 8. Set session view window
    const viewTx = await encryptedBidContractInst.setSessionViewWindow(sessionId, viewWindowInSeconds);
    await viewTx.wait();
    console.log("Session view window set. Tx:", viewTx.hash);

    // 9. Submit encrypted bid
    const bidTx = await encryptedBidContractInst.submitBid(sessionId, bidderId, encryptedData, iv.toString("hex"));
    await bidTx.wait();
    console.log("Bid submitted successfully. Tx Hash:", bidTx.hash);

    // 10. Local decryption (test)
    function decryptData(encryptedHex, keyHex, ivHex) {
      const decipher = crypto.createDecipheriv(
        "aes-256-cbc",
        Buffer.from(keyHex, "hex"),
        Buffer.from(ivHex, "hex")
      );
      let decrypted = decipher.update(encryptedHex, "hex", "utf8");
      decrypted += decipher.final("utf8");
      return decrypted;
    }

    const decrypted = decryptData(encryptedData, key.toString("hex"), iv.toString("hex"));
    console.log("Decrypted Data (test):", decrypted);

  } catch (err) {
    console.error("Error occurred:", err);
  }
}

// Execute main function
main();
