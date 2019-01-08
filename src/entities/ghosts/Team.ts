import {ActionOrder, Ghost} from "./Ghost";
import {Layer} from "../layers/Layer";

export class Team {

    members: Ghost[] = [];
    actionOrder: ActionOrder | undefined;

    constructor() {

    }

    append(ghost: Ghost, frameCount: number = 0): void {
        this.members.push(ghost);
        if (this.members.length === 1) {
            ghost.x = (g.game.width / 2) - (ghost.width / 2);
            ghost.y = (g.game.height / 2) - (ghost.height / 2);
        } else {
            const front = this.getFrontMember(ghost);
            ghost.x = front.x - 16;
            ghost.y = front.y;
            ghost.order({frameCount: frameCount, order: "keep"});
        }
    }

    appendMembersTo(target: Layer): void {
        for (let i = this.members.length - 1; i >= 0; i--) {
            target.append(this.members[i]);
        }
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

    onUpdate(): void {
        if (this.members.length <= 0) {
            return;
        }

        this.members[0].order(this.actionOrder);
    }


    getIndex(ghost: Ghost): number | undefined {
        for (let i = 0; i < this.members.length; i++) {
            if (this.members[i].id == ghost.id) {
                return i;
            }
        }
        return undefined;
    }

    getRelatedMembers(target: Ghost): { front: Ghost | undefined; back: Ghost | undefined } {
        return {
            front: this.getFrontMember(target),
            back: this.getBackMember(target)
        };
    }

    getFrontMember(target: Ghost): Ghost | undefined {
        const index = this.getIndex(target);
        if (index === undefined || index === 0) {
            return undefined;
        }
        return this.members[index - 1];
    }

    getBackMember(target: Ghost): Ghost | undefined {
        const index = this.getIndex(target);
        if (index === undefined || index === this.members.length - 1) {
            return undefined;
        }
        return this.members[index + 1];
    }

    getSpeed(): number {
        if (this.members.length <= 0) {
            return 0;
        }

        return this.members[0].getSpeed();
    }

    order(order: ActionOrder): void {
        this.actionOrder = order;
    }
}