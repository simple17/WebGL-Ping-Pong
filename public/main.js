(() => {
  var socket = new WebSocket(`ws://${window.location.hostname}:${window.location.port}/client`);
  socket.onopen = function(){
    socket.send(JSON.stringify({
      type: 'initView'
    }));
  }

  socket.onmessage = function(msg){
    var data = JSON.parse(msg.data);
    //Я сильный волчара!!!! :DDDDDD
    if(data[1] !== undefined){
      players.first.direction = parseInt(data[1].orientation.y) <= 0 ? 'left' : 'right';
      console.log('first goes ' + players.first.direction);
    }
    if(data[2] !== undefined){
      players.second.direction = parseInt(data[2].orientation.y) <= 0 ? 'left' : 'right';
      console.log('second goes ' + players.first.direction);
    }
    if(data[3] !== undefined){
      players.third.direction = parseInt(data[3].orientation.y) <= 0 ? 'left' : 'right';
      console.log('third goes ' + players.first.direction);
    }
  }

  setInterval(() => {
    socket.send(JSON.stringify({type: 'getStates'}));
  }, 100);
})();

function foo() {
    console.log('foo is running');
    // here we'll put the Three.js stuff
    //создаём сцену и камеру
    //var vars.SCENE = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(35,
        window.innerWidth / window.innerHeight,
        1, 1000);
    //создаём отрисовщик объектов на сцене
    var renderer = new THREE.WebGLRenderer();
    console.log(renderer);
    renderer.setClearColor(0x202a56);
    //устанавливаем размер области для 3д графики
    renderer.setSize(window.innerWidth, window.innerHeight);
    var collidableMeshList = [];

    //массив для объектов с которыми может столкнуться шарик
    var collidableMeshList = [];

    //var controls = new THREE.Orb


    //первый куб с размерами, задаём цвет
    var cubeGeometry = new THREE.CubeGeometry(vars.sizeOfPlayers,2,0);
    var cubeMaterial = new THREE.MeshBasicMaterial(
        {color: 0xe9211a, wireframe: false});
    var cubeFirst = new THREE.Mesh(cubeGeometry, cubeMaterial);
    //cube.rotation.z = -0.5*Math.PI;
    cubeFirst.position.x = players.first.startPosition.x;
    cubeFirst.position.y = players.first.startPosition.y;
    cubeFirst.position.z = 0;
    vars.SCENE.add(cubeFirst);
    collidableMeshList.push(cubeFirst);

    //второй куб
    var cubeGeometry = new THREE.CubeGeometry(vars.sizeOfPlayers,2,0);
    var cubeMaterial = new THREE.MeshBasicMaterial(
        {color: 0x365023, wireframe: false});
    var cubeSecond = new THREE.Mesh(cubeGeometry, cubeMaterial);
    cubeSecond.rotation.z = 45;
    cubeSecond.position.x = players.second.startPosition.x;
    cubeSecond.position.y = players.second.startPosition.y;
    cubeSecond.position.z = 0;
    vars.SCENE.add(cubeSecond);
    collidableMeshList.push(cubeSecond);

    //третий куб
    var cubeGeometry = new THREE.CubeGeometry(vars.sizeOfPlayers,2,0);
    var cubeMaterial = new THREE.MeshBasicMaterial(
        {color: 0x00accf, wireframe: false});
    var cubeThird = new THREE.Mesh(cubeGeometry, cubeMaterial);
    cubeThird.rotation.z = -45;
    cubeThird.position.x = players.third.startPosition.x;
    cubeThird.position.y = players.third.startPosition.y;
    cubeThird.position.z = 0;
    vars.SCENE.add(cubeThird);
    collidableMeshList.push(cubeThird);

    //создаём сферу
    var sphereGeometry = new THREE.SphereGeometry(2,20,20);
    var sphereMaterial = new THREE.MeshLambertMaterial(
        {color: 0x7777ff});
    var sphere = new THREE.Mesh(sphereGeometry,sphereMaterial);
    sphere.position.x = 0;
    sphere.position.y = 0;
    sphere.position.z = 0;
    vars.SCENE.add(sphere);

    //создаём источник света
    var spotLightLeft = new THREE.SpotLight( 0xffffff );
    spotLightLeft.position.set( cubeFirst.position.x, cubeFirst.position.y, 0);
    vars.SCENE.add(spotLightLeft);

    var spotLightRight = new THREE.SpotLight( 0xffffff );
    spotLightRight.position.set( cubeSecond.position.x, cubeSecond.position.y, 0);
    vars.SCENE.add(spotLightRight);

    var spotLightBottom = new THREE.SpotLight( 0xffffff );
    spotLightBottom.position.set( cubeThird.position.x, cubeThird.position.y, 0);
    vars.SCENE.add(spotLightBottom);

    //задаём положение камеры
    camera.position.x = 0;
    camera.position.y = 0;
    camera.position.z = 50;
    camera.lookAt(vars.SCENE.position);

    let div = document.querySelector('#WebGL-output');
    div.append(renderer.domElement);
    //renderer.render(vars.SCENE, camera);


    //функция рендеринга сцены
    var step=0;
    var cubeStep=0;
    let posSecondCube = cubeSecond.position.x-5;
    console.log(cubeFirst.position.x);
    //console.log(posSecondCube);


    tools.makeSideOfTriangle(
        {x: -vars.sizeOfSideOfTriangle, y: -vars.sizeOfSideOfTriangle},
        {x: vars.sizeOfSideOfTriangle, y: -vars.sizeOfSideOfTriangle}
    );
    tools.makeSideOfTriangle(
        {x: vars.sizeOfSideOfTriangle, y: -vars.sizeOfSideOfTriangle},
        {x: 0, y: vars.sizeOfSideOfTriangle * (Math.sqrt(3) - 1)}
    );
    tools.makeSideOfTriangle(
        {x: 0, y: vars.sizeOfSideOfTriangle * (Math.sqrt(3) - 1)},
        {x: -vars.sizeOfSideOfTriangle, y: -vars.sizeOfSideOfTriangle}
    );

    var axes = new THREE.AxisHelper(3);
    vars.SCENE.add(axes);
    var direction = 'left';



    //var originPoint = sphere.position.clone();
    console.log("I am originPoint");
    //console.log(originPoint);
