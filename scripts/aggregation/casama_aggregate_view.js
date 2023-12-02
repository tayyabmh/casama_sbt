const ethers = require('ethers')
const fs = require('fs');
const { parse } = require('path');
const path = require('path');
const Moralis = require("moralis").default;
const { EvmChain } = require('@moralisweb3/common-evm-utils');
const axios = require('axios');


// Moralis
const MORALIS_API_KEY = '';

// Providers
const GOERLI_PROVIDER = new ethers.providers.JsonRpcProvider('');

// Additional things that I would be nice to aggregate about our holders
// 1. ENS Holders (Unique, and total ENS's) - CHECK
// Total NFT Market Cap - CHECK
// 2. Holders of FWB - CHECK
// 4. SharkDAO, Seedclub, - CHECK
// 6. Forefront - CHECK
// 7. Moonbirds - CHECK
// 8. ConstitutionDAO, LexDAO, Mirror, PleasrDAO, RaidGuild
// 9. GnosisSafe Signatories
// 10. Farcaster - CHECK
// 11. Lens Protocol
// 12. Kernel Block
// 13. Zorbs holders
// 14. More Loot
// 15. Nouns, Lil Nouns, Purple Nouns, PublicNouns
// 16. Crypto Coven
// 17. CryptoKitties
// 18. Grand Leisure
// 19. Chain Runners
// 20. NF.TD
// 21. PoolSuite
// 23. Devs for Revolution (Developer DAO)
// 5. Members of any Aragon DAOs
// 3. Members of any DAOHaus DAOs



// Supported ERC-20s
const supportedTokens = [
    {
        'name': "Friends With Benefits",
        'symbol': "FWB",
        'contractAddress': "0x35bD01FC9d6D5D81CA9E055Db88Dc49aa2c699A8",
        'decimals': 18,
    },
    {
        'name': 'Olympus Token',
        'symbol': 'OHM',
        'contractAddress': '0x64aa3364F17a4D01c6f1751Fd97C2BD3D7e7f1D5',
        'decimals': 9,
    }, {
        'name': 'ENS Token',
        'symbol': 'ENS',
        'contractAddress': '0xC18360217D8F7Ab5e7c516566761Ea12Ce7F9D72',
        'decimals': 18,
    }, {
        'name': 'USD Coin',
        'symbol': 'USDC',
        'contractAddress': '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
        'decimals': 6,
    }, {
        'name': 'Panvala Pan',
        'symbol': 'PAN',
        'contractAddress': '0xD56daC73A4d6766464b38ec6D91eB45Ce7457c44',
        'decimals': 18,
    }, {
        'name': 'Wrapped Ether',
        'symbol': 'WETH',
        'contractAddress': '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
        'decimals': 18,
    }, {
        'name': 'Olympus Staked OHM',
        'symbol': 'sOHM',
        'contractAddress': '0x04F2694C8fcee23e8Fd0dfEA1d4f5Bb8c352111F',
        'decimals': 9,
    }, {
        'name': 'Olympus Governance OHM',
        'symbol': 'gOHM',
        'contractAddress': '0x0ab87046fBb341D058F17CBC4c1133F25a20a52f',
        'decimals': 18
    }, {
        'name': 'Nation3 Token',
        'symbol': 'NATION',
        'contractAddress': '0x333A4823466879eeF910A04D473505da62142069',
        'decimals': 18,
    }, {
        'name': 'DAI Stablecoin',
        'symbol': 'DAI',
        'contractAddress': '0x6B175474E89094C44Da98b954EedeAC495271d0F',
        'decimals': 18,
    }, {
        'name': 'Tether USD',
        'symbol': 'USDT',
        'contractAddress': '0xdAC17F958D2ee523a2206206994597C13D831ec7',
        'decimals': 6,
    }, {
        'name': 'Polygon Matic',
        'symbol': 'MATIC',
        'contractAddress': '0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0',
        'decimals': 18,
    }, {
        'name': 'Shiba Inu',
        'symbol': 'SHIB',
        'contractAddress': '0x95aD61b0a150d79219dCF64E1E6Cc01f0B64C4cE',
        'decimals': 18,
    }, {
        'name': 'Uniswap',
        'symbol': 'UNI',
        'contractAddress': '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984',
        'decimals': 18,
    }, {
        'name': 'Chainlink',
        'symbol': 'LINK',
        'contractAddress': '0x514910771AF9Ca656af840dff83E8264EcF986CA',
        'decimals': 18,
    }, {
        'name': 'Wrapped Bitcoin',
        'symbol': 'WBTC',
        'contractAddress': '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599',
        'decimals': 8,
    }, {
        'name': 'SushiSwap Coin',
        'symbol': 'SUSHI',
        'contractAddress': '0x6B3595068778DD592e39A122f4f5a5cF09C90fE2',
        'decimals': 18,
    }, {
        'name': 'ApeCoin',
        'symbol': 'APE',
        'contractAddress': '0x4d224452801ACEd8B2F0aebE155379bb5D594381',
        'decimals': 18,
    }, {
        'name': 'Frax',
        'symbol': 'FRAX',
        'contractAddress': '0x853d955aCEf822Db058eb8505911ED77F175b99e',
        'decimals': 18,
    }, {
        'name': 'Pax Dollar',
        'symbol': 'USDP',
        'contractAddress': '0x8E870D67F660D95d5be530380D0eC0bd388289E1',
        'decimals': 18,
    }, {
        'name': 'MAKER DAO',
        'symbol': 'MKR',
        'contractAddress': '0x9f8F72aA9304c8B593d555F12eF6589cC3A579A2',
        'decimals': 18,
    }, {
        'name': 'The Graph',
        'symbol': 'GRT',
        'contractAddress': '0xc944E90C64B2c07662A292be6244BDf05Cda44a7',
        'decimals': 18,
    }, {
        'name': 'Aave',
        'symbol': 'AAVE',
        'contractAddress': '0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9',
        'decimals': 18,
    }, {
        'name': 'Yearn Finance',
        'symbol': 'YFI',
        'contractAddress': '0x0bc529c00C6401aEF6D220BE8C6Ea1667F6Ad93e',
        'decimals': 18,
    }, {
        'name': 'Compound',
        'symbol': 'COMP',
        'contractAddress': '0xc00e94Cb662C3520282E6f5717214004A7f26888',
        'decimals': 18,
    }, {
        'name': 'Synthetix Network Token',
        'symbol': 'SNX',
        'contractAddress': '0xC011a73ee8576Fb46F5E1c5751cA3B9Fe0af2a6F',
        'decimals': 18,
    }
]

