import Web3 from 'web3';
import store from '../../store/index';
import ABI from './api.json';
import Vue from 'vue';

class NFTTool {
    // 当前链判断
    async switchChain() {
        const { ethereum } = window;
        try {
            //切换以太坊节点
            await ethereum.request({
                method: "wallet_switchEthereumChain",
                params: [{ chainId: process.env.VUE_APP_CHAINID }],
            });
        } catch (switchError) {
            //添加以太坊节点
            //4902  节点未找到
            if (switchError.code === 4902) {
                const params = [
                    {
                        chainId: process.env.VUE_APP_CHAINID, // A 0x-prefixed hexadecimal string
                        chainName: process.env.VUE_APP_CHAINNAME,
                        rpcUrls: [process.env.VUE_APP_RPC],
                        blockExplorerUrls: [process.env.VUE_APP_BLOCK],
                    },
                ];
                try {
                    await ethereum.request({
                        method: "wallet_addEthereumChain",
                        params: params,
                    });
                } catch (addError) {
                    // handle "add" error
                    return 0;
                }
            }
        }
    }
    //调用合约领取
    async ReceiveChain(_address, _resource, _ticket, _sign) {
        return new Promise(async (reslove, reject) => {
            const { ethereum } = window;
            let web3;
            if (ethereum.selectedAddress) {
                web3 = new Web3(window.web3.currentProvider);
            } else {
                reslove(0);
                Vue.prototype.$notify({ type: "danger", message: '您尚未连接您的数字钱包，请在连接后重试' })
                store.dispatch('loginIn');
            };
            await this.switchChain();
            // return
            let contract_address = '0xDfFDf9836d66d896759c254260D6211C553d78A8';
            let contract_methods = new web3.eth.Contract(ABI, contract_address);
            contract_methods.methods.mint(_address, _resource, _ticket, _sign).send({ from: ethereum.selectedAddress }).then((res) => {
                reslove(1);
            }).catch(err => {
                if (err.code == 4001) {
                    Vue.prototype.$notify({ type: "danger", message: '您已取消领取' })
                } else {
                    Vue.prototype.$notify({ type: "danger", message: '网络错误，请稍后再试' })
                }
                reslove(0);
            })

        })
    }
}
export default new NFTTool();
