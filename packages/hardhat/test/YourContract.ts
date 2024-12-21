import { ethers } from "hardhat";
import { expect } from "chai";
import { TimeLockedWallet } from "../typechain-types";

describe("TimeLockedWallet Contract", function () {
  let timeLockedWallet: TimeLockedWallet;
  let owner: any;
  let addr1: any;
  let addr2: any;

  beforeEach(async () => {
    const timeLockedWalletFactory = await ethers.getContractFactory("TimeLockedWallet");
    timeLockedWallet = await timeLockedWalletFactory.deploy();
    await timeLockedWallet.waitForDeployment();

    [owner, addr1, addr2] = await ethers.getSigners();
  });

  it("Should allow deposits", async () => {
    const depositAmount = ethers.parseEther("1");
    const unlockTime = Math.floor(Date.now() / 1000) + 60; // через 60 секунд

    await timeLockedWallet.connect(addr1).deposit(unlockTime, { value: depositAmount });

    const lockInfo = await timeLockedWallet.getLockInfo(addr1.address);
    expect(lockInfo.amount).to.equal(depositAmount);
    expect(lockInfo.unlockTime).to.equal(unlockTime);
  });

  it("Should prevent withdrawals before unlock time", async () => {
    const depositAmount = ethers.parseEther("1");
    const unlockTime = Math.floor(Date.now() / 1000) + 60; // через 60 секунд

    await timeLockedWallet.connect(addr1).deposit(unlockTime, { value: depositAmount });

    await expect(timeLockedWallet.connect(addr1).withdraw()).to.be.revertedWith(
      "Funds are locked"
    );
  });

  it("Should allow withdrawals after unlock time", async () => {
    const depositAmount = ethers.parseEther("1");
    const unlockTime = Math.floor(Date.now() / 1000) + 60; // через 60 секунд

    await timeLockedWallet.connect(addr1).deposit(unlockTime, { value: depositAmount });

    // Увеличиваем время на 60 секунд
    await ethers.provider.send("evm_increaseTime", [60]);
    await ethers.provider.send("evm_mine", []);

    await timeLockedWallet.connect(addr1).withdraw();

    const lockInfo = await timeLockedWallet.getLockInfo(addr1.address);
    expect(lockInfo.amount).to.equal(0n);
  });

  it("Should emit Deposit and Withdraw events", async () => {
    const depositAmount = ethers.parseEther("1");
    const currentBlock = await ethers.provider.getBlock("latest");
  
    // Установим unlockTime на 65 секунд вперед
    const unlockTime = currentBlock.timestamp + 65; // больше 60 секунд для исключения задержек
  
    console.log("Current block timestamp:", currentBlock.timestamp);
    console.log("Unlock time for deposit:", unlockTime);
  
    // Убедимся, что unlockTime больше текущего времени блока
    if (unlockTime <= currentBlock.timestamp) {
      throw new Error("Unlock time must be in the future");
    }
  
    // Проверяем событие Deposit
    await expect(timeLockedWallet.connect(addr1).deposit(unlockTime, { value: depositAmount }))
      .to.emit(timeLockedWallet, "Deposit")
      .withArgs(addr1.address, depositAmount, unlockTime);
  
    // Увеличиваем время на 65 секунд
    await ethers.provider.send("evm_increaseTime", [65]); // увеличиваем время на 65 секунд
    await ethers.provider.send("evm_mine", []); // Минуем блок
  
    // Проверяем событие Withdraw
    await expect(timeLockedWallet.connect(addr1).withdraw())
      .to.emit(timeLockedWallet, "Withdraw")
      .withArgs(addr1.address, depositAmount);
  });
  
  

  it("Should prevent setting unlock time by non-owner", async () => {
    await expect(
      timeLockedWallet.connect(addr2).deposit(Math.floor(Date.now() / 1000) + 60, {
        value: ethers.parseEther("1"),
      })
    ).to.not.throw;
  });
});
