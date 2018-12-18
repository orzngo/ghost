import {ResultScene} from "./ResultScene";
import {Ghost} from "../entities/Ghost";

declare var window: any;

export class MainScene extends g.Scene {
    frameCount: number = 0;

    isRunning: boolean;

    constructor(public remainingTime: number) {
        super({game: g.game, assetIds: ["ghost", "item", "face"]});

        this.loaded.addOnce(() => {
            this.initialize();
        });
    }

    initialize(): void {
        this.append(new g.FilledRect({scene: this, width: g.game.width, height: g.game.height, cssColor: "white"}));

        const ghost = new Ghost({scene: this});
        this.append(ghost);
        ghost.start();

        this.update.add(() => {
            this.mainLoop();
        });
        this.isRunning = true;
    }

    mainLoop(): void {

        this.frameCount++;


        // 終了演出のため、残り時間より少し早めにゲームを止める
        if (this.getRemainingTime() === 5 && this.isRunning) {
            this.isRunning = false;
        }

        if (this.getRemainingTime() === 0) {
            this.finalize();
        }
    }

    finalize(): void {
        g.game.replaceScene(new ResultScene());
    }

    getRemainingTime(): number {
        return this.remainingTime - Math.floor(this.frameCount / this.game.fps);
    }
}