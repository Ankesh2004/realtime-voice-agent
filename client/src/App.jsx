import React, { useState, useRef, useEffect } from 'react';
import { RealtimeAgent, RealtimeSession } from '@openai/agents/realtime';
import './App.css';

function App() {
  const [status, setStatus] = useState('Not Connected');
  const [transcript, setTranscript] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [agentName, setAgentName] = useState('Assistant');
  const [agentInstructions, setAgentInstructions] = useState('You are a friendly and helpful assistant. Keep your responses concise.');
  const voiceSessionRef = useRef(null);

  // ----------------[ HELPER FUNCTIONS ]-------------------------//
  const getEphemeralToken = async () => {
    console.log("Attempting to fetch ephemeral token...");
    try {
      const response = await fetch('http://localhost:3001/api/get-token', {
        method: 'POST',
      });
      if (!response.ok) {
        throw new Error(`Failed to fetch token from server (${response.status})`);
      }
      const data = await response.json();
      if (!data.token) {
        throw new Error('Token not found in server response.');
      }
      console.log("Successfully fetched ephemeral token.");
      return data.token;
    } catch (error) {
      console.error("Error in getEphemeralToken:", error);
      setStatus(`Error: ${error.message}`);
      return null;
    }
  };

  const handleConnect = async () => {
    console.log("handleConnect called.");
    
    // Gracefully close any existing session before starting a new one.
    if (voiceSessionRef.current) {
      console.log("An active session exists. Closing it before creating a new one.");
      try {
        voiceSessionRef.current.close();
        console.log("Previous session closed.");
      } catch (error) {
        console.error("Error closing existing session:", error);
      }
      voiceSessionRef.current = null;
    }

    setIsConnecting(true);
    setTranscript(''); // Clear previous transcript
    setStatus('Requesting ephemeral token...');
    console.log("State: Requesting ephemeral token...");

    // ----------------[ CORE WORKING STEPS ]-------------------------//
    const ephemeralKey = await getEphemeralToken();
    if (!ephemeralKey) {
      console.log("Token fetching failed. Aborting connection.");
      setIsConnecting(false);
      return;
    }

    let agent;
    let session;

    // Step 1: Create the Agent
    try {
      setStatus('Token acquired. Creating agent...');
      console.log("State: Creating RealtimeAgent...");
      agent = new RealtimeAgent({
        name: agentName,
        instructions: agentInstructions,
      });
      console.log("RealtimeAgent created successfully.");
    } catch (error) {
      console.error("Error creating RealtimeAgent:", error);
      setStatus(`Error: Failed to create agent. ${error.message}`);
      setIsConnecting(false);
      return;
    }

    // Step 2: Create the Session
    try {
      setStatus('Agent created. Creating session...');
      console.log("State: Creating RealtimeSession...");
      session = new RealtimeSession(agent, {
        model: 'gpt-4o-mini-realtime-preview',
      });
      voiceSessionRef.current = session;
      console.log("RealtimeSession created successfully.");
    } catch (error) {
      console.error("Error creating RealtimeSession:", error);
      setStatus(`Error: Failed to create session. ${error.message}`);
      setIsConnecting(false);
      return;
    }

    // Step 3: Setup Event Listeners
    
    session.on('error', (error) => {
      console.error('EVENT: session.error - A runtime error occurred:', error);
      setStatus(`Error: A session error occurred. ${error.message}`);
      setIsConnecting(false);
    });
    // Step 4: Connect to the session
    try {
      setStatus('Connecting to session...');
      console.log("State: Attempting to connect to the session...");
      await session.connect({ apiKey:ephemeralKey });
      setIsConnecting(false);
      setIsConnected(true);
      setStatus('Connected');
      console.log("Session connection initiated. Waiting for 'connected' state.");
    } catch (error) {
      console.error('Connection to session failed:', error);
      setStatus(`Error: Connection failed. ${error.message}`);
    } finally {
      setIsConnecting(false);
    }
  };
  
  // Cleanup realtime session on component unmount
  useEffect(() => {
    return () => {
      if (voiceSessionRef.current) {
        console.log("Cleanup: Component is unmounting. Closing session.");
        voiceSessionRef.current.close();
      }
    };
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <h1>Real-Time Voice Agent</h1>
        <div className="status-bar">
          <span className={`status-indicator ${isConnected ? 'connected' : ''}`}></span>
          <p>Status: {status}</p>
        </div>
        
        <div className="session-config">
          <div className="input-group">
            <label htmlFor="agentName">Agent Name</label>
            <input
              id="agentName"
              type="text"
              value={agentName}
              onChange={(e) => setAgentName(e.target.value)}
              disabled={isConnecting || isConnected}
              placeholder="e.g., Assistant"
            />
          </div>
          <div className="input-group">
            <label htmlFor="agentInstructions">Instructions</label>
            <textarea
              id="agentInstructions"
              value={agentInstructions}
              onChange={(e) => setAgentInstructions(e.target.value)}
              disabled={isConnecting || isConnected}
              placeholder="e.g., You are a friendly and helpful assistant."
            />
          </div>
        </div>

        <button onClick={handleConnect} disabled={isConnecting || isConnected}>
          { isConnected ? 'Connected' : isConnecting ? 'Connecting...' : 'Start Session'}
        </button>
      </header>
    </div>
  );
}

export default App;