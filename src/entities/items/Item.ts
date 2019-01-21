export class Item extends g.FrameSprite {
    score: number;
    id: number;
    private static ID: number = 0;
    static SCORES: number[] = [10, 200, 0];

    constructor(scene: g.Scene, public itemId: number = 0) {
        super({
            src: (<g.ImageAsset>scene.assets["item"]),
            width: 32,
            height: 32,
            srcWidth: 32,
            srcHeight: 32,
            scene: scene,
            frames: [itemId],
            interval: 0
        });
        this.score = Item.SCORES[itemId];
        this.id = Item.ID;
        Item.ID++;
    }

    onUpdate(speed: number) {
        if (this.destroyed()) {
            return;
        }

        this.x -= speed / g.game.fps;
    }

}