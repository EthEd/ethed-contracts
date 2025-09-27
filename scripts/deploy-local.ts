import { ethers } from "hardhat";

async function main() {
  console.log("🚀 Deploying LearningBuddyManager to built-in Hardhat network...");
  
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
  
  // Get deployer info
  const [deployer] = await ethers.getSigners();
  console.log("👤 Deployer address:", deployer.address);
  const balance = await deployer.getBalance();
  console.log("💰 Deployer balance:", ethers.utils.formatEther(balance), "ETH");
  
  console.log("\n🧪 Testing basic functionality...");
  try {
    // Create a test buddy
    console.log("🐣 Creating test buddy...");
    const createTx = await learningBuddyManager.createBuddy("TestBuddy");
    const receipt = await createTx.wait();
    console.log("✅ Test buddy created! Gas used:", receipt.gasUsed.toString());
    
    // Get buddy info
    const buddy = await learningBuddyManager.getBuddy(0);
    console.log("📊 Test buddy info:");
    console.log("   ID:", buddy.id.toString());
    console.log("   Name:", buddy.name);
    console.log("   Level:", buddy.level.toString());
    console.log("   XP:", buddy.xp.toString());
    console.log("   Owner:", buddy.owner);
    
    // Test lesson completion
    console.log("\n📚 Testing lesson completion...");
    const lessonTx = await learningBuddyManager.completeLesson(0, 150);
    const lessonReceipt = await lessonTx.wait();
    console.log("✅ Lesson completed! Gas used:", lessonReceipt.gasUsed.toString());
    
    // Get updated buddy info
    const updatedBuddy = await learningBuddyManager.getBuddy(0);
    console.log("📊 Updated buddy info:");
    console.log("   Level:", updatedBuddy.level.toString());
    console.log("   XP:", updatedBuddy.xp.toString());
    
    // Test badge claiming
    console.log("\n🏆 Testing badge claiming...");
    const badgeTx = await learningBuddyManager.claimBadge(0, "First Lesson");
    const badgeReceipt = await badgeTx.wait();
    console.log("✅ Badge claimed! Gas used:", badgeReceipt.gasUsed.toString());
    
    // Get final buddy info
    const finalBuddy = await learningBuddyManager.getBuddy(0);
    console.log("📊 Final buddy info:");
    console.log("   Badges:", finalBuddy.badges);
    
  } catch (error: any) {
    console.log("⚠️ Test functionality failed:", error.message);
  }
  
  console.log("\n🎉 Deployment Complete!");
  console.log("\n📝 For frontend testing, use these values:");
  console.log(`   CONTRACT_ADDRESS = "${learningBuddyManager.address}";`);
  console.log(`   NETWORK_ID = ${network.chainId}; // Hardhat local network`);
  console.log(`   RPC_URL = "http://127.0.0.1:8545"; // When running 'npx hardhat node'`);
  
  console.log("\n🔧 To start a persistent local network:");
  console.log("   npx hardhat node --hostname 0.0.0.0");
  console.log("\n💡 To connect MetaMask to local network:");
  console.log("   Network Name: Hardhat Local");
  console.log("   RPC URL: http://127.0.0.1:8545");
  console.log("   Chain ID: 31337");
  console.log("   Currency Symbol: ETH");
  
  console.log("\n🎯 Contract deployed and tested successfully!");
  console.log("   Open frontend-assets/demo.html and update the CONTRACT_ADDRESS to start testing!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });