import { ethers } from "hardhat";
import fs from "fs";
import path from "path";

type ABIItem = {
  type: string;
  name?: string;
  inputs?: any[];
  outputs?: any[];
  stateMutability?: string;
};

async function extractABI() {
  console.log("📋 Extracting contract ABI for frontend integration...\n");

  // Compile contracts first
  console.log("🔨 Compiling contracts...");
  await run("compile");

  // Read the compiled artifact
  const artifactPath = path.join(__dirname, "../artifacts/contracts/LearningBuddyManager.sol/LearningBuddyManager.json");
  
  if (fs.existsSync(artifactPath)) {
    const artifact = JSON.parse(fs.readFileSync(artifactPath, "utf8"));
    
    // Extract ABI
    const contractABI = {
      contractName: "LearningBuddyManager",
      abi: artifact.abi,
      bytecode: artifact.bytecode,
      deployedBytecode: artifact.deployedBytecode
    };

    // Create frontend directory if it doesn't exist
    const frontendDir = path.join(__dirname, "../frontend-assets");
    if (!fs.existsSync(frontendDir)) {
      fs.mkdirSync(frontendDir, { recursive: true });
    }

    // Save ABI file for frontend
    const abiPath = path.join(frontendDir, "LearningBuddyManager.json");
    fs.writeFileSync(abiPath, JSON.stringify(contractABI, null, 2));

    console.log("✅ ABI extracted successfully!");
    console.log(`📁 Saved to: ${abiPath}`);
    console.log(`📝 Functions available: ${(artifact.abi as ABIItem[]).filter((item: ABIItem) => item.type === 'function').length}`);
    console.log(`📤 Events available: ${(artifact.abi as ABIItem[]).filter((item: ABIItem) => item.type === 'event').length}`);

    // Create a simple contract info file
    const contractInfo = {
      name: "LearningBuddyManager",
      description: "A smart contract for managing learning buddies and gamifying education",
      functions: {
        createBuddy: "Create a new learning buddy",
        completeLesson: "Award XP for completing lessons",
        updateStreak: "Update daily learning streak",
        claimBadge: "Claim achievement badges",
        getBuddy: "Get buddy details by ID",
        getBuddiesByOwner: "Get all buddies owned by an address"
      },
      events: {
        BuddyCreated: "Emitted when a new buddy is created",
        LessonCompleted: "Emitted when XP is awarded",
        BadgeClaimed: "Emitted when a badge is claimed",
        StreakUpdated: "Emitted when streak is updated"
      }
    };

    const infoPath = path.join(frontendDir, "contract-info.json");
    fs.writeFileSync(infoPath, JSON.stringify(contractInfo, null, 2));

    console.log(`📖 Contract info saved to: ${infoPath}\n`);

    // Display integration example
    console.log("🔗 Frontend Integration Example:");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log(`
import contractABI from './frontend-assets/LearningBuddyManager.json';

// In your React component:
const contract = new ethers.Contract(
  "CONTRACT_ADDRESS_HERE", 
  contractABI.abi, 
  signer
);

// Usage examples:
await contract.createBuddy("StudyBot");
await contract.completeLesson(0, 150);
await contract.updateStreak(0);
const buddy = await contract.getBuddy(0);
    `);
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  } else {
    console.log("❌ Contract artifact not found. Make sure the contract is compiled.");
  }
}

// Helper function since we can't import from hardhat in this context
async function run(taskName: string) {
  const hre = require("hardhat");
  await hre.run(taskName);
}

extractABI()
  .then(() => console.log("\n🎉 ABI extraction completed!"))
  .catch((error) => {
    console.error("❌ ABI extraction failed:", error);
    process.exit(1);
  });