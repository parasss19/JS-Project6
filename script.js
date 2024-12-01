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
    //Draw the video on the canvas
    ctx.drawImage(video, 0, 0, width, height)

    //Effects logic
    //1 take the pixels out of the canvas
    //2 pass the pixels value inside redEffect func and it convert the pixels array and return the modified pixels array
    //3 put the pixels back to canvas 

    //1
    let pixels = ctx.getImageData(0, 0, width, height)
    //console.log(pixels) 

    //2 
    // Red Effect
    if(redMode){
      pixels = redEffect(pixels)
    }
    // RGB effect
    else if(rgbMode){
      pixels = rgbEffect(pixels)
    }
    
    //3
    ctx.putImageData(pixels, 0, 0)
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


//4 ******************* Effects **********************
const redBtn = document.getElementById("red-button")
const rgbBtn = document.getElementById("rgb-button")

//Track state for button functionality
let redMode = false
let rgbMode = false

// addEventListener to toggle the mode(redMode or rgbMode) when the buttons are clicked. Ensured only one mode is active at a time by disabling the other mode in the event listener.
redBtn.addEventListener("click", () => {
  if(redMode) {
    redMode = false;  //Disable Red Effect(initially)
    redBtn.textContent = "Red Effect🪄";
  } else {
    redMode = true;  // Enable Red Effect
    rgbMode = false; // Disable RGB Mode
    redBtn.textContent = "Remove Effect";
    rgbBtn.textContent = "RGB Effect🪄"; // Reset RGB Button
  }
});
rgbBtn.addEventListener("click", () => {
  if (rgbMode) {
    rgbMode = false;    // Disable RGB Effect(initially)
    rgbBtn.textContent = "RGB Effect🪄";
  } else {
    rgbMode = true;   // Enable RGB Effect
    redMode = false;  // Disable Red Mode
    rgbBtn.textContent = "Remove Effect";
    redBtn.textContent = "Red Effect🪄"; // Reset RGB Button
  }
});

//a red effect
function redEffect(pixels){
  for (let i = 0; i < pixels.data.length; i += 4) {
    pixels.data[i+0] += 100; //red
    pixels.data[i+1] -= 50; //green
    pixels.data[i+2] *= 0.4; //blue
    //we dont change alpha value 
  }
  return pixels  
}
//In loop we iterate i = i+4 coz
//pixels.data[] array has 4 values consecutive millions times
//1st value for red
//2nd for green
//3rd for blue
//4th for alpha

//b rgb effect
function rgbEffect(pixels){
  for (let i = 0; i < pixels.data.length; i += 4) {
     pixels.data[i-500] = pixels.data[i+0]  //red
     pixels.data[i+40] = pixels.data[i+1]  //green
     pixels.data[i-550] = pixels.data[i+2]  //blue
    //we dont change alpha value 
  }
  return pixels  
}
