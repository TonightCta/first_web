import Vue from 'vue';
import * as api from '../request/api';
import EthTool from './web3/index';
let lang = sessionStorage.getItem('language') || 'zh-CN';
import store from '../store/index';
//图片转换
export function dataURLtoFile(base, filename) {
    let arr = base.split(','),
        mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]),
        n = bstr.length,
        u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n)
    }
    return new File([u8arr], filename, { type: mime })
};
//支付链判断
export function getNetworkType(_chain) {
    const { ethereum } = window;
    const condition = (_chain == ethereum.chainId);
    if (!condition) {
        Vue.prototype.$notify({
            type: "danger",
            message: lang == 'en' ? 'Please switch to the corresponding blockchain network' : '请切换至对应公链'
        });
        return;
    }
    return 'next'
}
//获取地址栏参数
export function GetUrlKey(name, url) {
    return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(url) || [, ""])[1].replace(/\+/g, '%20')) || null
};
//返回顶部
export function scrollBack() {
    const container = document.querySelector('.mine-view');
    container && container.scrollTo({
        top: 0,
        behavior: "smooth",
    });
};
//无导航返回顶部
export function scrollInner() {
    window.scrollTo({
        top: 0,
        behavior: "smooth",
    });
};
//PDF指纹追加
export function PDFLock(_type, _id, _device, _is_old) {
    /**
     * @param _type 文件类型
     * @param _id 文件对应数据ID
     * @param _device 设备类型
     * @param _is_old 新 / 旧版区分
    */

    const lock = async () => {
        const params = {
            type: _type,
            id: _id,
            device: _device,
            is_old: _is_old
        };
        const result = await api.PDFLockFinger(params);
        return;
        result.data ? window.open(reuslt.data) : Vue.prototype.$notify({ type: 'danger', message: result.msg });
    };
    lock();
};
class ChainTool {
    //切换公链
    async chooseChain(_chain, _index) {
        /**
         * @param _chain 节点列表
         * @param _index 当前节点下标
        */
        const { ethereum } = window;
        try {
            //切换以太坊节点
            await ethereum.request({
                method: "wallet_switchEthereumChain",
                params: [{ chainId: _chain[_index].chain_id }],
            });
        } catch (switchError) {
            // This error code indicates that the chain has not been added to MetaMask.
            //添加以太坊节点
            //4902  节点未找到
            if (switchError.code === 4902) {
                const params = [
                    {
                        chainId: _chain[_index].chain_id, // A 0x-prefixed hexadecimal string
                        chainName: _chain[_index].network_name,
                        nativeCurrency: {
                            name: _chain[_index].name,
                            symbol: _chain[_index].symbol, // 2-6 characters long
                            decimals: _chain[_index].decimals,
                        },
                        rpcUrls: [_chain[_index].rpc_url],
                        blockExplorerUrls: [_chain[_index].explorer],
                    },
                ];
                try {
                    await ethereum.request({
                        method: "wallet_addEthereumChain",
                        params: params,
                    });
                } catch (addError) {
                    // handle "add" error
                }
            }
            // handle other "switch" errors
        }
    }
    //钱包支付 --> 合约支付
    async payContract(params) {
        return new Promise(async (resolve, reject) => {
            /**
             * @param _chain 节点列表
             * @param _chain_type 当前选中节点
             * @param _coin_type 当前选择资产类型  USDT / USDC
             * @param _order_num 当前操作订单Number
             */
            const _params = params;
            const { ethereum } = window;
            //未安装钱包
            !ethereum && (Vue.prototype.$notify({ type: "danger", message: lang == 'en' ? 'Your browser does not have a wallet installed' : '您的浏览器尚未安装钱包', }), resolve(0));
            // 钱包是否解锁
            const lockStatus = await ethereum._metamask.isUnlocked()
            // console.log(lock)
            !lockStatus && (Vue.prototype.$notify({ type: "danger", message: lang == 'en' ? 'Please unlock your digital wallet first.' : '请先解锁您的数字钱包', }), resolve(0));
            //是否连接钱包
            !ethereum.selectedAddress && (await store.dispatch('loginIn'), resolve(0));
            //当前节点判断
            const netWorkType = getNetworkType(
                params._chain[params._chain_type].chain_id
            );
            const next = async () => {
                //支付参数
                const payMsg = {
                    order_number: _params._order_num,
                    chain_id: _params._chain[_params._chain_type].id,
                    coin_id: _params._chain[_params._chain_type].coin[_params._coin_type].id,
                };
                //获取支付信息
                const result = await api.payMsg(payMsg);
                if (result.code != 2000) {
                    Vue.prototype.$notify({
                        type: "danger",
                        message: result.msg,
                    });
                    resolve(0);
                }
                //支付信息
                const params = {
                    _address: result.data.contactAddress,
                    _token_address: result.data.coin_address,
                    _event: result.data.transfer,
                    _discimal:
                        "1e" + _params._chain[_params._chain_type].coin[_params._coin_type].decimals,
                    _amount: result.data.amount,
                    _gas_price: result.data.ges_price,
                    _coin_name:
                        _params._chain[_params._chain_type].coin[_params._coin_type].name +
                        " - ERC20",
                };
                //调用metamask进行支付
                const wallet = await EthTool.tract(params);
                if (!wallet) {
                    resolve(0);
                } else if (wallet.code == 4001) {
                    Vue.prototype.$notify({
                        type: "danger",
                        //您已取消支付
                        message: lang == 'en' ? 'You’ve cancelled the payment' : '您已取消支付',
                    });
                    resolve(0);
                } else {
                    //绑定交易hash
                    const bindMsg = {
                        order_number: _params._order_num,
                        hash: wallet,
                        address: ethereum.selectedAddress,
                        chain_id: _params._chain[_params._chain_type].id,
                        coin_id: _params._chain[_params._chain_type].coin[_params._coin_type].id,
                    };
                    //绑定订单Hash
                    await api.bindHash(bindMsg);
                    resolve(wallet);
                }
            };
            netWorkType == 'next' ? next() : resolve(0);
        })
    }
};
export default new ChainTool();
//拖拽指令
Vue.directive('dragscroll', function (el) {
    el.onmousedown = function (ev) {
        const disX = ev.clientX;
        const disY = ev.clientY;
        const originalScrollLeft = el.scrollLeft;
        const originalScrollTop = el.scrollTop;
        const originalScrollBehavior = el.style['scroll-behavior'];
        const originalPointerEvents = el.style['pointer-events'];
        el.style['scroll-behavior'] = 'auto';
        document.onmousemove = function (ev) {
            ev.preventDefault();
            const distanceX = ev.clientX - disX;
            const distanceY = ev.clientY - disY;
            el.scrollTo(originalScrollLeft - distanceX, originalScrollTop - distanceY);
            el.style['pointer-events'] = 'none';
        }
        document.onmouseup = function () {
            document.onmousemove = null;
            document.onmouseup = null;
            el.style['scroll-behavior'] = originalScrollBehavior;
            el.style['pointer-events'] = originalPointerEvents;
        }
    }
});
//PDF下载
export function downPDF(_url) {
    let x = new XMLHttpRequest();
    x.open("GET", _url, true);
    x.responseType = "blob";
    let url_name = _url;
    let urlArr = url_name.split("?");
    let k = urlArr[0];
    let appU = k.split("/");
    x.onload = (e) => {
        let url = window.URL.createObjectURL(x.response);
        let a = document.createElement("a");
        a.href = url;
        a.download = `${appU[appU.length - 2]}-${appU[appU.length - 1]}`;
        a.click();
    };
    x.send();
};
