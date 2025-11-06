const { ethers } = require("hardhat");

async function main() {
  console.log("=== NFT合约信息 ===");
  
  // 加载部署地址
  const addresses = require("../my-nft-address.json");
  console.log("📄 合约地址:", addresses.myNFT);
  console.log("👤 部署者:", addresses.deployer);
  
  // 连接到合约
  const MyNFT = await ethers.getContractFactory("MyNFT");
  const myNFT = await MyNFT.attach(addresses.myNFT);
  
  // 显示合约基本信息
  console.log("\n📊 合约基本信息:");
  console.log("名称:", await myNFT.name());
  console.log("符号:", await myNFT.symbol());
  console.log("当前Token数量:", await myNFT.getCurrentTokenId());
  
  console.log("\n🔗 提供给团队成员的信息:");
  console.log("NFT合约地址:", addresses.myNFT);
  console.log("GitHub仓库: https://github.com/jingruzhang82-alt/Lab4-COMP5521-2025");
  console.log("Metadata示例: https://raw.githubusercontent.com/jingruzhang82-alt/Lab4-COMP5521-2025/main/metadata/1.json");
}

main().catch(console.error);