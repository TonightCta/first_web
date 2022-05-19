import Vue from 'vue';
import Web3 from 'web3';
const web3js = window.web3;
class EthToolTest {
    async test() {
        let web3Provider;
        if (window.ethereum) {
            web3Provider = window.ethereum;
        } else if (web3js) {
            web3Provider = web3js.currentProvider;
        }
        let web3j = new Web3(web3Provider);
        const result = await web3j.eth.getAccounts();
        console.log(result)
        return result
    }
};
export default new EthToolTest();

