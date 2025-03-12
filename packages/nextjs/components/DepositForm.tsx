"use client";

import { useState } from "react";

interface DepositFormProps {
  onDeposit: (unlockTime: number, amount: string) => Promise<void>;
  fetchLockInfo: () => Promise<void>;
}

const DepositForm: React.FC<DepositFormProps> = ({ onDeposit, fetchLockInfo }) => {
  const [amount, setAmount] = useState<string>("");
  const [unlockTime, setUnlockTime] = useState<string>("");

  const handleSubmit = async () => {
    if (!amount || !unlockTime) return;

    try {
      await onDeposit(Number(unlockTime), amount);
      setAmount("");
      setUnlockTime("");

      // Обновляем информацию о блокировке
      await fetchLockInfo();
    } catch (error) {
      console.error("Ошибка депозита:", error);
    }
  };

  return (
    <div className="p-6 bg-gradient-to-r from-purple-500 to-indigo-700 text-white rounded-2xl shadow-xl mx-auto max-w-md">
      <h2 className="text-3xl font-extrabold mb-4 text-center">💰 Сделать депозит</h2>
      
      <div className="space-y-4">
        <input
          type="number"
          placeholder="Сумма (ETH)"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full p-3 text-white bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
        <input
          type="number"
          placeholder="Время разблокировки (Unix Timestamp)"
          value={unlockTime}
          onChange={(e) => setUnlockTime(e.target.value)}
          className="w-full p-3 text-white bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
      </div>

      <button
        onClick={handleSubmit}
        className="w-full mt-4 py-3 rounded-lg bg-indigo-500 hover:bg-indigo-600 transition-all text-white font-semibold text-lg"
      >
        🔒 Заблокировать средства
      </button>
    </div>
  );
};

export default DepositForm;
