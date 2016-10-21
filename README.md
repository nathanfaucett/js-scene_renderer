scene_renderer [![Build Status](https://travis-ci.org/nathanfaucett/js-scene_renderer.svg?branch=master)](https://travis-ci.org/nathanfaucett/js-scene_renderer)
======

entity component scene graph

```javascript
var sceneGraph = require("@nathanfaucett/scene_graph"),
    sceneRenderer = require("@nathanfaucett/scene_renderer");


var Scene = sceneGraph.Scene,
    SceneRenderer = sceneRenderer.SceneRenderer;


var scene = Scene.create(),
    renderer = SceneRenderer.create(scene);

SceneRenderer.addRenderer(SomeRenderer);
SceneRenderer.addPlugin(SomePlugin);

scene.init();
scene.update();

renderer.init();
renderer.render();
```
