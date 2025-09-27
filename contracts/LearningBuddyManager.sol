// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract LearningBuddyManager {
    uint256 private nextBuddyId;

    struct LearningBuddy {
        uint256 id;
        string name;
        uint256 level;
        uint256 xp;
        uint256 streak;
        string[] badges;
        uint256 lastActive;
        address owner;
    }

    mapping(uint256 => LearningBuddy) public buddies;
    mapping(address => uint256[]) public ownerToBuddies;

    event BuddyCreated(uint256 buddyId, address owner, string name);
    event LessonCompleted(uint256 buddyId, uint256 xpGained, uint256 newXp, uint256 newLevel);
    event BadgeClaimed(uint256 buddyId, string badge);
    event StreakUpdated(uint256 buddyId, uint256 newStreak);

    modifier onlyOwner(uint256 buddyId) {
        require(buddies[buddyId].owner == msg.sender, "Not your buddy");
        _;
    }

    // Create a new buddy
    function createBuddy(string calldata name) external {
        uint256 buddyId = nextBuddyId++;
        LearningBuddy storage buddy = buddies[buddyId];

        buddy.id = buddyId;
        buddy.name = name;
        buddy.level = 1;
        buddy.xp = 0;
        buddy.streak = 0;
        buddy.lastActive = block.timestamp;
        buddy.owner = msg.sender;

        ownerToBuddies[msg.sender].push(buddyId);

        emit BuddyCreated(buddyId, msg.sender, name);
    }

    // Complete a lesson -> gain XP
    function completeLesson(uint256 buddyId, uint256 xpGained) external onlyOwner(buddyId) {
        LearningBuddy storage buddy = buddies[buddyId];

        buddy.xp += xpGained;
        uint256 newLevel = buddy.level + (buddy.xp / 100); // Every 100 XP = +1 level
        if (newLevel > buddy.level) {
            buddy.level = newLevel;
        }

        emit LessonCompleted(buddyId, xpGained, buddy.xp, buddy.level);
    }

    // Update streak (daily login simulation)
    function updateStreak(uint256 buddyId) external onlyOwner(buddyId) {
        LearningBuddy storage buddy = buddies[buddyId];

        if (block.timestamp - buddy.lastActive <= 1 days) {
            buddy.streak += 1;
        } else {
            buddy.streak = 1; // reset streak if gap > 1 day
        }

        buddy.lastActive = block.timestamp;

        emit StreakUpdated(buddyId, buddy.streak);
    }

    // Claim a badge (string-based for now, could be NFT later)
    function claimBadge(uint256 buddyId, string calldata badge) external onlyOwner(buddyId) {
        LearningBuddy storage buddy = buddies[buddyId];
        buddy.badges.push(badge);

        emit BadgeClaimed(buddyId, badge);
    }

    // Get all buddy IDs for a user
    function getBuddiesByOwner(address user) external view returns (uint256[] memory) {
        return ownerToBuddies[user];
    }

    // Get full buddy details
    function getBuddy(uint256 buddyId) external view returns (LearningBuddy memory) {
        return buddies[buddyId];
    }
}
