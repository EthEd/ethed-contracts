# 🎓 EthEd Contracts - Blockchain-Powered Education

A smart contract ecosystem that gamifies learning through blockchain technology, making education more engaging, transparent, and student-owned.

## 🚀 Project Overview

This project features the **LearningBuddyManager** smart contract - a revolutionary approach to educational gamification using Ethereum blockchain technology. Students can create virtual "learning buddies" that track their progress, achievements, and streaks in an immutable, decentralized manner.

### Key Features:
- **Gamified Learning**: Transform education into an engaging game-like experience
- **Digital Companions**: Virtual buddies that grow with student progress  
- **Blockchain Transparency**: Immutable records of educational achievements
- **Multi-Buddy System**: Students can create multiple buddies for different subjects
- **Achievement System**: XP, levels, streaks, and collectible badges

# 🎮 LearningBuddyManager Smart Contract

## 🏗️ Core Architecture

### Data Structure - LearningBuddy
```solidity
struct LearningBuddy {
    uint256 id;           // Unique identifier
    string name;          // Custom name (e.g., "Pixel", "Nova")
    uint256 level;        // Current level (starts at 1)
    uint256 xp;           // Experience points earned
    uint256 streak;       // Consecutive days of activity
    string[] badges;      // Collection of achievements
    uint256 lastActive;   // Timestamp of last interaction
    address owner;        // Ethereum address of the student
}
```

### Storage Mappings
- `mapping(uint256 => LearningBuddy) public buddies` - Stores all buddy data by ID
- `mapping(address => uint256[]) public ownerToBuddies` - Links users to their buddies
- `uint256 private nextBuddyId` - Auto-incrementing ID counter

## 🎯 Core Features

### 1. 🐣 Buddy Creation
```solidity
function createBuddy(string calldata name) external
```
- Students can create multiple learning buddies
- Each buddy starts at level 1 with 0 XP
- Automatically assigns ownership to the creator
- Emits `BuddyCreated` event for tracking

### 2. ⚡ XP & Leveling System
```solidity
function completeLesson(uint256 buddyId, uint256 xpGained) external onlyOwner(buddyId)
```
- **XP Calculation**: Every 100 XP = +1 level
- **Progressive Leveling**: Level increases based on total XP accumulated
- **Ownership Protection**: Only the buddy's owner can award XP
- **Event Tracking**: Emits lesson completion data

**Level Progression Example:**
- 0-99 XP → Level 1
- 100-199 XP → Level 2  
- 200-299 XP → Level 3
- And so on...

### 3. 🔥 Streak System
```solidity
function updateStreak(uint256 buddyId) external onlyOwner(buddyId)
```
- **Daily Engagement**: Tracks consecutive days of activity
- **Streak Logic**: 
  - If last activity ≤ 1 day ago → increment streak
  - If gap > 1 day → reset to 1
- **Timestamp Tracking**: Updates `lastActive` on each interaction

### 4. 🏆 Achievement Badges
```solidity
function claimBadge(uint256 buddyId, string calldata badge) external onlyOwner(buddyId)
```
- **String-based Achievements**: "First Lesson", "Week Warrior", etc.
- **Expandable System**: Could evolve into NFT badges
- **Permanent Collection**: Badges accumulate in an array

## 🔒 Security Features

### Access Control
```solidity
modifier onlyOwner(uint256 buddyId) {
    require(buddies[buddyId].owner == msg.sender, "Not your buddy");
    _;
}
```
- Prevents users from modifying other people's buddies
- Applied to all state-changing functions
- Ensures data integrity and privacy

## 📊 View Functions

### Individual Buddy Data
```solidity
function getBuddy(uint256 buddyId) external view returns (LearningBuddy memory)
```
Returns complete buddy information including progress stats.

### User's Buddy Collection
```solidity
function getBuddiesByOwner(address user) external view returns (uint256[] memory)
```
Lists all buddy IDs owned by a specific user.

## 🎯 Educational Use Cases

### For Students:
- **Gamification**: Turn learning into a game-like experience
- **Progress Tracking**: Visual representation of educational achievements
- **Motivation**: Streaks and levels encourage consistent study habits
- **Personalization**: Multiple buddies for different subjects/goals

### For Educators:
- **Engagement Analytics**: Track student participation through events
- **Reward Systems**: Award XP for completed assignments/assessments
- **Achievement Recognition**: Create custom badges for milestones
- **Decentralized Records**: Immutable proof of educational progress

## 🚀 Technical Benefits

### Blockchain Advantages:
- **Transparency**: All progress is publicly verifiable
- **Permanence**: Educational achievements can't be lost or falsified
- **Interoperability**: Buddies could work across different educational platforms
- **Ownership**: Students truly own their educational progress data

### Gas Efficiency:
- **Efficient Storage**: Structs pack data efficiently
- **Event-Based**: Important actions emit events for off-chain indexing
- **View Functions**: Reading data doesn't cost gas

## 📈 Future Expansion Possibilities

