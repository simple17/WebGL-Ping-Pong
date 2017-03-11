(() => {
  var socket = new WebSocket(`ws://${window.location.hostname}:${window.location.port}/client`);
  socket.onopen = function(){
    socket.send(JSON.stringify({
      type: 'initView'
    }));
  }

  socket.onmessage = function(msg){
    console.log(JSON.parse(msg.data));
  }

  setInterval(() => {
    socket.send(JSON.stringify({type: 'getStates'}));
  }, 200);
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
    renderer.setClearColor(0xEEEEEE);
    //устанавливаем размер области для 3д графики
    renderer.setSize(window.innerWidth, window.innerHeight);
    var collidableMeshList = [];

    //первый куб с размерами, задаём цвет
    var cubeGeometry = new THREE.CubeGeometry(vars.sizeOfPlayers,2,0);
    var cubeMaterial = new THREE.MeshBasicMaterial(
        {color: 0x6C8995, wireframe: false});
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
        {color: 0x1b243b, wireframe: false});
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
        {color: 0x425b4d, wireframe: false});
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
    var sphereStartPosition = sphere.position.clone();
    console.log("SPHERE");
    console.log(sphereStartPosition);

    //создаём источник света
    var spotLight = new THREE.SpotLight( 0xffffff );
    spotLight.position.set( 15, 5, 0 );
    vars.SCENE.add(spotLight);

    var spotLight2 = new THREE.SpotLight( 0xffffff );
    spotLight2.position.set( 0, -14, 0 );
    vars.SCENE.add(spotLight2);

    var spotLight3 = new THREE.SpotLight( 0xffffff );
    spotLight3.position.set( -15, 5, 0 );
    vars.SCENE.add(spotLight3);

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

    var ray = new THREE.Raycaster( sphereStartPosition, sphere.position.clone().normalize() );
    var collisionResults = ray.intersectObjects( collidableMeshList );
    console.log(collisionResults);

    function render() {
        step+=0.05;
        sphere.position.x = 0+(cubeThird.position.x*(Math.cos(step)));
        //var startPoscubeFirst = cubeFirst.position.x+0.1;



        //условие перемещения нижнего куба

        if (players.first.direction == 'left' && cubeFirst.position.x > -vars.sizeOfSideOfTriangle) {
            cubeFirst.position.x -= vars.cubeStep;
        } else if (players.first.direction == 'left' && cubeFirst.position.x <= -vars.sizeOfSideOfTriangle) {
            players.first.direction = 'right';
        } else if (players.first.direction == 'right' && cubeFirst.position.x <= vars.sizeOfSideOfTriangle) {
            cubeFirst.position.x += vars.cubeStep;
        } else if (players.first.direction == 'right' && cubeFirst.position.x > vars.sizeOfSideOfTriangle) {
            players.first.direction = 'left';
        }


        //movement of second player

        if (players.second.direction == 'left' &&
            cubeSecond.position.x > -vars.sizeOfSideOfTriangle &&
            cubeSecond.position.y > -vars.sizeOfSideOfTriangle) {

            cubeSecond.position.x -= vars.cubeStep;
            cubeSecond.position.y = Math.sqrt(3) * cubeSecond.position.x + vars.sizeOfSideOfTriangle * (Math.sqrt(3) - 1);

        } else if (players.second.direction == 'left' &&
            cubeSecond.position.x <= -vars.sizeOfSideOfTriangle &&
            cubeSecond.position.y <= -vars.sizeOfSideOfTriangle) {

            players.second.direction = 'right';

        } else if (players.second.direction == 'right' &&
            cubeSecond.position.x <= 0 &&
            cubeSecond.position.y <= (Math.sqrt(3) - 1) * vars.sizeOfSideOfTriangle) {

            cubeSecond.position.x += vars.cubeStep;
            cubeSecond.position.y = Math.sqrt(3) * cubeSecond.position.x + vars.sizeOfSideOfTriangle * (Math.sqrt(3) - 1);

        } else if (players.second.direction == 'right' &&
            cubeSecond.position.x > 0 &&
            cubeSecond.position.y > (Math.sqrt(3) - 1) * vars.sizeOfSideOfTriangle) {
            players.second.direction = 'left';
        }

        //movement of third player

        if (players.third.direction == 'left' &&
            cubeThird.position.x > 0 &&
            cubeThird.position.y < (Math.sqrt(3) - 1) * vars.sizeOfSideOfTriangle) {

            cubeThird.position.x -= vars.cubeStep;
            cubeThird.position.y = -Math.sqrt(3) * cubeThird.position.x + vars.sizeOfSideOfTriangle * (Math.sqrt(3) - 1);

        } else if (players.third.direction == 'left' &&
            cubeThird.position.x <= 0 &&
            cubeThird.position.y >= (Math.sqrt(3) - 1) * vars.sizeOfSideOfTriangle) {
            players.third.direction = 'right';

        } else if (players.third.direction == 'right' &&
            cubeThird.position.x < vars.sizeOfSideOfTriangle &&
            cubeThird.position.y > -vars.sizeOfSideOfTriangle) {

            cubeThird.position.x += vars.cubeStep;
            cubeThird.position.y = -Math.sqrt(3) * cubeThird.position.x + vars.sizeOfSideOfTriangle * (Math.sqrt(3) - 1);

        } else if (players.third.direction == 'right' &&
            cubeThird.position.x >= vars.sizeOfSideOfTriangle &&
            cubeThird.position.y <= -vars.sizeOfSideOfTriangle) {
            players.third.direction = 'left';
        }




        //var localVertex = sphere.geometry.vertices[vertexIndex].clone();
        //var globalVertex = localVertex.applyMatrix4( sphere.matrix );
        //var directionVector = globalVertex.sub( sphere.position );


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
