require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.17",
  networks: {
    'mumbai': {
      url: "",
    },
    'base-goerli': {
      url: "https://goerli.base.org",
    }
  }
};