// Alchemy Provider URL
const ETH_PROVIDER = new ethers.providers.JsonRpcProvider("");

const main = async () => {

    await Moralis.start({
        apiKey: MORALIS_API_KEY
    })

    const rawData = fs.readFileSync(path.join(__dirname, '/surveyRespondents.json'));
    const owners = JSON.parse(rawData);

    const timer = () => new Promise(res => setTimeout(res, 1000));


    const allNFTs = [];
    const chains = [ EvmChain.ETHEREUM ];

    console.log("Fetching ERC20s...")
    const allERCs = await getERC20sForAllHolders(timer, owners.owners, chains[0]);
    console.log("Retrieved all ERC20s.")
    console.log("Filtering ERC20s...");
    const filteredERCs = filterOutERC20s(allERCs);
    console.log("Filtered ERC20s.");
    console.log("Aggregating ERC20 balances...");
    const aggregatedBalances = await aggregateBalancesPerERC20(timer, filteredERCs, chains[0]);
    console.log("Aggregated ERC20 balances.");
    console.log(aggregatedBalances)
    console.log("Getting Total Market Cap of Casama Holders...");
    const totalMarketCapOfERCs = getTotalMarketCapOfCasamaHolders(aggregatedBalances);
    console.log("Total ERC20 Market Cap of Casama Holders: $", totalMarketCapOfERCs);


    // // NFT Logic
    console.log("Fetching NFTs...")
    
    const date = '1674489245440';
    const TWO_MONTHS_AGO = new Date();
    TWO_MONTHS_AGO.setMonth(TWO_MONTHS_AGO.getMonth() - 2);
    const blockFromTwoMonthsAgo = await Moralis.EvmApi.block.getDateToBlock({
        date: TWO_MONTHS_AGO,
        chain: chains[0]
    })

    const RECENT_NFT_PURCHASERS = [];


    for (casamaHolder of owners.owners) {
        
        for (const chain of chains) {
                const response = await Moralis.EvmApi.nft.getWalletNFTs({
                    address: casamaHolder.walletAddress,
                    chain
                });
                
                await timer();

                const hasPurchasedNFTinLast2Months = hasPurchasedNFTInLastTwoMonths(blockFromTwoMonthsAgo.toJSON().block, response.result); 
                if (hasPurchasedNFTinLast2Months)  {
                    console.log("Found NFTs purchased in last two months.")
                    console.log("Casama Holder: ", casamaHolder.casamaId)
                    RECENT_NFT_PURCHASERS.push(casamaHolder);
                }
                allNFTs.push(...response.result);
        }

    }

    console.log("Retrieved all NFTs.")

    console.log("Total NFT's held by Casama Community: ", allNFTs.length)
    console.log("Number of people to recently purchased an NFT: ", RECENT_NFT_PURCHASERS.length);




    const numberOfSharkDAOHolders = countSharkDAOHolders(allERCs);
    console.log("Total SharkDAO Holders: ", numberOfSharkDAOHolders)

    const numberOfSeedClubHolders = countSeedClubHolders(allERCs);
    console.log("Total Seed Club Holders: ", numberOfSeedClubHolders)

    const numberOfForeFrontHolders = countForeFrontHolders(allERCs);
    console.log("Total ForeFront Holders: ", numberOfForeFrontHolders)

    const numberOfMoonbirdHolders = countMoonbirdHolders(allNFTs);
    console.log("Total Moonbird Holders: ", numberOfMoonbirdHolders)

    const numberOFFWBHolders = countFWBHolders(filteredERCs);
    console.log("Total FWB Holders: ", numberOFFWBHolders)

    const numberOfFarcasterIdHolders = await countFarcasterIdHolders(owners.owners);
    console.log("Total Farcaster ID Holders: ", numberOfFarcasterIdHolders)

    console.log("Total ERC20 Market Cap of Casama Holders: $", totalMarketCapOfERCs);
    console.log("Total NFT's held by Casama Community: ", allNFTs.length)

    const totalMarketCapOfNFTs = await getTotalNFTMarketCapOfHolders(timer, owners.owners);
    console.log("Total NFT Market Cap of Casama Holders: $", totalMarketCapOfNFTs);

    const [ totalENSCount, uniqueENSHoldersCount ] = countTotalAndUniqueENSHolders(allNFTs);
    console.log("Total ENS NFT's held by Casama Community: ", totalENSCount)
    console.log("Total Unique ENS Holders: ", uniqueENSHoldersCount)


}

