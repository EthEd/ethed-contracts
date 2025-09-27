# 🌐 Frontend Integration Guide for LearningBuddyManager

## 🚀 Quick Deployment & Setup

### 1. Local Development Setup
```bash
# Terminal 1: Start local blockchain
pnpm hardhat node

# Terminal 2: Deploy contract (when Node.js memory issue is resolved)
pnpm hardhat run scripts/deploy.ts --network localhost

# Or use this simple deployment command:
pnpm hardhat run scripts/deploy-simple.js --network localhost
```

### 2. Testnet Deployment (Recommended)
```bash
# Set your environment variables
export SEPOLIA_PRIVATE_KEY="your_private_key_here"
export SEPOLIA_RPC_URL="https://sepolia.infura.io/v3/your_project_id"

# Deploy to Sepolia
pnpm hardhat run scripts/deploy.ts --network sepolia
```

## 📱 Frontend Integration Code

### React/Next.js Setup

#### Install Dependencies
```bash
npm install ethers @metamask/detect-provider
# or
yarn add ethers @metamask/detect-provider
```

#### Contract Integration Hook
```javascript
// hooks/useLearningBuddy.js
import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import LearningBuddyManagerABI from '../contracts/LearningBuddyManager.json';

const CONTRACT_ADDRESS = "0x..."; // Your deployed contract address
const SEPOLIA_CHAIN_ID = "0xaa36a7"; // 11155111 in hex

export const useLearningBuddy = () => {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState(null);
  const [loading, setLoading] = useState(false);

  // Connect to MetaMask
  const connectWallet = async () => {
    try {
      if (typeof window.ethereum !== 'undefined') {
        setLoading(true);
        
        // Request account access
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        
        // Switch to Sepolia testnet
        try {
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: SEPOLIA_CHAIN_ID }],
          });
        } catch (switchError) {
          // If Sepolia is not added, add it
          if (switchError.code === 4902) {
            await window.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [{
                chainId: SEPOLIA_CHAIN_ID,
                chainName: 'Sepolia Testnet',
                nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 },
                rpcUrls: ['https://sepolia.infura.io/v3/YOUR_PROJECT_ID'],
                blockExplorerUrls: ['https://sepolia.etherscan.io/'],
              }],
            });
          }
        }

        // Set up provider and signer
        const web3Provider = new ethers.BrowserProvider(window.ethereum);
        const web3Signer = await web3Provider.getSigner();
        const userAccount = await web3Signer.getAddress();

        // Initialize contract
        const buddyContract = new ethers.Contract(
          CONTRACT_ADDRESS,
          LearningBuddyManagerABI.abi,
          web3Signer
        );

        setProvider(web3Provider);
        setSigner(web3Signer);
        setContract(buddyContract);
        setAccount(userAccount);
        
        console.log('✅ Wallet connected:', userAccount);
      } else {
        alert('Please install MetaMask!');
      }
    } catch (error) {
      console.error('Connection failed:', error);
      alert('Failed to connect wallet: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Contract interaction methods
  const createBuddy = async (name) => {
    if (!contract) throw new Error('Contract not initialized');
    
    try {
      setLoading(true);
      const tx = await contract.createBuddy(name);
      const receipt = await tx.wait();
      
      console.log('✅ Buddy created:', receipt.hash);
      return receipt;
    } catch (error) {
      console.error('Failed to create buddy:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const completeLesson = async (buddyId, xpGained) => {
    if (!contract) throw new Error('Contract not initialized');
    
    try {
      setLoading(true);
      const tx = await contract.completeLesson(buddyId, xpGained);
      const receipt = await tx.wait();
      
      console.log('✅ Lesson completed:', receipt.hash);
      return receipt;
    } catch (error) {
      console.error('Failed to complete lesson:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateStreak = async (buddyId) => {
    if (!contract) throw new Error('Contract not initialized');
    
    try {
      setLoading(true);
      const tx = await contract.updateStreak(buddyId);
      const receipt = await tx.wait();
      
      console.log('✅ Streak updated:', receipt.hash);
      return receipt;
    } catch (error) {
      console.error('Failed to update streak:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const claimBadge = async (buddyId, badgeName) => {
    if (!contract) throw new Error('Contract not initialized');
    
    try {
      setLoading(true);
      const tx = await contract.claimBadge(buddyId, badgeName);
      const receipt = await tx.wait();
      
      console.log('✅ Badge claimed:', receipt.hash);
      return receipt;
    } catch (error) {
      console.error('Failed to claim badge:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const getBuddy = async (buddyId) => {
    if (!contract) throw new Error('Contract not initialized');
    
    try {
      const buddy = await contract.getBuddy(buddyId);
      return {
        id: buddy.id.toString(),
        name: buddy.name,
        level: buddy.level.toString(),
        xp: buddy.xp.toString(),
        streak: buddy.streak.toString(),
        badges: buddy.badges,
        lastActive: buddy.lastActive.toString(),
        owner: buddy.owner
      };
    } catch (error) {
      console.error('Failed to get buddy:', error);
      throw error;
    }
  };

  const getUserBuddies = async (userAddress = account) => {
    if (!contract) throw new Error('Contract not initialized');
    
    try {
      const buddyIds = await contract.getBuddiesByOwner(userAddress || account);
      const buddies = await Promise.all(
        buddyIds.map(id => getBuddy(id.toString()))
      );
      return buddies;
    } catch (error) {
      console.error('Failed to get user buddies:', error);
      throw error;
    }
  };

  return {
    // State
    provider,
    signer,
    contract,
    account,
    loading,
    
    // Methods
    connectWallet,
    createBuddy,
    completeLesson,
    updateStreak,
    claimBadge,
    getBuddy,
    getUserBuddies
  };
};
```

