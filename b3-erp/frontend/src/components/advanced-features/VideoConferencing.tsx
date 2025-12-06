'use client';

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useRef,
  useMemo,
  ReactNode,
} from 'react';

// ============================================================================
// Video Conferencing Types
// ============================================================================

export interface Participant {
  id: string;
  name: string;
  avatar?: string;
  isLocal: boolean;
  stream?: MediaStream;
  audioEnabled: boolean;
  videoEnabled: boolean;
  isScreenSharing: boolean;
  isSpeaking: boolean;
  connectionState: RTCPeerConnectionState;
}

export interface ChatMessage {
  id: string;
  participantId: string;
  participantName: string;
  content: string;
  timestamp: Date;
  type: 'text' | 'file' | 'system';
}

export interface MeetingInfo {
  id: string;
  title: string;
  host: string;
  startTime: Date;
  scheduled?: boolean;
  password?: string;
}

export type CallState = 'idle' | 'connecting' | 'connected' | 'reconnecting' | 'ended' | 'error';

// ============================================================================
// Video Conference Context
// ============================================================================

interface VideoConferenceContextValue {
  callState: CallState;
  localStream: MediaStream | null;
  participants: Participant[];
  meeting: MeetingInfo | null;
  chatMessages: ChatMessage[];
  audioEnabled: boolean;
  videoEnabled: boolean;
  isScreenSharing: boolean;
  error: string | null;
  joinMeeting: (meetingId: string, name: string, password?: string) => Promise<void>;
  leaveMeeting: () => void;
  toggleAudio: () => void;
  toggleVideo: () => void;
  toggleScreenShare: () => Promise<void>;
  sendChatMessage: (content: string) => void;
  raiseHand: () => void;
}

const VideoConferenceContext = createContext<VideoConferenceContextValue | null>(null);

// ============================================================================
// Video Conference Provider
// ============================================================================

export interface VideoConferenceProviderProps {
  children: ReactNode;
  signalingServer?: string;
  iceServers?: RTCIceServer[];
  onParticipantJoined?: (participant: Participant) => void;
  onParticipantLeft?: (participantId: string) => void;
  onMeetingEnded?: () => void;
}

