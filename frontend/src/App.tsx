import VideoFeed from "./components/VideoFeed";
// import "./App.css"

const App = () => {
  
    return (
        <div className="h-full w-full">
            <div className="pt-3 pb-2 text-center">
                <h1 className="text-2xl font-semibold">
                    RTSP Video Streaming App
                </h1>
            </div>
            <hr />
            <div className="m-7">
                <VideoFeed src="http://localhost:8083/stream/pattern/channel/0/hls/live/index.m3u8" />
            </div>
        </div>
    );
};

export default App;