#### React Component Example
```javascript
// components/LearningBuddyDashboard.jsx
import React, { useState, useEffect } from 'react';
import { useLearningBuddy } from '../hooks/useLearningBuddy';

const LearningBuddyDashboard = () => {
  const {
    account,
    loading,
    connectWallet,
    createBuddy,
    completeLesson,
    updateStreak,
    claimBadge,
    getUserBuddies
  } = useLearningBuddy();

  const [buddies, setBuddies] = useState([]);
  const [newBuddyName, setNewBuddyName] = useState('');

  useEffect(() => {
    if (account) {
      loadBuddies();
    }
  }, [account]);

  const loadBuddies = async () => {
    try {
      const userBuddies = await getUserBuddies();
      setBuddies(userBuddies);
    } catch (error) {
      console.error('Failed to load buddies:', error);
    }
  };

  const handleCreateBuddy = async (e) => {
    e.preventDefault();
    if (!newBuddyName.trim()) return;

    try {
      await createBuddy(newBuddyName);
      setNewBuddyName('');
      await loadBuddies(); // Refresh the list
    } catch (error) {
      alert('Failed to create buddy: ' + error.message);
    }
  };

  const handleCompleteLesson = async (buddyId) => {
    try {
      await completeLesson(buddyId, 100); // Award 100 XP
      await loadBuddies(); // Refresh to show updated stats
    } catch (error) {
      alert('Failed to complete lesson: ' + error.message);
    }
  };

  const handleUpdateStreak = async (buddyId) => {
    try {
      await updateStreak(buddyId);
      await loadBuddies(); // Refresh to show updated streak
    } catch (error) {
      alert('Failed to update streak: ' + error.message);
    }
  };

  const handleClaimBadge = async (buddyId, badgeName) => {
    try {
      await claimBadge(buddyId, badgeName);
      await loadBuddies(); // Refresh to show new badge
    } catch (error) {
      alert('Failed to claim badge: ' + error.message);
    }
  };

  if (!account) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-500 to-purple-600">
        <div className="bg-white p-8 rounded-lg shadow-2xl text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            🎓 Learning Buddy Manager
          </h1>
          <p className="text-gray-600 mb-6">
            Connect your wallet to start your learning journey!
          </p>
          <button
            onClick={connectWallet}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-3 px-6 rounded-lg transition-colors"
          >
            {loading ? 'Connecting...' : 'Connect Wallet'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            🎓 Learning Buddy Dashboard
          </h1>
          <p className="text-gray-600">
            Connected: {account.slice(0, 6)}...{account.slice(-4)}
          </p>
        </div>

        {/* Create New Buddy */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            🐣 Create New Learning Buddy
          </h2>
          <form onSubmit={handleCreateBuddy} className="flex gap-4">
            <input
              type="text"
              value={newBuddyName}
              onChange={(e) => setNewBuddyName(e.target.value)}
              placeholder="Enter buddy name (e.g., StudyBot, MathPal)"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              disabled={loading || !newBuddyName.trim()}
              className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-bold py-2 px-6 rounded-lg transition-colors"
            >
              {loading ? 'Creating...' : 'Create Buddy'}
            </button>
          </form>
        </div>

        {/* Buddies List */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {buddies.map((buddy, index) => (
            <div key={buddy.id} className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-800">{buddy.name}</h3>
                <span className="bg-blue-100 text-blue-800 text-sm font-semibold px-2 py-1 rounded">
                  Level {buddy.level}
                </span>
              </div>
              
              <div className="space-y-2 mb-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">XP:</span>
                  <span className="font-semibold">{buddy.xp}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Streak:</span>
                  <span className="font-semibold">🔥 {buddy.streak} days</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Badges:</span>
                  <span className="font-semibold">🏆 {buddy.badges.length}</span>
                </div>
              </div>

              <div className="space-y-2">
                <button
                  onClick={() => handleCompleteLesson(buddy.id)}
                  disabled={loading}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-2 px-4 rounded transition-colors"
                >
                  Complete Lesson (+100 XP)
                </button>
                
                <button
                  onClick={() => handleUpdateStreak(buddy.id)}
                  disabled={loading}
                  className="w-full bg-orange-600 hover:bg-orange-700 disabled:bg-gray-400 text-white font-bold py-2 px-4 rounded transition-colors"
                >
                  Daily Check-in
                </button>
                
                <button
                  onClick={() => handleClaimBadge(buddy.id, 'Achievement Unlocked')}
                  disabled={loading}
                  className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white font-bold py-2 px-4 rounded transition-colors"
                >
                  Claim Badge
                </button>
              </div>

              {buddy.badges.length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">Badges:</h4>
                  <div className="flex flex-wrap gap-1">
                    {buddy.badges.map((badge, i) => (
                      <span
                        key={i}
                        className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded"
                      >
                        {badge}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {buddies.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              No learning buddies yet. Create your first one above! 🚀
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LearningBuddyDashboard;
```

