import {Team} from "./Team";
import {Layer} from "../layers/Layer";


export class Ghost extends g.E {
    private static ID: number = 0;
    private static EATING_COUNT: number = g.game.fps / 4;

    body: g.FrameSprite;
    face: g.FrameSprite;

    id: number;
    isDead: boolean = false;
    actionOrder: ActionOrder | undefined;
    eatingCount: number = 0;

    constructor(params: g.EParameterObject, public ghostParams: GhostParams = DefaultGhost) {
        super(params);
        this.id = Ghost.ID;
        Ghost.ID++;

        this.body = new g.FrameSprite({
            src: (<g.ImageAsset>this.scene.assets["ghost"]),
            width: 64,
            height: 64,
            srcWidth: 64,
            srcHeight: 64,
            scene: this.scene,
            frames: [0, 1, 2, 1],
            interval: 250
        });
        this.append(this.body);
        this.width = this.body.width;
        this.height = this.body.height;

        this.face = new g.FrameSprite({
            src: (<g.ImageAsset>this.scene.assets["face"]),
            width: 32,
            height: 32,
            srcWidth: 32,
            srcHeight: 32,
            scene: this.scene,
            frames: [this.ghostParams.type],
            interval: 0
        });
        this.face.x = 32;
        this.body.append(this.face);
    }


    start(): void {
        this.body.start();
    }

    stop(): void {
        this.body.stop();
    }

    getSpeed(): number {
        return this.ghostParams.speed;
    }

    kill(): void {
        this.isDead = true;
        this.opacity = 0.5;
        this.modified();
    }

    order(order: ActionOrder): void {
        this.actionOrder = order;
    }

    feedScore(): void {
        this.eatingCount = Ghost.EATING_COUNT;
    }

    onUpdate(frameCount: number, team: Team, layer: Layer): void {
        if (this.destroyed()) {
            return;
        }

        const teamIndex = team.getIndex(this);

        if (teamIndex >= 0) {
            this.updateEating(team);

            this.updateOrder(frameCount, team, teamIndex);

            if (!this.actionOrder) {
                return;
            }

            if (this.actionOrder.order === "down") {
                this.y += this.ghostParams.downSpeed / g.game.fps;
            } else if (this.actionOrder.order === "up") {
                this.y -= this.ghostParams.upSpeed / g.game.fps;
            }
            if (this.y < 0) {
                this.y = 0;
            } else if (this.y > layer.height - this.height) {
                this.y = layer.height - this.height;
            }
            this.modified();
        } else { // 野良ゴーストの処理
            this.x -= team.getSpeed() / g.game.fps;
            if (this.isDead) {
                this.y -= 60 / g.game.fps;
            }
            this.modified();
        }
    }

    private updateEating(team: Team): void {
        // 前のゴーストが食べてたら自分も食べてる状態になる
        const front = team.getFrontMember(this);
        if (front && front.eatingCount > (Ghost.EATING_COUNT * 0.4)) {
            this.feedScore();
        }

        if (this.eatingCount > 0) {
            this.eatingCount--;
        }
        this.scaleY = 1.0 - (0.5 * (this.eatingCount / Ghost.EATING_COUNT));
    }

    private updateOrder(frameCount: number, team: Team, index: number): void {
        if (index < 0 || index === undefined) {
            return;
        }

        // 先頭の場合、チームのオーダーを自身のオーダーとする
        if (index === 0) {
            if (this.ghostParams.type === GhostName.BOB) { // あまのじゃく
                this.order({
                    order: (team.actionOrder.order === "up") ? "down" : "up",
                    frameCount: team.actionOrder.frameCount
                });
            } else {
                this.order(team.actionOrder);
            }
        } else { // 後続の場合、基本的には前方と距離が離れたらupdateする
            const front = team.getFrontMember(this);
            if (front) {
                if (this.ghostParams.type === GhostName.BOB) { // あまのじゃくは直接オーダーを参照し、逆のことを行う
                    this.order({
                        order: (team.actionOrder.order === "up") ? "down" : "up",
                        frameCount: team.actionOrder.frameCount
                    });
                    return;
                }
                if (this.ghostParams.type === GhostName.MONO) { // 直接オーダーを参照する
                    this.order(team.actionOrder);
                    return;
                }
                const distance = front.y - this.y;
                if (distance > this.ghostParams.distance) {
                    this.order({order: "down", frameCount: frameCount});
                } else if (distance < -this.ghostParams.distance) {
                    this.order({order: "up", frameCount: frameCount});
                } else {
                    if (this.ghostParams.type === GhostName.SAM) {
                        this.order({order: "keep", frameCount: frameCount});
                    }
                    if (this.ghostParams.type === GhostName.BOON && this.actionOrder.order === "up") {
                        this.order({order: "keep", frameCount: frameCount});
                    }
                    if (this.ghostParams.type === GhostName.WOON && this.actionOrder.order === "down") {
                        this.order({order: "keep", frameCount: frameCount});
                    }
                }

            }
        }
    }
}

export interface GhostParams {
    type: GhostName;
    speed: number;
    reactionSpeed: number;
    upSpeed: number;
    downSpeed: number;
    distance: number;
}

const DefaultGhost: GhostParams = {
    type: 0,
    speed: 5,
    reactionSpeed: 5,
    upSpeed: 32,
    downSpeed: 32,
    distance: 10
};

export interface ActionOrder {
    frameCount: number;
    order: "up" | "down" | "keep";
}

export enum GhostName {
    BENI = 0,
    MOMO,
    SAM,
    BOON,
    WOON,
    TAKESHI,
    BOB,
    ONI,
    GAKI,
    MONO,
    BATSU,
    NAGA
}