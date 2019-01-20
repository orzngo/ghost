import {Item} from "./Item";

export class ItemRepository {
    items:Item[] = [];
    constructor(public scene:g.Scene) {

    }

    // factoryつくんのめんどい
    create(itemId:number, withSave:boolean = true):Item {
        if (itemId > Item.SCORES.length) {
            throw new Error("Invalid itemId");
        }
        const item = new Item(this.scene, itemId);

        if (withSave) {
            this.save(item);
        }
        return item;
    }


    save(item:Item):void {
        this.items.push(item);
    }

    delete(target:Item):void {
        const newItems:Item[] = [];
        this.items.forEach((item) => {
            if (target.id === item.id) {
                return;
            }
            newItems.push(item);
        });
        this.items = newItems;
        target.destroy();
    }
}