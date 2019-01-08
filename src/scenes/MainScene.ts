import {ResultScene} from "./ResultScene";
import {GhostRepository} from "../entities/ghosts/GhostRepository";
import {Layer} from "../entities/layers/Layer";
import {Team} from "../entities/ghosts/Team";
import {Ghost} from "../entities/ghosts/Ghost";

declare var window: any;

export class MainScene extends g.Scene {
    frameCount: number = 0;

    ghostRepository: GhostRepository;
    isRunning: boolean;

    backgroundLayer: Layer;
    gameLayer: Layer;
    topLayer: Layer;


    // gameまわり
    team: Team = new Team();

    constructor(public remainingTime: number) {
        super({game: g.game, assetIds: ["ghost", "item", "face"]});
        this.ghostRepository = new GhostRepository(this);
        this.backgroundLayer = new Layer(this, "background");
        this.gameLayer = new Layer(this, "main");
        this.topLayer = new Layer(this, "top");

        this.append(this.backgroundLayer);
        this.append(this.gameLayer);
        this.append(this.topLayer);

        this.loaded.addOnce(() => {
            this.initialize();
        });
    }

    initialize(): void {
        this.backgroundLayer.append(new g.FilledRect({
            scene: this,
            width: g.game.width,
            height: g.game.height,
            cssColor: "white"
        }));
        this.update.add(() => {
            this.mainLoop();
        });
        this.pointDownCapture.add((e: g.PointDownEvent) => {
            this.onPointDown(e);
        });
        this.pointUpCapture.add((e: g.PointUpEvent) => {
            this.onPointUp(e);
        });
        this.team = new Team();

        this.team.append(this.ghostRepository.create(0));
        this.team.append(this.ghostRepository.create(1));
        this.team.append(this.ghostRepository.create(0));
        this.team.append(this.ghostRepository.create(0));
        this.team.appendMembersTo(this.gameLayer);
        this.team.order({frameCount: 0, order: "down"});
        this.isRunning = true;
    }

    mainLoop(): void {

        this.frameCount++;

        this.team.onUpdate();
        (<any>window).console.log(this.team.actionOrder);

        this.ghostRepository.ghosts.forEach((ghost) => {
            ghost.onUpdate(this.frameCount, this.team);
        });

        // 終了演出のため、残り時間より少し早めにゲームを止める
        if (this.getRemainingTime() === 5 && this.isRunning) {
            this.isRunning = false;
        }

        if (this.getRemainingTime() === 0) {
            this.finalize();
        }
    }

    onPointDown(e: g.PointDownEvent): void {
        // 上昇中でなかったら上昇命令を出す
        if (this.team.actionOrder.order !== "up") {
            this.team.order({frameCount: this.frameCount, order: "up"});

        }
    }

    onPointUp(e: g.PointUpEvent): void {
        //上昇中だったら下降命令を出す
        if (this.team.actionOrder.order === "up") {
            this.team.order({frameCount: this.frameCount, order: "down"});
        }

    }

    finalize(): void {
        g.game.replaceScene(new ResultScene());
    }

    getRemainingTime(): number {
        return this.remainingTime - Math.floor(this.frameCount / this.game.fps);
    }
}