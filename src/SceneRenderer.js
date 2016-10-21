var indexOf = require("@nathanfaucett/index_of"),
    Class = require("@nathanfaucett/class");


var ClassPrototype = Class.prototype,
    SceneRendererPrototype;


module.exports = SceneRenderer;


function SceneRenderer() {

    Class.call(this);

    this.scene = null;

    this._renderers = [];
    this.renderers = {};

    this._plugins = [];
    this.plugins = {};

    this._initted = false;
}

Class.extend(SceneRenderer, "scene_renderer.SceneRenderer");
SceneRendererPrototype = SceneRenderer.prototype;

SceneRendererPrototype.construct = function(scene) {

    ClassPrototype.construct.call(this);

    this.scene = scene;
    this._initted = false;

    return this;
};

SceneRendererPrototype.destructor = function() {
    var renderers = this._renderers,
        plugins = this._plugins,
        i;

    ClassPrototype.destructor.call(this);

    i = renderers.length;
    while (i--) {
        renderers[i].destroy(false).destructor();
    }
    i = plugins.length;
    while (i--) {
        plugins[i].destroy(false).destructor();
    }

    this.scene = null;
    this._initted = false;

    return this;
};

SceneRendererPrototype.init = function() {
    if (!this._initted) {
        this._initted = true;
        sortRenderers(this);
        this.initPlugins();
        this.initRenderers();
        this.emit("init");
    }
    return this;
};

SceneRendererPrototype.render = function() {

    this.beforePlugins();
    this.renderRenderers();
    this.afterPlugins();

    return this;
};

SceneRendererPrototype.clear = function(emitEvent) {
    var renderers = this._renderers,
        plugins = this._plugins,
        i;

    if (emitEvent !== false) {
        this.emit("clear");
    }

    i = renderers.length;
    while (i--) {
        renderers[i].destroy(emitEvent);
    }
    i = plugins.length;
    while (i--) {
        plugins[i].destroy(emitEvent);
    }

    return this;
};

SceneRendererPrototype.destroy = function(emitEvent) {
    if (emitEvent !== false) {
        this.emit("destroy");
    }
    this.clear(false);
    return this;
};

function sortRenderers(_this) {
    _this._renderers.sort(sortRenderersFn);
}

function sortRenderersFn(a, b) {
    return a.order - b.order;
}

SceneRendererPrototype.addRenderer = function() {
    var i = -1,
        il = arguments.length - 1;

    while (i++ < il) {
        SceneRendererPrototype_addRenderer(this, arguments[i]);
    }

    return this;
};

function SceneRendererPrototype_addRenderer(_this, renderer) {
    var renderers = _this._renderers,
        rendererHash = _this.renderers,
        className = renderer.className;

    if (!rendererHash[className]) {
        renderer.sceneRenderer = _this;
        renderers[renderers.length] = renderer;
        rendererHash[className] = renderer;

        if (this._initted) {
            sortRenderers(this);
            renderer.init();
        }
        _this.emit("addRenderer", renderer);
    } else {
        throw new Error(
            "SceneRenderer addRenderer(...renderers) trying to add renderer " +
            className + " that is already a member of SceneRenderer"
        );
    }
}

SceneRendererPrototype.removeRenderer = function() {
    var i = -1,
        il = arguments.length - 1;

    while (i++ < il) {
        SceneRendererPrototype_removeRenderer(this, arguments[i]);
    }

    return this;
};

function SceneRendererPrototype_removeRenderer(_this, renderer) {
    var renderers = _this._renderers,
        rendererHash = _this.renderers,
        className = renderer.className;

    if (rendererHash[className]) {
        _this.emit("removeRenderer", renderer);
        renderer.sceneRenderer = null;
        renderers.splice(indexOf(renderers, renderer), 1);
        delete rendererHash[className];
    } else {
        throw new Error(
            "SceneRenderer removeRenderer(...renderers) trying to remove renderer " +
            className + " that is not a member of SceneRenderer"
        );
    }
}

SceneRendererPrototype.hasRenderer = function(name) {
    return !!this.renderers[name];
};

SceneRendererPrototype.getRenderer = function(name) {
    return this.renderers[name];
};

function clearRenderers_callback(renderer) {
    renderer.clear(clearRenderers_callback.emitEvents);
}
clearRenderers_callback.set = function set(emitEvents) {
    this.emitEvents = emitEvents;
    return this;
};
SceneRendererPrototype.clearRenderers = function(emitEvents) {
    return this.forEachRenderer(clearRenderers_callback.set(emitEvents));
};

