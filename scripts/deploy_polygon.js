

const main = async () => {
    // Deploy the contract
    const domainContractFactory = await hre.ethers.getContractFactory("Domains");
    const domainContract = await domainContractFactory.deploy("casama");
    await domainContract.deployed();
    console.log("Domain deployed to:", domainContract.address);

    for(var i = 0; i < registered.length; i++) {
        let payment_value;
        if (registered[i].domain.length == 3) {
            payment_value = ethers.utils.parseEther("0.05");
        } else if (registered[i].domain.length == 4) {
            payment_value = ethers.utils.parseEther("0.03");
        } else {
            payment_value = ethers.utils.parseEther("0.01");
        }
        await domainContract.registerOther(registered[i].domain, registered[i].wallet_address, {value: payment_value});
        console.log("Registered: ", registered[i].domain, " to: ", registered[i].wallet_address);
    }

    

    console.log("Done registering domains");
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