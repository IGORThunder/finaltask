"use client";

import { useState, useEffect } from "react";
import { useScaffoldReadContract } from "~~/hooks/scaffold-eth";

interface LockInfoProps {
  contract: any;
  address: string | undefined;
  fetchLockInfo: () => void; // Функция для обновления данных
}

const LockInfo: React.FC<LockInfoProps> = ({ contract, address, fetchLockInfo }) => {
  const [lockInfo, setLockInfo] = useState<{ amount: string; unlockTime: string }>({
    amount: "0",
    unlockTime: "0",
  });

  useEffect(() => {
    if (address) {
      fetchLockInfo(); // Получаем информацию о блокировке, если есть адрес
    }
  }, [address, fetchLockInfo]);

  return (
    <div className="p-6 bg-gradient-to-r from-teal-400 to-blue-500 text-white rounded-lg shadow-lg mx-auto">
      <h2 className="text-2xl font-bold mb-4">Информация о блокировке</h2>
      <p>Сумма: {lockInfo.amount} ETH</p>
      <p>Время разблокировки: {lockInfo.unlockTime}</p>
    </div>
  );
};

export default LockInfo;
