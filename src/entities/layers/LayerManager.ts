import {Layer} from "./Layer";

export class LayerManager {
    baseLayer:Layer;
    managedLayers:Layer[] = [];

    constructor(public scene:g.Scene, public base:Appendable = scene) {
        this.baseLayer = new Layer(scene, "LayerManagerBase");
        this.base.append(this.baseLayer);
    }

    add(name:string, parent:Appendable = this.baseLayer): Layer {
        const layer = new Layer(this.scene, name);
        parent.append(layer);
        return layer;
    }

    append(layer:Layer, parent:Appendable = this.baseLayer):void {
        parent.append(layer);
    }
}

export type Appendable = g.Scene | g.E | Layer;