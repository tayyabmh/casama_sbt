


export async function getERC20sForAddress(address, chain) {
    const response = await Moralis.EvmApi.token.getWalletTokenBalances({
        address,
        chain
    });
    return response.result;
}