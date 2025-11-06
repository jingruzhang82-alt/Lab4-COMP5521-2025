const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  
  console.log("Deploying MyNFT contract with account:", deployer.address);
  console.log("Account balance:", (await deployer.provider.getBalance(deployer.address)).toString());

  // Deploy MyNFT Contract
  const MyNFT = await ethers.getContractFactory("MyNFT");
  const myNFT = await MyNFT.deploy();
  
  await myNFT.waitForDeployment();
  const nftAddress = await myNFT.getAddress();

  console.log("MyNFT deployed to:", nftAddress);
  console.log("Transaction hash:", myNFT.deploymentTransaction().hash);

  // Save contract address for later use
  const fs = require("fs");
  const addresses = {
    myNFT: nftAddress,
    deployer: deployer.address
  };
  fs.writeFileSync("my-nft-address.json", JSON.stringify(addresses, null, 2));
  
  console.log("Contract info saved to my-nft-address.json");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });