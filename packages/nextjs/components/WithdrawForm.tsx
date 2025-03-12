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
    <div className="p-6 bg-gradient-to-r from-indigo-500 to-blue-600 text-white rounded-xl shadow-xl mx-auto mt-6 transition-all duration-300">
      <h2 className="text-2xl font-bold mb-4">Снять средства</h2>
      <button
        onClick={handleSubmit}
        disabled={isProcessing}
        className={`w-full py-3 rounded-xl text-white font-semibold transition-all duration-300 ${
          isProcessing ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-700"
        }`}
      >
        {isProcessing ? "Обработка..." : "Снять средства"}
      </button>
    </div>
  );
};

export default WithdrawForm;
