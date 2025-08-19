"use client";

import { useState, useRef, useEffect } from "react";
import { useAppStore } from "@/store/useAppStore";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Volume2, 
  Settings, 
  Download,
  MessageSquare,
  Send,
  Clock,
  Scissors,
  Music,
  Eye,
  Move,
  ZoomIn,
  ZoomOut
} from "lucide-react";

export default function VideoEditor() {
  const { currentProject, updateExportSettings } = useAppStore();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(30); // Total project duration
  const [zoom, setZoom] = useState(1);
  const [selectedClip, setSelectedClip] = useState<string | null>(null);
  const [volume, setVolume] = useState(80);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  
  // Video element reference
  const videoRef = useRef<HTMLVideoElement>(null);
  
  const chatHistory = [
    {
      id: 1,
      type: "ai",
      message: "Welcome to your video editor! I can help you with editing tips, transitions, and more. What would you like to know?",
      timestamp: new Date().toLocaleTimeString()
    }
  ];

  // Demo video clips data (simulating the Cinematic Real Estate template with 3 shots)
  const demoClips = [
    {
      id: "clip-1",
      name: "Exterior Shot",
      duration: 8,
      thumbnail: "/sample-assets/images/living-room-01.jpg",
      cameraMovement: "pan",
      startTime: 0,
      endTime: 8,
      videoUrl: "/sample-assets/clips/Start_with_the_202508091432.mp4"
    },
    {
      id: "clip-2", 
      name: "Living Room",
      duration: 12,
      thumbnail: "/sample-assets/images/living-room-01.jpg",
      cameraMovement: "dolly",
      startTime: 8,
      endTime: 20,
      videoUrl: "/sample-assets/clips/Start_with_the_202508091454.mp4"
    },
    {
      id: "clip-3",
      name: "Kitchen",
      duration: 10,
      thumbnail: "/sample-assets/images/kitchen-01.jpg", 
      cameraMovement: "orbit",
      startTime: 20,
      endTime: 30,
      videoUrl: "/sample-assets/clips/Start_with_the_202508091527.mp4"
    }
  ];

  // Get current clip based on time
  const getCurrentClip = () => {
    return demoClips.find(clip => 
      currentTime >= clip.startTime && currentTime < clip.endTime
    );
  };

  // Handle play/pause
  const handlePlayPause = () => {
    if (!videoRef.current) return;
    
    if (isPlaying) {
      setIsPlaying(false);
      videoRef.current.pause();
    } else {
      setIsPlaying(true);
      videoRef.current.play();
    }
  };

  // Handle seeking
  const handleSeek = (time: number) => {
    const clampedTime = Math.max(0, Math.min(time, duration));
    setCurrentTime(clampedTime);
    
    // Find which clip we're seeking to
    const targetClip = demoClips.find(clip => 
      clampedTime >= clip.startTime && clampedTime < clip.endTime
    );
    
    if (targetClip && videoRef.current) {
      // Set video source if different
      if (videoRef.current.src !== targetClip.videoUrl) {
        videoRef.current.src = targetClip.videoUrl;
      }
      
      // Calculate time within the clip
      const clipTime = clampedTime - targetClip.startTime;
      videoRef.current.currentTime = clipTime;
    }
  };

  // Handle timeline click
  const handleTimelineClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const timelineWidth = rect.width;
    const clickTime = (clickX / timelineWidth) * duration;
    handleSeek(clickTime);
  };

  // Handle clip selection
  const handleClipClick = (clipId: string) => {
    setSelectedClip(clipId);
    const clip = demoClips.find(c => c.id === clipId);
    if (clip) {
      handleSeek(clip.startTime);
    }
  };

  // Handle zoom controls
  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev * 1.5, 4));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev / 1.5, 0.25));
  };

  // Handle volume controls
  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume);
    if (newVolume === 0) {
      setIsMuted(true);
    } else {
      setIsMuted(false);
    }
  };

  const handleMuteToggle = () => {
    setIsMuted(!isMuted);
  };

  // Handle playback rate changes
  const handlePlaybackRateChange = (rate: number) => {
    setPlaybackRate(rate);
    if (videoRef.current) {
      videoRef.current.playbackRate = rate;
    }
  };

  // Format time display
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Get timeline position
  const getTimelinePosition = (time: number) => {
    return (time / duration) * 100;
  };

  // Get timeline width
  const getTimelineWidth = (clipDuration: number) => {
    return (clipDuration / duration) * 100;
  };

  // Update video source when clip changes
  useEffect(() => {
    if (videoRef.current && currentTime === 0) {
      // Set initial video source
      const firstClip = demoClips[0];
      if (firstClip) {
        videoRef.current.src = firstClip.videoUrl;
        videoRef.current.currentTime = 0;
      }
    }
  }, []);

  // Handle video time updates
  const handleVideoTimeUpdate = () => {
    if (videoRef.current) {
      const currentClip = getCurrentClip();
      if (currentClip) {
        const clipTime = videoRef.current.currentTime;
        const totalTime = currentClip.startTime + clipTime;
        setCurrentTime(totalTime);
      }
    }
  };

  // Handle video ended
  const handleVideoEnded = () => {
    setIsPlaying(false);
    // Could implement auto-advance to next clip here
  };

  if (!currentProject) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">No Project Found</h1>
          <p className="text-gray-600">Please start by selecting a template and creating a project.</p>
        </div>
      </div>
    );
  }

  const currentClip = getCurrentClip();

  return (
    <div className="h-screen bg-gray-900 flex flex-col">
      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 12px;
          width: 12px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
        }
        .slider::-moz-range-thumb {
          height: 12px;
          width: 12px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
          border: none;
        }
      `}</style>
      
      {/* Top Toolbar */}
      <div className="bg-gray-800 border-b border-gray-700 px-3 py-2 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-white font-semibold text-base">{currentProject.name}</h1>
          <Badge variant="secondary" className="bg-blue-600 text-white text-xs">
            {formatTime(duration)}
          </Badge>
          {currentClip && (
            <Badge variant="outline" className="text-xs border-blue-500 text-blue-400">
              {currentClip.name}
            </Badge>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 text-white text-xs">
            <span>Speed:</span>
            <Select value={playbackRate.toString()} onValueChange={(value) => handlePlaybackRateChange(parseFloat(value))}>
              <SelectTrigger className="bg-gray-700 border-gray-600 text-white h-6 w-16 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-700 border-gray-600">
                <SelectItem value="0.5">0.5x</SelectItem>
                <SelectItem value="1">1x</SelectItem>
                <SelectItem value="1.5">1.5x</SelectItem>
                <SelectItem value="2">2x</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <Button variant="outline" size="sm" className="text-white border-gray-600 hover:bg-gray-700 h-7 px-2 text-xs" onClick={handleZoomOut}>
            <ZoomOut className="w-3 h-3 mr-1" />
            Zoom Out
          </Button>
          <Button variant="outline" size="sm" className="text-white border-gray-600 hover:bg-gray-700 h-7 px-2 text-xs" onClick={handleZoomIn}>
            <ZoomIn className="w-3 h-3 mr-1" />
            Zoom In
          </Button>
        </div>
      </div>

      {/* Main Editor Area */}
      <div className="flex-1 flex">
        {/* Left Panel - Timeline & Clips */}
        <div className="w-72 bg-gray-800 border-r border-gray-700 flex flex-col">
          <CardHeader className="bg-gray-800 border-b border-gray-700 py-3">
            <CardTitle className="text-white text-base">Timeline</CardTitle>
          </CardHeader>
          
          <div className="flex-1 p-3 space-y-3">
            {/* Video Clips Track */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-300">Video</span>
                <Badge variant="secondary" className="bg-green-600 text-white text-xs">
                  {demoClips.length} clips
                </Badge>
              </div>
              
              <div className="space-y-2">
                {demoClips.map((clip) => (
                  <div
                    key={clip.id}
                    className={`p-2 rounded-lg border-2 cursor-pointer transition-all ${
                      selectedClip === clip.id
                        ? 'border-blue-500 bg-blue-900/20'
                        : 'border-gray-600 bg-gray-700 hover:border-gray-500'
                    } ${currentTime >= clip.startTime && currentTime < clip.endTime ? 'ring-2 ring-yellow-400' : ''}`}
                    onClick={() => handleClipClick(clip.id)}
                  >
                    <div className="flex items-center gap-2">
                      <img
                        src={clip.thumbnail}
                        alt={clip.name}
                        className="w-10 h-7 object-cover rounded"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-white truncate">{clip.name}</p>
                        <div className="flex items-center gap-1 mt-1">
                          <Badge variant="outline" className="text-xs border-gray-500 text-gray-300 px-1 py-0">
                            {clip.cameraMovement}
                          </Badge>
                          <span className="text-xs text-gray-400">{clip.duration}s</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Separator className="bg-gray-600" />

            {/* Audio Track */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-300">Audio</span>
                <Badge variant="secondary" className="bg-purple-600 text-white text-xs">
                  Locked
                </Badge>
              </div>
              
              <div className="p-2 rounded-lg border-2 border-gray-600 bg-gray-700">
                <div className="flex items-center gap-2">
                  <Music className="w-4 h-4 text-purple-400" />
                  <div className="flex-1">
                    <p className="text-xs font-medium text-white">Background Music</p>
                    <p className="text-xs text-gray-400">Cinematic Ambience</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-white hover:bg-white/20 h-6 w-6 p-0"
                      onClick={handleMuteToggle}
                    >
                      {isMuted ? <Volume2 className="w-3 h-3" /> : <Volume2 className="w-3 h-3" />}
                    </Button>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={isMuted ? 0 : volume}
                      onChange={(e) => handleVolumeChange(parseInt(e.target.value))}
                      className="w-16 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Center Panel - Video Preview */}
        <div className="flex-1 bg-black flex flex-col">
          {/* Video Player */}
          <div className="flex-1 flex items-center justify-center relative p-4">
            <div className="w-full max-w-5xl aspect-video bg-gray-800 rounded-lg overflow-hidden relative">
              {/* Current Clip Display */}
              {currentClip && (
                <div className="w-full h-full relative">
                  {/* Video Player */}
                  <video
                    ref={videoRef}
                    className="w-full h-full object-cover rounded-lg"
                    controls={false}
                    muted={isMuted}
                    onTimeUpdate={handleVideoTimeUpdate}
                    onEnded={handleVideoEnded}
                    onLoadedMetadata={(e) => {
                      const video = e.target as HTMLVideoElement;
                      if (video.duration) {
                        // Update clip duration if needed
                      }
                    }}
                  />
                  
                  {/* Overlay with clip info */}
                  <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-sm rounded-lg px-3 py-2">
                    <p className="text-white text-sm font-medium">{currentClip.name}</p>
                    <p className="text-gray-300 text-xs">{currentClip.cameraMovement} movement</p>
                    <p className="text-gray-400 text-xs">
                      {formatTime(currentTime - currentClip.startTime)} / {currentClip.duration}s
                    </p>
                  </div>
                  
                  {/* Clip Progress Bar */}
                  <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 w-48 h-1 bg-gray-600 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-blue-500 rounded-full transition-all duration-100"
                      style={{ width: `${((currentTime - currentClip.startTime) / currentClip.duration) * 100}%` }}
                    />
                  </div>
                </div>
              )}
             
              {/* Playback Controls Overlay */}
              <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex items-center gap-3 bg-black/50 backdrop-blur-sm rounded-full px-4 py-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white hover:bg-white/20 h-8 w-8 p-0"
                  onClick={() => handleSeek(currentTime - 5)}
                  disabled={currentTime <= 5}
                >
                  <SkipBack className="w-4 h-4" />
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white hover:bg-white/20 h-8 w-8 p-0"
                  onClick={handlePlayPause}
                >
                  {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white hover:bg-white/20 h-8 w-8 p-0"
                  onClick={() => handleSeek(currentTime + 5)}
                  disabled={currentTime >= duration - 5}
                >
                  <SkipForward className="w-4 h-4" />
                </Button>
                
                <div className="flex items-center gap-1 text-white text-xs px-2">
                  <span>{formatTime(currentTime)}</span>
                  <span>/</span>
                  <span>{formatTime(duration)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="h-28 bg-gray-800 border-t border-gray-700 p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-300">Timeline</span>
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <span>Zoom: {Math.round(zoom * 100)}%</span>
              </div>
            </div>
            
            {/* Timeline Ruler */}
            <div className="h-5 bg-gray-700 rounded mb-2 relative">
              <div className="absolute inset-0 flex items-center justify-between px-2 text-xs text-gray-400">
                {Array.from({ length: Math.ceil(duration / 5) + 1 }, (_, i) => (
                  <span key={i}>{i * 5}s</span>
                ))}
              </div>
            </div>
            
            {/* Timeline Tracks */}
            <div className="space-y-1">
              {/* Video Track */}
              <div className="h-6 bg-gray-700 rounded relative cursor-pointer" onClick={handleTimelineClick}>
                {demoClips.map((clip) => (
                  <div
                    key={clip.id}
                    className={`absolute top-0.5 h-5 rounded cursor-pointer transition-colors ${
                      selectedClip === clip.id ? 'bg-blue-500 ring-2 ring-yellow-400' : 'bg-blue-600 hover:bg-blue-500'
                    }`}
                    style={{
                      left: `${getTimelinePosition(clip.startTime)}%`,
                      width: `${getTimelineWidth(clip.duration)}%`
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleClipClick(clip.id);
                    }}
                  >
                    <div className="px-1 py-0.5 text-xs text-white font-medium truncate">
                      {clip.name}
                    </div>
                  </div>
                ))}
                
                {/* Playhead */}
                <div
                  className="absolute top-0 w-0.5 h-full bg-red-500 cursor-pointer z-10"
                  style={{ left: `${getTimelinePosition(currentTime)}%` }}
                />
                
                {/* Current Time Indicator */}
                <div
                  className="absolute top-0 w-2 h-2 bg-red-500 rounded-full transform -translate-x-1 z-20"
                  style={{ left: `${getTimelinePosition(currentTime)}%` }}
                />
              </div>
              
              {/* Audio Track */}
              <div className="h-6 bg-gray-700 rounded relative">
                <div className="absolute inset-0.5 bg-purple-600 rounded opacity-60">
                  <div className="px-1 py-0.5 text-xs text-white font-medium">Background Music</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel - Export Settings & AI Chat */}
        <div className="w-72 bg-gray-800 border-l border-gray-700 flex flex-col">
          {/* Export Settings */}
          <CardHeader className="bg-gray-800 border-b border-gray-700 py-3">
            <CardTitle className="text-white text-base">Export Settings</CardTitle>
          </CardHeader>
          
          <div className="p-3 space-y-3">
            <div className="space-y-2">
              <div>
                <label className="text-sm font-medium text-gray-300 mb-1 block">Resolution</label>
                <Select
                  value={currentProject.exportSettings.resolution}
                  onValueChange={(value) => updateExportSettings({ resolution: value as any })}
                >
                  <SelectTrigger className="bg-gray-700 border-gray-600 text-white h-8 text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-700 border-gray-600">
                    <SelectItem value="1080p">1080p</SelectItem>
                    <SelectItem value="4K">4K</SelectItem>
                    <SelectItem value="720p">720p</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-300 mb-1 block">Format</label>
                <Select
                  value={currentProject.exportSettings.format}
                  onValueChange={(value) => updateExportSettings({ format: value as any })}
                >
                  <SelectTrigger className="bg-gray-700 border-gray-600 text-white h-8 text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-700 border-gray-600">
                    <SelectItem value="MP4">MP4</SelectItem>
                    <SelectItem value="MOV">MOV</SelectItem>
                    <SelectItem value="AVI">AVI</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-300 mb-1 block">Frame Rate</label>
                <Select
                  value={currentProject.exportSettings.frameRate}
                  onValueChange={(value) => updateExportSettings({ frameRate: value as any })}
                >
                  <SelectTrigger className="bg-gray-700 border-gray-600 text-white h-8 text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-700 border-gray-600">
                    <SelectItem value="24fps">24fps</SelectItem>
                    <SelectItem value="30fps">30fps</SelectItem>
                    <SelectItem value="60fps">60fps</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <Button className="w-full bg-blue-600 hover:bg-blue-700 flex items-center gap-2 h-9 text-sm">
              <Download className="w-4 h-4" />
              Download Video
            </Button>
          </div>

          <Separator className="bg-gray-600" />

          {/* AI Chat */}
          <div className="flex-1 p-3">
            <div className="flex items-center gap-2 mb-2">
              <MessageSquare className="w-4 h-4 text-blue-400" />
              <span className="text-sm font-medium text-gray-300">AI Assistant</span>
            </div>
            
            {/* Chat Messages */}
            <div className="flex-1 space-y-2 mb-3 max-h-48 overflow-y-auto">
              {chatHistory.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] px-2 py-1 rounded-lg text-xs ${
                      message.type === 'user'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-700 text-gray-200'
                    }`}
                  >
                    {message.message}
                    <div className="text-xs opacity-70 mt-1">{message.timestamp}</div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Chat Input */}
            <form className="flex gap-2">
              <input
                type="text"
                placeholder="Ask for editing help..."
                className="flex-1 px-2 py-1 bg-gray-700 border border-gray-600 rounded-lg text-white text-xs placeholder-gray-400 focus:outline-none focus:border-blue-500"
                disabled
              />
              <Button type="button" size="sm" className="bg-gray-600 hover:bg-gray-700 h-7 w-7 p-0" disabled>
                <Send className="w-3 h-3" />
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
