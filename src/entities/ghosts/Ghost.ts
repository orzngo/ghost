import {MainScene} from "../../scenes/MainScene";
import {Team} from "./Team";

export class Ghost extends g.E {
    private static ID: number = 0;

    body: g.FrameSprite;
    face: g.FrameSprite;

    id: number;
    isDead: boolean = false;
    actionOrder: ActionOrder | undefined;

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
            frames: [this.ghostParams.faceId],
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

    onUpdate(frameCount: number, team: Team): void {
        if (this.destroyed()) {
            return;
        }

        const teamIndex = team.getIndex(this);

        if (teamIndex >= 0) {
            this.updateOrder(frameCount, team, teamIndex);

            if (!this.actionOrder) {
                return;
            }

            if (this.actionOrder.order === "down") {
                this.y += this.ghostParams.downSpeed / g.game.fps;
            } else if (this.actionOrder.order === "up") {
                this.y -= this.ghostParams.upSpeed / g.game.fps;
            }
            this.modified();
        } else { // 野良ゴーストの処理
            this.x -= team.getSpeed() / g.game.fps;
        }
    }

    private updateOrder(frameCount: number, team: Team, index: number): void {
        if (index < 0 || index === undefined) {
            return;
        }

        // 先頭の場合、チームのオーダーを自身のオーダーとする
        if (index === 0) {
            this.order(team.actionOrder);
        } else { // 後続の場合、基本的には前方と距離が離れたらupdateする
            const front = team.getFrontMember(this);
            if (front) {
                const distance = front.y - this.y;
                if (distance > this.ghostParams.distance) {
                    this.order({order: "down", frameCount: frameCount});
                } else if (distance < -this.ghostParams.distance) {
                    this.order({order: "up", frameCount: frameCount});
                } else {
                    //this.order({order: "keep", frameCount: frameCount});
                }

            }
        }
    }
}

export interface GhostParams {
    faceId: number;
    speed: number;
    reactionSpeed: number;
    upSpeed: number;
    downSpeed: number;
    distance: number;
}

const DefaultGhost: GhostParams = {
    faceId: 0,
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