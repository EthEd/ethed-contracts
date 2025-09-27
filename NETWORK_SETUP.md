# 🔧 MetaMask Network Setup for LearningBuddy Demo

## ❌ Current Issue
You're connected to **Ethereum Mainnet** (Chain ID: 1), but the contract is deployed on **Hardhat Local** (Chain ID: 31337).

## 🎯 Quick Fix

### Option 1: Auto-Switch (Recommended)
1. **Refresh the demo page**
2. **Click "Connect MetaMask"** again
3. **The demo will automatically prompt you** to switch/add the Hardhat network
4. **Click "Switch Network"** or **"Add Network"** when MetaMask asks

### Option 2: Manual Setup
If auto-switch doesn't work, add the network manually:

1. **Open MetaMask**
2. **Click the network dropdown** (currently showing "Ethereum Mainnet")
3. **Click "Add Network"** or "Add a network manually"
4. **Enter these details**:
   ```
   Network Name: Hardhat Local
   New RPC URL: http://127.0.0.1:8545
   Chain ID: 31337
   Currency Symbol: ETH
   Block Explorer URL: (leave blank)
   ```
5. **Click "Save"**
6. **Switch to the new "Hardhat Local" network**

### Option 3: Import Test Account
For testing with pre-funded account:

1. **In MetaMask, click the account circle**
2. **Select "Import Account"**
3. **Paste this private key**:
   ```
   0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
   ```
4. **This account has 10,000 ETH** for testing

## ✅ Verification
Once connected to Hardhat Local network, you should see:
- **Network**: "✅ Hardhat Local (31337)" 
- **Contract functions working** without "call revert" errors
- **Ability to create buddies, complete lessons, etc.**

## 🚨 Important Notes
- **Never use the test private key on real networks** - it's public knowledge
- **The local network resets** when you restart `npx hardhat node`
- **Make sure the Hardhat node is running** before connecting

## 📞 Still Having Issues?
1. **Check the console** for detailed error messages
2. **Make sure** `npx hardhat node` is running in terminal
3. **Verify** the contract address matches in both demo and deployment
4. **Try refreshing** the browser page

Your contract is deployed and ready at: `0x5FbDB2315678afecb367f032d93F642f64180aa3` 🎉