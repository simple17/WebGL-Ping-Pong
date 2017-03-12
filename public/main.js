(() => {
  window.horses = window.location.hash.slice(1);
  window.beep = function(){
    document.getElementById('beep').play();
  }
  window.sheep = function(){
    document.getElementById('sheep').play();
  }

  if(window.horses == 'horses'){
    document.getElementById('horse').play();
  }

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
      players.first.step = vars.cubeStep * Math.abs(parseInt(data[1].orientation.y) / 7);
      console.log('first goes ' + players.first.direction);
    }
    if(data[2] !== undefined){
      players.second.direction = parseInt(data[2].orientation.y) <= 0 ? 'left' : 'right';
      players.second.step = vars.cubeStep * Math.abs(parseInt(data[2].orientation.y) / 14);
      console.log('second goes ' + players.first.direction);
    }
    if(data[3] !== undefined){
      players.third.direction = parseInt(data[3].orientation.y) <= 0 ? 'left' : 'right';
      players.third.step = vars.cubeStep * Math.abs(parseInt(data[3].orientation.y) / 14);
      console.log('third goes ' + players.first.direction);
    }
  }

  setInterval(() => {
    socket.send(JSON.stringify({type: 'getStates'}));
  }, 50);
})();

function foo() {
  var mixer, mixer2;
  var horseLeft, horseRight;
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
        {color: 0x494c90, wireframe: false}
    );
    var goalMat =  new THREE.MeshBasicMaterial(
              {color: 0xff0000, wireframe: false}
    );

    var redGoal = new THREE.Mesh(cubeGoalsGeometry, cubeGoalMaterial);
    redGoal.position.x = 0;
    redGoal.position.y = -vars.sizeOfSideOfTriangle;
    redGoal.position.z = 0;
    redGoal.name = 'redGoal';
    redGoal.normal = new THREE.Vector3(1, 0, 0).applyAxisAngle(new THREE.Vector3(0, 0, 1), Math.PI / 2);
    vars.SCENE.add(redGoal);


    var greenGoal = new THREE.Mesh(cubeGoalsGeometry, cubeGoalMaterial);
    greenGoal.rotation.z = Math.PI / 3;
    greenGoal.position.x = -vars.sizeOfSideOfTriangle / 2;
    greenGoal.position.y = -Math.sqrt(3) * vars.sizeOfSideOfTriangle / 2 + vars.sizeOfSideOfTriangle * (Math.sqrt(3) - 1);
    greenGoal.position.z = 0;
    greenGoal.name = 'greenGoal';
    greenGoal.normal = new THREE.Vector3(1 / 2, Math.sqrt(3) / 2, 0).applyAxisAngle(new THREE.Vector3(0, 0, 1), 3 * Math.PI / 2);
    vars.SCENE.add(greenGoal);


    var blueGoal = new THREE.Mesh(cubeGoalsGeometry, cubeGoalMaterial);
    blueGoal.rotation.z = 2 * Math.PI / 3;
    blueGoal.position.x = vars.sizeOfSideOfTriangle / 2;
    blueGoal.position.y = -Math.sqrt(3) * vars.sizeOfSideOfTriangle / 2 + vars.sizeOfSideOfTriangle * (Math.sqrt(3) - 1);
    blueGoal.position.z = 0;
    blueGoal.name = 'blueGoal';
    blueGoal.normal = new THREE.Vector3(-1 / 2, Math.sqrt(3) / 2, 0).applyAxisAngle(new THREE.Vector3(0, 0, 1), Math.PI / 2);
    vars.SCENE.add(blueGoal);

    //Рёбра

    var cubeBordersGeometry = new THREE.CubeGeometry(3, vars.borderWidth, 0);
    var cubeBordersMaterial = new THREE.MeshBasicMaterial(
        {color: 0x494c90, wireframe: false}
    );
    // заглушки на углах

    var borderGB = new THREE.Mesh(cubeBordersGeometry, cubeBordersMaterial);
    borderGB.position.x = 0;
    borderGB.position.y = 9.8;
    borderGB.position.z = 0;
    borderGB.name = 'borderGB';
    borderGB.normal = new THREE.Vector3(0, -1, 0);
    vars.SCENE.add(borderGB);
    collidableMeshList.push(borderGB);

    var borderRB = new THREE.Mesh(cubeBordersGeometry, cubeBordersMaterial);
    borderRB.rotation.z = Math.PI / 3;
    borderRB.position.x = vars.sizeOfSideOfTriangle - vars.sizeOfSideOfTriangle / 15;
    borderRB.position.y = -vars.sizeOfSideOfTriangle + vars.sizeOfSideOfTriangle / 30;
    borderRB.position.z = 0;
    borderRB.name = 'borderRB';
    borderRB.normal = new THREE.Vector3(1 / 2, Math.sqrt(3) / 2, 0).applyAxisAngle(new THREE.Vector3(0, 0, 1), Math.PI / 2);
    vars.SCENE.add(borderRB);
    collidableMeshList.push(borderRB);

    var borderRG = new THREE.Mesh(cubeBordersGeometry, cubeBordersMaterial);
    borderRG.rotation.z = 2 * Math.PI / 3;
    borderRG.position.x = -vars.sizeOfSideOfTriangle + vars.sizeOfSideOfTriangle / 15;
    borderRG.position.y = -vars.sizeOfSideOfTriangle + vars.sizeOfSideOfTriangle / 30;
    borderRG.position.z = 0;
    borderRG.name = 'borderRG';
    borderRG.normal = new THREE.Vector3(-1 / 2, Math.sqrt(3) / 2, 0).applyAxisAngle(new THREE.Vector3(0, 0, 1), 3 * Math.PI / 2);
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
    cubeFirst.normal = new THREE.Vector3(1, 0, 0).applyAxisAngle(new THREE.Vector3(0, 0, 1), Math.PI / 2);
    vars.SCENE.add(cubeFirst);
    collidableMeshList.push(cubeFirst);

    //второй куб
    var cubeGeometry = new THREE.CubeGeometry(vars.sizeOfPlayers, 0.5, 0);
    var cubeMaterial = new THREE.MeshBasicMaterial(
        {color: 0x008000, wireframe: false});
    var cubeSecond = new THREE.Mesh(cubeGeometry, cubeMaterial);
    cubeSecond.rotation.z = Math.PI / 3;
    cubeSecond.position.x = players.second.startPosition.x;
    cubeSecond.position.y = players.second.startPosition.y;
    cubeSecond.position.z = 0;
    cubeSecond.name = 'green';
    cubeSecond.normal = new THREE.Vector3(1 / 2, Math.sqrt(3) / 2, 0).applyAxisAngle(new THREE.Vector3(0, 0, 1), 3 * Math.PI / 2);
    vars.SCENE.add(cubeSecond);
    collidableMeshList.push(cubeSecond);

    //третий куб
    var cubeGeometry = new THREE.CubeGeometry(vars.sizeOfPlayers, 0.5, 0);
    var cubeMaterial = new THREE.MeshBasicMaterial(
        {color: 0x0000ff, wireframe: false});
    var cubeThird = new THREE.Mesh(cubeGeometry, cubeMaterial);
    cubeThird.rotation.z = 2 * Math.PI / 3;
    cubeThird.position.x = players.third.startPosition.x;
    cubeThird.position.y = players.third.startPosition.y;
    cubeThird.position.z = 0;
    cubeThird.name = 'blue';
    cubeThird.normal = new THREE.Vector3(-1 / 2, Math.sqrt(3) / 2, 0).applyAxisAngle(new THREE.Vector3(0, 0, 1), Math.PI / 2);
    vars.SCENE.add(cubeThird);
    collidableMeshList.push(cubeThird);

    collidableMeshList.push(redGoal);
    collidableMeshList.push(greenGoal);
    collidableMeshList.push(blueGoal);

    //создаём сферу
    var sphereGeometry = new THREE.SphereGeometry(0.5, 0, 20);
    var sphereMaterial = new THREE.MeshLambertMaterial(
        {color: 0x05cffb});
    var sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    sphere.position.x = 0;
    sphere.position.y = 0;
    sphere.position.z = 0;
    vars.SCENE.add(sphere);

    //создаём источник света
    var spotLightFirst = new THREE.SpotLight(0xffffff);
    spotLightFirst.position.set(15, 5, 0);
    vars.SCENE.add(spotLightFirst);

    var spotLightSecond = new THREE.SpotLight(0xffffff);
    spotLightSecond.position.set(0, -14, 0);
    vars.SCENE.add(spotLightSecond);

    var spotLightThird = new THREE.SpotLight(0xffffff);
    spotLightThird.position.set(-15, 5, 0);
    vars.SCENE.add(spotLightThird);

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

    //var axes = new THREE.AxisHelper(3);
    //vars.SCENE.add(axes);
    //var direction = 'left';


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

    function animate() {
        deltaTime = clock.getDelta();
    }

    function addParticles() {
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
            {
                color: 0xe1e9f2,
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

    //Рисуем коня
    if(window.horses == 'horses'){
      var loader = new THREE.JSONLoader();
  				loader.load( "horse.js", function( geometry ) {
  					horseLeft = new THREE.Mesh( geometry, new THREE.MeshLambertMaterial( {
  						vertexColors: THREE.FaceColors,
  						morphTargets: true
  					} ) );
  					horseLeft.scale.set( 0.1, 0.1, 0.1 );
            // mesh.position(0, 0, 0);

  					vars.SCENE.add( horseLeft );

            horseRight = horseLeft.clone();
            horseLeft.position.set(-20,-12,5);

            vars.SCENE.add( horseRight );
            horseRight.position.set(20,-12,5);

            mixer = new THREE.AnimationMixer( horseLeft );
  					var clip = THREE.AnimationClip.CreateFromMorphTargetSequence( 'gallop', geometry.morphTargets, 30 );
  					mixer.clipAction( clip ).setDuration( 1 ).play();

            mixer2 = new THREE.AnimationMixer( horseRight );
  					var clip2 = THREE.AnimationClip.CreateFromMorphTargetSequence( 'gallop', geometry.morphTargets, 30 );
  					mixer2.clipAction( clip ).setDuration( 1 ).play();
  				} );

    }


    function checkCollision() {

    }

    var collisionDetect = false;
    var firstFrame = true;
    var prevTime = Date.now();

    composer = new THREE.EffectComposer( renderer );
    composer.addPass( new THREE.RenderPass( vars.SCENE, camera ) );
    glitchPass = new THREE.GlitchPass();
    glitchPass.renderToScreen = true;
    composer.addPass( glitchPass );

    function render() {
        particleSystem.rotation.y += 0.01;
        sphere.position.x += vars.sphere.direction.x;
        sphere.position.y += vars.sphere.direction.y;
        calculateCollisionPoint(sphere.position);

      //АНимация лошадей
      if(window.horses == 'horses'){
        var time = Date.now();
        if ( mixer ) {
          mixer.update( ( time - prevTime ) * 0.001 );
        }
        if ( mixer2 ) {
          mixer2.update( ( time - prevTime ) * 0.001 );
        }
        prevTime = time;
      }
//условие перемещения нижнего куба

        if (players.first.direction == 'left' && cubeFirst.position.x > -vars.sizeOfSideOfTriangle) {
            cubeFirst.position.x -= players['first'].step;
            spotLightFirst.position.x -= players['first'].step;
        } else if (players.first.direction == 'left' && cubeFirst.position.x <= -vars.sizeOfSideOfTriangle) {
            players.first.direction = 'right';
        } else if (players.first.direction == 'right' && cubeFirst.position.x <= vars.sizeOfSideOfTriangle) {
            cubeFirst.position.x += players['first'].step;
        } else if (players.first.direction == 'right' && cubeFirst.position.x > vars.sizeOfSideOfTriangle) {
            players.first.direction = 'left';
        }


        //movement of second player

        if (players.second.direction == 'left' &&
            cubeSecond.position.x > -vars.sizeOfSideOfTriangle &&
            cubeSecond.position.y > -vars.sizeOfSideOfTriangle) {

            cubeSecond.position.x -= players['second'].step;
            cubeSecond.position.y = Math.sqrt(3) * cubeSecond.position.x + vars.sizeOfSideOfTriangle * (Math.sqrt(3) - 1);

            spotLightSecond.position.x -= players['second'].step;
            spotLightSecond.position.y = Math.sqrt(3) * cubeSecond.position.x + vars.sizeOfSideOfTriangle * (Math.sqrt(3) - 1);

        } else if (players.second.direction == 'left' &&
            cubeSecond.position.x <= -vars.sizeOfSideOfTriangle &&
            cubeSecond.position.y <= -vars.sizeOfSideOfTriangle) {

            players.second.direction = 'right';

        } else if (players.second.direction == 'right' &&
            cubeSecond.position.x <= 0 &&
            cubeSecond.position.y <= (Math.sqrt(3) - 1) * vars.sizeOfSideOfTriangle) {

            cubeSecond.position.x += players['second'].step;
            cubeSecond.position.y = Math.sqrt(3) * cubeSecond.position.x + vars.sizeOfSideOfTriangle * (Math.sqrt(3) - 1);

            spotLightSecond.position.x += players['second'].step;
            spotLightSecond.position.y = Math.sqrt(3) * cubeSecond.position.x + vars.sizeOfSideOfTriangle * (Math.sqrt(3) - 1);

        } else if (players.second.direction == 'right' &&
            cubeSecond.position.x > 0 &&
            cubeSecond.position.y > (Math.sqrt(3) - 1) * vars.sizeOfSideOfTriangle) {
            players.second.direction = 'left';
        }

        //movement of third player

        if (players.third.direction == 'left' &&
            cubeThird.position.x > 0 &&
            cubeThird.position.y < (Math.sqrt(3) - 1) * vars.sizeOfSideOfTriangle) {

            cubeThird.position.x -= players['third'].step;
            cubeThird.position.y = -Math.sqrt(3) * cubeThird.position.x + vars.sizeOfSideOfTriangle * (Math.sqrt(3) - 1);

            spotLightThird.position.x -= players['third'].step;
            spotLightThird.position.y = -Math.sqrt(3) * cubeThird.position.x + vars.sizeOfSideOfTriangle * (Math.sqrt(3) - 1);

        } else if (players.third.direction == 'left' &&
            cubeThird.position.x <= 0 &&
            cubeThird.position.y >= (Math.sqrt(3) - 1) * vars.sizeOfSideOfTriangle) {
            players.third.direction = 'right';

        } else if (players.third.direction == 'right' &&
            cubeThird.position.x < vars.sizeOfSideOfTriangle &&
            cubeThird.position.y > -vars.sizeOfSideOfTriangle) {

            cubeThird.position.x += players['third'].step;
            cubeThird.position.y = -Math.sqrt(3) * cubeThird.position.x + vars.sizeOfSideOfTriangle * (Math.sqrt(3) - 1);

            spotLightThird.position.x += players['third'].step;
            spotLightThird.position.y = -Math.sqrt(3) * cubeThird.position.x + vars.sizeOfSideOfTriangle * (Math.sqrt(3) - 1);

        } else if (players.third.direction == 'right' &&
            cubeThird.position.x >= vars.sizeOfSideOfTriangle &&
            cubeThird.position.y <= -vars.sizeOfSideOfTriangle) {
            players.third.direction = 'left';
        }

		var movementDirection = new THREE.Vector3(1, 0, 1);
        var ray = new THREE.Raycaster();
        ray.set(vars.sphere.collisionPoint, movementDirection);
        var collisionResults = ray.intersectObjects(collidableMeshList);
        if (collisionResults.length > 0 && collisionResults[0].distance <= 1) {
            var thisElement = collisionResults[0].object;
            if(collisionResults.length > 1){
              var collisionElement;
              collisionResults.forEach(function(el){
                if(el.object.name.indexOf('Goal') !== -1){

                }else{
                  thisElement = el.object;
                }
              })
            }

            switch (thisElement.name) {
                case 'red':
                    console.log('red rocket');
                    nextSteps = reflect(thisElement.normal, vars.sphere.direction);
                    break;
                case 'green':
                    console.log('green rocket');
                    nextSteps = reflect(thisElement.normal, vars.sphere.direction);
                    break;
                case 'blue':
                    console.log('blue rocket');
                    nextSteps = reflect(thisElement.normal, vars.sphere.direction);
                    break;
                case 'redGoal':
                reflectGoal(thisElement)
                players.first.score -= 1;
                    break;
                case 'greenGoal':
                    reflectGoal(thisElement)
                    players.second.score -= 1;
                    break;
                case 'blueGoal':
                reflectGoal(thisElement)
                players.third.score -= 1;
                    break;
                case 'borderGB':
                    console.log('borderGB');
                    //nextSteps = borderReflect(vars.sphere.stepX, vars.sphere.stepY);
                    nextSteps = reflect(thisElement.normal, vars.sphere.direction);
                    break;
                case 'borderRB':
                    console.log('borderRB');
                    //nextSteps = borderReflect(vars.sphere.stepX, vars.sphere.stepY);
                    nextSteps = reflect(thisElement.normal, vars.sphere.direction);
                    break;
                case 'borderRG':
                    console.log('borderRG');
                    //nextSteps = borderReflect(vars.sphere.stepX, vars.sphere.stepY);
                    nextSteps = reflect(thisElement.normal, vars.sphere.direction);
                    break;
                default:
                    console.log('What the fuck!?');
            }
            collisionResults = [];
        }
        renderScores();
        requestAnimationFrame(render);

        if(window.horses == 'horses'){
            composer.render();
        } else{
            renderer.render(vars.SCENE, camera);
        }

        function markGoal(obj){
          obj.material = goalMat;
          setTimeout(function (){obj.material = cubeGoalMaterial;},100)
        }

        function reflect(normalVect, objectVect) {
            objectVect.reflect(normalVect);
            move(objectVect.x, objectVect.y);
        }

        function reflectGoal(goal){
          reflect(goal.normal, vars.sphere.direction);
          markGoal(goal);
          if(window.horses == 'horses'){
            window.beep();  
            // window.sheep();
          } else{
            window.beep();
          }

        }

        function move(x, y) {
            vars.sphere.direction.x = x;
            vars.sphere.direction.y = y;
        }

        function calculateCollisionPoint(centerPoint) {
            var direction = new THREE.Vector3(vars.sphere.direction.x, vars.sphere.direction.y, 0);
            direction.normalize();
            vars.sphere.collisionPoint = new THREE.Vector3(centerPoint.x + direction.x * vars.sphere.radius, centerPoint.y + direction.y * vars.sphere.radius, 0);
        }

        //function goalReflect(stepX, stepY, player) {
        //    players[player].score = players[player].score - 1;
        //    return {
        //        stepX: stepX,
        //        stepY: stepY
        //    };
        //}
    }

    render();

    function renderScores() {
        document.getElementById('firstPlayerScore').textContent = players['first'].score;
        document.getElementById('secondPlayerScore').textContent = players['second'].score;
        document.getElementById('thirdPlayerScore').textContent = players['third'].score;
    }

};
foo();
