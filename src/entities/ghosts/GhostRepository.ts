import {Ghost} from "./Ghost";

export class GhostRepository {
    ghosts:Ghost[] =[];

    scene:g.Scene;

    constructor(scene:g.Scene) {
        this.scene = scene;
    }

    // factoryつくんのめんどい
    create(faceId:number, withSave:boolean = true):Ghost {
        if (faceId > ghostParams.length) {
            throw new Error("Invalid faceId");
        }
        const ghost = new Ghost({scene: this.scene}, ghostParams[faceId]);
        ghost.start();
        if (withSave) {
            this.save(ghost);
        }
        return ghost;
    }


    save(ghost:Ghost):void {
        this.ghosts.push(ghost);
    }

    delete(target:Ghost):void {
        const newGhosts:Ghost[] = [];
        this.ghosts.forEach((ghost) => {
            if (target.id === ghost.id) {
                return;
            }
            newGhosts.push(ghost);
        });
        this.ghosts = newGhosts;
    }

    reset():void {
        this.ghosts.forEach((ghost) => {
            ghost.destroy();
        });
        this.ghosts = [];
    }
}


const ghostParams = [
    {
        faceId: 0,
        speed: 5,
        reactionSpeed: 5,
        upSpeed: 16,
        downSpeed: 16
    },
    {
        faceId: 1,
        speed: 5,
        reactionSpeed: 5,
        upSpeed: 16,
        downSpeed: 16
    }
];