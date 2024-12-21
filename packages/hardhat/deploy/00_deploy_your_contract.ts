import { HardhatRuntimeEnvironment } from "hardhat/types"; // Импорт типов для среды выполнения Hardhat
import { DeployFunction } from "hardhat-deploy/types"; // Импорт типа функции деплоя

/**
 * Скрипт для развертывания контракта TimeLockedWallet.
 * Использует Hardhat Runtime Environment для выполнения операций.
 *
 * @param hre Объект среды выполнения Hardhat.
 */
const deployTimeLockedWallet: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts(); // Учетная запись для деплоя
  const { deploy } = hre.deployments; // Функция для развертывания

  console.log("Деплой контракта TimeLockedWallet...");

  // Разворачиваем TimeLockedWallet без аргументов конструктора
  const deployment = await deploy("TimeLockedWallet", {
    from: deployer,
    args: [], // Конструктор контракта не требует аргументов
    log: true,
    autoMine: true, // Для локальной сети майнинг выполняется автоматически
  });

  console.log(`Контракт TimeLockedWallet развернут по адресу: ${deployment.address}`);
};

// Экспорт функции деплоя
export default deployTimeLockedWallet;
deployTimeLockedWallet.tags = ["TimeLockedWallet"];
