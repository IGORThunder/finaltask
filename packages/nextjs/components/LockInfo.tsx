"use client";

import { useState, useEffect } from "react";
import { useScaffoldReadContract } from "~~/hooks/scaffold-eth";

interface LockInfoProps {
  contract: any;
  address: string | undefined;
  fetchLockInfo: () => void;
}

const LockInfo: React.FC<LockInfoProps> = ({ contract, address, fetchLockInfo }) => {
  const [lockInfo, setLockInfo] = useState<{ amount: string; unlockTime: string }>({
    amount: "0",
    unlockTime: "0",
  });

  useEffect(() => {
    if (address) {
      fetchLockInfo();
    }
  }, [address, fetchLockInfo]);

  return (
    <div className="p-6 bg-gradient-to-r from-purple-500 to-indigo-700 text-white rounded-2xl shadow-xl border-2 border-white/30 mx-auto">
      <h2 className="text-3xl font-extrabold mb-4">🔒 Информация о блокировке</h2>
      <p className="text-lg font-medium">💰 Сумма: <span className="font-bold">{lockInfo.amount} ETH</span></p>
      <p className="text-lg font-medium">⏳ Время разблокировки: <span className="font-bold">{lockInfo.unlockTime}</span></p>
    </div>
  );
};

export default LockInfo;
