const { ethers } = require("hardhat");

async function main() {
  console.log("🚀 Deploying LearningBuddyManager...");
  
  // Get the contract factory
  const LearningBuddyManager = await ethers.getContractFactory("LearningBuddyManager");
  
  // Deploy the contract
  console.log("📦 Deploying contract...");
  const learningBuddyManager = await LearningBuddyManager.deploy();
  
  console.log("⏳ Waiting for deployment confirmation...");
  await learningBuddyManager.deployed();
  
  console.log("✅ LearningBuddyManager deployed!");
  console.log("📍 Contract address:", learningBuddyManager.address);
  console.log("🔗 Transaction hash:", learningBuddyManager.deployTransaction.hash);
  console.log("⛽ Gas used:", learningBuddyManager.deployTransaction.gasLimit?.toString());
  
  // Get network info
  const network = await ethers.provider.getNetwork();
  console.log("🌐 Network:", network.name, "(" + network.chainId + ")");
  
  // Wait a bit for block confirmations before verification
  console.log("⏳ Waiting for block confirmations...");
  await learningBuddyManager.deployTransaction.wait(5);
  
  console.log("\n🎉 Deployment Complete!");
  console.log("📝 Add this address to your frontend:");
  console.log(`   CONTRACT_ADDRESS = "${learningBuddyManager.address}";`);
  console.log("\n🔍 Verify on Etherscan:");
  console.log(`   https://sepolia.etherscan.io/address/${learningBuddyManager.address}`);
  
  // Test basic functionality
  console.log("\n🧪 Testing basic functionality...");
  try {
    const [deployer] = await ethers.getSigners();
    console.log("👤 Deployer address:", deployer.address);
    
    // Create a test buddy
    console.log("🐣 Creating test buddy...");
    const createTx = await learningBuddyManager.createBuddy("TestBuddy");
    await createTx.wait();
    console.log("✅ Test buddy created!");
    
    // Get buddy info
    const buddy = await learningBuddyManager.getBuddy(0);
    console.log("📊 Test buddy info:");
    console.log("   Name:", buddy.name);
    console.log("   Level:", buddy.level.toString());
    console.log("   XP:", buddy.xp.toString());
    
  } catch (error: any) {
    console.log("⚠️ Test functionality failed:", error.message);
  }
  
  console.log("\n🎯 Ready to use! Open demo.html and update the CONTRACT_ADDRESS");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });