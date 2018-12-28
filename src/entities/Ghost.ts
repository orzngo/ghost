export class Ghost extends g.E {
    static ID: number = 0;

    body: g.FrameSprite;
    face: g.FrameSprite;

    id: number;
    isDead: boolean = false;

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
    }

    onUpdate(): void {
        if (!this.isDead) {
            return;
        }
    }
}

export interface GhostParams {
    faceId: number;
    speed: number;
    reactionSpeed: number;
    upSpeed: number;
    downSpeed: number;
}

const DefaultGhost: GhostParams = {
    faceId: 0,
    speed: 5,
    reactionSpeed: 5,
    upSpeed: 5,
    downSpeed: 5
};