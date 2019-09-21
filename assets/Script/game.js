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
        linePrefab: {
            default: null,
            type: cc.Prefab
        },
        notePrefab: {
            default: null,
            type: cc.Prefab
        }
    },

    onLoad() {
        cc.director.getPhysicsManager().enabled = true;
        cc.director.getPhysicsManager().gravity = cc.v2(0, -3200);
        var self = this;
        cc.loader.loadRes("beatmaps/list", cc.JsonAsset, function (err, listMap) {
            var id = listMap.json[Global.CURRENT_SONG_INDEX];
            cc.loader.loadRes("beatmaps/" + id + "/beatmap", cc.JsonAsset, function (err, map) {
                cc.loader.loadRes("beatmaps/" + id + "/" + map.json.music, cc.AudioClip, function (err, clip) {
                    self.lines = map.json.game.lines;
                    self.notes = map.json.game.notes;
                    self.lineCount = 0;
                    self.noteCount = 0;
                    cc.audioEngine.stopAll();
                    self.musicId = cc.audioEngine.play(clip, false, 1);
                });
            });
        });
    },

    update(dt) {
        if (this.musicId >= 0) {
            this.genLine();
            this.genNote();
        }
    },

    genLine() {
        var lines = this.lines[this.lineCount];
        if (lines) {
            for (var i in lines) {
                var line = lines[i];
                if (cc.audioEngine.getCurrentTime(this.musicId) >= line.offset - 2) {
                    if (i === '0') {
                        this.lineCount++;
                    }
                    var lineNode = cc.instantiate(this.linePrefab);
                    lineNode.position = line.position;
                    lineNode.duration = line.duration;
                    this.node.getChildByName("lines").addChild(lineNode);
                }
            }
        }
    },

    genNote() {
        var notes = this.notes[this.noteCount];
        if (!notes) {
            this.handleGameOver();
        } else {
            for (var i in notes) {
                var note = notes[i];
                var [genPos, genVelocity, t] = this.getNoteInit(note.position);
                if (cc.audioEngine.getCurrentTime(this.musicId) >= note.offset - t) {
                    if (i === '0') {
                        this.noteCount++;
                    }
                    if (note.type === 1) {
                        // 出note
                        var noteNode = cc.instantiate(this.notePrefab);
                        noteNode.musicId = this.musicId;
                        noteNode.offset = note.offset;
                        noteNode.position = genPos;
                        // TODO 这个在手机上无效，导致后边的note点击区域覆盖前边的，完全无法玩，正在解决
                        noteNode.zIndex = this.notes.length - this.noteCount;
                        noteNode.getComponent(cc.RigidBody).linearVelocity = genVelocity;
                        this.node.getChildByName("notes").addChild(noteNode);
                    } else if (note.type === 2) {
                        // TODO 出面条或者什么类型
                    }
                }
            }
        }
    },

    getNoteInit(endPos) {
        var g = -cc.director.getPhysicsManager().gravity.y;
        var highPos = cc.v2(endPos.x * 3 / 4, endPos.y + this.node.height / 4);

        var hEnd = highPos.y - endPos.y;
        var tEnd = Math.sqrt(2 * hEnd / g);

        var hGen = highPos.y + this.node.height / 2;
        var tGen = Math.sqrt(2 * hGen / g);

        var vx = (endPos.x - highPos.x) / tEnd;
        var vy = Math.sqrt(2 * g * hGen);

        var t = tEnd + tGen;
        var xGen = endPos.x - vx * t;
        return [cc.v2(xGen, -this.node.height / 2), cc.v2(vx, vy), t];
    },

    handleGameOver() {
        this.musicId = -999;
        // TODO 游戏结束，切得分场景，这里先切回菜单
        this.getComponent(cc.Canvas).scheduleOnce(function() {
            cc.audioEngine.stopAll();
            cc.director.loadScene("list");
        }, 3);
    }
});
