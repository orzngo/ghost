export class Ghost extends g.E {

    body: g.FrameSprite;
    face: g.FrameSprite;

    constructor(params: g.EParameterObject, faceId: number = 0) {
        super(params);

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
            frames: [faceId],
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

}