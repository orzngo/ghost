import {ActionOrder, Ghost} from "./Ghost";
import {Layer} from "../layers/Layer";

export class Team {

    members: Ghost[] = [];
    actionOrder:ActionOrder | undefined;

    constructor() {

    }

    append(ghost: Ghost): void {
        this.members.push(ghost);
    }

    appendMembersTo(target:Layer):void {
        this.members.reverse().forEach((ghost) =>{
            target.append(ghost);
        });
    }

    /**
     * 指定したゴーストを外す
     * 指定したゴーストより後ろにいるゴーストも外す
     *
     * @param {Ghost} ghost
     */
    kick(ghost: Ghost): void {
        const targetIndex = this.getIndex(ghost);
        const newMembers: Ghost[] = [];
        this.members.forEach((member: Ghost, index: number) => {
            if (index < targetIndex) {
                newMembers.push(member);
            } else {
                member.kill();
            }
        });
        this.members = newMembers;
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

        return this.members[0].getSpeed();
    }

    order(order:ActionOrder):void {
        this.actionOrder = order;
    }
}
