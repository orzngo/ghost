import {Ghost} from "./Ghost";

export class Team {

    members: Ghost[] = [];

    constructor() {

    }

    append(ghost: Ghost): void {
        this.members.push(ghost);
    }

    kick(ghost: Ghost): void {


    }


    getIndex(ghost: Ghost): number {
        for (let i = 0; i < this.members.length; i++) {
            if (this.members[i].id == ghost.id) {
                return i;
            }
        }
        throw new Error("member not found");


    }

    getSpeed(): number {
        if (this.members.length <= 0) {
            return 0;
        }

        return this.members[0].speed;
    }

}