# Lab4-COMP5521-2025: ERC721 and NFT Marketplace Simulation

This is the sample code repository for the COMP5521 2025 Lab 4. This lab builds upon the concepts of ERC20 tokens and introduces ERC721 NFTs. It demonstrates how to create, deploy, and interact with both token standards, culminating in a script that simulates a trade in a mock marketplace.

## Prerequisites
- Node.js and npm installed
- Basic understanding of Solidity, ERC20, and ERC721 standards
- MetaMask wallet set up with the Sepolia testnet and funded with SepoliaETH
- At least three separate accounts (private keys) for the simulation: one for the contract owner, and two for traders (Alice and Bob).

## Setup Instructions
1.  **Clone this repository:**
    ```bash
    git clone https://github.com/AnthonyXuan/Lab4-COMP5521-2025.git
    cd Lab4-COMP5521-2025
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Configure your environment:**
    Create a `.env` file in the root of the project and add your Sepolia network details and private keys.
    ```
    # Your Infura or Alchemy RPC URL for the Sepolia network
    SEPOLIA_RPC_URL="https://sepolia.infura.io/v3/YOUR_INFURA_PROJECT_ID"

    # The private key of the account that will deploy the contracts (Owner)
    PRIVATE_KEY="YOUR_OWNER_WALLET_PRIVATE_KEY"

    # Private keys for the two accounts that will trade
    ALICE_PRIVATE_KEY="YOUR_ALICE_WALLET_PRIVATE_KEY"
    BOB_PRIVATE_KEY="YOUR_BOB_WALLET_PRIVATE_KEY"

    # Your Etherscan API key for contract verification
    ETHERSCAN_API_KEY="YOUR_ETHERSCAN_API_KEY"
    ```

4.  **Compile the smart contracts:**
    ```bash
    npx hardhat compile
    ```

5.  **Deploy the smart contracts to the Sepolia testnet:**
    ```bash
    npx hardhat run scripts/deploy.js --network sepolia
    ```
    After running, take note of the deployed `MySimpleToken` and `MyCollectible` contract addresses from the terminal output.

6.  **Update the simulation script:**
    Open the `scripts/simulate_trade.js` file. Find the following lines and replace the placeholder addresses with the actual contract addresses you just deployed:
    ```javascript
    // Paste the deployed contract addresses here
    const TOKEN_CONTRACT_ADDRESS = "0xYourDeployedTokenAddress";
    const NFT_CONTRACT_ADDRESS = "0xYourDeployedNftAddress";
    ```

7.  **Run the trade simulation script:**
    This script will simulate Alice and Bob approving the owner (acting as a marketplace) to perform a trade, and then execute the swap of tokens for an NFT.
    ```bash
    npx hardhat run scripts/simulate_trade.js --network sepolia
    ```
    Check the terminal output to see the state of each account before and after the trade.

## Project Structure
- `contracts/`:
  - `MySimpleToken.sol`: A simple ERC20 token contract.
  - `MyCollectible.sol`: A simple ERC721 NFT contract.
- `scripts/`:
  - `deploy.js`: Script to deploy both contracts to the blockchain and verify them on Etherscan.
  - `simulate_trade.js`: Script to simulate an atomic swap of an NFT for ERC20 tokens between two users, orchestrated by a third party (the "marketplace").
- `test/`: Contains test scripts for the smart contracts.
- `hardhat.config.js`: The Hardhat configuration file, defining the Solidity version, network settings, and Etherscan API key.