1. **NFT Integration**: Convert buddies and badges to tradeable NFTs
2. **Multi-School Networks**: Connect buddies across institutions  
3. **Advanced Mechanics**: Buddy battles, collaborative projects, marketplace
4. **Integration APIs**: Connect with existing Learning Management Systems
5. **Token Economics**: Introduce ERC-20 tokens for rewards and governance

---

## 🛠️ Development Setup

### Prerequisites
- Node.js 22.x+ (recommended for Hardhat 3.x compatibility)
- pnpm package manager

### Installation
```shell
# Clone the repository
git clone https://github.com/EthEd/ethed-contracts.git
cd ethed-contracts

# Install dependencies
pnpm install
```

### Running Tests
The project includes comprehensive TypeScript tests using Hardhat and ethers.js:

```shell
# Run all tests
pnpm hardhat test

# Run tests with gas reporting
pnpm hardhat test --gas-report
```

**Test Coverage:**
- ✅ Buddy creation and ownership
- ✅ XP system and level progression  
- ✅ Streak tracking and time logic
- ✅ Badge collection system
- ✅ Multi-buddy support per user
- ✅ Access control and security

### Compilation
```shell
# Compile smart contracts
pnpm hardhat compile
```

### Deployment

#### Local Development
```shell
# Start local Hardhat node
pnpm hardhat node

# Deploy to local network
pnpm hardhat ignition deploy ignition/modules/LearningBuddyManager.ts --network localhost
```

#### Sepolia Testnet
Set up your environment variables:
```shell
# Set private key using hardhat-keystore
npx hardhat keystore set SEPOLIA_PRIVATE_KEY

# Or use environment variable
export SEPOLIA_PRIVATE_KEY="your_private_key_here"
export SEPOLIA_RPC_URL="https://sepolia.infura.io/v3/your_project_id"
```

Deploy to Sepolia:
```shell
pnpm hardhat ignition deploy ignition/modules/LearningBuddyManager.ts --network sepolia
```

#### Polygon Networks
The project is optimized for Polygon with gas-efficient deployment:

**Polygon Mainnet:**
```shell
# Set environment variables
export POLYGON_PRIVATE_KEY="your_private_key_here"
export POLYGON_RPC_URL="https://polygon-rpc.com/"

# Deploy to Polygon
pnpm hardhat ignition deploy ignition/modules/LearningBuddyManager.ts --network polygon
```

**Mumbai Testnet (Polygon Testnet):**
```shell
# Set environment variables  
export MUMBAI_PRIVATE_KEY="your_private_key_here"
export MUMBAI_RPC_URL="https://rpc-mumbai.maticvigil.com/"

# Deploy to Mumbai
pnpm hardhat ignition deploy ignition/modules/LearningBuddyManager.ts --network mumbai
```

### ⚡ Gas Optimization
The project uses Solidity optimizer with 200 runs for optimal gas efficiency:
- **Deployment Cost**: ~832K gas (reduced from ~1.37M without optimizer)
- **Function Costs**:
  - `createBuddy`: ~167K gas
  - `completeLesson`: ~54K gas  
  - `updateStreak`: ~44K gas
  - `claimBadge`: ~71K gas

## 📋 Contract Interaction Examples

### Creating a Learning Buddy
```javascript
const buddyManager = await ethers.getContractAt("LearningBuddyManager", contractAddress);

// Create a new buddy named "StudyBot"
await buddyManager.createBuddy("StudyBot");

// Get buddy details
const buddy = await buddyManager.getBuddy(0);
console.log(`Buddy: ${buddy.name}, Level: ${buddy.level}, XP: ${buddy.xp}`);
```

### Completing Lessons and Gaining XP
```javascript
// Award 150 XP for completing a lesson
await buddyManager.completeLesson(0, 150);

// Check new level (should be level 2 if starting from 0 XP)
const updatedBuddy = await buddyManager.getBuddy(0);
console.log(`New Level: ${updatedBuddy.level}, Total XP: ${updatedBuddy.xp}`);
```

### Managing Streaks
```javascript
// Update daily streak
await buddyManager.updateStreak(0);

// Check streak count
const buddy = await buddyManager.getBuddy(0);
console.log(`Current Streak: ${buddy.streak} days`);
```

### Claiming Achievements
```javascript
// Claim a badge for completing first lesson
await buddyManager.claimBadge(0, "First Lesson Complete");

// View all badges
const buddy = await buddyManager.getBuddy(0);
console.log(`Badges: ${buddy.badges.join(", ")}`);
```

## 🧪 Testing Strategy

The test suite covers all major functionality:

1. **Unit Tests**: Individual function testing
2. **Integration Tests**: End-to-end user workflows  
3. **Security Tests**: Access control and edge cases
4. **Gas Optimization**: Monitoring transaction costs

## 📚 Additional Resources

- [Hardhat Documentation](https://hardhat.org/docs)
- [Ethers.js Documentation](https://docs.ethers.io/)
- [Solidity Documentation](https://docs.soliditylang.org/)
- [OpenZeppelin Contracts](https://openzeppelin.com/contracts/)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**Built with ❤️ for the future of education on blockchain** 🎓⛓️
