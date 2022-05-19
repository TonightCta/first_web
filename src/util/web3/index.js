import Vue from 'vue';
import Web3 from 'web3';
import store from '../../store'
const web3js = window.web3;
import i18n from '../../lang/i18n';
let lang = new Vue({ i18n })

class EthTool {
  constructor() {  //web3配置
    // 端口配置
    this.flag = navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i);
    //切换账户监听
    if (typeof window.ethereum !== 'undefined') {
      // 切换账户时
      //TODO
      return;
      ethereum.on('accountsChanged', function (accounts) {
        if (accounts[0] != undefined) {
          const next = () => {
            const _address = accounts;
            window.localStorage.clear();
            window.sessionStorage.clear();
            store.dispatch('loginDiel', _address[0]);
          };
          !store.state.app.isBindAddress && next();
          // if (ethereum.selectedAddress) {
          // }
          // window.location.reload();
        } else {
          const next = () => {
            window.localStorage.clear();
            window.sessionStorage.clear();
            window.location.replace(process.env.VUE_APP_RESET)
          };
          !store.state.app.isBindAddress && store.state.app.account.wallet_addrsss && next();
        }
      });
      //切换网络监听
      ethereum.on('chainChanged', function (response) {
        const condition = (process.env.VUE_APP_CURRENTMODE == 'dev' || process.env.VUE_APP_CURRENTMODE == 'test')
          ? ethereum.chainId != "0x3" && ethereum.chainId != "0x13881"
          : ethereum.chainId != '0x1' && ethereum.chainId != '0x89';
        if (condition) {
          Vue.prototype.$notify({
            type: "danger",
            message: (process.env.VUE_APP_CURRENTMODE == 'dev' || process.env.VUE_APP_CURRENTMODE == 'test')
              ? '请切换至Ropsten测试网或Matic测试网'
              : '请切换至以太坊网或MATIC主网',
          });
        }
      });
    }
  }
  async signIn() {//登入
    if (typeof window.ethereum != 'undefined') {
      try {
        if (ethereum.selectedAddress != null) {
          let arr = [];
          arr.push(ethereum.selectedAddress)
          return arr;
        } else {
          const result = await ethereum.request({ method: 'eth_requestAccounts' }) // 登录调用
          result.push('1')
          return result;
        }
      } catch (err) {
        return err
      }
    } else {
      Vue.prototype.$notify({ type: 'danger', message: lang.$t('notify.un_wallet') });
    }
  }
  async sign(_address, _nonce) {//签名登录
    return new Promise((resolve, reject) => {
      let web3Provider;
      if (window.ethereum) {
        web3Provider = window.ethereum;
      } else if (web3js) {
        web3Provider = web3js.currentProvider;
      }
      let web3j = new Web3(web3Provider);
      web3j.eth.personal.sign(_nonce, _address, (err, signature) => {
        if (signature == undefined) {
          resolve(null)
          if (this.flag != null) {
            // 您已取消签名授权
            Toast(lang.$t('notify.cancel_sign'))
          } else {
            Vue.prototype.$notify({ type: 'danger', message: lang.$t('notify.cancel_sign') });
          }
        } else {
          resolve(signature)
        }
      })
    });
  };
  async isConnected(){//检查钱包连接
    const result = web3js.currentProvider.isConnected();
    return result;
  };
  async getAccount(){//获取用户信息
    const result = web3js.eth.getAccounts();
    return result;
  };
  async tract(params) {//支付
    if (ethereum.selectedAddress == null) {
      Vue.prototype.$notify({ type: 'danger', message: lang.$t('notify.lost_contact') });
      return;
    }
    const balance = await ethereum.request({
      method: 'eth_call',
      params: [{
        "from": ethereum.selectedAddress,
        "to": params._token_address,
        "data": "0x70a08231000000000000000000000000" + ethereum.selectedAddress.replace('0x', '')
      }, 'latest']
    });
    const price = ('0x' + params._amount) / process.env.VUE_APP_PRE;
    const userBal = balance / process.env.VUE_APP_PRE;
    if (userBal < price) {
      let msg = (store.state.app.language == 'en' ? 'Your ' : '您的 ') + params._coin_name + (store.state.app.language == 'en' ? ' balance is insufficient' : ' 余额不足')
      Vue.prototype.$notify({ type: 'danger', message: msg });
    } else {
      const transactionParameters = {
        from: ethereum.selectedAddress,
        to: params._token_address,
        value: "0x000000000000000",
        gasPrice: params._gas_price,
        gas: '0x13880',
        data: `${params._event}000000000000000000000000${params._address}${params._amount}`
      };
      try {
        const txHash = await ethereum.request({
          method: 'eth_sendTransaction',
          params: [transactionParameters],
        });
        return txHash
      } catch (err) {
        return err
      }
    }
  };
  // async testTract(params){
  //   // Create a connector
  //   const connector = new WalletConnect({
  //     bridge: "https://bridge.walletconnect.org", // Required
  //     qrcodeModal: QRCodeModal,
  //   });
  //   // if (!connector.connected) {
  //   //   // create new session
  //   //   connector.createSession();
  //   // }else{
  //   //
  //   // }
  //   const transactionParameters = {
  //     from:ethereum.selectedAddress,
  //     to:params._token_address,
  //     value: "0x000000000000000",
  //     gasPrice: params._gas_price,
  //     gas: '0x13880',
  //     data:`${params._event}000000000000000000000000${params._address}${params._amount}`
  //   };
  //   console.log(transactionParameters)
  //   console.log(web3j.eth.sendTransaction())
  //   const txHash = await connector.sendTransaction(transactionParameters)
  //   console.log(txHash)
  // }
};

export default new EthTool();
