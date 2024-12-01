const canvas = document.querySelector("#photo")
const video = document.querySelector("#player")
const strip = document.querySelector("#strip")
const snap = document.querySelector(".snap")

const ctx = canvas.getContext('2d')

//1 function getVideo => is designed to access the user's camera and display the video feed on a webpage. 
function getVideo(){
    navigator.mediaDevices.getUserMedia({video:true, audio: false})
      .then((localMediaStream)=>{
        console.log(localMediaStream)
        video.srcObject = localMediaStream
        video.play()    //when video start playing it call the paintToCanvas() func coz we attached eventlistener(canplay) to video 
      })

      //If the user denies permission or an error occurs (e.g., no camera available), this block handles it. 
      .catch((err)=>{
        console.log("Error", err)
      })
}

getVideo()

//Notes
//1 navigator.mediaDevices.getUserMedia: This is a browser API that requests access to media input devices like the camera and microphone.
// video: true: Requests access to the user's camera.
// audio: false: Does not request access to the microphone.
// navigator will return promise so we use .then() and .catch()

//2 Handling Success : .then()
//If the user grants permission,the browser returns a "MediaStream" object(stored in localMediaStream), representing the video feed from the camera.
//video.srcObject = localMediaStream: Assigns the camera feed to the srcObject property of the <video> element, enabling it to display the stream.
//video.play(): Starts playing the video stream on the webpage.



//2 PaintoCanvas Function - The paintToCanvas function is designed to draw frames from a video element onto an HTML canvas element, effectively creating a real-time video feed on the canvas. 
function paintToCanvas(){
  //Get the video's dimensions
  const width = video.videoWidth
  const height = video.videoHeight

  //Set the canvas dimensions to match the video's dimensions
  canvas.width = width
  canvas.height = height

  // Use `setInterval` to repeatedly draw the video frames onto the canvas
  return setInterval(() => {
    ctx.drawImage(video, 0, 0, width, height)
  }, 10);
}

//Now we have to separately call getVideo() and then paintoCanvas() fun to get Video draw on canvas so
// we apply eventListener on video so when we call getVideo() func it will run paintoCanvas() automatically
video.addEventListener('canplay', paintToCanvas)   



//3 Take photo functionality
function takePhoto(){
  //When click on takephot btn played the sound
  snap.currentTime = 0   //Reset audio to start - so that sound will immediately startover again 
  snap.play()

  //get data(which is img here) out of canvas
  const data = canvas.toDataURL('image/jpeg')   
  
  //Create link element
  const link = document.createElement('a')     
  link.href = data                              
  link.setAttribute("download", "handsome")     //set attributes of link elem
  link.innerHTML = `<img src="${data}" alt="Handsome" />`   //innerHTML of link elem is an img

  //Now we insert link(which is an image) at the beginning of the strip div
  strip.insertBefore(link, strip.firstChild)
}

