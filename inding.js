var aCamera = document.querySelector('a-camera');
var aVideoSphere = document.querySelector('a-videosphere');
window.onload = function(){
    if(!navigator.getUserMedia){
        console.log('userMedia not supported')
    }else{
        navigator.getUserMedia({video:{width:3024, height:3024}, audio:false}, function(s){
            var vue = URL.createObjectURL(s);
            aVideoSphere.setAttribute('src', vue);
            aCamera.setAttribute('rotation', {y:90})
            vue.onload = (function(){
                var aCamera = document.querySelector('a-camera');
                var aSky = document.querySelector('a-videosphere');
                var cvCompute = document.querySelector('.a-canvas');
                var phantom = document.querySelector('#phantom');
                var shadow = document.querySelector('#shadow');
                phantom.setAttribute('height', cvCompute.getAttribute('height'))
                phantom.setAttribute('width', cvCompute.getAttribute('width'))
                shadow.setAttribute('height', cvCompute.getAttribute('height'))
                shadow.setAttribute('width', cvCompute.getAttribute('width'))
                var context = shadow.getContext('2d');
                const height = phantom.height;
                const width = phantom.width;
                var tracker = new tracking.ObjectTracker("face");
                tracker.setInitialScale(1.8);
                tracker.setStepSize(1);
                tracker.setEdgesDensity(0.1);
                //tracking.track('#videosphere', tracker);

                tracker.on('track', function(event) {
                    context.clearRect(0, 0, canvas.width, canvas.height);
                    event.data.forEach(function(rect) {
                      context.strokeStyle = '#a64ceb';
                      context.strokeRect(rect.x, rect.y, rect.width, rect.height);
                      context.font = '11px Helvetica';
                      context.fillStyle = "#fff";
                      context.fillText('x: ' + rect.x + 'px', rect.x + rect.width + 5, rect.y + 11);
                      context.fillText('y: ' + rect.y + 'px', rect.x + rect.width + 5, rect.y + 22);
                    });
                  });

                setInterval(function(){
                    /******************************MAGIK BORDERS*******************************/
                    if(aCamera.getAttribute('rotation').y >= 210){
                        var x = aCamera.getAttribute('rotation').x || 0
                        aCamera.setAttribute('rotation', {y: 209})
                    }
                    if(aCamera.getAttribute('rotation').y <= -30){
                        var x = aCamera.getAttribute('rotation').x || 0
                        aCamera.setAttribute('rotation', {y: -29})
                    }
                    if(aCamera.getAttribute('rotation').x <= -30 && aCamera.getAttribute('rotation').x < 0){
                        var y = aCamera.getAttribute('rotation').y || 0
                        aCamera.setAttribute('rotation', {x: -29, y})
                    }
                    if(aCamera.getAttribute('rotation').x >= 30 && aCamera.getAttribute('rotation').x > 0){
                        var y = aCamera.getAttribute('rotation').y || 0
                        aCamera.setAttribute('rotation', {x: +29,y})
                    }
                    /******************************MAGIK BORDERS*******************************/
                    
                }, 60)
            })();
        }, function(err){
            console.log(err)
        })
    }
}