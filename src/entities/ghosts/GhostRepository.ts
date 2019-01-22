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
        speed: 100,
        reactionSpeed: 10,
        upSpeed: 90,
        downSpeed: 90,
        distance: 15,
    },
    {
        faceId: 1,
        speed: 90,
        reactionSpeed: 10,
        upSpeed: 60,
        downSpeed: 60,
        distance: 10,
    },
    {
        faceId: 2,
        speed: 100,
        reactionSpeed: 10,
        upSpeed: 250,
        downSpeed: 250,
        distance: 60,
    },
    {
        faceId: 3,
        speed: 110,
        reactionSpeed: 10,
        upSpeed: 250,
        downSpeed: 50,
        distance: 25,
    },
    {
        faceId: 4,
        speed: 80,
        reactionSpeed: 10,
        upSpeed: 60,
        downSpeed: 250,
        distance: 25,
    },
    {
        faceId: 5,
        speed: 140,
        reactionSpeed: 10,
        upSpeed: 90,
        downSpeed: 90,
        distance: 15,
    },
    {
        faceId: 6,
        speed: 150,
        reactionSpeed: 10,
        upSpeed: 95,
        downSpeed: 95,
        distance: 15,
    },
    {
        faceId: 7,
        speed: 100,
        reactionSpeed: 10,
        upSpeed: 80,
        downSpeed: 80,
        distance: 20,
    },
    {
        faceId: 8,
        speed: 110,
        reactionSpeed: 10,
        upSpeed: 120,
        downSpeed: 120,
        distance: 20,
    },
    {
        faceId: 9,
        speed: 170,
        reactionSpeed: 10,
        upSpeed: 70,
        downSpeed: 70,
        distance: 20,
    },
    {
        faceId: 10,
        speed: 200,
        reactionSpeed: 10,
        upSpeed: 150,
        downSpeed: 150,
        distance: 20,
    },
    {
        faceId: 11,
        speed: 100,
        reactionSpeed: 10,
        upSpeed: 90,
        downSpeed: 90,
        distance: 20,
    },
];