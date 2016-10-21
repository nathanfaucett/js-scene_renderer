var Class = require("@nathanfaucett/class");


var ClassPrototype = Class.prototype,
    PluginPrototype;


module.exports = Plugin;


function Plugin() {

    Class.call(this);

    this.sceneRenderer = null;
}
Class.extend(Plugin, "scene_renderer.Plugin");
PluginPrototype = Plugin.prototype;

PluginPrototype.construct = function() {

    ClassPrototype.construct.call(this);

    return this;
};

PluginPrototype.destructor = function() {

    ClassPrototype.destructor.call(this);

    this.sceneRenderer = null;

    return this;
};

PluginPrototype.init = function() {
    this.emitArg("init");
    return this;
};

PluginPrototype.clear = function(emitEvent) {
    if (emitEvent !== false) {
        this.emitArg("clear");
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
    var sceneRenderer = this.sceneRenderer;

    if (sceneRenderer) {
        if (emitEvent !== false) {
            this.emitArg("destroy");
        }
        sceneRenderer.removePlugin(this);
        this.clear(false);
    }

    return this;
};