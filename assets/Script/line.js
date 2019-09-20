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

    onLoad () {
        this.node.scale = 0;
        this.node.runAction(cc.scaleTo(1, 1).easing(cc.easeCubicActionOut()));
        this.node.runAction(cc.sequence(cc.fadeIn(0.2), cc.fadeOut(0.2), cc.fadeIn(0.2), cc.fadeOut(0.2), cc.fadeIn(0.2)));
        this.scheduleOnce(function () {
            this.node.runAction(cc.scaleTo(0.5, 0).easing(cc.easeCubicActionIn()))
        }, this.node.duration + 2);
    }
});
