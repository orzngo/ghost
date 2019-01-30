import {ResultScene} from "./ResultScene";
import {GhostRepository} from "../entities/ghosts/GhostRepository";
import {Layer} from "../entities/layers/Layer";
import {Team} from "../entities/ghosts/Team";
import {ItemRepository} from "../entities/items/ItemRepository";
import {StatusBar} from "../entities/uis/StatusBar";

declare var window: any;

export class MainScene extends g.Scene {
    frameCount: number = 0;

    ghostRepository: GhostRepository;
    itemRepository: ItemRepository;
    isRunning: boolean;

    backgroundLayer: Layer;
    gameLayer: Layer;
    topLayer: Layer;

    statusBar: StatusBar;


    // gameまわり
    score: number = 0;
    team: Team = new Team();
    createdItemCount: number = 0;
    tappedPoint: g.CommonOffset | undefined = undefined;

    constructor(public remainingTime: number) {
        super({game: g.game, assetIds: ["ghost", "item", "face", "meet", "eat", "dead"]});
        this.ghostRepository = new GhostRepository(this);
        this.itemRepository = new ItemRepository(this);
        this.backgroundLayer = new Layer(this, "background");
        this.gameLayer = new Layer(this, "main", {width: g.game.width, height: g.game.height - StatusBar.HEIGHT});
        this.topLayer = new Layer(this, "top");

        this.append(this.backgroundLayer);
        this.append(this.gameLayer);
        this.append(this.topLayer);

        this.loaded.addOnce(() => {
            this.initialize();
        });
    }

    initialize(): void {
        this.backgroundLayer.append(new g.FilledRect({
            scene: this,
            width: g.game.width,
            height: g.game.height,
            cssColor: "white"
        }));
        this.update.add(() => {
            this.mainLoop();
        });
        this.pointDownCapture.add((e: g.PointDownEvent) => {
            this.onPointDown(e);
        });
        this.pointUpCapture.add((e: g.PointUpEvent) => {
            this.onPointUp(e);
        });
        this.team = new Team();


        this.statusBar = new StatusBar(this);
        this.topLayer.append(this.statusBar);
        this.statusBar.x = 0;
        this.statusBar.y = this.topLayer.height - StatusBar.HEIGHT;


        const firstGhost = this.ghostRepository.create(0);
        firstGhost.x = (this.gameLayer.width / 2) - (firstGhost.width / 2);
        firstGhost.y = (this.gameLayer.height / 2) - (firstGhost.height / 2);

        this.team.append(firstGhost);
        this.team.appendMembersTo(this.gameLayer);

        this.team.order({frameCount: 0, order: "down"});
        this.isRunning = true;
    }

    mainLoop(): void {

        this.frameCount++;

        this.team.onUpdate();
        this.ghostRepository.ghosts.forEach((ghost) => {
            ghost.onUpdate(this.frameCount, this.team, this.gameLayer);
            if (ghost.y < -ghost.height || ghost.x < -ghost.width) {
                this.ghostRepository.delete(ghost);
            }
        });
        this.itemRepository.items.forEach((item) => {
            item.onUpdate(this.team.getSpeed());
            if (item.x < -item.width) {
                this.itemRepository.delete(item);
            }
        });

        this.checkCreateNomadGhost();
        this.checkCreateItem();
        this.checkHitGhost();
        this.checkHitItem();


        // 終了演出のため、残り時間より少し早めにゲームを止める
        if (this.getRemainingTime() === 5 && this.isRunning) {
            this.isRunning = false;
        }

        if (this.getRemainingTime() === 0) {
            this.finalize();
        }
    }

    onPointDown(e: g.PointDownEvent): void {
        // 上昇中でなかったら上昇命令を出す
        if (this.team.actionOrder.order !== "up") {
            this.team.order({frameCount: this.frameCount, order: "up"});
        }
        this.tappedPoint = e.point;
    }


    onPointUp(e: g.PointUpEvent): void {
        //上昇中だったら下降命令を出す
        if (this.team.actionOrder.order === "up") {
            this.team.order({frameCount: this.frameCount, order: "down"});
        }

    }