function countTotalAndUniqueENSHolders(allNFTs) {
    const uniqueENSHolders = [];
    let totalENSCount = 0;

    for (const nft of allNFTs) {
        if (nft._data.symbol === 'ENS') {
            totalENSCount += 1;
            if (!uniqueENSHolders.includes(nft._data.ownerOf._value)) {
                uniqueENSHolders.push(nft._data.ownerOf._value);
            }
        }
    }

    return [totalENSCount, uniqueENSHolders.length];
}

async function getTotalNFTMarketCapOfHolders(timer,owners) {
    let totalMarketCapOfNFTs = 0;

    for (casamaHolder of owners) {

        const response = await axios.get('https://data-api.nftgo.io/eth/v2/address/metrics?address=' + casamaHolder.walletAddress, {
            headers: {
                'X-API-KEY': '',
                'accept': 'application/json'
            }
        });

        await timer();

        console.log("Total Est Holding Value in USD for ", casamaHolder.walletAddress, ": $", response.data.portfolio_value.usd)
        
        totalMarketCapOfNFTs += response.data.portfolio_value.usd;
    }

    return totalMarketCapOfNFTs;
}


async function getERC20sForAddress(address, chain) {

    try {
        const response = await Moralis.EvmApi.token.getWalletTokenBalances({
            address,
            chain
        });
        return response.result;
    }
    catch (error) {
        console.log("Error fetching ERC20s for address: ", address)
    }

}

async function getERC20sForAllHolders(timer, addresses, chain) {
    const allERCs = [];
    for (const casamaHolder of addresses) {
        try {
            console.log("Fetching ERC20s for address: ", casamaHolder.walletAddress)
            const ercs = await getERC20sForAddress(casamaHolder.walletAddress, chain);
            await timer();
            allERCs.push(...ercs);
        } catch(e) {
            console.log("Error fetching ERC20s for address: ", casamaHolder.walletAddress)
        }
        
    }
    return allERCs;
}

async function getTokenPrice(address, chain) {
    const response = await Moralis.EvmApi.token.getTokenPrice({
        address,
        chain
    })
    return response.result;
}

function filterOutERC20s(allERCs) {
    const filteredERCs = [];
    
    for (const erc of allERCs) {
        for (const token of supportedTokens) {
            if (erc._token._value.contractAddress._value === token.contractAddress) {
                filteredERCs.push(erc);
                // exit loop
                break;
            }
        }
    }

    return filteredERCs;
}

