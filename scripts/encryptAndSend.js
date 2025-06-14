// === encryptAndSend.js ===

import crypto from "crypto";
import { ethers } from "ethers";
import dotenv from "dotenv";
dotenv.config();

// 1. Data to encrypt
const sessionId = "property123-channel";
const bidderId = "user_4a1c56e2";

const data = JSON.stringify({
		"id": 50,
		"bid_id": 87,
		"user_id": 430,
		"user_type": "B",
		"property_id": "946148a5-aab6-47fe-a520-10d3a414f8ae",
		"base_price": "12000000.00",
		"bid_increase_amount": "25000.00",
		"bid_price": "12075000.00",
		"bid_rank": 1,
		"device_id": "eqe",
		"createdAt": "2025-05-06T09:47:18.624Z",
		"updatedAt": "2025-05-06T10:14:55.978Z"
});

// 2. Generate AES-256 key and IV
const key = crypto.randomBytes(32); // Must be stored securely off-chain for 20 days
const iv = crypto.randomBytes(16);

// 3. Encrypt the data
function encryptData(data, key, iv) {
  const cipher = crypto.createCipheriv("aes-256-cbc", key, iv);
  let encrypted = cipher.update(data, "utf8", "hex");
  encrypted += cipher.final("hex");
  return encrypted;
}

const encryptedData = encryptData(data, key, iv);

console.log("Encrypted Data:", encryptedData);
console.log("IV:", iv.toString("hex"));
console.log("Secret Key (store securely for 20 days):", key.toString("hex"));

// 4. ABI (Updated to match latest contract)
const abi = [
  {
    "inputs": [
      { "internalType": "string", "name": "sessionId", "type": "string" },
      { "internalType": "string", "name": "bidderId", "type": "string" },
      { "internalType": "string", "name": "encryptedData", "type": "string" },
      { "internalType": "string", "name": "iv", "type": "string" }
    ],
    "name": "submitBid",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "string", "name": "sessionId", "type": "string" },
      { "internalType": "string", "name": "bidderId", "type": "string" }
    ],
    "name": "getBid",
    "outputs": [
      {
        "components": [
          { "internalType": "string", "name": "encryptedData", "type": "string" },
          { "internalType": "string", "name": "iv", "type": "string" }
        ],
        "internalType": "struct EncryptedBidContract.EncryptedBid",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];

// 5. Connect to contract
const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
const signer = new ethers.Wallet(process.env.PK, provider);
const contract = new ethers.Contract(process.env.CONTRACT_ADDRESS, abi, signer);

// 6. Submit the encrypted bid to blockchain
// (async () => {
//   try {
//     const tx = await contract.submitBid(
//       sessionId,
//       bidderId,
//       encryptedData,
//       iv.toString("hex")
//     );
//     await tx.wait();
//     console.log("✅ Bid submitted successfully:", tx.hash);
//   } catch (err) {
//     console.error("❌ Error submitting bid:", err);
//   }
// })();

// 7. Decryption utility (for testing off-chain decryption)
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

// Uncomment to test decryption
const originalData = decryptData(encryptedData, key.toString("hex"), iv.toString("hex"));
console.log("🔓 Decrypted Original Data:", originalData);
