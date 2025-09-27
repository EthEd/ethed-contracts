import { expect } from "chai";
import { ethers } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

describe("LearningBuddyManager", function () {
  let LearningBuddyManager: any;
  let manager: any;
  let owner: SignerWithAddress;
  let user1: SignerWithAddress;

  beforeEach(async () => {
    [owner, user1] = await ethers.getSigners();
    LearningBuddyManager = await ethers.getContractFactory("LearningBuddyManager");
    manager = await LearningBuddyManager.deploy();
    await manager.deployed();
  });

  it("should create a buddy", async function () {
    await manager.createBuddy("Pixel");
    const buddy = await manager.getBuddy(0);
    
    expect(buddy.name).to.equal("Pixel");
    expect(buddy.level.toNumber()).to.equal(1);
    expect(buddy.owner).to.equal(owner.address);
  });

  it("should add XP and level up", async function () {
    await manager.createBuddy("Pixel");
    await manager.completeLesson(0, 250); // +250 XP
    const buddy = await manager.getBuddy(0);
    
    expect(buddy.xp.toNumber()).to.equal(250);
    expect(buddy.level.toNumber()).to.equal(3); // level (1 + 250/100)
  });

  it("should track streaks", async function () {
    await manager.createBuddy("Pixel");

    await manager.updateStreak(0);
    let buddy = await manager.getBuddy(0);
    expect(buddy.streak.toNumber()).to.equal(1);

    // simulate less than a day (23 hours) to keep the streak
    await ethers.provider.send("evm_increaseTime", [23 * 60 * 60]);
    await ethers.provider.send("evm_mine");

    await manager.updateStreak(0);
    buddy = await manager.getBuddy(0);
    expect(buddy.streak.toNumber()).to.equal(2);
  });

  it("should claim badges", async function () {
    await manager.createBuddy("Pixel");
    await manager.claimBadge(0, "First Lesson");
    const buddy = await manager.getBuddy(0);
    
    expect(buddy.badges.length).to.equal(1);
    expect(buddy.badges[0]).to.equal("First Lesson");
  });

  it("should allow multiple buddies per user", async function () {
    await manager.createBuddy("Pixel");
    await manager.createBuddy("Nova");

    const buddies = await manager.getBuddiesByOwner(owner.address);
    expect(buddies.length).to.equal(2);
  });

  it("should prevent non-owners from using a buddy", async function () {
    await manager.createBuddy("Pixel");
    
    try {
      await manager.connect(user1).completeLesson(0, 100);
      expect.fail("Should have reverted");
    } catch (error: any) {
      expect(error.message).to.include("Not your buddy");
    }
  });
});
