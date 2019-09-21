// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

window.Global = {
    CURRENT_SONG_INDEX: 0
};

cc.Class({
    extends: cc.Component,

    properties: {
        left: {
            default: null,
            type: cc.Node
        },
        right: {
            default: null,
            type: cc.Node
        }
    },

    loadPreview(current) {
        var id = this.idList[current];
        if (id) {
            cc.audioEngine.stopAll();
            this.left.getComponent('left').cancelInput();
            this.right.getComponent('right').cancelInput();
            Global.CURRENT_SONG_INDEX = current;
            var self = this;
            cc.loader.loadRes("beatmaps/" + id + "/beatmap", cc.JsonAsset, function (err, map) {
                cc.loader.loadRes("beatmaps/" + id + "/" + map.json.background, cc.SpriteFrame, function (err, spriteFrame) {
                    var bgNode = self.node.getChildByName("background");
                    bgNode.opacity = 0;
                    bgNode.runAction(cc.fadeIn(0.5).easing(cc.easeCubicActionOut()));
                    bgNode.getComponent(cc.Sprite).spriteFrame = spriteFrame;
                });
                cc.loader.loadRes("beatmaps/" + id + "/" + map.json.music, cc.AudioClip, function (err, clip) {
                    cc.audioEngine.play(clip, false, 1);
                    self.left.getComponent('left').openInput();
                    self.right.getComponent('right').openInput();
                });
            });
        }
    },

    onLoad() {
        this.left.getComponent('left').list = this;
        this.right.getComponent('right').list = this;
        var self = this;
        cc.loader.loadRes("beatmaps/list", cc.JsonAsset, function (err, map) {
            self.idList = map.json;
            self.loadPreview(Global.CURRENT_SONG_INDEX);
        });
        this.openInput();
    },

    onDestroy() {
        this.cancelInput();
    },

    openInput() {
        this.node.on(cc.Node.EventType.TOUCH_START, this.onPress, this);
    },

    cancelInput() {
        this.node.off(cc.Node.EventType.TOUCH_START, this.onPress, this);
    },

    onPress (e) {
        cc.audioEngine.stopAll();
        cc.director.loadScene("game");
        e.stopPropagation();
    }
});
