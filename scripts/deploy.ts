import { ethers } from "hardhat";

async function main() {
  console.log("🚀 Deploying LearningBuddyManager...\n");

  const [deployer] = await ethers.getSigners();
  console.log("📝 Deploying with account:", deployer.address);
  console.log("💰 Account balance:", ethers.utils.formatEther(await deployer.getBalance()), "ETH\n");

  // Deploy the contract
  const LearningBuddyManager = await ethers.getContractFactory("LearningBuddyManager");
  console.log("⏳ Deploying contract...");
  
  const buddy = await LearningBuddyManager.deploy();
  await buddy.deployed();
  
  const contractAddress = buddy.address;
  console.log("✅ LearningBuddyManager deployed to:", contractAddress);
  
  // Verify deployment by creating a test buddy
  console.log("\n🧪 Testing contract deployment...");
  const tx = await buddy.createBuddy("TestBuddy");
  await tx.wait();
  
  const testBuddy = await buddy.getBuddy(0);
  console.log("🎉 Test buddy created:", {
    name: testBuddy.name,
    level: testBuddy.level.toString(),
    owner: testBuddy.owner
  });

  // Display contract info for frontend integration
  console.log("\n📋 Contract Information for Frontend:");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log(`Contract Address: ${contractAddress}`);
  console.log(`Network: ${(await ethers.provider.getNetwork()).name}`);
  console.log(`Chain ID: ${(await ethers.provider.getNetwork()).chainId}`);
  console.log(`Deployer: ${deployer.address}`);
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

  // Sample frontend integration code
  console.log("🔗 Frontend Integration Example:");
  console.log(`
// React/JavaScript Frontend Integration
const contractAddress = "${contractAddress}";
const contractABI = [...]; // Import from artifacts

// Connect to contract
const provider = new ethers.providers.Web3Provider(window.ethereum);
const signer = provider.getSigner();
const buddyContract = new ethers.Contract(contractAddress, contractABI, signer);

// Example interactions:
// 1. Create a buddy
await buddyContract.createBuddy("MyBuddy");

// 2. Complete a lesson (gain XP)
await buddyContract.completeLesson(0, 150);

// 3. Update streak
await buddyContract.updateStreak(0);

// 4. Claim a badge
await buddyContract.claimBadge(0, "First Lesson");

// 5. Get buddy details
const buddy = await buddyContract.getBuddy(0);
console.log("Buddy Level:", buddy.level.toString());
  `);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });