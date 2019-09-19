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

    properties: {
        notePrefab: {
            default: null,
            type: cc.Prefab
        }
    },

    onLoad() {
        cc.director.getPhysicsManager().enabled = true;
        cc.director.getPhysicsManager().gravity = cc.v2(0, -3200);
        var self = this;
        cc.loader.loadRes("beatmaps/test/beatmap", cc.JsonAsset, function (err, map) {
            cc.loader.loadRes("beatmaps/test/" + map.json.music, cc.AudioClip, function (err, clip) {
                self.notes = map.json.game.notes;
                self.n = 0;
                self.musicId = cc.audioEngine.play(clip, false, 1);
            });
        });
    },

    update(dt) {
        if (typeof(this.musicId) !== "undefined") {
            var note = this.notes[this.n];
            if (!note) {
                // TODO note用完了，稍等一会切到成绩场景
            } else {
                var g = -cc.director.getPhysicsManager().gravity.y;
                var h = note.fixPos.y - note.genPos.y;
                var v0 = Math.sqrt(2 * g * h);
                var t = v0 / g;
                var actualGenOffset = note.offset - t;
                if (cc.audioEngine.getCurrentTime(this.musicId) >= actualGenOffset) {
                    this.n++;
                    if (note.type === 1) {
                        // 出note
                        var noteNode = cc.instantiate(this.notePrefab);
                        noteNode.musicId = this.musicId;
                        noteNode.offset = note.offset;
                        noteNode.position = cc.v2(note.genPos.x, note.genPos.y);
                        noteNode.getComponent(cc.RigidBody).linearVelocity = cc.v2((note.fixPos.x - note.genPos.x) / t, v0);
                        this.node.addChild(noteNode);
                    } else if (note.type === 2) {
                        // TODO 出面条或者什么类型
                    }
                }
            }
        }
    }
});
