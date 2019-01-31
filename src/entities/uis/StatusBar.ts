import FilledRect = g.FilledRect;

export class StatusBar extends g.E {
    static HEIGHT: number = 36;


    background: g.FilledRect;

    constructor(scene: g.Scene) {
        super({scene: scene});
        this.background = new FilledRect({
            scene: scene,
            width: g.game.width,
            height: StatusBar.HEIGHT,
            cssColor: "rgba(192,0,32,0.7)"
        });
        this.append(this.background);
        this.width = this.background.width;
        this.height = this.background.height;
    }

    updateScore(score: number): void {

    }
}