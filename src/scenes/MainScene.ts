import {ResultScene} from "./ResultScene";
import {GhostRepository} from "../entities/ghosts/GhostRepository";
import {Layer} from "../entities/layers/Layer";
import {Team} from "../entities/ghosts/Team";
import {ItemRepository} from "../entities/items/ItemRepository";

declare var window: any;

export class MainScene extends g.Scene {
    frameCount: number = 0;

    ghostRepository: GhostRepository;
    itemRepository: ItemRepository;
    isRunning: boolean;

    backgroundLayer: Layer;
    gameLayer: Layer;
    topLayer: Layer;


    // gameまわり
    team: Team = new Team();
    createdGhostCount: number = 0;
    createdItemCount: number = 0;

    constructor(public remainingTime: number) {
        super({game: g.game, assetIds: ["ghost", "item", "face"]});
        this.ghostRepository = new GhostRepository(this);
        this.itemRepository = new ItemRepository(this);
        this.backgroundLayer = new Layer(this, "background");
        this.gameLayer = new Layer(this, "main");
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

        this.team.append(this.ghostRepository.create(0));
        this.team.appendMembersTo(this.gameLayer);

        this.team.order({frameCount: 0, order: "down"});
        this.isRunning = true;
    }

    mainLoop(): void {

        this.frameCount++;

        this.team.onUpdate();
        this.ghostRepository.ghosts.forEach((ghost) => {
            ghost.onUpdate(this.frameCount, this.team);
        });
        this.itemRepository.items.forEach((item) => {
            item.onUpdate(this.team.getSpeed());
            if (item.x < -item.width) {
                this.itemRepository.delete(item);
            }
        });

        this.checkCreateObject();
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
    }

    onPointUp(e: g.PointUpEvent): void {
        //上昇中だったら下降命令を出す
        if (this.team.actionOrder.order === "up") {
            this.team.order({frameCount: this.frameCount, order: "down"});
        }

    }

    createItem(difficulty: number): void {
        const itemIdRand: number = g.game.random.get(0, 100) - difficulty;
        let itemId: number = 0;
        if (itemIdRand > 40) {
            itemId = 0;
        } else if (g.game.random.get(0, 2) === 0) {
            itemId = 2;
        } else {
            itemId = 1;
        }

        if (this.createdItemCount < 10) {
            itemId = 0;
        }

        const item = this.itemRepository.create(itemId);
        item.x = g.game.width;
        item.y = g.game.random.get(0, g.game.height - item.height);

        this.gameLayer.append(item);

        this.createdItemCount++;
        if (this.itemRepository.items.length <= 1) {
            return;
        }

        // 一番最後に作ったアイテムにかぶるY座標の場合、上下いずれかにずらす
        const lastItem = this.itemRepository.items[this.itemRepository.items.length - 1];
        if (item.y > lastItem.y - lastItem.height && lastItem.y + lastItem.height < item.y) {
            if (g.game.random.get(0, 1) === 0) {
                item.y += item.height;
            } else {
                item.y -= item.height;
            }
        }
    }

    createNomadGhost(): void {
        let ghostId = 0;
        if (this.createdGhostCount < 3) {
            ghostId = g.game.random.get(0, 1);
        } else {
            ghostId = g.game.random.get(0, 11);
        }

        const ghost = this.ghostRepository.create(ghostId);
        ghost.scaleX = -1;
        ghost.x = g.game.width;
        ghost.y = g.game.random.get(0, g.game.height - ghost.height);
        this.gameLayer.append(ghost);
        this.createdGhostCount++;

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
        this.ghostRepository.ghosts.forEach((ghost) => {
            if (this.team.getIndex(ghost) === undefined) {
                return;
            }
            this.ghostRepository.ghosts.forEach((target) => {
                if (this.team.getIndex(target) >= 0) {
                    return;
                }
                if (ghost.x >= target.x - ghost.width && ghost.y >= target.y - ghost.height && ghost.x <= target.x + target.width && ghost.y <= target.y + target.height) {
                    this.team.append(target);
                    this.team.appendMembersTo(this.gameLayer);
                    target.scaleX = 1;
                }
            });
        });
    }

    checkHitItem(): void {

    }

    checkCreateObject(): void {
        const difficulty: number = Math.floor(this.frameCount / (g.game.fps * 10)) + 1;
        if (this.frameCount % 2 === 0) {
            return;
        }

        if (g.game.random.get(0, 100) > difficulty) {
            return;
        }

        if (g.game.random.get(0, 5) === 0) {
            this.createNomadGhost();
        } else {
            this.createItem(difficulty);
        }
    }
}