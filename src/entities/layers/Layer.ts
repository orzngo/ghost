export class Layer extends g.E{
    id:number;
    private static ID:number = 0;

    constructor(scene:g.Scene, public name:string, public isClickableLayer:boolean = false) {
        super({scene:scene});
        this.width = scene.game.width;
        this.height = scene.game.height;
        this.modified();
        this.id = Layer.ID;
        Layer.ID++;

        // TODO:LayerManagerができるまでの暫定処理
        this.touchable = this.isClickableLayer;
    }
}