export function VideoConferenceProvider({
  children,
  signalingServer,
  iceServers = [{ urls: 'stun:stun.l.google.com:19302' }],
  onParticipantJoined,
  onParticipantLeft,
  onMeetingEnded,
}: VideoConferenceProviderProps) {
  const [callState, setCallState] = useState<CallState>('idle');
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [meeting, setMeeting] = useState<MeetingInfo | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const peerConnectionsRef = useRef<Map<string, RTCPeerConnection>>(new Map());
  const screenStreamRef = useRef<MediaStream | null>(null);
  const localParticipantIdRef = useRef<string>('');

  // Get user media
  const getUserMedia = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'user',
        },
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });
      return stream;
    } catch (err) {
      console.error('Failed to get user media:', err);
      throw err;
    }
  }, []);

  // Join meeting
  const joinMeeting = useCallback(
    async (meetingId: string, name: string, password?: string) => {
      setCallState('connecting');
      setError(null);

      try {
        // Get local media stream
        const stream = await getUserMedia();
        setLocalStream(stream);

        // Create local participant
        const localId = `local-${Date.now()}`;
        localParticipantIdRef.current = localId;

        const localParticipant: Participant = {
          id: localId,
          name,
          isLocal: true,
          stream,
          audioEnabled: true,
          videoEnabled: true,
          isScreenSharing: false,
          isSpeaking: false,
          connectionState: 'connected',
        };

        setParticipants([localParticipant]);

        // Set meeting info
        setMeeting({
          id: meetingId,
          title: `Meeting ${meetingId}`,
          host: name,
          startTime: new Date(),
        });

        // Add system message
        setChatMessages([
          {
            id: `system-${Date.now()}`,
            participantId: 'system',
            participantName: 'System',
            content: `${name} joined the meeting`,
            timestamp: new Date(),
            type: 'system',
          },
        ]);

        setCallState('connected');

        // In a real implementation, you would:
        // 1. Connect to signaling server
        // 2. Exchange ICE candidates and SDP offers/answers
        // 3. Set up WebRTC peer connections

      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to join meeting');
        setCallState('error');
      }
    },
    [getUserMedia]
  );

  // Leave meeting
  const leaveMeeting = useCallback(() => {
    // Stop local stream
    if (localStream) {
      localStream.getTracks().forEach((track) => track.stop());
    }

    // Stop screen sharing
    if (screenStreamRef.current) {
      screenStreamRef.current.getTracks().forEach((track) => track.stop());
    }

    // Close peer connections
    peerConnectionsRef.current.forEach((pc) => pc.close());
    peerConnectionsRef.current.clear();

    // Reset state
    setLocalStream(null);
    setParticipants([]);
    setMeeting(null);
    setChatMessages([]);
    setAudioEnabled(true);
    setVideoEnabled(true);
    setIsScreenSharing(false);
    setCallState('ended');

    onMeetingEnded?.();
  }, [localStream, onMeetingEnded]);

  // Toggle audio
  const toggleAudio = useCallback(() => {
    if (localStream) {
      const audioTrack = localStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setAudioEnabled(audioTrack.enabled);

        // Update local participant
        setParticipants((prev) =>
          prev.map((p) =>
            p.isLocal ? { ...p, audioEnabled: audioTrack.enabled } : p
          )
        );
      }
    }
  }, [localStream]);

  // Toggle video
  const toggleVideo = useCallback(() => {
    if (localStream) {
      const videoTrack = localStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setVideoEnabled(videoTrack.enabled);

        // Update local participant
        setParticipants((prev) =>
          prev.map((p) =>
            p.isLocal ? { ...p, videoEnabled: videoTrack.enabled } : p
          )
        );
      }
    }
  }, [localStream]);

  // Toggle screen share
  const toggleScreenShare = useCallback(async () => {
    if (isScreenSharing) {
      // Stop screen sharing
      if (screenStreamRef.current) {
        screenStreamRef.current.getTracks().forEach((track) => track.stop());
        screenStreamRef.current = null;
      }
      setIsScreenSharing(false);

      // Update local participant
      setParticipants((prev) =>
        prev.map((p) => (p.isLocal ? { ...p, isScreenSharing: false } : p))
      );
    } else {
      try {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({
          video: {
            width: { ideal: 1920 },
            height: { ideal: 1080 },
          },
          audio: false,
        });

        screenStreamRef.current = screenStream;
        setIsScreenSharing(true);

        // Update local participant
        setParticipants((prev) =>
          prev.map((p) => (p.isLocal ? { ...p, isScreenSharing: true } : p))
        );

        // Handle stream ended (user clicks "Stop sharing")
        screenStream.getVideoTracks()[0].onended = () => {
          setIsScreenSharing(false);
          screenStreamRef.current = null;
          setParticipants((prev) =>
            prev.map((p) => (p.isLocal ? { ...p, isScreenSharing: false } : p))
          );
        };
      } catch (err) {
        console.error('Failed to share screen:', err);
      }
    }
  }, [isScreenSharing]);

  // Send chat message
  const sendChatMessage = useCallback(
    (content: string) => {
      const localParticipant = participants.find((p) => p.isLocal);
      if (!localParticipant) return;

      const message: ChatMessage = {
        id: `msg-${Date.now()}`,
        participantId: localParticipant.id,
        participantName: localParticipant.name,
        content,
        timestamp: new Date(),
        type: 'text',
      };

      setChatMessages((prev) => [...prev, message]);

      // In a real implementation, send via data channel
    },
    [participants]
  );

  // Raise hand
  const raiseHand = useCallback(() => {
    const localParticipant = participants.find((p) => p.isLocal);
    if (!localParticipant) return;

    const message: ChatMessage = {
      id: `hand-${Date.now()}`,
      participantId: 'system',
      participantName: 'System',
      content: `${localParticipant.name} raised their hand`,
      timestamp: new Date(),
      type: 'system',
    };

    setChatMessages((prev) => [...prev, message]);
  }, [participants]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (localStream) {
        localStream.getTracks().forEach((track) => track.stop());
      }
      if (screenStreamRef.current) {
        screenStreamRef.current.getTracks().forEach((track) => track.stop());
      }
      peerConnectionsRef.current.forEach((pc) => pc.close());
    };
  }, [localStream]);

  const value = useMemo(
    () => ({
      callState,
      localStream,
      participants,
      meeting,
      chatMessages,
      audioEnabled,
      videoEnabled,
      isScreenSharing,
      error,
      joinMeeting,
      leaveMeeting,
      toggleAudio,
      toggleVideo,
      toggleScreenShare,
      sendChatMessage,
      raiseHand,
    }),
    [
      callState,
      localStream,
      participants,
      meeting,
      chatMessages,
      audioEnabled,
      videoEnabled,
      isScreenSharing,
      error,
      joinMeeting,
      leaveMeeting,
      toggleAudio,
      toggleVideo,
      toggleScreenShare,
      sendChatMessage,
      raiseHand,
    ]
  );

  return (
    <VideoConferenceContext.Provider value={value}>
      {children}
    </VideoConferenceContext.Provider>
  );
}