## 🔗 Additional Integration Features

### ENS Subdomain Integration (Future)
```javascript
// utils/ensIntegration.js
export const registerENSSubdomain = async (buddyName, ownerAddress) => {
  // Register {buddyName}.ethed.eth subdomain
  // This would integrate with ENS contracts
};

export const resolveBuddyENS = async (ensName) => {
  // Resolve ethed.eth subdomains to buddy contracts
};
```

### Polygon ID Integration (Future)
```javascript
// utils/polygonIdIntegration.js
export const verifyEducationalCredentials = async (userDID) => {
  // Verify educational certificates via Polygon ID
};

export const issueCompletionCredential = async (buddyId, achievement) => {
  // Issue verifiable credentials for achievements
};
```

## 🎯 Next Steps

1. **Deploy Contract**: Resolve Node.js memory issues and deploy to testnet
2. **Frontend Setup**: Create React/Next.js app with the provided code
3. **Wallet Integration**: Test MetaMask connection and transactions
4. **UI Enhancement**: Add animations, better styling, error handling
5. **Advanced Features**: ENS subdomains, Polygon ID, NFT badges

## 📱 Testing Checklist

- [ ] Connect MetaMask wallet
- [ ] Switch to correct network (Sepolia/Polygon)
- [ ] Create learning buddy
- [ ] Complete lessons and gain XP
- [ ] Update daily streaks
- [ ] Claim achievement badges
- [ ] View buddy progress over time