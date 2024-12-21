"use client";

import { useState, useEffect } from "react";
import { useAccount, usePublicClient, useWalletClient } from "wagmi";
import DepositForm from "../components/DepositForm";
import WithdrawForm from "../components/WithdrawForm";
import LockInfo from "../components/LockInfo";

const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
const CONTRACT_ABI = [
  {
    inputs: [{ internalType: "address", name: "user", type: "address" }],
    name: "getLockInfo",
    outputs: [
      { internalType: "uint256", name: "amount", type: "uint256" },
      { internalType: "uint256", name: "unlockTime", type: "uint256" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "unlockTime", type: "uint256" }],
    name: "deposit",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [],
    name: "withdraw",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

const Page = () => {
  const { address, isConnected } = useAccount();
  const publicClient = usePublicClient();
  const { data: walletClient } = useWalletClient();

  const [lockInfo, setLockInfo] = useState({ amount: "0", unlockTime: "0" });

  const fetchLockInfo = async () => {
    if (!address || !publicClient) return;

    try {
      const [amount, unlockTime] = await publicClient.readContract({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: "getLockInfo",
        args: [address],
      });

      setLockInfo({
        amount: (Number(amount) / 1e18).toFixed(4), // Конвертация в ETH
        unlockTime: new Date(Number(unlockTime) * 1000).toLocaleString(),
      });
    } catch (error) {
      console.error("Ошибка получения информации о блокировке:", error);
    }
  };

  const handleDeposit = async (amount: string, unlockTime: string) => {
    if (!walletClient) return;

    try {
      const tx = await walletClient.writeContract({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: "deposit",
        args: [BigInt(unlockTime)],
        overrides: {
          value: BigInt(Number(amount) * 1e18), // ETH в Wei
        },
      });

      await publicClient.waitForTransactionReceipt(tx.hash);
      alert("Депозит успешно выполнен!");
      fetchLockInfo();
    } catch (error) {
      console.error("Ошибка депозита:", error);
      alert("Не удалось выполнить депозит.");
    }
  };

  const handleWithdraw = async () => {
    if (!walletClient) return;

    try {
      const tx = await walletClient.writeContract({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: "withdraw",
      });

      await publicClient.waitForTransactionReceipt(tx.hash);
      alert("Снятие средств успешно выполнено!");
      fetchLockInfo();
    } catch (error) {
      console.error("Ошибка снятия средств:", error);
      alert("Не удалось выполнить снятие средств.");
    }
  };

  useEffect(() => {
    if (isConnected) {
      fetchLockInfo();
    }
  }, [isConnected]);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold text-center text-black mb-8">Time Locked Wallet</h1>

      {isConnected ? (
        <div className="max-w-md mx-auto bg-white shadow-md rounded-lg p-6">
          <LockInfo lockInfo={lockInfo} />
          <DepositForm onDeposit={handleDeposit} />
          <WithdrawForm onWithdraw={handleWithdraw} />
        </div>
      ) : (
        <p className="text-center text-gray-500">Подключите ваш кошелек, чтобы взаимодействовать с контрактом.</p>
      )}
    </div>
  );
};

export default Page;
