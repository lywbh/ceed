// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    onLoad() {
        this.openInput();
    },

    onDestroy() {
        this.cancelInput();
    },

    openInput() {
        this.node.on(cc.Node.EventType.MOUSE_DOWN, this.onPress, this);
        this.node.on(cc.Node.EventType.TOUCH_START, this.onPress, this);
    },

    cancelInput() {
        this.node.off(cc.Node.EventType.MOUSE_DOWN, this.onPress, this);
        this.node.off(cc.Node.EventType.TOUCH_START, this.onPress, this);
    },

    onPress() {
        var acc = Math.abs(this.node.offset - cc.audioEngine.getCurrentTime(this.node.musicId));
        // TODO 判定阈值待实测
        // TODO 播放判定动画
        if (acc < 0.2) {
            // 满分
        } else if (acc < 0.5) {
            // 警告
        } else {
            // miss
        }
        this.node.destroy();
    },

    update(dt) {
        if (this.node.position.y < -900) {
            this.node.destroy();
        }
    }
});