function initRenderers_callback(renderer) {
    renderer.init();
}
SceneRendererPrototype.initRenderers = function() {
    return this.forEachRenderer(initRenderers_callback);
};

function renderRenderers_callback(renderer) {
    renderer.before();
    renderer.render();
    renderer.after();
}
SceneRendererPrototype.renderRenderers = function() {
    return this.forEachRenderer(renderRenderers_callback);
};

SceneRendererPrototype.forEachRenderer = function(fn) {
    var renderers = this._renderers,
        i = -1,
        il = renderers.length - 1;

    while (i++ < il) {
        if (fn(renderers[i]) === false) {
            break;
        }
    }
    return this;
};

SceneRendererPrototype.addPlugin = function() {
    var i = -1,
        il = arguments.length - 1;

    while (i++ < il) {
        SceneRendererPrototype_addPlugin(this, arguments[i]);
    }

    return this;
};

function SceneRendererPrototype_addPlugin(_this, plugin) {
    var plugins = _this._plugins,
        pluginHash = _this.plugins,
        className = plugin.className;

    if (!pluginHash[className]) {
        plugin.sceneRenderer = _this;
        plugins[plugins.length] = plugin;
        pluginHash[className] = plugin;
        if (this._initted) {
            plugin.init();
        }
        _this.emit("addPlugin", plugin);
    } else {
        throw new Error(
            "SceneRenderer addPlugin(...plugins) trying to add plugin " +
            className + " that is already a member of SceneRenderer"
        );
    }
}

SceneRendererPrototype.removePlugin = function() {
    var i = -1,
        il = arguments.length - 1;

    while (i++ < il) {
        SceneRendererPrototype_removePlugin(this, arguments[i]);
    }

    return this;
};

function SceneRendererPrototype_removePlugin(_this, plugin) {
    var plugins = _this._plugins,
        pluginHash = _this.plugins,
        className = plugin.className;

    if (pluginHash[className]) {
        _this.emit("removePlugin", plugin);
        plugin.sceneRenderer = null;
        plugins.splice(indexOf(plugins, plugin), 1);
        delete pluginHash[className];
    } else {
        throw new Error(
            "SceneRenderer removePlugin(...plugins) trying to remove plugin " +
            className + " that is not a member of SceneRenderer"
        );
    }
}

SceneRendererPrototype.hasPlugin = function(name) {
    return !!this.plugins[name];
};

SceneRendererPrototype.getPlugin = function(name) {
    return this.plugins[name];
};

function clearPlugins_callback(plugin) {
    plugin.clear(clearPlugins_callback.emitEvents);
}
clearPlugins_callback.set = function set(emitEvents) {
    this.emitEvents = emitEvents;
    return this;
};
SceneRendererPrototype.clearPlugins = function(emitEvents) {
    return this.forEachPlugin(clearPlugins_callback.set(emitEvents));
};

function initPlugins_callback(plugin) {
    plugin.init();
}
SceneRendererPrototype.initPlugins = function() {
    return this.forEachPlugin(initPlugins_callback);
};

function beforePlugins_callback(plugin) {
    plugin.before();
}
SceneRendererPrototype.beforePlugins = function() {
    return this.forEachPlugin(beforePlugins_callback);
};

function afterPlugins_callback(plugin) {
    plugin.after();
}
SceneRendererPrototype.afterPlugins = function() {
    return this.forEachPlugin(afterPlugins_callback);
};

SceneRendererPrototype.forEachPlugin = function(fn) {
    var plugins = this._plugins,
        i = -1,
        il = plugins.length - 1;

    while (i++ < il) {
        if (fn(plugins[i]) === false) {
            break;
        }
    }
    return this;
};

SceneRendererPrototype.toJSON = function(json) {
    var plugins = this._plugins,
        i, il, index, jsonPlugins;

    json = ClassPrototype.toJSON.call(this, json);

    jsonPlugins = json.plugins || (json.plugins = []);

    i = -1;
    il = plugins.length - 1;
    while (i++ < il) {
        index = jsonPlugins.length;
        jsonPlugins[index] = plugins[i].toJSON(jsonPlugins[index]);
    }

    return json;
};

SceneRendererPrototype.fromJSON = function(json) {
    var jsonPlugins = json.plugins,
        i, il, jsonPlugin, plugin;

    ClassPrototype.fromJSON.call(this, json);

    i = -1;
    il = jsonPlugins.length - 1;
    while (i++ < il) {
        jsonPlugin = jsonPlugins[i];
        plugin = Class.newClass(jsonPlugin.className);
        plugin.fromJSON(jsonPlugin);
        this.addPlugin(plugin);
    }

    return this;
};
