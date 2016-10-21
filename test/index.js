var tape = require("tape"),
    sg = require("@nathanfaucett/scene_graph"),
    sr = require("..");


tape("scene_renderer", function(assert) {
    var scene = sg.Scene.create(),
        sceneRenderer = sr.SceneRenderer.create(scene);

    scene.init();

    sceneRenderer.addPlugin(sr.Plugin.create());
    sceneRenderer.addRenderer(sr.Renderer.create());

    sceneRenderer.init();
    sceneRenderer.render();

    assert.equals(sceneRenderer.hasRenderer("scene_renderer.Renderer"), true);
    assert.equals(sceneRenderer.hasPlugin("scene_renderer.Plugin"), true);

    assert.end();
});