/*
    for(var vertexIndex = 0; vertexIndex < sphere.geometry.vertices.length; vertexIndex++){
        var localVertex = sphere.geometry.vertices[vertexIndex].clone();
        var globalVertex = localVertex.applyMatrix4(sphere.matrix);
        var directionVector = globalVertex.sub(sphere.position);

        var ray = new THREE.Raycaster(originPoint, directionVector.clone().normalize());
        var collisionResults = ray.intersectObjects(collidableMeshList);
        if(collisionResults.length > 0 && collisionResults[0].distance < directionVector.length()){
            console.log("Hit");
        }
    }
*/

    var deltaTime;
    function animate(){
        deltaTime = clock.getDelta();
    }

    function addParticles(){
        // The number of particles in a particle system is not easily changed.
        var particleCount = 2000;

        // Particles are just individual vertices in a geometry
        // Create the geometry that will hold all of the vertices
        var particles = new THREE.Geometry();

        // Create the vertices and add them to the particles geometry
        for (var p = 0; p < particleCount; p++) {

            // This will create all the vertices in a range of -200 to 200 in all directions
            var x = Math.random() * 400 - 200;
            var y = Math.random() * 400 - 200;
            var z = Math.random() * 400 - 200;

            // Create the vertex
            var particle = new THREE.Vector3(x, y, z);

            // Add the vertex to the geometry
            particles.vertices.push(particle);
        }

        // Create the material that will be used to render each vertex of the geometry
        var particleMaterial = new THREE.PointsMaterial(
            {color: 0xe1e9f2,
                size: 4,
                map: THREE.ImageUtils.loadTexture("images/snowflake.png"),
                blending: THREE.AdditiveBlending,
                transparent: true,
            });

        // Create the particle system
        particleSystem = new THREE.Points(particles, particleMaterial);

        return particleSystem;
    }
    var particleSystem = addParticles();
    vars.SCENE.add(particleSystem);

    var collisionDetect = true;

    function render() {
        step+=0.05;
        sphere.position.x = 0+(cubeThird.position.x*(Math.cos(step)));
        //var startPoscubeFirst = cubeFirst.position.x+0.1;
        particleSystem.rotation.y+=0.01;



        //условие перемещения нижнего куба и источника света

        if (players.first.direction == 'left' && cubeFirst.position.x > -vars.sizeOfSideOfTriangle) {
            cubeFirst.position.x -= vars.cubeStep;
            spotLightLeft.position.x -= vars.cubeStep;
        } else if (players.first.direction == 'left' && cubeFirst.position.x <= -vars.sizeOfSideOfTriangle) {
            players.first.direction = 'right';
        } else if (players.first.direction == 'right' && cubeFirst.position.x <= vars.sizeOfSideOfTriangle) {
            cubeFirst.position.x += vars.cubeStep;
            spotLightLeft.position.x += vars.cubeStep;
        } else if (players.first.direction == 'right' && cubeFirst.position.x > vars.sizeOfSideOfTriangle) {
            players.first.direction = 'left';
        }


        //movement of second player and spotlight

        if (players.second.direction == 'left' &&
            cubeSecond.position.x > -vars.sizeOfSideOfTriangle &&
            cubeSecond.position.y > -vars.sizeOfSideOfTriangle) {

            cubeSecond.position.x -= vars.cubeStep;
            cubeSecond.position.y = Math.sqrt(3) * cubeSecond.position.x + vars.sizeOfSideOfTriangle * (Math.sqrt(3) - 1);

            spotLightRight.position.x -= vars.cubeStep;
            spotLightRight.position.y = Math.sqrt(3) * cubeSecond.position.x + vars.sizeOfSideOfTriangle * (Math.sqrt(3) - 1);

        } else if (players.second.direction == 'left' &&
            cubeSecond.position.x <= -vars.sizeOfSideOfTriangle &&
            cubeSecond.position.y <= -vars.sizeOfSideOfTriangle) {

            players.second.direction = 'right';

        } else if (players.second.direction == 'right' &&
            cubeSecond.position.x <= 0 &&
            cubeSecond.position.y <= (Math.sqrt(3) - 1) * vars.sizeOfSideOfTriangle) {

            cubeSecond.position.x += vars.cubeStep;
            cubeSecond.position.y = Math.sqrt(3) * cubeSecond.position.x + vars.sizeOfSideOfTriangle * (Math.sqrt(3) - 1);

            spotLightRight.position.x += vars.cubeStep;
            spotLightRight.position.y = Math.sqrt(3) * cubeSecond.position.x + vars.sizeOfSideOfTriangle * (Math.sqrt(3) - 1);

        } else if (players.second.direction == 'right' &&
            cubeSecond.position.x > 0 &&
            cubeSecond.position.y > (Math.sqrt(3) - 1) * vars.sizeOfSideOfTriangle) {
            players.second.direction = 'left';
        }

        //movement of third player and spotlight

        if (players.third.direction == 'left' &&
            cubeThird.position.x > 0 &&
            cubeThird.position.y < (Math.sqrt(3) - 1) * vars.sizeOfSideOfTriangle) {

            cubeThird.position.x -= vars.cubeStep;
            cubeThird.position.y = -Math.sqrt(3) * cubeThird.position.x + vars.sizeOfSideOfTriangle * (Math.sqrt(3) - 1);

            spotLightBottom.position.x -= vars.cubeStep;
            spotLightBottom.position.y = -Math.sqrt(3) * cubeThird.position.x + vars.sizeOfSideOfTriangle * (Math.sqrt(3) - 1);

        } else if (players.third.direction == 'left' &&
            cubeThird.position.x <= 0 &&
            cubeThird.position.y >= (Math.sqrt(3) - 1) * vars.sizeOfSideOfTriangle) {
            players.third.direction = 'right';

        } else if (players.third.direction == 'right' &&
            cubeThird.position.x < vars.sizeOfSideOfTriangle &&
            cubeThird.position.y > -vars.sizeOfSideOfTriangle) {

            cubeThird.position.x += vars.cubeStep;
            cubeThird.position.y = -Math.sqrt(3) * cubeThird.position.x + vars.sizeOfSideOfTriangle * (Math.sqrt(3) - 1);

            spotLightBottom.position.x += vars.cubeStep;
            spotLightBottom.position.y = -Math.sqrt(3) * cubeThird.position.x + vars.sizeOfSideOfTriangle * (Math.sqrt(3) - 1);

        } else if (players.third.direction == 'right' &&
            cubeThird.position.x >= vars.sizeOfSideOfTriangle &&
            cubeThird.position.y <= -vars.sizeOfSideOfTriangle) {
            players.third.direction = 'left';
        }
        //if (cubeFirst.position.x<=-15){
        //    console.log("max"+cubeFirst.position.x);
        //    cubeFirst.position.x = cubeFirst.position.x+cubeStep;
        //}
        //else{
        //    console.log("min"+cubeFirst.position.x);
        //    cubeFirst.position.x = cubeFirst.position.x-cubeStep;
        //}

/*
        if(cubeSecond.position.x > posSecondCube){
        console.log(cubeSecond.position.x);
            cubeSecond.position.x = cubeSecond.position.x-cubeStep;
            cubeSecond.position.y = cubeSecond.position.y-cubeStep;
        } else {
            cubeSecond.position.x = cubeSecond.position.x+cubeStep;
            cubeSecond.position.y = cubeSecond.position.y+cubeStep;
        }
        /*
        else{
            console.log('-'+step);
            cubeSecond.position.x = cubeSecond.position.x-cubeStep;
            cubeSecond.position.y = cubeSecond.position.y-cubeStep;
        }
*/

        if (collisionDetect) {
            var originPoint = sphere.position.clone();
            for (var vertexIndex = 0; vertexIndex < sphere.geometry.vertices.length; vertexIndex++) {
                var localVertex = sphere.geometry.vertices[vertexIndex].clone();
                var globalVertex = localVertex.applyMatrix4(sphere.matrix);
                var directionVector = globalVertex.sub(sphere.position);

                var ray = new THREE.Raycaster(originPoint, directionVector.clone().normalize());
                var collisionResults = ray.intersectObjects(collidableMeshList);
                if (collisionResults.length > 0 && collisionResults[0].distance < directionVector.length() && collisionDetect) {
                    //collisionDetect = !collisionDetect;
                    console.log("Hit");
                    collisionResults = [];
                    collisionDetect = false;
                }
            }
        }

        requestAnimationFrame(render);
        renderer.render(vars.SCENE, camera);
    }

    render();

    /*
    function renderScene(){
        requestAnimationFrame(renderScene);
        renderer.render(scene, camera);
    }

    renderScene();
*/

};
foo();
