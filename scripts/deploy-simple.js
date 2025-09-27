// Simple deployment script for LearningBuddyManager
const hre = require("hardhat");

async function main() {
  console.log("🚀 Deploying LearningBuddyManager...");

  // Get the ContractFactory and Signers
  const [deployer] = await hre.ethers.getSigners();
  
  console.log("Deploying contracts with the account:", deployer.address);
  console.log("Account balance:", hre.ethers.formatEther(await hre.ethers.provider.getBalance(deployer.address)));

  // Deploy contract
  const LearningBuddyManager = await hre.ethers.getContractFactory("LearningBuddyManager");
  const buddy = await LearningBuddyManager.deploy();
  
  await buddy.waitForDeployment();
  const contractAddress = await buddy.getAddress();
  
  console.log("✅ LearningBuddyManager deployed to:", contractAddress);

  // Test the contract
  console.log("🧪 Testing deployment...");
  const tx = await buddy.createBuddy("TestBuddy");
  await tx.wait();
  
  const testBuddy = await buddy.getBuddy(0);
  console.log("Test buddy created:", testBuddy.name, "Level:", testBuddy.level.toString());

  console.log("\n📋 Frontend Integration Info:");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("Contract Address:", contractAddress);
  console.log("Network: localhost:8545");
  console.log("Chain ID: 31337");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });