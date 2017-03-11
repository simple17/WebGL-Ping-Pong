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
    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(35,
        window.innerWidth / window.innerHeight,
        1, 1000);
    //создаём отрисовщик объектов на сцене
    var renderer = new THREE.WebGLRenderer();
    console.log(renderer);
    renderer.setClearColor(0xEEEEEE);
    //устанавливаем размер области для 3д графики
    renderer.setSize(window.innerWidth, window.innerHeight);

    //первый куб с размерами, задаём цвет
    var cubeGeometry = new THREE.CubeGeometry(10,2,0);
    var cubeMaterial = new THREE.MeshBasicMaterial(
        {color: 0x6C8995, wireframe: false});
    var cubeFirst = new THREE.Mesh(cubeGeometry, cubeMaterial);
    //cube.rotation.z = -0.5*Math.PI;
    cubeFirst.position.x = 0;
    cubeFirst.position.y = -14;
    cubeFirst.position.z = 0;
    scene.add(cubeFirst);

    //второй куб
    var cubeGeometry = new THREE.CubeGeometry(10,2,0);
    var cubeMaterial = new THREE.MeshBasicMaterial(
        {color: 0x1b243b, wireframe: false});
    var cubeSecond = new THREE.Mesh(cubeGeometry, cubeMaterial);
    cubeSecond.rotation.z = 45;
    cubeSecond.position.x = -15;
    cubeSecond.position.y = 5;
    cubeSecond.position.z = 0;
    scene.add(cubeSecond);

    //третий куб
    var cubeGeometry = new THREE.CubeGeometry(10,2,0);
    var cubeMaterial = new THREE.MeshBasicMaterial(
        {color: 0x425b4d, wireframe: false});
    var cubeThird = new THREE.Mesh(cubeGeometry, cubeMaterial);
    cubeThird.rotation.z = -45;
    cubeThird.position.x = 15;
    cubeThird.position.y = 5;
    cubeThird.position.z = 0;
    scene.add(cubeThird);

    //создаём сферу
    var sphereGeometry = new THREE.SphereGeometry(2,20,20);
    var sphereMaterial = new THREE.MeshLambertMaterial(
        {color: 0x7777ff});
    var sphere = new THREE.Mesh(sphereGeometry,sphereMaterial);
    sphere.position.x = 0;
    sphere.position.y = 0;
    sphere.position.z = 0;
    scene.add(sphere);

    //создаём источник света
    var spotLight = new THREE.SpotLight( 0xffffff );
    spotLight.position.set( 15, 5, 0 );
    scene.add(spotLight);

    var spotLight2 = new THREE.SpotLight( 0xffffff );
    spotLight2.position.set( 0, -14, 0 );
    scene.add(spotLight2);

    var spotLight3 = new THREE.SpotLight( 0xffffff );
    spotLight3.position.set( -15, 5, 0 );
    scene.add(spotLight3);

    //задаём положение камеры
    camera.position.y = 0;
    camera.position.z = 50;
    camera.lookAt(scene.position);

    let div = document.querySelector('#WebGL-output');
    div.append(renderer.domElement);
    //renderer.render(scene, camera);


    //функция рендеринга сцены
    var step=0;
    var cubeStep=0;
    let posSecondCube = cubeSecond.position.x-5;
    console.log(cubeFirst.position.x);
    //console.log(posSecondCube);
    function render() {
        step+=0.05;
        sphere.position.x = 0+(cubeThird.position.x*(Math.cos(step)));
        //var startPoscubeFirst = cubeFirst.position.x+0.1;
        cubeStep=1;


        //условие перемещения нижнего куба
        if (cubeFirst.position.x<=-10){
            console.log("max"+cubeFirst.position.x);
            cubeFirst.position.x = cubeFirst.position.x+cubeStep;
        }
        else{
            console.log("min"+cubeFirst.position.x);
            cubeFirst.position.x = cubeFirst.position.x-cubeStep;
        }

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
        renderer.render(scene, camera);
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
