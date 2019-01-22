export class Item extends g.FrameSprite {
    score: number;
    id: number;
    private static ID: number = 0;
    static SCORES: number[] = [10, 200, 0];

    moveYSpeed: number = 0;
    moveYSpeedDiff: number = 0;
    moveYCurrentSpeed: number = 0;

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

        if (this.itemId === 2) {
            this.moveYSpeed = g.game.random.get(-10, 10);
            this.moveYSpeedDiff = 1;
        }
    }

    onUpdate(speed: number) {
        if (this.destroyed()) {
            return;
        }

        this.x -= speed / g.game.fps;
        if (this.itemId === 2) {
            this.x -= g.game.random.get((speed / 4), (speed / 4) * 3) / g.game.fps;
            if (this.moveYCurrentSpeed === 0) {
                this.moveYSpeed = -this.moveYSpeed;
                this.moveYCurrentSpeed = this.moveYSpeed;
            }

            if (this.moveYCurrentSpeed > 0) {
                this.moveYCurrentSpeed--;
            } else {
                this.moveYCurrentSpeed++;
            }

            this.y += this.moveYCurrentSpeed;
        }
        this.modified();
    }

}