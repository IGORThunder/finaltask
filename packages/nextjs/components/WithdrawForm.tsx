"use client";

import { useState } from "react";

interface WithdrawFormProps {
  onWithdraw: () => Promise<void>;
}

const WithdrawForm: React.FC<WithdrawFormProps> = ({ onWithdraw }) => {
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const handleSubmit = async () => {
    try {
      setIsProcessing(true);
      await onWithdraw();
    } catch (error) {
      console.error("Ошибка снятия средств:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="p-6 bg-gradient-to-r from-purple-400 to-pink-500 text-white rounded-lg shadow-lg mx-auto mt-6">
      <h2 className="text-2xl font-bold mb-4">Снять средства</h2>
      <button
        onClick={handleSubmit}
        disabled={isProcessing}
        className={`w-full py-2 rounded-lg text-white ${
          isProcessing ? "bg-gray-500" : "bg-pink-500 hover:bg-pink-600"
        }`}
      >
        {isProcessing ? "Обработка..." : "Снять средства"}
      </button>
    </div>
  );
};

export default WithdrawForm;
