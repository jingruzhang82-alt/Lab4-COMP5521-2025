const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("MyNFT (ERC721)", function () {
  let MyNFT;
  let nftContract;
  let owner;
  let user1;
  let user2;
  const baseUri = "https://ipfs.io/ipfs/comp5521/";

  // 每个测试前部署新合约
  beforeEach(async function () {
    [owner, user1, user2] = await ethers.getSigners();
    
    // 部署你的NFT合约
    MyNFT = await ethers.getContractFactory("MyNFT");
    nftContract = await MyNFT.deploy();
    await nftContract.waitForDeployment();
  });

  describe("合约基础信息", function () {
    it("应正确设置名称和符号", async function () {
      expect(await nftContract.name()).to.equal("COMP5521 Digital Collectible");
      expect(await nftContract.symbol()).to.equal("C5NFT");
    });

    it("应正确设置所有者", async function () {
      expect(await nftContract.owner()).to.equal(owner.address);
    });

    it("初始tokenId计数器应为1", async function () {
      expect(await nftContract.getCurrentTokenId()).to.equal(1);
    });
  });

  describe("铸造功能 (safeMint)", function () {
    it("所有者应能铸造NFT并正确分配所有权", async function () {
      // 铸造第一个NFT（tokenId=1）给user1
      const tokenUri1 = baseUri + "1";
      await nftContract.safeMint(user1.address, tokenUri1);
      
      // 验证tokenId计数器自增
      expect(await nftContract.getCurrentTokenId()).to.equal(2);
      
      // 验证所有权
      expect(await nftContract.ownerOf(1)).to.equal(user1.address);
      expect(await nftContract.balanceOf(user1.address)).to.equal(1);
      
      // 验证元数据URI
      expect(await nftContract.tokenURI(1)).to.equal(tokenUri1);

      // 铸造第二个NFT（tokenId=2）给user2
      const tokenUri2 = baseUri + "2";
      await nftContract.safeMint(user2.address, tokenUri2);
      
      expect(await nftContract.getCurrentTokenId()).to.equal(3);
      expect(await nftContract.ownerOf(2)).to.equal(user2.address);
      expect(await nftContract.tokenURI(2)).to.equal(tokenUri2);
    });

    it("非所有者不能铸造NFT（onlyOwner权限控制）", async function () {
      await expect(
        nftContract.connect(user1).safeMint(user2.address, baseUri + "3")
      ).to.be.revertedWithCustomError(nftContract, "OwnableUnauthorizedAccount");
    });
  });

  describe("NFT转移功能", function () {
    beforeEach(async function () {
      // 提前铸造2个NFT作为测试基础（tokenId=1和2）
      await nftContract.safeMint(user1.address, baseUri + "1");
      await nftContract.safeMint(user1.address, baseUri + "2");
    });

    it("NFT所有者应能转移自己的NFT", async function () {
      // user1将tokenId=1转移给user2
      await nftContract.connect(user1).transferFrom(user1.address, user2.address, 1);
      
      // 验证所有权变更
      expect(await nftContract.ownerOf(1)).to.equal(user2.address);
      expect(await nftContract.balanceOf(user1.address)).to.equal(1); // 剩余tokenId=2
      expect(await nftContract.balanceOf(user2.address)).to.equal(1);
    });

    it("非所有者未授权时不能转移NFT", async function () {
      // user2尝试转移不属于自己的tokenId=1
      await expect(
        nftContract.connect(user2).transferFrom(user1.address, user2.address, 1)
      ).to.be.revertedWithCustomError(nftContract, "ERC721InsufficientApproval");
    });

    it("授权后可转移他人NFT", async function () {
      // user1授权user2管理tokenId=1
      await nftContract.connect(user1).approve(user2.address, 1);
      
      // user2使用授权转移NFT
      await nftContract.connect(user2).transferFrom(user1.address, owner.address, 1);
      
      expect(await nftContract.ownerOf(1)).to.equal(owner.address);
    });

    it("批量授权(setApprovalForAll)后可转移所有NFT", async function () {
      // user1授权user2管理自己的所有NFT
      await nftContract.connect(user1).setApprovalForAll(user2.address, true);
      
      // 验证授权状态
      expect(await nftContract.isApprovedForAll(user1.address, user2.address)).to.be.true;
      
      // user2转移两个NFT
      await nftContract.connect(user2).transferFrom(user1.address, owner.address, 1);
      await nftContract.connect(user2).transferFrom(user1.address, owner.address, 2);
      
      // 验证结果
      expect(await nftContract.balanceOf(user1.address)).to.equal(0);
      expect(await nftContract.balanceOf(owner.address)).to.equal(2);
    });
  });

  describe("异常情况处理", function () {
    it("查询不存在的tokenId应报错", async function () {
      // 此时只铸造了tokenId=1（如果前面测试没影响的话），查询999应报错
      await expect(
        nftContract.ownerOf(999)
      ).to.be.revertedWithCustomError(nftContract, "ERC721NonexistentToken");
    });

    it("转移不存在的NFT应报错", async function () {
      await expect(
        nftContract.transferFrom(owner.address, user1.address, 999)
      ).to.be.revertedWithCustomError(nftContract, "ERC721NonexistentToken");
    });
  });
});