// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract TimeLockedWallet {
    struct Lock {
        uint256 amount;
        uint256 unlockTime;
    }

    mapping(address => Lock) private locks;

    event Deposit(address indexed user, uint256 amount, uint256 unlockTime);
    event Withdraw(address indexed user, uint256 amount);

    // Функция для депозита с указанием времени блокировки
    function deposit(uint256 unlockTime) external payable {
        require(msg.value > 0, "Deposit must be greater than zero");
        require(unlockTime > block.timestamp, "Unlock time must be in the future");

        locks[msg.sender].amount += msg.value;
        locks[msg.sender].unlockTime = unlockTime;

        emit Deposit(msg.sender, msg.value, unlockTime);
    }

    // Функция для вывода средств после истечения времени
    function withdraw() external {
        Lock memory userLock = locks[msg.sender];
        require(userLock.amount > 0, "No funds to withdraw");
        require(block.timestamp >= userLock.unlockTime, "Funds are locked");

        uint256 amount = userLock.amount;
        locks[msg.sender].amount = 0;

        payable(msg.sender).transfer(amount);

        emit Withdraw(msg.sender, amount);
    }

    // Получение информации о балансе и времени блокировки
    function getLockInfo(address user) external view returns (uint256 amount, uint256 unlockTime) {
        Lock memory userLock = locks[user];
        return (userLock.amount, userLock.unlockTime);
    }
}