async function aggregateBalancesPerERC20(timer, filteredERCs, chain) {
    const aggregatedBalances = [];
    for (const erc of filteredERCs) {
        const usdPrice = await getTokenPrice(erc._token._value.contractAddress._value, chain);
        await timer();
        const balance = parseFloat(ethers.utils.formatUnits(erc._value.amount.value, erc._value.decimals))
        const usdValue = balance * usdPrice.usdPrice;
        if (aggregatedBalances[erc._token._value.name]) {
            aggregatedBalances[erc._token._value.name].usdValue += usdValue;
        } else {
            aggregatedBalances[erc._token._value.name] = {
                symbol: erc._token._value.symbol,
                usdValue
            }
        }
    }

    return aggregatedBalances;
}

function getTotalMarketCapOfCasamaHolders(aggregatedBalances) {
    let totalMarketCap = 0;
    for (const token in aggregatedBalances) {
        totalMarketCap += aggregatedBalances[token].usdValue;
    }
    return totalMarketCap;
}


async function retrieveCollectionsByAddress(address) {
    const response = await axios.get('https://api.opensea.io/api/v1/collections?asset_owner=' + address + '&offset=0&limit=50', {
        headers: {
            'accept': 'application/json',
            "Accept-Encoding": "gzip,deflate,compress"
        }
    })
    return response.data;
}

function countFWBHolders(filteredERCs) {
    let uniqueFWBHolders = 0;
    for (erc of filteredERCs) {
        if (erc._token._value.contractAddress._value === '0x35bD01FC9d6D5D81CA9E055Db88Dc49aa2c699A8') {
            uniqueFWBHolders += 1;
        }
    }
    return uniqueFWBHolders;
}

// No price available so use all ERCs not filtered
function countSharkDAOHolders(allERCs) {
    let uniqueSharkDAOHolders = 0;
    const SHARK_DAO_CONTRACT_ADDRESS = '0x232AFcE9f1b3AAE7cb408e482E847250843DB931';
    for (erc of allERCs) {
        if (erc._token._value.contractAddress._value === SHARK_DAO_CONTRACT_ADDRESS) {
            uniqueSharkDAOHolders += 1;
        }
    }
    return uniqueSharkDAOHolders;
}

function countSeedClubHolders(allERCs) {
    let uniqueSeedClubHolders = 0;
    const SEED_CLUB_CONTRACT_ADDRESS = '0xF76d80200226AC250665139B9E435617e4Ba55F9';
    for (erc of allERCs) {
        if (erc._token._value.contractAddress._value === SEED_CLUB_CONTRACT_ADDRESS) {
            uniqueSeedClubHolders += 1;
        }
    }

    return uniqueSeedClubHolders;
}

function countForeFrontHolders(allERCs) {
    let uniqueForeFrontHolders = 0;
    const FOREFRONT_CONTRACT_ADDRESS = '0x7E9D8f07A64e363e97A648904a89fb4cd5fB94CD';
    for (erc of allERCs) {
        if (erc._token._value.contractAddress._value === FOREFRONT_CONTRACT_ADDRESS) {
            uniqueForeFrontHolders += 1;
        }
    }

    return uniqueForeFrontHolders;
}

function countMoonbirdHolders(allNFTs) {
    let uniqueMoonbirdHolders = 0;
    const MOONBIRD_CONTRACT_ADDRESS = '0x23581767a106ae21c074b2276D25e5C3e136a68b';
    for (nft of allNFTs) {
        if (nft._data.tokenAddress._value === MOONBIRD_CONTRACT_ADDRESS) {
            uniqueMoonbirdHolders += 1;
        }
    }

    return uniqueMoonbirdHolders;
}

async function countFarcasterIdHolders(owners) {
    let farcasterIds = 0;
    for (casamaHolder of owners) {
        try {

            const response = await axios.get('https://api.farcaster.xyz/v2/user-by-verification', {
                params: {
                    'address': casamaHolder.walletAddress
                },
                headers: {
                    'accept': 'application/json',
                    'authorization': 'Bearer ===REDACTED='
                }
            });

            if (response.status === 200) {
                console.log("Farcaster ID found for address: ", casamaHolder.walletAddress, 'with username: ', response.data.result.user.username)
                farcasterIds += 1;
            } else {
                continue;
            }

        } catch (e) {
            console.log("Didn't find a Farcaster ID for address: ", casamaHolder.walletAddress)
        }

    }

    return farcasterIds;
}

function hasPurchasedNFTInLastTwoMonths(TWO_MONTHS_AGO_BLOCK_NUMBER, NFTsForWallet) {
    for (const nft of NFTsForWallet) {
        if (nft.toJSON().blockNumberMinted > TWO_MONTHS_AGO_BLOCK_NUMBER) {
            return true;
        }
    }
    return false;
}
    

main();
