# 🚀 LearningBuddy Frontend Demo Setup

## ✅ Current Status
- **Contract Deployed**: `0x5FbDB2315678afecb367f032d93F642f64180aa3`
- **Network**: Hardhat Local (Chain ID: 31337)  
- **Demo File**: `frontend-assets/demo.html`
- **Tests**: All 6/6 passing ✅
- **Gas Optimization**: Enabled (39% cost reduction)

## 🎯 Quick Start Guide

### 1. Start Local Blockchain
```bash
# In terminal 1 (keep this running)
npx hardhat node
```

This will start a local blockchain at `http://127.0.0.1:8545` with test accounts.

### 2. Deploy Contract
```bash
# In terminal 2
npx hardhat run scripts/deploy-local.ts
```

This will deploy the contract and show you the address to use.

### 3. Setup MetaMask
1. **Add Network**:
   - Network Name: `Hardhat Local`
   - RPC URL: `http://127.0.0.1:8545`
   - Chain ID: `31337`
   - Currency Symbol: `ETH`

2. **Import Test Account**:
   - Private Key: `0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80`
   - This gives you 10,000 ETH for testing

### 4. Open Demo
1. Open `frontend-assets/demo.html` in your browser
2. Click "Connect MetaMask"
3. Switch to the Hardhat Local network
4. Start creating and interacting with your Learning Buddies!

## 🔧 Troubleshooting

### If Contract Connection Fails:
1. Make sure `npx hardhat node` is running
2. Check that MetaMask is connected to the right network (31337)
3. Verify the contract address in `demo.html` matches the deployed address

### If Transactions Fail:
1. Check you have test ETH in your account
2. Try refreshing the page and reconnecting MetaMask
3. Make sure you're on the correct network

### If MetaMask Doesn't Connect:
1. Make sure MetaMask is installed
2. Try refreshing the browser page
3. Check that the network is added correctly

## 🎮 Demo Features

The demo includes:
- **👤 Wallet Connection**: Connect/disconnect MetaMask
- **🐣 Create Learning Buddies**: Name your AI study companions
- **📚 Complete Lessons**: Gain XP and level up (100 XP per lesson)
- **🔥 Daily Check-ins**: Maintain learning streaks
- **🏆 Collect Badges**: Earn achievements for milestones
- **📊 Real-time Stats**: See levels, XP, streaks, and badges
- **💰 Gas Tracking**: Monitor transaction costs

## 📱 Contract Functions

### Main Functions:
- `createBuddy(name)` - Create a new learning buddy
- `completeLesson(buddyId, xp)` - Complete a lesson and gain XP
- `updateStreak(buddyId)` - Update daily learning streak
- `claimBadge(buddyId, badge)` - Claim achievement badges
- `getBuddy(buddyId)` - Get buddy details
- `getBuddiesByOwner(address)` - Get all buddies for an address

### Gas Costs (Optimized):
- Deploy Contract: ~832K gas
- Create Buddy: ~166K gas  
- Complete Lesson: ~53K gas
- Claim Badge: ~71K gas
- Update Streak: ~28K gas

## 🌐 Production Deployment

For testnet/mainnet deployment:

1. **Get Test ETH**:
   - Sepolia: https://sepoliafaucet.com/
   - Mumbai: https://faucet.polygon.technology/

2. **Set Environment Variables**:
   ```bash
   SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_KEY
   SEPOLIA_PRIVATE_KEY=your_private_key_here
   ```

3. **Deploy to Testnet**:
   ```bash
   npx hardhat run scripts/deploy-testnet.ts --network sepolia
   ```

## 📋 Architecture

```
📁 ethed-contracts/
├── 📄 contracts/LearningBuddyManager.sol (Smart Contract)
├── 📄 test/LearningBuddyManager.ts (Tests - 6/6 passing)
├── 📄 scripts/deploy-local.ts (Local deployment)
├── 📄 hardhat.config.ts (Config with optimizer)
└── 📁 frontend-assets/
    ├── 📄 demo.html (Interactive demo)
    ├── 📄 LearningBuddyManager.json (Contract ABI)
    └── 📄 FRONTEND_INTEGRATION.md (Developer guide)
```

## 🎓 Next Steps

1. **Try the Demo**: Test all contract features through the web interface
2. **Build Your Frontend**: Use the provided React examples in `FRONTEND_INTEGRATION.md`
3. **Add Features**: Implement lesson content, progress tracking, social features
4. **Deploy Live**: Move to Polygon mainnet for production use

## 💡 Pro Tips

- **Gas Optimization**: Contract uses 200-run optimization for balanced costs
- **Event Listening**: Subscribe to contract events for real-time updates  
- **Error Handling**: Demo includes comprehensive error handling
- **Mobile Ready**: Demo is responsive and works on mobile browsers
- **Extensible**: Easy to add new buddy types, badge categories, etc.

## 📞 Support

If you run into issues:
1. Check the Activity Log in the demo for detailed error messages
2. Verify all environment setup steps above
3. Make sure Node.js version is compatible (recommend 18.x or 22.x)
4. Try restarting the local node if connections fail

Happy learning! 🎓✨