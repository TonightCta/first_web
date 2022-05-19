
Node.js Version - 10.16.1


.env.dev - 开发环境
.env.test  - 测试环境
.env.master  - 生产环境

VUE_APP_BASEURL - 后台接口域名地址
VUE_APP_RESET - 退出登陆重定向地址

repuest/api  -  全局接口管理

util/index.js -  管理链工具配置
util/web3/index.js  -  Web3管理配置
util/nft/config.js  -  NFT相关合约交互配置

views/bureau  -  情报局项目
views/bureau_admin  -  移动端情报局管理（内部使用）
views/channel_business  -  渠道商控制台

vue.config.js - 设置本地代理环境

npm run serve:start - 本地开发启动
npm run build:test - 测试环境打包
npm run build:master = 生产环境打包

# 脚本

命令 bash build-test.sh / build-master.sh

build-test.sh  -   更新测试服务器
build-master.sh  -  更新主站

注:每次运行脚本时到文件内更新本次提交说明
