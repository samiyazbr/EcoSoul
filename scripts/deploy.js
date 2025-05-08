const hre = require("hardhat");

async function main() {
  console.log("Deploying EcoSoulNFT contract...");
  
  // Get the contract factory
  const EcoSoulNFT = await hre.ethers.getContractFactory("EcoSoulNFT");
  console.log("Contract factory created");
  
  // Deploy contract with standard settings
  const ecoSoulNFT = await EcoSoulNFT.deploy();
  console.log("Contract deployment transaction sent");
  
  await ecoSoulNFT.waitForDeployment();
  console.log("Contract deployed successfully!");
  
  const address = await ecoSoulNFT.getAddress();
  console.log("EcoSoulNFT deployed to:", address);
  
  // Verify contract on Etherscan
  if (hre.network.name === "sepolia") {
    console.log("Waiting for 5 block confirmations before verification...");
    await ecoSoulNFT.deploymentTransaction().wait(5);
    
    console.log("Verifying contract on Etherscan...");
    await hre.run("verify:verify", {
      address: address,
      constructorArguments: [],
    });
    console.log("Contract verified on Etherscan");
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Error deploying contract:", error);
    process.exit(1);
  }); 