import {Ghost} from "./Ghost";

export class GhostRepository {
    ghosts: Ghost[] = [];

    scene: g.Scene;

    constructor(scene: g.Scene) {
        this.scene = scene;
    }

    // factoryつくんのめんどい
    create(faceId: number, withSave: boolean = true): Ghost {
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


    save(ghost: Ghost): void {
        this.ghosts.push(ghost);
    }

    delete(target: Ghost): void {
        const newGhosts: Ghost[] = [];
        this.ghosts.forEach((ghost) => {
            if (target.id === ghost.id) {
                return;
            }
            newGhosts.push(ghost);
        });
        this.ghosts = newGhosts;
        target.destroy();
    }

    reset(): void {
        this.ghosts.forEach((ghost) => {
            ghost.destroy();
        });
        this.ghosts = [];
    }
}


const ghostParams = [
    {
        faceId: 0,
        speed: 20,
        reactionSpeed: 10,
        upSpeed: 60,
        downSpeed: 60,
        distance: 15,
    },
    {
        faceId: 1,
        speed: 20,
        reactionSpeed: 10,
        upSpeed: 50,
        downSpeed: 50,
        distance: 20,
    },
    {
        faceId: 2,
        speed: 20,
        reactionSpeed: 10,
        upSpeed: 80,
        downSpeed: 80,
        distance: 50,
    },
    {
        faceId: 3,
        speed: 6,
        reactionSpeed: 10,
        upSpeed: 80,
        downSpeed: 50,
        distance: 20,
    },
    {
        faceId: 4,
        speed: 7,
        reactionSpeed: 10,
        upSpeed: 50,
        downSpeed: 80,
        distance: 20,
    },
    {
        faceId: 5,
        speed: 20,
        reactionSpeed: 10,
        upSpeed: 60,
        downSpeed: 60,
        distance: 20,
    },
    {
        faceId: 6,
        speed: 20,
        reactionSpeed: 10,
        upSpeed: 60,
        downSpeed: 60,
        distance: 20,
    },
    {
        faceId: 7,
        speed: 20,
        reactionSpeed: 10,
        upSpeed: 50,
        downSpeed: 50,
        distance: 20,
    },
    {
        faceId: 8,
        speed: 20,
        reactionSpeed: 10,
        upSpeed: 45,
        downSpeed: 45,
        distance: 20,
    },
    {
        faceId: 9,
        speed: 20,
        reactionSpeed: 10,
        upSpeed: 45,
        downSpeed: 45,
        distance: 20,
    },
    {
        faceId: 10,
        speed: 20,
        reactionSpeed: 10,
        upSpeed: 45,
        downSpeed: 45,
        distance: 20,
    },
    {
        faceId: 11,
        speed: 20,
        reactionSpeed: 10,
        upSpeed: 45,
        downSpeed: 45,
        distance: 20,
    },
];