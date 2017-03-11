var tools = {
    makeSideOfTriangle: function (from, to) {
        var materialRED  = new THREE.LineBasicMaterial({ color: 0xff0000 });
        var geometry = new THREE.Geometry();
        geometry.vertices.push(new THREE.Vector3(from.x, from.y, 0));
        geometry.vertices.push(new THREE.Vector3(to.x, to.y, 0));
        var line = new THREE.Line(geometry, materialRED);
        vars.SCENE.add(line);
    }
}
