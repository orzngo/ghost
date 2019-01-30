export class Layer extends g.E {
    id: number;
    private static ID: number = 0;

    constructor(
        scene: g.Scene,
        public name: string,
        size: g.CommonSize = {width: scene.game.width, height: scene.game.height}
    ) {
        super({scene: scene});
        this.width = size.width;
        this.height = size.height;
        this.modified();
        this.id = Layer.ID;
        Layer.ID++;
    }
}