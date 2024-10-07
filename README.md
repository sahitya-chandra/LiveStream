## LiveStream 

## Getting Started

1. First
```
git clone https://github.com/sahitya-chandra/LiveStream.git
cd LiveStream/
```

2. Second, 
This is the important part.

Convert RTSP URL to HTTP URL
For this, we will be leveraging RTSPtoWeb. RTSPtoWeb is a Golang-based service which converts RTSP streams to a browser-friendly format.
```
cd RTSPtoWeb
GO111MODULE=on go run *.go
```
We can now confirm that the service is running by visiting localhost:8083 in our browser. If your dashboard looks like the image below, then you should be in the clear!

![Screenshot from 2024-10-08 01-34-10](https://github.com/user-attachments/assets/a0b4501d-2a21-4df5-b719-0af99dfab8b8)

Within this dashboard we can see a few of the different formats that RTSPtoWeb can convert our stream: MSE, HLS, and WebRTC. For our use, we will be leveraging the HLS stream. Confirm that your HLS stream loads properly by clicking on the HLS button. You should see the following image confirming that the video is being appropriately converted by RTSPtoWeb.

![Screenshot from 2024-10-08 01-36-15](https://github.com/user-attachments/assets/bc0055e5-9089-41bc-85ed-5c18c9dc7a74)

Now, you have successfully set up RTSPtoWeb


3. Third
Set up the backend
```
cd ../backend/
pip install flask pymongo flask_cors
```
You will need a MongoDB Server Locally
Run the server

4. Final step
For Frontend
```
cd ../frontend/
npm install
npm run dev
```

Now, You can Stream RTSP video with custom overlay
