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
        this.node.scale = 0;
        var lifeTime = this.node.offset - cc.audioEngine.getCurrentTime(this.node.musicId);
        var scaleUp = cc.scaleTo(lifeTime, 1);
        var rigidBody = this.getComponent(cc.RigidBody);
        var vxStop = cc.callFunc(function () {
            rigidBody.linearVelocity = cc.v2(0, rigidBody.linearVelocity.y);
        }, this, rigidBody);
        var fadeOut = cc.fadeOut(0.2);
        this.node.runAction(cc.sequence(scaleUp, vxStop, fadeOut));
        this.openInput();
    },

    onDestroy() {
        this.cancelInput();
    },

    openInput() {
        this.node.once(cc.Node.EventType.TOUCH_START, this.onPress, this);
    },

    cancelInput() {
        this.node.off(cc.Node.EventType.TOUCH_START, this.onPress, this);
    },

    onPress(e) {
        // 下落期才能点击，防止误触
        if (this.getComponent(cc.RigidBody).linearVelocity.y < 0) {
            // 播放判定动画
            this.node.zIndex = -9999;
            this.getComponent(cc.RigidBody).linearVelocity = cc.v2(0, 0);
            var destroy = cc.callFunc(function () {
                this.node.destroy();
            }, this);
            this.node.runAction(cc.scaleTo(0.1, 2));
            this.node.runAction(cc.sequence(cc.fadeOut(0.1), destroy));
            // TODO 判定阈值待实测
            /*var acc = Math.abs(this.node.offset - cc.audioEngine.getCurrentTime(this.node.musicId));
            if (acc < 0.1) {
                // 满分
            } else if (acc < 0.3) {
                // 警告
            } else {
                // miss
            }*/
        }
    },

    update(dt) {
        if (this.node.opacity <= 0) {
            this.node.destroy();
        }
    }
});
