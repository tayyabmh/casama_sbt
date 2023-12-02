

const main = async () => {
    // Get the contract
    const domainContractFactory = await hre.ethers.getContractFactory("Domains");
    const domainContract = await domainContractFactory.attach("");

    const casama_id = "";
    const wallet_address = "";

    let payment_value;
    if (casama_id.length == 3) {
        payment_value = ethers.utils.parseEther("0.05");
    } else if (casama_id.length == 4) {
        payment_value = ethers.utils.parseEther("0.03");
    } else {
        payment_value = ethers.utils.parseEther("0.01");
    }
    await domainContract.registerOther(casama_id, wallet_address, {value: payment_value});
    console.log("Registered: ", casama_id, " to: ", wallet_address);

    console.log("Done registering domains.");

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