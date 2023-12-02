const ethers = require('ethers')
const fs = require('fs');
const path = require('path')


const main = async () => {
    const domainContractFactory = await hre.ethers.getContractFactory("CasamaDomains");
    const domainContract = await domainContractFactory.attach("");

    const arrayOfOwners = [];

    for (let i = 0; i < 440; i++) {
        const owner = await domainContract.ownerOf(i);
        const casamaId = await domainContract.getName(owner)
        console.log("Owner: ", owner, "Casama ID: ", casamaId)
        arrayOfOwners.push({
            walletAddress: owner,
            casamaId: casamaId
        });
    }

    const object = {
        owners: arrayOfOwners
    }

    fs.writeFile(path.join(__dirname, './aggregation/allCasamaHolders.json'),JSON.stringify(object), (err) => {
        if (err) throw err;
        console.log("Success")
    })
    
}

    main();