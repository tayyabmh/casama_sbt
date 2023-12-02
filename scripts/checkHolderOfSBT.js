

async function main() {

    const CASAMA_SBT_CONTRACT_ADDRESS_MUMBAI = "";

    // Get Contract from POLYGON
    const SBTContractFactory = await hre.ethers.getContractFactory("Domains");
    const SBTContract = await SBTContractFactory.attach(CASAMA_SBT_CONTRACT_ADDRESS_MUMBAI);

    // Get the address from id
    const casama_id = "";
    const address = await SBTContract.getAddress(casama_id);
    console.log("Name: ", casama_id, " is owned by: ", address);

    // Get the id from address
    const wallet_address = address;
    const id = await SBTContract.getName(wallet_address);
    console.log("Address: ", wallet_address, " owns: ", id);
    
}


main().catch((error) => {
    console.error(error);
    process.exit(1);
});