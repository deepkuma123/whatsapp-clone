import { useStateProvider } from "@/context/StateContext";
import WaveSurfer from "wavesurfer.js";
import React, { useEffect, useRef, useState } from "react";
import {
  FaMicrophone,
  FaPauseCircle,
  FaPlay,
  FaStop,
  FaTrash,
} from "react-icons/fa";
import { MdSend } from "react-icons/md";
import { ADD_AUDIO_MESSAGE_ROUTE } from "@/utils/ApiRoutes";
import axios from "axios";
import { reducercases } from "@/context/constants";

function CaptureAudio({ hide }) {
  const [{ userInfo, currentChatUser, socket }, dispatch] = useStateProvider();
  const [isRecording, setisRecording] = useState(false);
  const [recordedAudio, setRecordedAudio] = useState(null);
  const [waveForm, setWaveForm] = useState(null);
  const [recordingDuration, setrecordingDuration] = useState(0);
  const [currentPlayBackTime, setcurrentPlayBackTime] = useState(0);
  const [totalDuration, settotalDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [renderedAudio, setrenderedAudio] = useState(null);

  const audioRef = useRef(null);
  const mediaRecordedRef = useRef(null);
  const waveFormRef = useRef(null);


  useEffect(() => {
    let interval;
    if (isRecording) {
      interval = setInterval(() => {
        setrecordingDuration((prevDuration) => {
          settotalDuration(prevDuration + 1);
          return prevDuration + 1;
        });
      }, 1000);
    }

    return () => {
      clearInterval(interval);
    };
  }, [isRecording]);

useEffect(() => {
  const waveSurfer = WaveSurfer.create({
    container: waveFormRef.current,
    waveColor: "#ccc",
    progressColor: "#4a9eff",
    cursorColor: "#7ae3c3",
    barWidth: 2,
    height: 30,
    responsive: true,
  });
  setWaveForm(waveSurfer);

  waveSurfer.on("finish", () => {
    setIsPlaying(false);
  });

  return () => {
    waveSurfer.destroy();
  };
}, []);

   useEffect(() => {
     if (waveForm) {
       handleStartRecording();
     }
   }, [waveForm]);
  

  

 

  const handleStartRecording = () => {
    setrecordingDuration(0);
    setcurrentPlayBackTime(0);
    settotalDuration(0);
    setisRecording(true);
    setRecordedAudio(null)
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecordedRef.current = mediaRecorder;
        audioRef.current.srcOject = stream;

        const chunks = [];
        mediaRecorder.ondataavailable = (e) => chunks.push(e.data);
        mediaRecorder.onstop = (e) => {
          const blob = new Blob(chunks, { type: "audio/ogg; codecs=opus" });
          const audioUrl = URL.createObjectURL(blob);
          const audio = new Audio(audioUrl);
          setRecordedAudio(audio);

          waveForm.load(audioUrl);
        };

        mediaRecorder.start();
      })
      .catch((error) => {
        console.error("Error accessing microphone:", error);
      });
  };
  const handleStopRecording = () => {
    if (mediaRecordedRef.current && isRecording) {
      mediaRecordedRef.current.stop();
      setisRecording(false);
      waveForm.stop();

      const audioChunks = [];
      mediaRecordedRef.current.addEventListener("dataavailable", (event) => {
        audioChunks.push(event.data);
      });

      mediaRecordedRef.current.addEventListener("stop", (event) => {
        const audioBlob = new Blob(audioChunks, { type: "audio/mp3" });
        const audioFile = new File([audioBlob], "recording.mp3");
        setrenderedAudio (audioFile);
      });
    }
  };

  useEffect(() => {
    if (recordedAudio) {
      const updatePlayBackTime = () => {
        setcurrentPlayBackTime(recordedAudio.currentTime);
      };
      recordedAudio.addEventListener("timeupdate",updatePlayBackTime)
      return () => {
        recordedAudio.removeEventListener("timeupdate",updatePlayBackTime)
      };
    }
  }, [recordedAudio]);

    const handlePlayRecording = () => {
      if (recordedAudio) {
        waveForm.stop();
        waveForm.play();
        recordedAudio.play();
        setIsPlaying(true);
      }
    };
    const handlePauseRecording = () => {
      waveForm.stop();
      recordedAudio.pause();
      setIsPlaying(false);
    };

  const sendRecording = async () => {
    alert("send")
    try {
      const formData = new FormData();
      formData.append("audio", renderedAudio);
      const response = await axios.post(ADD_AUDIO_MESSAGE_ROUTE, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        params: {
          from: userInfo.id,
          to: currentChatUser.id,
        },
      });
      if (response.status === 201) {
        socket.current.emit("send-msg", {
          to: currentChatUser?.id,
          from: userInfo?.id,
          message: response.data.message,
        });
        console.log(userInfo.id);
        dispatch({
          type: reducercases.ADD_MESSAGE,
          newMessage: {
            ...response.data.message,
          },
          fromSelf: true,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const formatTime = (time) => {
    if (isNaN(time)) return "00:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <div className=" flex text-2xl w-full justify-end items-center">
      <div className="pt-1">
        <FaTrash className=" text-panel-header-icon" onClick={() => hide()} />
      </div>
      <div className=" mx-4 py-2 px-4 text-white text-lg flex gap-3 justify-center items-center bg-search-input-container-background rounded-full drop-shadow-lg">
        {isRecording ? (
          <div className=" text-red-500 animate-pulse w-60 text-center">
            Recording <span>{recordingDuration}s</span>
          </div>
        ) : (
          <div>
            {recordedAudio && (
              <>
                {!isPlaying ? (
                  <FaPlay onClick={handlePlayRecording} />
                ) : (
                  <FaStop onClick={handlePauseRecording} />
                )}
              </>
            )}
          </div>
        )}
        <div className="w-60" ref={waveFormRef} hidden={isRecording} />
        {recordedAudio && isPlaying && (
          <span>{formatTime(currentPlayBackTime)}</span>
        )}
        {recordedAudio && !isPlaying && (
          <span>{formatTime(totalDuration)}</span>
        )}
        <audio ref={audioRef} hidden />
      </div>

      <div className="mr-4">
        {!isRecording ? (
          <FaMicrophone
            className=" text-red-500"
            onClick={handleStartRecording}
          />
        ) : (
          <FaPauseCircle
            className=" text-red-500"
            onClick={handleStopRecording}
          />
        )}
      </div>

      <div>
        <MdSend
          className=" text-panel-header-icon cursor-pointer mr-4"
          title="send"
          onClick={sendRecording}
        />
      </div>
    </div>
  );
}
export default CaptureAudio;
