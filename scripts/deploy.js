const hre = require("hardhat");

async function main() {
  try {
    console.log("Deploying EcoSoulNFT contract...");
    
    const EcoSoulNFT = await hre.ethers.getContractFactory("EcoSoulNFT");
    console.log("Contract factory created");
    
    const ecoSoulNFT = await EcoSoulNFT.deploy();
    console.log("Contract deployment transaction sent");
    
    await ecoSoulNFT.waitForDeployment();
    console.log("Contract deployment confirmed");
    
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
  } catch (error) {
    console.error("Error deploying contract:", error);
    process.exit(1);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 