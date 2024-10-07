import React, { useRef, useEffect, useState } from "react";
import videojs from "video.js";
import "video.js/dist/video-js.css";
import Overlay from "./Overlay";

const BASE_URL = "http://127.0.0.1:8080"

const VideoFeed: React.FC<VideoFeedProps> = ({ src }) => {
    const videoRef = useRef(null);
    const [player, setPlayer] = useState<ReturnType<typeof videojs>>();
    const [overlays, setOverlays] = useState<{
        _id: string; 
        type: string,
        content: string, 
        position: { x: number; y: number },
        width: number;
        height: number;
    }[]>([]);
    const [selectedOverlayId, setSelectedOverlayId] = useState<string | null>(null);
    const [editText, setEditText] = useState("");
    // const [editPosition, setEditPosition] = useState< {x: number, y: number}>({x:0, y:0})
    console.log(selectedOverlayId)

    useEffect(() => {
        const fetchOverlays = async () => {
            const response = await fetch('${BASE_URL}/api/overlays');
            const data = await response.json();
            setOverlays(data);
        };
        fetchOverlays();
    }, []);

    useEffect(() => {
        if (!player) {
            const videoElement = videoRef.current;
            if (!videoElement) return;

        // make sure Video.js player is only initialized once
        const videoJsPlayer = videojs(videoElement, {
            controls: true,
            fluid: false, // This allows the video player to be responsive
            responsive: true, // Makes the player responsive
        }, () => {
            console.log("player is ready");
        });

        setPlayer(videoJsPlayer);
    }
        

        // return () => {
        //     if (player) {
        //         player.dispose();
        //     }
        // };
    }, [player]);

    useEffect(() => {
        return () => {
        if (player) {
            player.dispose();
            }
        };
    }, [player]);

    const addOverlay = async (e: any) => {
        e.preventDefault()
        const formData = new FormData(e.target)

        const text = JSON.stringify(formData.get("text"))
        // const x = JSON.parse(JSON.stringify(formData.get("x")))
        // const y = JSON.parse(JSON.stringify(formData.get("y")))

        const newOverlay = {    
            type: "text",
            content: text,
            position: {x: 0, y:0},
            width: 100,
            height: 50,
        };
        // setOverlays([...overlays, newOverlay]);

        const response = await fetch(`${BASE_URL}/api/overlays`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newOverlay),
        });

        console.log(response)

        if (response.ok) {
            setOverlays([...overlays, { ...newOverlay, _id: (await response.json())._id }]); // Add new overlay with returned id
        }
    };

    const addImageOverlay = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = async (e) => {
                const newOverlay = {
                    type: "image",
                    content: e.target?.result as string,
                    position: { x: 0, y: 0 },
                    width: 100,
                    height: 100,
                };
                // setOverlays([...overlays, newOverlay]);

                const response = await fetch(`${BASE_URL}/api/overlays`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(newOverlay),
                });

                if (response.ok) {
                    setOverlays([...overlays, { ...newOverlay, _id: (await response.json())._id }]);
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const handleOverlayClick = (_id: string) => {
        console.log("thiiiiii")
        setSelectedOverlayId(_id);
        const selectedOverlay = overlays.find((overlay) => overlay._id === _id);
        if (selectedOverlay && (selectedOverlay.type === "text")) {
          setEditText(selectedOverlay.content);
        //   setEditPosition(selectedOverlay.position)
        }
    };
    
      // Handle text change
      const handleTextChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const newContent = e.target.value;
        console.log("thhhhhh");
        
        // Update local state
        setEditText(newContent);
        setOverlays((prevOverlays) =>
            prevOverlays.map((overlay) =>
                overlay._id === selectedOverlayId ? { ...overlay, content: newContent } : overlay
            )
        );
    
        // Make a request to update the overlay in the database
        try {
            const response = await fetch(`${BASE_URL}/api/overlays/${selectedOverlayId}`, {
                method: 'PUT', // or 'PATCH' if you prefer
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ content: newContent }),
            });
    
            if (!response.ok) {
                throw new Error('Failed to update overlay');
            }
    
            const updatedOverlay = await response.json();
            console.log('Overlay updated successfully:', updatedOverlay);
        } catch (error) {
            console.error('Error updating overlay:', error);
        }
    };
    

    // const handleTextPosition = (id: number, newPosition: { x: number; y: number }) => {
    //     console.log("oooooo")
    //     // console.log(editPosition)

    //     // setEditPosition({...editPosition, [e.target.name]: e.target.value})

    //     // console.log(editPosition)
    //     setOverlays(
    //         overlays.map((overlay) =>
    //           overlay.id === selectedOverlayId ? { ...overlay, position: newPosition } : overlay
    //         )
    //     );
    // }

    const handleOverlayDrag = (_id: string, _e: any, data: any) => {
        setOverlays(
          overlays.map((overlay) =>
            overlay._id === _id ? { ...overlay, position: { x: data.x, y: data.y } } : overlay
            )
        );
    };

    const handleOverlayResize = (_id: string, _e: any, data: any) => {
        setOverlays(
          overlays.map((overlay) =>
            overlay._id === _id
              ? { ...overlay, width: data.size.width, height: data.size.height }
              : overlay
            )
        );
    };
    
    const handleDeleteOverlay = async () => {
        console.log("fffff")
        if (selectedOverlayId !== null) {
            try {
                const response = await fetch(`${BASE_URL}/api/overlays/${selectedOverlayId}`, {
                    method: 'DELETE',
                });
    
                if (!response.ok) {
                    throw new Error('Failed to delete overlay');
                }
    
                // Update state after successful deletion
                setOverlays(overlays.filter((overlay) => overlay._id !== selectedOverlayId));
                setSelectedOverlayId(null);
                setEditText("");
                console.log('Overlay deleted successfully');
            } catch (error) {
                console.error('Error deleting overlay:', error);
            }
        }
    };

  return (
    <div className="relative flex">
        <div className="grow-0">
            <video className="video-js vjs-big-play-centered" ref={videoRef} controls style={{ width: "800px", height: "480px", borderRadius: "10px" }}>
                <source src={src} type="application/x-mpegURL" />
            </video>
        </div>
        
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
            {overlays.map((overlay) => (
                <Overlay key={overlay._id} id={overlay._id} type={overlay.type} content={overlay.content} position={overlay.position} width={overlay.width}
                height={overlay.height} isSelected={overlay._id === selectedOverlayId}
                onClick={() => handleOverlayClick(overlay._id)} onDrag={(e, data) => handleOverlayDrag(overlay._id, e, data)} onResize={(e, data) => handleOverlayResize(overlay._id, e, data)}/>
            ))}
        </div>

        <div className="m-2 p-3 grow flex flex-col items-center border-t">
            <h1 className="pb-2">Add Text</h1>
            <form onSubmit={addOverlay} className="flex justify-center flex-wrap w-full bg-white gap-3 pb-4 border-b">
                <input type="text" name="text" placeholder="Overlay Test" className="w-full h-10 border-2 rounded-md border-solid bg-transparent p-1" />
                {/* <div className="flex justify-between gap-2">
                    <input type="number" name="x" placeholder="x-offset" className="w-full h-7 border-2 rounded-md border-solid bg-transparent p-1"/>
                    <input type="number" name="y" placeholder="y-offset" className="w-full h-7 border-2 rounded-md border-solid bg-transparent p-1"/>
                </div> */}
                <button type="submit" className="bg-blue-500 rounded-md h-10 px-20 hover:bg-blue-400 ">
                    Add Text
                </button>
            </form>
            <div className="w-full pt-2 border-b"> 
                <h1 className="text-center pb-2">Add Logo</h1>          
                <input type="file" accept="image/*" onChange={addImageOverlay} className="w-full text-lg border rounded-md p-1 mb-2" />
                {/* <form onSubmit={addOverlay} className="flex justify-center flex-wrap w-full bg-white gap-2 pb-4 border-b">
                    <div className="flex justify-between gap-2 my-2">
                        <input type="number" name="x" placeholder="x-offset" defaultValue={100} className="w-full h-7 border-2 rounded-md border-solid bg-transparent p-1"/>
                        <input type="number" name="y" placeholder="y-offset" defaultValue={50} className="w-full h-7 border-2 rounded-md border-solid bg-transparent p-1"/>
                    </div>
                    <button type="submit" className="bg-blue-500 rounded-md h-10 px-20 hover:bg-blue-400 ">
                        Add Logo
                    </button>
                </form> */}
            </div>
            {selectedOverlayId !== null ? (overlays.find((overlay) => overlay._id === selectedOverlayId)?.type === "text" && (
            <div className="w-full mt-3 border-b">
                <h1 className="text-center pb-2">Edit Text</h1>
                <input
                    type="text"
                    // value={editText}
                    onChange={handleTextChange}
                    placeholder="Edit text"
                    className="w-full h-8 border-2 rounded-md border-solid bg-transparent p-1"
                />
                {/* <div className="flex justify-between gap-2 my-2">
                    <input type="number" name="x"  placeholder="x-offset" className="w-full h-7 border-2 rounded-md border-solid bg-transparent p-1"/>
                    <input type="number" name="y"  placeholder="y-offset" className="w-full h-7 border-2 rounded-md border-solid bg-transparent p-1"/>
                </div>  */}
            </div>)
            ) : <></>}
            {selectedOverlayId !== null ? (
                <div className="mt-3">
                    <button onClick={handleDeleteOverlay} className="bg-red-500 text-white px-2 py-1">
                        Delete Selected Overlay
                    </button>
                </div>
            ) : <></>}
        </div>   
    </div>
  );
};

interface VideoFeedProps {
  src: string;
}

export default VideoFeed;