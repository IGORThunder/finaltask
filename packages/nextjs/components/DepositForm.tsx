"use client";

import { useState } from "react";

interface DepositFormProps {
  onDeposit: (unlockTime: number, amount: string) => Promise<void>;
  fetchLockInfo: () => Promise<void>; // Функция для получения информации о блокировке
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
    <div className="p-6 bg-gradient-to-r from-teal-400 to-blue-500 text-white rounded-lg shadow-lg mx-auto">
      <h2 className="text-2xl font-bold mb-4">Сделать депозит</h2>
      <input
        type="number"
        placeholder="Сумма (ETH)"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className="w-full p-2 mb-4 text-black bg-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <input
        type="number"
        placeholder="Время разблокировки (Unix Timestamp)"
        value={unlockTime}
        onChange={(e) => setUnlockTime(e.target.value)}
        className="w-full p-2 mb-4 text-black bg-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button
        onClick={handleSubmit}
        className="w-full py-2 rounded-lg text-white bg-blue-500 hover:bg-blue-600"
      >
        Сделать депозит
      </button>
    </div>
  );
};

export default DepositForm;