    createItem(difficulty: number): void {
        const itemIdRand: number = g.game.random.get(0, 100) - Math.floor(difficulty * 2.5);
        let itemId: number = 0;
        if (itemIdRand > 50) {
            itemId = 0;
        } else if (g.game.random.get(0, 9) > 5) {
            itemId = 2;
        } else {
            itemId = 1;
        }

        if (this.createdItemCount < 10) {
            itemId = 0;
        }

        const item = this.itemRepository.create(itemId);

        item.x = this.gameLayer.width;
        item.y = g.game.random.get(0, this.gameLayer.height - item.height);

        this.gameLayer.append(item);

        this.createdItemCount++;
        if (this.itemRepository.items.length <= 1) {
            return;
        }

        // 一番最後に作ったアイテムにかぶる座標の場合、いずれかにずらす
        const lastItem = this.itemRepository.items[this.itemRepository.items.length - 1];
        if (item.y > lastItem.y - lastItem.height && lastItem.y + lastItem.height < item.y) {
            if (g.game.random.get(0, 1) === 0) {
                item.y += item.height;
            } else {
                item.y -= item.height;
            }
        }
        if (item.x > lastItem.x - lastItem.width && lastItem.x + lastItem.width < item.x) {
            if (g.game.random.get(0, 1) === 0) {
                item.x += item.width;
            } else {
                item.x -= item.width;
            }
        }
    }

    createNomadGhost(): void {
        const ghost = this.ghostRepository.create(g.game.random.get(1, 11));
        ghost.scaleX = -1;
        ghost.x = this.gameLayer.width;
        ghost.y = g.game.random.get(0, this.gameLayer.height - ghost.height);
        this.gameLayer.append(ghost);
    }

    finalize(): void {
        g.game.replaceScene(new ResultScene());
    }

    getRemainingTime(): number {
        return this.remainingTime - Math.floor(this.frameCount / this.game.fps);
    }

    /**
     * ゴーストと野良ゴーストの当たり判定を行う
     * 野良同士、チーム同士の判定はしない
     *
     */
    checkHitGhost(): void {
        this.team.members.forEach((ghost) => {
            if (ghost.isDead) {
                return;
            }
            this.ghostRepository.ghosts.forEach((target) => {
                if (target.isDead) {
                    return;
                }
                if (this.team.getIndex(target) >= 0) {
                    return;
                }
                if (ghost.x >= target.x - ghost.width && ghost.y >= target.y - ghost.height && ghost.x <= target.x + target.width && ghost.y <= target.y + target.height) {
                    this.team.append(target);
                    this.team.appendMembersTo(this.gameLayer);
                    target.scaleX = 1;
                    (<g.AudioAsset>this.assets["meet"]).play();
                }
            });

            if (this.tappedPoint !== undefined && this.team.members.length > 1 && this.team.getIndex(ghost) === 0) {
                if (this.tappedPoint.x >= ghost.x && this.tappedPoint.x <= ghost.x + ghost.width && this.tappedPoint.y >= ghost.y && this.tappedPoint.y <= ghost.y + ghost.height) {
                    this.team.kick(this.team.members[0]);
                    (<g.AudioAsset>this.assets["dead"]).play();
                    this.tappedPoint = undefined;
                }
            }
        });
        this.tappedPoint = undefined;
    }

    /**
     * アイテムとチームの当たり判定
     *
     */
    checkHitItem(): void {
        this.team.members.forEach((ghost) => {
            if (ghost.isDead) {
                return;
            }
            this.itemRepository.items.forEach((target) => {
                let hit: boolean = false;
                if (ghost.x >= target.x - ghost.width && ghost.y >= target.y - ghost.height && ghost.x <= target.x + target.width && ghost.y <= target.y + target.height) {
                    hit = true;
                }
                if (!hit) {
                    return;
                }

                if (target.itemId === 2) {
                    if (this.team.members.length <= 1) {
                        return;
                    } else {
                        this.team.kick(ghost);
                        (<g.AudioAsset>this.assets["dead"]).play();
                    }
                } else {
                    ghost.feedScore();
                    const feedMemberNum: number = this.team.members.length - this.team.getIndex(ghost);
                    this.score += target.score * feedMemberNum;
                    (<g.AudioAsset>this.assets["eat"]).play();
                }
                this.itemRepository.delete(target);
            });
        });
    }

    checkCreateNomadGhost(): void {
        if (this.frameCount % Math.floor(g.game.fps * 3) !== 0) {
            return;
        }
        this.createNomadGhost();
    }

    checkCreateItem(): void {
        const difficulty: number = Math.floor(this.frameCount / (g.game.fps * 10)) + 1;
        if (g.game.random.get(0, 100) > difficulty) {
            return;
        }

        this.createItem(difficulty);
    }
}