var aCamera = document.querySelector('a-camera');
var aSky = document.querySelector('a-videosphere');
var assetVideo = document.querySelector('#assetVideo');
document.body.onload = function() {
    if(!navigator.getUserMedia){
        console.log('userMedia not supported')
    }else{
        navigator.getUserMedia({video:{facingMode: "environement", aspectRatio: 4/3}, audio:false}, function(s){
            var newSky = URL.createObjectURL(s);
            aSky.setAttribute('src', newSky);
            assetVideo.setAttribute('src', newSky)
            document.querySelector('a-camera').setAttribute('rotation', {y:90})
            s.onload = (function(){
                var aCamera = document.querySelector('a-camera');
                var aSky = document.querySelector('a-videosphere');
                var cvCompute = document.querySelector('.a-canvas');
                var phantom = document.querySelector('#phantom');
                var shadow = document.querySelector('#shadow');
                phantom.setAttribute('height', cvCompute.getAttribute('height'))
                phantom.setAttribute('width', cvCompute.getAttribute('width'))
                shadow.setAttribute('height', cvCompute.getAttribute('height'))
                shadow.setAttribute('width', cvCompute.getAttribute('width'))
                assetVideo.setAttribute('height', cvCompute.getAttribute('height'))
                assetVideo.setAttribute('width', cvCompute.getAttribute('width'))
                var context = phantom.getContext('2d');
                const height = phantom.height
                const width = phantom.width
                var src = new cv.Mat(height, width, cv.CV_8UC4);
                var dst = new cv.Mat(height, width, cv.CV_8UC4);
                var gray = new cv.Mat();
                let cap = new cv.VideoCapture(assetVideo);
                var faces = new cv.RectVector();
                var classifier = new cv.CascadeClassifier();
                classifier.load('haarcascade_frontalface_alt.xml');
                setInterval(function(){
                   // context.drawImage(cvCompute, 0, 0, width, height);
                   // src.data.set(context.getImageData(0, 0, width, height).data);
                    cap.read(src);
                    src.copyTo(dst);
                    cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY, 0);
                    // detect faces.
                    classifier.detectMultiScale(gray, faces, 1.1, 3, 0);
                    // draw faces.
                    for (let i = 0; i < faces.size(); ++i) {
                        let face = faces.get(i);
                        let point1 = new cv.Point(face.x, face.y);
                        let point2 = new cv.Point(face.x + face.width, face.y + face.height);
                        cv.rectangle(src, point1, point2, [255, 0, 0, 255]);
                    }
                    cv.imshow(shadow, src);
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
        },
    function(err){
        console.log(err)
    })
    }
}
