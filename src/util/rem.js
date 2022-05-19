const baseSize = 37.5
function setRem(){
    const scale = document.documentElement.clientWidth / 1080;
    // 设置页面根节点字体大小
    document.documentElement.style.fontSize = (baseSize * Math.min(scale, 2)) + 'px';
};
setRem();
window.onresize = function() {
    setRem()
};