const canvas = document.querySelector("#photo")
const video = document.querySelector("#player")
const strip = document.querySelector("#strip")
const snap = document.querySelector(".snap")

const ctx = canvas.getContext('2d')


//function getVideo => is designed to access the user's camera and display the video feed on a webpage. 
function getVideo(){
    navigator.mediaDevices.getUserMedia({video:true, audio: false})
      .then((localMediaStream)=>{
        console.log(localMediaStream)
        video.srcObject = localMediaStream
        video.play()
      })
      .catch((err)=>{
        console.log("Error", err)
      })
}
//Notes
//1 navigator.mediaDevices.getUserMedia: This is a browser API that requests access to media input devices like the camera and microphone.
// video: true: Requests access to the user's camera.
// audio: false: Does not request access to the microphone.
// navigator will return promise so we use .then() and .catch()

//2 Handling Success : .then()
//If the user grants permission,the browser returns a "MediaStream" object(stored in localMediaStream), representing the video feed from the camera.
//video.srcObject = localMediaStream: Assigns the camera feed to the srcObject property of the <video> element, enabling it to display the stream.
//video.play(): Starts playing the video stream on the webpage.

//3 Handling Errors with catch
//If the user denies permission or an error occurs (e.g., no camera available), this block handles it. 






