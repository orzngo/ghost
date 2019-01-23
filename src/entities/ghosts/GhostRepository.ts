import {Ghost} from "./Ghost";
import {GhostParams} from "./Ghost";
import {GhostName} from "./Ghost";

export class GhostRepository {
    ghosts: Ghost[] = [];

    scene: g.Scene;

    constructor(scene: g.Scene) {
        this.scene = scene;
    }

    // factoryつくんのめんどい
    create(type: GhostName, withSave: boolean = true): Ghost {
        if (type > ghostParams.length) {
            throw new Error("Invalid type");
        }
        const ghost = new Ghost({scene: this.scene}, ghostParams[type]);
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

let ghostParams: GhostParams[] = [];

ghostParams[GhostName["BENI"]] = {
    type: GhostName["BENI"],
    speed: 100,
    reactionSpeed: 10,
    upSpeed: 90,
    downSpeed: 90,
    distance: 15,
};

ghostParams[GhostName["MOMO"]] = {
    type: GhostName["MOMO"],
    speed: 90,
    reactionSpeed: 10,
    upSpeed: 60,
    downSpeed: 60,
    distance: 10,
};

ghostParams[GhostName["SAM"]] = {
    type: GhostName["SAM"],
    speed: 100,
    reactionSpeed: 10,
    upSpeed: 250,
    downSpeed: 250,
    distance: 60,
};
ghostParams[GhostName["BOON"]] = {
    type: GhostName["BOON"],
    speed: 110,
    reactionSpeed: 10,
    upSpeed: 250,
    downSpeed: 50,
    distance: 25
};
ghostParams[GhostName["WOON"]] = {
    type: GhostName["WOON"],
    speed: 80,
    reactionSpeed: 10,
    upSpeed: 60,
    downSpeed: 250,
    distance: 25,
};
ghostParams[GhostName["TAKESHI"]] = {
    type: GhostName["TAKESHI"],
    speed: 140,
    reactionSpeed: 10,
    upSpeed: 90,
    downSpeed: 90,
    distance: 15,
};
ghostParams[GhostName["BOB"]] = {
    type: GhostName["BOB"],
    speed: 150,
    reactionSpeed: 10,
    upSpeed: 95,
    downSpeed: 95,
    distance: 15,
};
ghostParams[GhostName["ONI"]] = {
    type: GhostName["ONI"],
    speed: 100,
    reactionSpeed: 10,
    upSpeed: 80,
    downSpeed: 80,
    distance: 20,
};
ghostParams[GhostName["GAKI"]] = {
    type: GhostName["GAKI"],
    speed: 110,
    reactionSpeed: 10,
    upSpeed: 120,
    downSpeed: 120,
    distance: 20,
};
ghostParams[GhostName["MONO"]] = {
    type: GhostName["MONO"],
    speed: 170,
    reactionSpeed: 10,
    upSpeed: 70,
    downSpeed: 70,
    distance: 20,
};
ghostParams[GhostName["BATSU"]] = {
    type: GhostName["BATSU"],
    speed: 200,
    reactionSpeed: 10,
    upSpeed: 150,
    downSpeed: 150,
    distance: 20,
};
ghostParams[GhostName["NAGA"]] = {
    type: GhostName["NAGA"],
    speed: 100,
    reactionSpeed: 10,
    upSpeed: 90,
    downSpeed: 90,
    distance: 20,
};
