// (() => {
//   var socket = new WebSocket(`ws://${window.location.hostname}:${window.location.port}/client`);
//   socket.onopen = function(){
//     socket.send(JSON.stringify({
//       type: 'initView'
//     }));
//   }
//
//   socket.onmessage = function(msg){
//     var data = JSON.parse(msg.data);
//     //Я сильный волчара!!!! :DDDDDD
//     if(data[1] !== undefined){
//       players.first.direction = parseInt(data[1].orientation.y) <= 0 ? 'left' : 'right';
//       console.log('first goes ' + players.first.direction);
//     }
//     if(data[2] !== undefined){
//       players.second.direction = parseInt(data[2].orientation.y) <= 0 ? 'left' : 'right';
//       console.log('second goes ' + players.first.direction);
//     }
//     if(data[3] !== undefined){
//       players.third.direction = parseInt(data[3].orientation.y) <= 0 ? 'left' : 'right';
//       console.log('third goes ' + players.first.direction);
//     }
//   }
//
//   setInterval(() => {
//     socket.send(JSON.stringify({type: 'getStates'}));
//   }, 100);
// })();

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

    //Голевые зоны

    var cubeGoalsGeometry = new THREE.CubeGeometry(2 * vars.sizeOfSideOfTriangle, vars.goalWidth, 0);
    var cubeGoalMaterial = new THREE.MeshBasicMaterial(
        {color: 0xff8787, wireframe: false}
    );

    var redGoal = new THREE.Mesh(cubeGoalsGeometry, cubeGoalMaterial);
    redGoal.position.x = 0;
    redGoal.position.y = -vars.sizeOfSideOfTriangle;
    redGoal.position.z = 0;
    redGoal.name = 'redGoal';
    redGoal.normal = new THREE.Vector3(1,0,0).applyAxisAngle(new THREE.Vector3(0,0,1), Math.PI/2);
    vars.SCENE.add(redGoal);


    var greenGoal = new THREE.Mesh(cubeGoalsGeometry, cubeGoalMaterial);
    greenGoal.rotation.z = Math.PI/3;
    greenGoal.position.x = -vars.sizeOfSideOfTriangle / 2;
    greenGoal.position.y = - Math.sqrt(3) * vars.sizeOfSideOfTriangle / 2 + vars.sizeOfSideOfTriangle * (Math.sqrt(3) - 1);
    greenGoal.position.z = 0;
    greenGoal.name = 'greenGoal';
    greenGoal.normal = new THREE.Vector3(1/2,Math.sqrt(3)/2,0).applyAxisAngle(new THREE.Vector3(0,0,1), 3*Math.PI/2);
    vars.SCENE.add(greenGoal);


    var blueGoal = new THREE.Mesh(cubeGoalsGeometry, cubeGoalMaterial);
    blueGoal.rotation.z = 2 * Math.PI/3;
    blueGoal.position.x = vars.sizeOfSideOfTriangle / 2;
    blueGoal.position.y = - Math.sqrt(3) * vars.sizeOfSideOfTriangle / 2 + vars.sizeOfSideOfTriangle * (Math.sqrt(3) - 1);
    blueGoal.position.z = 0;
    blueGoal.name = 'blueGoal';
    blueGoal.normal = new THREE.Vector3(-1/2,Math.sqrt(3)/2,0).applyAxisAngle(new THREE.Vector3(0,0,1), Math.PI/2);
    vars.SCENE.add(blueGoal);

    //Рёбра

    var cubeBordersGeometry = new THREE.CubeGeometry( 1.34, vars.borderWidth, 0);
    var cubeBordersMaterial = new THREE.MeshBasicMaterial(
        {color: 0x0000ff, wireframe: false}
    );

    var borderGB = new THREE.Mesh(cubeBordersGeometry, cubeBordersMaterial);
    borderGB.position.x = 0;
    borderGB.position.y = 9.8;
    borderGB.position.z = 0;
    borderGB.name = 'borderGB';
    vars.SCENE.add(borderGB);
    collidableMeshList.push(borderGB);

    var borderRB = new THREE.Mesh(cubeBordersGeometry, cubeBordersMaterial);
    borderRB.rotation.z = Math.PI/3;
    borderRB.position.x = vars.sizeOfSideOfTriangle - vars.sizeOfSideOfTriangle / 15;
    borderRB.position.y = - vars.sizeOfSideOfTriangle + vars.sizeOfSideOfTriangle / 30;
    borderRB.position.z = 0;
    borderRB.name = 'borderRB';
    vars.SCENE.add(borderRB);
    collidableMeshList.push(borderRB);

    var borderRG = new THREE.Mesh(cubeBordersGeometry, cubeBordersMaterial);
    borderRG.rotation.z = 2 * Math.PI/3;
    borderRG.position.x = - vars.sizeOfSideOfTriangle + vars.sizeOfSideOfTriangle / 15;
    borderRG.position.y = - vars.sizeOfSideOfTriangle + vars.sizeOfSideOfTriangle / 30;
    borderRG.position.z = 0;
    borderRG.name = 'borderRG';
    vars.SCENE.add(borderRG);
    collidableMeshList.push(borderRG);

    //первый куб с размерами, задаём цвет
    var cubeGeometry = new THREE.CubeGeometry(vars.sizeOfPlayers, 0.5, 0);
    var cubeMaterial = new THREE.MeshBasicMaterial(
        {color: 0xff0000, wireframe: false});
    var cubeFirst = new THREE.Mesh(cubeGeometry, cubeMaterial);
    //cube.rotation.z = -0.5*Math.PI;
    cubeFirst.position.x = players.first.startPosition.x;
    cubeFirst.position.y = players.first.startPosition.y;
    cubeFirst.position.z = 0;
    cubeFirst.name = 'red';
    vars.SCENE.add(cubeFirst);
    collidableMeshList.push(cubeFirst);

    //второй куб
    var cubeGeometry = new THREE.CubeGeometry(vars.sizeOfPlayers, 0.5, 0);
    var cubeMaterial = new THREE.MeshBasicMaterial(
        {color: 0x00ff00, wireframe: false});
    var cubeSecond = new THREE.Mesh(cubeGeometry, cubeMaterial);
    cubeSecond.rotation.z = Math.PI/3;
    cubeSecond.position.x = players.second.startPosition.x;
    cubeSecond.position.y = players.second.startPosition.y;
    cubeSecond.position.z = 0;
    cubeSecond.name = 'green';
    vars.SCENE.add(cubeSecond);
    collidableMeshList.push(cubeSecond);

    //третий куб
    var cubeGeometry = new THREE.CubeGeometry(vars.sizeOfPlayers, 0.5, 0);
    var cubeMaterial = new THREE.MeshBasicMaterial(
        {color: 0x0000ff, wireframe: false});
    var cubeThird = new THREE.Mesh(cubeGeometry, cubeMaterial);
    cubeThird.rotation.z = 2 * Math.PI/3;
    cubeThird.position.x = players.third.startPosition.x;
    cubeThird.position.y = players.third.startPosition.y;
    cubeThird.position.z = 0;
    cubeThird.name = 'blue';
    vars.SCENE.add(cubeThird);
    collidableMeshList.push(cubeThird);

    collidableMeshList.push(redGoal);
    collidableMeshList.push(greenGoal);
    collidableMeshList.push(blueGoal);

    //создаём сферу
    var sphereGeometry = new THREE.SphereGeometry(0.5, 0, 20);
    var sphereMaterial = new THREE.MeshLambertMaterial(
        {color: 0x7777ff});
    var sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    sphere.position.x = 0;
    sphere.position.y = 0;
    sphere.position.z = 0;
    vars.SCENE.add(sphere);

    //создаём источник света
    var spotLight = new THREE.SpotLight(0xffffff);
    spotLight.position.set(15, 5, 0);
    vars.SCENE.add(spotLight);

    var spotLight2 = new THREE.SpotLight(0xffffff);
    spotLight2.position.set(0, -14, 0);
    vars.SCENE.add(spotLight2);

    var spotLight3 = new THREE.SpotLight(0xffffff);
    spotLight3.position.set(-15, 5, 0);
    vars.SCENE.add(spotLight3);

    //задаём положение камеры
    camera.position.x = 0;
    camera.position.y = 0;
    camera.position.z = 50;
    camera.lookAt(vars.SCENE.position);

    let div = document.querySelector('#WebGL-output');
    div.append(renderer.domElement);

    //функция рендеринга сцены
    var step = 0;
    var cubeStep = 0;
    let posSecondCube = cubeSecond.position.x - 5;


    // tools.makeSideOfTriangle(
    //     {x: -vars.sizeOfSideOfTriangle, y: -vars.sizeOfSideOfTriangle},
    //     {x: vars.sizeOfSideOfTriangle, y: -vars.sizeOfSideOfTriangle}
    // );
    // tools.makeSideOfTriangle(
    //     {x: vars.sizeOfSideOfTriangle, y: -vars.sizeOfSideOfTriangle},
    //     {x: 0, y: vars.sizeOfSideOfTriangle * (Math.sqrt(3) - 1)}
    // );
    // tools.makeSideOfTriangle(
    //     {x: 0, y: vars.sizeOfSideOfTriangle * (Math.sqrt(3) - 1)},
    //     {x: -vars.sizeOfSideOfTriangle, y: -vars.sizeOfSideOfTriangle}
    // );

    var axes = new THREE.AxisHelper(3);
    vars.SCENE.add(axes);
    var direction = 'left';



    //var originPoint = sphere.position.clone();
    // console.log("I am originPoint");
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
    //Рисуем космос
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

    function checkCollision() {

    }

    var collisionDetect = false;
    var firstFrame = true;

    function render() {
      particleSystem.rotation.y+=0.01;
      sphere.position.x += vars.sphere.stepX;
      //sphere.position.y = vars.newK * sphere.position.x + vars.newB;
      //sphere.position.y = vars.angle * sphere.position.x;
      sphere.position.y += vars.sphere.stepY;


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


      //rays = [
         var movementDirection =  new THREE.Vector3(1, 0, 1);
          //new THREE.Vector3(0, 0, 1),
          //new THREE.Vector3(1, 0, 0),
          //new THREE.Vector3(1, 0, -1),
          //new THREE.Vector3(0, 0, -1),
          //new THREE.Vector3(-1, 0, -1),
          //new THREE.Vector3(-1, 0, 0),
          //new THREE.Vector3(-1, 0, 1)
      //];

        calculateCollisionPoint(sphere.position);
      var ray = new THREE.Raycaster();
      //for (var vertexIndex = 0; vertexIndex < rays.length; vertexIndex++) {
          if (collisionDetect) {
              ray.set(vars.sphere.collisionPoint, movementDirection);
              var collisionResults = ray.intersectObjects(collidableMeshList);
             if (collisionResults.length > 0 && collisionResults[0].distance <= 1 && collisionDetect) {
                  console.log("Hit");
                  var nextSteps = {
                      stepX: vars.sphere.stepX,
                      stepY: vars.sphere.stepY
                  };
                  var thisElement = collisionResults[0].object;
                  switch (thisElement.name){
                      case 'red':
                          console.log('red rocket');
                          nextSteps = rocketReflect(vars.sphere.stepX, vars.sphere.stepY, 'red');
                          break;
                      case 'green':
                          console.log('green rocket');
                          nextSteps = rocketReflect(vars.sphere.stepX, vars.sphere.stepY, 'green');
                          break;
                      case 'blue':
                          console.log('blue rocket');
                          nextSteps = rocketReflect(vars.sphere.stepX, vars.sphere.stepY, 'blue');
                          break;
                      case 'redGoal':
                          console.log('redGoal');
                          //nextSteps = goalReflect(vars.sphere.stepX, vars.sphere.stepY, 'first');
                          nextSteps = reflect(thisElement.normal,vars.sphere.direction);
                          players.first.score -=1;
                          break;
                      case 'greenGoal':
                          console.log('greenGoal');
                          nextSteps = reflect(thisElement.normal,vars.sphere.direction);
                          players.second.score -=1;
                          //nextSteps = goalReflect(vars.sphere.stepX, vars.sphere.stepY, 'second');
                          break;
                      case 'blueGoal':
                          console.log('blueGoal');
                          nextSteps = reflect(thisElement.normal,vars.sphere.direction);
                          players.third.score -=1;
                          //nextSteps = goalReflect(vars.sphere.stepX, vars.sphere.stepY, 'third');
                          break;
                      case 'borderGB':
                          console.log('borderGB');
                          nextSteps = borderReflect(vars.sphere.stepX, vars.sphere.stepY);
                          break;
                      case 'borderRB':
                          console.log('borderRB');
                          nextSteps = borderReflect(vars.sphere.stepX, vars.sphere.stepY);
                          break;
                      case 'borderRG':
                          console.log('borderRG');
                          nextSteps = borderReflect(vars.sphere.stepX, vars.sphere.stepY);
                          break;
                      default:
                          console.log('What the fuck!?');
                  }

                  if(nextSteps) {
                      move(nextSteps.stepX,nextSteps.stepY);
                  }

                  collisionResults = [];
                  collisionDetect = false;
              }
          }
      //}
      collisionDetect = true;

      renderScores();
      requestAnimationFrame(render);
      renderer.render(vars.SCENE, camera);

        function reflect(normalVect, objectVect){
            objectVect.reflect(normalVect);
            move(objectVect.x,objectVect.y);
        }

        function move(x,y){
            vars.sphere.stepX = x;
            vars.sphere.stepY = y;
            vars.sphere.direction.x = x;
            vars.sphere.direction.y = y;
        }

        function calculateCollisionPoint(centerPoint){
            vars.sphere.collisionPoint.x = vars.sphere.direction.x * vars.sphere.radius + centerPoint.x;
            vars.sphere.collisionPoint.y = vars.sphere.direction.y * vars.sphere.radius + centerPoint.y;
        }

        function borderReflect(stepX,stepY){
            return {
                stepX: -stepX,
                stepY: -stepY
            };
        }

        function rocketReflect(stepX,stepY, side){

            var cos = (stepX * (1/2) + stepY * Math.sqrt(3)/2)/(Math.sqrt(stepX * stepX + stepY * stepY));
            vars.angle = Math.acos(cos);

            if (side == 'red'){
                return {
                    stepX: stepX,
                    stepY: -stepY
                };
            }

            return {
                stepX: -stepX,
                stepY: stepY
            };
        }

        function goalReflect(stepX,stepY, player){
            players[player].score = players[player].score - 1;
            return {
                stepX: stepX,
                stepY: stepY
            };
        }
    }

    render();

    function renderScores(){
      document.getElementById('firstPlayerScore').textContent = players['first'].score;
      document.getElementById('secondPlayerScore').textContent = players['second'].score;
      document.getElementById('thirdPlayerScore').textContent = players['third'].score;
    }

};
foo();
