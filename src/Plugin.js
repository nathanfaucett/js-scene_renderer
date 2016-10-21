var Class = require("@nathanfaucett/class");


var ClassPrototype = Class.prototype,
    PluginPrototype;


module.exports = Plugin;


function Plugin() {

    Class.call(this);

    this.scene = null;
}
Class.extend(Plugin, "scene_renderer.Plugin");
PluginPrototype = Plugin.prototype;

PluginPrototype.construct = function() {

    ClassPrototype.construct.call(this);

    return this;
};

PluginPrototype.destructor = function() {

    ClassPrototype.destructor.call(this);

    this.scene = null;

    return this;
};

PluginPrototype.init = function() {
    this.emit("init");
    return this;
};

PluginPrototype.clear = function(emitEvent) {
    if (emitEvent !== false) {
        this.emit("clear");
    }
    return this;
};

PluginPrototype.before = function() {
    return this;
};

PluginPrototype.after = function() {
    return this;
};

PluginPrototype.destroy = function(emitEvent) {
    var scene = this.scene;

    if (scene) {
        if (emitEvent !== false) {
            this.emit("destroy");
        }
        scene.removePlugin(this);
        this.clear(false);
    }

    return this;
};