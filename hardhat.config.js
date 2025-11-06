require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config(); // To load environment variables from a .env file

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.20",
  networks: {
    sepolia: {
      url: process.env.SEPOLIA_RPC_URL || "",
      accounts: [
        process.env.PRIVATE_KEY].filter(Boolean),
    },
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
};