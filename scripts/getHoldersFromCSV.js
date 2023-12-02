const ethers = require('ethers');
const fs = require('fs');
const path = require('path')


const main = async () => {
    const domainContractFactory = await hre.ethers.getContractFactory("Domains");
    const domainContract = await domainContractFactory.attach("");

    const arrayOfOwners = [];
    
    for(let i = 0; i < arrayOfUsers.length; i++) {
        const walletAddress = await domainContract.getAddress(arrayOfUsers[i])
        console.log("Wallet Address: ", walletAddress)

        console.log("Owner: ", walletAddress, "Casama ID: ", arrayOfUsers[i])
        arrayOfOwners.push({
            walletAddress: walletAddress,
            casamaId: arrayOfUsers[i]
        });
    }

    const object = {
        owners: arrayOfOwners
    }

    fs.writeFile(path.join(__dirname, './aggregation/surveyRespondents.json'),JSON.stringify(object), (err) => {
        if (err) throw err;
        console.log("Success")
    })
}

main();