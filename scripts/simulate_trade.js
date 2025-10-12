const hre = require("hardhat");

// --- CONFIGURATION ---
// Paste the deployed contract addresses here
const TOKEN_CONTRACT_ADDRESS = "0xa40E2e24a9a8C0378d6B92732132E54860Cc587b";
const NFT_CONTRACT_ADDRESS = "0xe17d5BE423d4EB6F5A3B9B48715e018E7D87fEb8";

// A sample metadata URI. For the demo, we can use a pre-made one.
const METADATA_URI = "https://ipfs.io/ipfs/QmeSjSinHpPnmXmspMjwiXyN6zS4E9zccariGR3jxcaWtq/1";
// --- END CONFIGURATION ---

async function main() {
  // Get signers to represent different users
  const [owner, alice, bob] = await hre.ethers.getSigners();
  console.log(`Owner: ${owner.address}`);
  console.log(`Alice: ${alice.address}`);
  console.log(`Bob:   ${bob.address}`);

  // Get contract instances
  const tokenContract = await hre.ethers.getContractAt("MySimpleToken", TOKEN_CONTRACT_ADDRESS);
  const nftContract = await hre.ethers.getContractAt("MyCollectible", NFT_CONTRACT_ADDRESS);

//   // --- 1. SETUP THE SCENE ---
//   console.log("\n--- Setting up the scene ---");
//   // Owner mints 1000 MST tokens to Bob
//   const mintAmount = hre.ethers.parseUnits("1000", 18);
//   let tx = await tokenContract.connect(owner).mint(bob.address, mintAmount);
//   await tx.wait();
//   console.log(`Minted 1000 MST to Bob.`);

//   // Owner mints NFT with tokenId 0 to Alice
//   tx = await nftContract.connect(owner).safeMint(alice.address, METADATA_URI);
//   await tx.wait();
//   console.log(`Minted NFT with tokenId 0 to Alice.`);

//   console.log("\n--- Initial State ---");
//   console.log(`Alice's NFT Balance: ${await nftContract.balanceOf(alice.address)}`);
//   console.log(`Bob's   NFT Balance: ${await nftContract.balanceOf(bob.address)}`);
//   console.log(`Owner of NFT #0: ${await nftContract.ownerOf(0)}`);
//   console.log(`Bob's Token Balance: ${hre.ethers.formatUnits(await tokenContract.balanceOf(bob.address), 18)} MST`);

  // --- 2. THE APPROVALS (PERMISSION SLIPS) ---
  console.log("\n--- The Approvals ---");
  const price = hre.ethers.parseUnits("500", 18); // The agreed price is 500 MST

  // Alice approves the Owner to manage her NFT #0
  // In a real DApp, the 'owner.address' would be the Marketplace Contract's address
  tx = await nftContract.connect(alice).approve(owner.address, 0);
  await tx.wait();
  console.log(`Alice approved Owner to manage her NFT #0.`);
  
  // Bob approves the Owner to spend 500 of his MST tokens
  tx = await tokenContract.connect(bob).approve(owner.address, price);
  await tx.wait();
  console.log(`Bob approved Owner to spend 500 MST.`);

  // --- 3. THE TRADE (EXECUTED BY THE "MARKETPLACE") ---
  console.log("\n--- Executing The Trade ---");
  // The Owner acts as the marketplace and executes the transfers
  // Transfer 500 MST from Bob to Alice
  tx = await tokenContract.connect(owner).transferFrom(bob.address, alice.address, price);
  await tx.wait();
  console.log(`Owner (as marketplace) transferred 500 MST from Bob to Alice.`);
  
  // Transfer NFT #0 from Alice to Bob
  tx = await nftContract.connect(owner).transferFrom(alice.address, bob.address, 0);
  await tx.wait();
  console.log(`Owner (as marketplace) transferred NFT #0 from Alice to Bob.`);

  // --- 4. FINAL STATE ---
  console.log("\n--- Final State ---");
  console.log(`Alice's NFT Balance: ${await nftContract.balanceOf(alice.address)}`);
  console.log(`Bob's   NFT Balance: ${await nftContract.balanceOf(bob.address)}`);
  console.log(`Owner of NFT #0: ${await nftContract.ownerOf(0)}`);
  console.log(`Alice's Token Balance: ${hre.ethers.formatUnits(await tokenContract.balanceOf(alice.address), 18)} MST`);
  console.log(`Bob's   Token Balance: ${hre.ethers.formatUnits(await tokenContract.balanceOf(bob.address), 18)} MST`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});