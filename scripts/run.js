
const main = async () => {
    // Deploy the contract
    const domainContractFactory = await hre.ethers.getContractFactory("CasamaDomains");
    const domainContract = await domainContractFactory.deploy("casama");
    await domainContract.deployed();
    console.log("Domain deployed to:", domainContract.address);

    // Register tayyab.casama as the initial one
    let txn = await domainContract.registerSelf("tayyab",  {value: hre.ethers.utils.parseEther('0.01')});
    await txn.wait();
    console.log("Registered tayyab.casama");

    // Register someone else
    let txn_new = await domainContract.registerOther('tricia', '0x26435d7D30F7095606101FFa65f77F9807855E6d', {value: hre.ethers.utils.parseEther('0.01')});
    await txn_new.wait();
    console.log("Registered tricia.casama");

    // Set the record for tayyab.casama, for now just use email. But, in the future this should point to some reputation data, transaction history, an off-chain config file, etc.
    txn = await domainContract.setRecord("tayyab", "tayyab@casama.xyz");
    await txn.wait();
    console.log("Set record for tayyab.casama");

    // Get the Address for "tayyab"
    const address_tayyab = await domainContract.getAddress("tayyab");
    console.log("Address for tayyab.casama is", address_tayyab);

    // Get the Address for "tricia"
    const address_tricia = await domainContract.getAddress("tricia");
    console.log("Address for tricia.casama is", address_tricia);

    // Print current Contract Balance
    const balance = await hre.ethers.provider.getBalance(domainContract.address);
    console.log("Contract balance:", hre.ethers.utils.formatEther(balance));

}


const runMain = async () => {
    try {
        await main();
        process.exit(0);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}

runMain();