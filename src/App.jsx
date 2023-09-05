import { useEffect, useState } from "react";
import "./App.css";
import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";
const ffmpeg = createFFmpeg({ log: true });

function App() {
  const [ready, setReady] = useState(false);
  const [video, setVideo] = useState();
  const [shortVideo, setShortVideo] = useState();

  const load = async () => {
    try {
      await ffmpeg.load();
      setReady(true);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    load();
  }, []);
  const convertToShortVideo = async () => {
    // Write the file to memory
    ffmpeg.FS("writeFile", "test.mp4", await fetchFile(video));
    // Run the FFMpeg command
    await ffmpeg.run(
      "-i",
      "test.mp4",
      "-t",
      "2.5",
      "-ss",
      "2.0",
      "-f",
      "mp4",
      "out.mp4"
    );
    // Read the result
    const data = ffmpeg.FS("readFile", "out.mp4");
    // Create a URL
    const url = URL.createObjectURL(
      new Blob([data.buffer], { type: "video/mp4" })
    );
    setShortVideo(url);
  };

  return ready ? (
    <div className="App">
      {
        video && (
          <video controls width="250" src={URL.createObjectURL(video)}></video>
        ) //URL.createObjectURL() is used to create a URL representing the object given in the parameter.
      }
      <input type="file" onChange={(e) => setVideo(e.target.files?.item(0))} />

      <button onClick={convertToShortVideo}>Convert</button>
      {
        shortVideo && <video controls width="250" src={shortVideo}></video> //URL.createObjectURL() is used to create a URL representing the object given in the parameter.
      }
    </div>
  ) : (
    <p>Loading...</p>
  );
}

export default App;
