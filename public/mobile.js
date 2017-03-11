window.globalData = {
  clientId: window.location.hash.slice(1),
  type: 'setOrientation'
};
(function(){
  // let path = window.location.hostname;

  let text = document.getElementById('data');
  let fixed = 0;
  // let clientId = window.location.hash.slice(1);


  if (window.DeviceOrientationEvent) {
    window.addEventListener("deviceorientation", function () {
      if(event.beta && event.gamma){
        text.textContent = `orientation.x = ${event.beta.toFixed(fixed)} orientation.y = ${event.gamma.toFixed(fixed)} `;
        window.globalData.orientation = {
          x: event.beta.toFixed(fixed),
          y: event.gamma.toFixed(fixed)
        };
      }
    }, true);
  } else if (window.DeviceMotionEvent) {
    window.addEventListener('devicemotion', function () {
      if(event.acceleration.x && event.acceleration.y){
        text.textContent = `orientation.x = ${event.acceleration.x.toFixed(fixed)} orientation.y = ${event.acceleration.y.toFixed(fixed)} `;
        window.globalData.acceleration = {
          x: acceleration.x.toFixed(fixed),
          y: acceleration.y.toFixed(fixed)
        };
      }
    }, true);
  } else {
    window.addEventListener("MozOrientation", function () {
      if(orientation.x && orientation.y){
        text.textContent = `orientation.x = ${orientation.x.toFixed(fixed)} orientation.y = ${orientation.y.toFixed(fixed)} `;
        window.globalData.orientation = {
          x: orientation.x.toFixed(fixed),
          y: orientation.y.toFixed(fixed)
        }
      }
    }, true);
  }

  var socket = new WebSocket(`ws://${window.location.hostname}:${window.location.port}/client`);
  socket.onopen = function(){
    socket.send(JSON.stringify({clientId: window.location.hash.slice(1), type: 'initClient'}));
    setInterval(function(){
      console.log(window.globalData);
      socket.send(JSON.stringify(window.globalData));
    }, 100);
  }

  socket.onmessage = function(msg){
    var data = JSON.parse(msg.data);
    if(typeof data.color != 'undefined'){
      document.body.style.background = data.color;
    }
  }
})();
