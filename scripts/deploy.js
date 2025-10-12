const hre = require("hardhat");

async function main() {
  // 1. Deploy the ERC20 Token Contract
  console.log("Deploying MySimpleToken contract...");
  const MySimpleToken = await hre.ethers.getContractFactory("MySimpleToken");
  const token = await MySimpleToken.deploy();
  await token.waitForDeployment();
  const tokenAddress = await token.getAddress();
  console.log(`MySimpleToken (MST) deployed to: ${tokenAddress}`);

  // 2. Deploy the ERC721 NFT Contract
  console.log("\nDeploying MyCollectible contract...");
  const MyCollectible = await hre.ethers.getContractFactory("MyCollectible");
  const nft = await MyCollectible.deploy();
  await nft.waitForDeployment();
  const nftAddress = await nft.getAddress();
  console.log(`MyCollectible (MCB) deployed to: ${nftAddress}`);

  // Wait for a few block confirmations to ensure Etherscan has indexed the contract
  await nft.deploymentTransaction().wait(5);

  // 3. Verify the ERC20 Token contract
  console.log("\nVerifying MySimpleToken contract on Etherscan...");
  try {
    await hre.run("verify:verify", {
      address: tokenAddress,
      constructorArguments: [],
    });
    console.log("MySimpleToken contract verified successfully!");
  } catch (error) {
    if (error.message.toLowerCase().includes("already verified")) {
      console.log("MySimpleToken contract is already verified.");
    } else {
      console.error(error);
    }
  }

  // 4. Verify the NFT contract
    console.log("Verifying contract on Etherscan...");
  try {
    await hre.run("verify:verify", {
      address: nftAddress,
      constructorArguments: [], 
    });
    console.log("Contract verified successfully!");
  } catch (error) {
    if (error.message.toLowerCase().includes("already verified")) {
      console.log("Contract is already verified.");
    } else {
      console.error(error);
    }
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});