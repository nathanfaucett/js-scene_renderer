var Class = require("@nathanfaucett/class");


var ClassPrototype = Class.prototype,
    RendererPrototype;


module.exports = Renderer;


function Renderer() {
    Class.call(this);
}

Renderer.onExtend = function(child, className, order) {
    child.order = child.prototype.order = isNullOrUndefined(order) ? 0 : order;
};

Class.extend(Renderer, "scene_renderer.Renderer");
RendererPrototype = Renderer.prototype;

Renderer.order = RendererPrototype.order = 0;

RendererPrototype.construct = function() {

    ClassPrototype.construct.call(this);

    return this;
};

RendererPrototype.destructor = function() {

    ClassPrototype.destructor.call(this);

    this.scene = null;

    return this;
};

RendererPrototype.init = function() {
    this.emit("init");
    return this;
};

RendererPrototype.clear = function(emitEvent) {
    if (emitEvent !== false) {
        this.emit("clear");
    }
    return this;
};

RendererPrototype.before = function() {
    return this;
};

RendererPrototype.after = function() {
    return this;
};

RendererPrototype.render = function() {
    return this;
};

RendererPrototype.destroy = function(emitEvent) {
    var scene = this.scene;

    if (scene) {
        if (emitEvent !== false) {
            this.emit("destroy");
        }
        scene.removeRenderer(this);
        this.clear(false);
    }

    return this;
};