// ============================================================================
// useVideoConference Hook
// ============================================================================

export function useVideoConference() {
  const context = useContext(VideoConferenceContext);
  if (!context) {
    throw new Error('useVideoConference must be used within a VideoConferenceProvider');
  }
  return context;
}

// ============================================================================
// Video Grid Component
// ============================================================================

export interface VideoGridProps {
  className?: string;
}

export function VideoGrid({ className = '' }: VideoGridProps) {
  const { participants, isScreenSharing } = useVideoConference();

  // Determine grid layout based on participant count
  const getGridClass = () => {
    const count = participants.length;
    if (count === 1) return 'grid-cols-1';
    if (count === 2) return 'grid-cols-2';
    if (count <= 4) return 'grid-cols-2';
    if (count <= 6) return 'grid-cols-3';
    return 'grid-cols-4';
  };

  // Find screen sharing participant
  const screenSharingParticipant = participants.find((p) => p.isScreenSharing);

  if (screenSharingParticipant) {
    // Screen share layout
    return (
      <div className={`flex flex-col h-full gap-2 ${className}`}>
        <div className="flex-1 bg-black rounded-lg overflow-hidden">
          <VideoTile
            participant={screenSharingParticipant}
            showScreenShare
            className="w-full h-full"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto py-2">
          {participants.map((participant) => (
            <VideoTile
              key={participant.id}
              participant={participant}
              className="w-32 h-24 flex-shrink-0"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={`grid ${getGridClass()} gap-2 h-full ${className}`}>
      {participants.map((participant) => (
        <VideoTile key={participant.id} participant={participant} />
      ))}
    </div>
  );
}

// ============================================================================
// Video Tile Component
// ============================================================================

export interface VideoTileProps {
  participant: Participant;
  showScreenShare?: boolean;
  className?: string;
}

export function VideoTile({
  participant,
  showScreenShare = false,
  className = '',
}: VideoTileProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current && participant.stream) {
      videoRef.current.srcObject = participant.stream;
    }
  }, [participant.stream]);

  return (
    <div
      className={`relative bg-gray-900 rounded-lg overflow-hidden ${className}`}
    >
      {participant.videoEnabled && participant.stream ? (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted={participant.isLocal}
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-gray-800">
          {participant.avatar ? (
            <img
              src={participant.avatar}
              alt={participant.name}
              className="w-20 h-20 rounded-full"
            />
          ) : (
            <div className="w-20 h-20 rounded-full bg-blue-600 flex items-center justify-center text-white text-2xl font-semibold">
              {participant.name.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
      )}

      {/* Overlay */}
      <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/60 to-transparent">
        <div className="flex items-center justify-between">
          <span className="text-white text-sm font-medium truncate">
            {participant.name}
            {participant.isLocal && ' (You)'}
          </span>
          <div className="flex items-center gap-1">
            {!participant.audioEnabled && (
              <span className="p-1 bg-red-500 rounded-full">
                <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
                </svg>
              </span>
            )}
            {participant.isSpeaking && (
              <span className="p-1 bg-green-500 rounded-full animate-pulse">
                <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Screen share indicator */}
      {participant.isScreenSharing && !showScreenShare && (
        <div className="absolute top-2 left-2 px-2 py-1 bg-blue-600 rounded text-white text-xs">
          Sharing Screen
        </div>
      )}
    </div>
  );
}

// ============================================================================
// Meeting Controls Component
// ============================================================================

export interface MeetingControlsProps {
  className?: string;
}

export function MeetingControls({ className = '' }: MeetingControlsProps) {
  const {
    audioEnabled,
    videoEnabled,
    isScreenSharing,
    toggleAudio,
    toggleVideo,
    toggleScreenShare,
    leaveMeeting,
    raiseHand,
  } = useVideoConference();

  const [showMore, setShowMore] = useState(false);

  return (
    <div className={`flex items-center justify-center gap-2 ${className}`}>
      {/* Audio Toggle */}
      <button
        onClick={toggleAudio}
        className={`p-4 rounded-full transition-colors ${
          audioEnabled
            ? 'bg-gray-700 hover:bg-gray-600 text-white'
            : 'bg-red-500 hover:bg-red-600 text-white'
        }`}
        title={audioEnabled ? 'Mute' : 'Unmute'}
      >
        {audioEnabled ? (
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
          </svg>
        ) : (
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
          </svg>
        )}
      </button>

      {/* Video Toggle */}
      <button
        onClick={toggleVideo}
        className={`p-4 rounded-full transition-colors ${
          videoEnabled
            ? 'bg-gray-700 hover:bg-gray-600 text-white'
            : 'bg-red-500 hover:bg-red-600 text-white'
        }`}
        title={videoEnabled ? 'Turn off camera' : 'Turn on camera'}
      >
        {videoEnabled ? (
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        ) : (
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
          </svg>
        )}
      </button>

      {/* Screen Share */}
      <button
        onClick={toggleScreenShare}
        className={`p-4 rounded-full transition-colors ${
          isScreenSharing
            ? 'bg-blue-500 hover:bg-blue-600 text-white'
            : 'bg-gray-700 hover:bg-gray-600 text-white'
        }`}
        title={isScreenSharing ? 'Stop sharing' : 'Share screen'}
      >
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      </button>

      {/* Raise Hand */}
      <button
        onClick={raiseHand}
        className="p-4 rounded-full bg-gray-700 hover:bg-gray-600 text-white transition-colors"
        title="Raise hand"
      >
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11" />
        </svg>
      </button>

      {/* More Options */}
      <div className="relative">
        <button
          onClick={() => setShowMore(!showMore)}
          className="p-4 rounded-full bg-gray-700 hover:bg-gray-600 text-white transition-colors"
          title="More options"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
          </svg>
        </button>

        {showMore && (
          <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-gray-800 rounded-lg shadow-lg py-2 min-w-48">
            <button className="w-full px-4 py-2 text-left text-white hover:bg-gray-700 flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Settings
            </button>
            <button className="w-full px-4 py-2 text-left text-white hover:bg-gray-700 flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              Participants
            </button>
            <button className="w-full px-4 py-2 text-left text-white hover:bg-gray-700 flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
              Chat
            </button>
          </div>
        )}
      </div>

      {/* Leave Call */}
      <button
        onClick={leaveMeeting}
        className="p-4 rounded-full bg-red-500 hover:bg-red-600 text-white transition-colors ml-4"
        title="Leave meeting"
      >
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M5 3a2 2 0 00-2 2v1c0 8.284 6.716 15 15 15h1a2 2 0 002-2v-3.28a1 1 0 00-.684-.948l-4.493-1.498a1 1 0 00-1.21.502l-1.13 2.257a11.042 11.042 0 01-5.516-5.517l2.257-1.128a1 1 0 00.502-1.21L9.228 3.683A1 1 0 008.279 3H5z" />
        </svg>
      </button>
    </div>
  );
}

// ============================================================================
// Meeting Chat Component
// ============================================================================

export interface MeetingChatProps {
  className?: string;
}

export function MeetingChat({ className = '' }: MeetingChatProps) {
  const { chatMessages, sendChatMessage, participants } = useVideoConference();
  const [message, setMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      sendChatMessage(message);
      setMessage('');
    }
  };

  const localParticipant = participants.find((p) => p.isLocal);

  return (
    <div className={`flex flex-col bg-gray-900 rounded-lg ${className}`}>
      <div className="p-3 border-b border-gray-800">
        <h3 className="font-medium text-white">Meeting Chat</h3>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {chatMessages.map((msg) => (
          <div
            key={msg.id}
            className={`${
              msg.type === 'system'
                ? 'text-center text-gray-500 text-sm'
                : msg.participantId === localParticipant?.id
                ? 'text-right'
                : ''
            }`}
          >
            {msg.type === 'system' ? (
              <span>{msg.content}</span>
            ) : (
              <div
                className={`inline-block max-w-[80%] ${
                  msg.participantId === localParticipant?.id ? 'text-right' : ''
                }`}
              >
                <p className="text-xs text-gray-500 mb-1">{msg.participantName}</p>
                <div
                  className={`px-3 py-2 rounded-lg ${
                    msg.participantId === localParticipant?.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-800 text-white'
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSend} className="p-3 border-t border-gray-800">
        <div className="flex gap-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 px-3 py-2 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            disabled={!message.trim()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
}

// ============================================================================
// Join Meeting Dialog
// ============================================================================

export interface JoinMeetingDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onJoin: (meetingId: string, name: string) => void;
}

export function JoinMeetingDialog({
  isOpen,
  onClose,
  onJoin,
}: JoinMeetingDialogProps) {
  const [meetingId, setMeetingId] = useState('');
  const [name, setName] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (meetingId.trim() && name.trim()) {
      onJoin(meetingId, name);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-xl max-w-md w-full mx-4 p-6">
        <h2 className="text-xl font-semibold mb-4">Join Meeting</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Meeting ID</label>
            <input
              type="text"
              value={meetingId}
              onChange={(e) => setMeetingId(e.target.value)}
              placeholder="Enter meeting ID"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Your Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="flex gap-3 justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Join Meeting
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

