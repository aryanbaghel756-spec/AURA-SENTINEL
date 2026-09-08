import React, { useState, useEffect, useRef } from "react";
import { api } from "../../services/api";
import { audioService } from "../../services/audioService";
import AuraCore from "../common/AuraCore";

const EXIT_PHRASES = [
  "bye aura", "aura bye", "goodbye aura", "stop listening",
  "band karo", "chup ho jao", "stop aura", "aura stop",
  "so jao", "alvida", "band ho ja", "bas kar do", "bye-bye", "i wanna go", "chlo bye",
  "bye", "goodbye", "ok bye", "theek hai bye",
];
const AFFIRMATIVE_PHRASES = ["haan", "yes", "ok", "okay", "confirm", "kar do", "kardo", "karo", "sure", "go ahead", "theek hai"];
const NEGATIVE_PHRASES = ["nahi", "no", "cancel", "mat karo", "rehne do", "stop"];

const QUICK_PROMPTS = [
  { label: "📊 Risk Posture", prompt: "AURA, summarize the overall system cybersecurity risk score and hardware load." },
  { label: "◈ Attack Surface", prompt: "AURA, open the attack surface radar and check for exposed ports." },
  { label: "🔥 Simulate Attack", prompt: "AURA, simulate a brute force attack scenario in the sandbox." },
  { label: "📁 File Scan", prompt: "AURA, scan local files for potential credential leaks." },
  { label: "📄 System Status", prompt: "AURA, provide an operational telemetry status report." },
];

export default function AIAssistant({ onOpenModule }) {
  const [voiceLanguage, setVoiceLanguage] = useState("hinglish");
  const [isListening, setIsListening] = useState(false);
  const [voiceStatus, setVoiceStatus] = useState("READY");
  const [transcript, setTranscript] = useState("");
  const [continuousMode, setContinuousMode] = useState(false);
  const [conversationHistory, setConversationHistory] = useState([]);
  const [pendingFileAction, setPendingFileAction] = useState(null);
  const [textInput, setTextInput] = useState("");

  const recognitionRef = useRef(null);
  const continuousModeRef = useRef(false);
  const isProcessingRef = useRef(false);
  const pendingFileActionRef = useRef(null);
  const chatScrollRef = useRef(null);

  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [conversationHistory, transcript]);

  const speakWithAura = (message, shouldRestartListening = true) => {
    if (!("speechSynthesis" in window)) {
      setVoiceStatus("VOICE OUTPUT NOT SUPPORTED");
      isProcessingRef.current = false;
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(message);

    if (voiceLanguage === "hindi") {
      utterance.lang = "hi-IN";
    } else if (voiceLanguage === "hinglish") {
      utterance.lang = "en-IN";
    } else {
      utterance.lang = "en-US";
    }

    utterance.rate = 1.05;
    utterance.pitch = 1.0;

    utterance.onstart = () => {
      setVoiceStatus("AURA TRANSMITTING...");
    };

    utterance.onend = () => {
      setVoiceStatus("READY");
      isProcessingRef.current = false;

      if (shouldRestartListening && continuousModeRef.current) {
        setTimeout(() => {
          if (continuousModeRef.current) startListening();
        }, 500);
      }
    };

    utterance.onerror = () => {
      setVoiceStatus("VOICE OUTPUT FAULT");
      isProcessingRef.current = false;
    };

    window.speechSynthesis.speak(utterance);
  };

  const executeFileAction = async (fileAction) => {
    try {
      if (fileAction.type === "move") {
        return await api.moveFile(fileAction.source, fileAction.destination_folder);
      } else if (fileAction.type === "delete") {
        return await api.deleteFilesBroad(fileAction.paths);
      } else if (fileAction.type === "create_folder") {
        return await api.createFolder(fileAction.parent_folder, fileAction.folder_name);
      }
      return { status: "UNKNOWN" };
    } catch (err) {
      console.error("File action error:", err);
      return { status: "ERROR" };
    }
  };

  const askAura = async (userMessage) => {
    const lowerMessage = userMessage.toLowerCase();

    // Check if there is a pending confirmation for file actions
    if (pendingFileActionRef.current) {
      const isYes = AFFIRMATIVE_PHRASES.some((p) => lowerMessage.includes(p));
      const isNo = NEGATIVE_PHRASES.some((p) => lowerMessage.includes(p));

      if (isYes) {
        const actionToRun = pendingFileActionRef.current;
        const result = await executeFileAction(actionToRun);
        pendingFileActionRef.current = null;
        setPendingFileAction(null);

        const isSuccess =
          result?.status === "MOVED" ||
          result?.status === "CREATED" ||
          (result?.results && result.results.every((r) => r.status === "DELETED"));

        let msg;
        if (isSuccess && actionToRun.type === "create_folder") {
          const fullPath = `${actionToRun.parent_folder}\\${actionToRun.folder_name}`;
          msg =
            voiceLanguage === "hindi"
              ? `फोल्डर तैयार है: ${fullPath}`
              : voiceLanguage === "hinglish"
              ? `Folder ban gaya yahan: ${fullPath}`
              : `Folder created at: ${fullPath}`;
        } else if (isSuccess) {
          msg =
            voiceLanguage === "hindi"
              ? "हो गया, टास्क पूरा हुआ।"
              : voiceLanguage === "hinglish"
              ? "Ho gaya, task complete kar diya."
              : "Action completed successfully.";
        } else {
          msg =
            voiceLanguage === "hindi"
              ? "यह नहीं हो पाया।"
              : voiceLanguage === "hinglish"
              ? "Ye nahi ho paya, check file permissions."
              : "Action could not be executed.";
        }

        setConversationHistory((prev) => [
          ...prev,
          { role: "user", content: userMessage },
          { role: "assistant", content: msg },
        ]);

        setVoiceStatus("AURA RESPONDING");
        speakWithAura(msg);
        return;
      }

      if (isNo) {
        pendingFileActionRef.current = null;
        setPendingFileAction(null);

        const msg =
          voiceLanguage === "hindi"
            ? "ठीक है, कैंसल कर दिया।"
            : voiceLanguage === "hinglish"
            ? "Theek hai, cancel kar diya."
            : "Operation cancelled.";

        setConversationHistory((prev) => [
          ...prev,
          { role: "user", content: userMessage },
          { role: "assistant", content: msg },
        ]);

        setVoiceStatus("AURA RESPONDING");
        speakWithAura(msg);
        return;
      }

      const reaskMsg =
        voiceLanguage === "hindi"
          ? "कृपया सिर्फ हाँ या नहीं बोलिए।"
          : voiceLanguage === "hinglish"
          ? "Samajh nahi aaya, confirm karne ke liye bas 'haan' ya 'nahi' bolo."
          : "Please confirm with yes or cancel with no.";

      speakWithAura(reaskMsg);
      return;
    }

    try {
      setVoiceStatus("AURA COMPUTING...");
      const data = await api.chatWithAura({
        message: userMessage,
        language: voiceLanguage || "hinglish",
        history: conversationHistory.slice(-8),
      });

      setConversationHistory((prev) => [
        ...prev.slice(-14),
        { role: "user", content: userMessage },
        { role: "assistant", content: data.reply },
      ]);

      if (data.file_action) {
        pendingFileActionRef.current = data.file_action;
        setPendingFileAction(data.file_action);
      }

      setVoiceStatus("AURA RESPONDING");
      speakWithAura(data.reply);

      if (data.action && onOpenModule) {
        setTimeout(() => {
          onOpenModule(data.action);
        }, 2000);
      }
    } catch (error) {
      console.error("AURA assistant error:", error);
      setVoiceStatus("AURA LINK DOWN");
      speakWithAura("Connection to AURA core could not be established.");
    }
  };

  const startListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setVoiceStatus("SPEECH RECOGNITION NOT SUPPORTED");
      return;
    }

    if (recognitionRef.current) {
      recognitionRef.current.abort();
    }

    window.speechSynthesis.cancel();
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;

    if (voiceLanguage === "hindi") {
      recognition.lang = "hi-IN";
    } else if (voiceLanguage === "hinglish") {
      recognition.lang = "en-IN";
    } else {
      recognition.lang = "en-US";
    }

    recognition.onstart = () => {
      setIsListening(true);
      setVoiceStatus("LISTENING...");
      setTranscript("");
    };

    recognition.onresult = (event) => {
      let interim = "";
      let final = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const text = event.results[i][0].transcript;
        if (event.results[i].isFinal) final += text;
        else interim += text;
      }

      setTranscript(final || interim);

      if (final.trim()) {
        isProcessingRef.current = true;
        const lower = final.trim().toLowerCase();
        const isExit = EXIT_PHRASES.some((ph) => lower.includes(ph));

        if (isExit) {
          continuousModeRef.current = false;
          setContinuousMode(false);
          const bye =
            voiceLanguage === "hindi"
              ? "अलविदा! जब भी ज़रूरत हो, बुला लेना।"
              : voiceLanguage === "hinglish"
              ? "Theek hai, bye! Jab bhi zarurat ho, bula lena."
              : "Goodbye! Standing by for your next command.";
          speakWithAura(bye, false);
        } else {
          setVoiceStatus("AURA COMPUTING...");
          askAura(final.trim());
        }
      }
    };

    recognition.onerror = (event) => {
      if (event.error === "not-allowed") setVoiceStatus("MIC ACCESS RESTRICTED");
      else if (event.error === "no-speech") setVoiceStatus("NO SPEECH DETECTED");
      else if (event.error !== "aborted") setVoiceStatus(`ERROR: ${event.error}`);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
      setVoiceStatus((curr) => (curr === "AURA COMPUTING..." || curr === "AURA TRANSMITTING..." ? curr : "READY"));

      if (continuousModeRef.current && !isProcessingRef.current) {
        setTimeout(() => {
          if (continuousModeRef.current && !isProcessingRef.current) startListening();
        }, 800);
      }
    };

    recognitionRef.current = recognition;
    try {
      recognition.start();
    } catch {
      setIsListening(false);
      setVoiceStatus("INITIALIZATION ERROR");
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) recognitionRef.current.stop();
    setIsListening(false);
    setVoiceStatus("READY");
  };

  const toggleVoiceSession = () => {
    audioService.playClick();
    if (continuousMode || isListening) {
      continuousModeRef.current = false;
      setContinuousMode(false);
      stopListening();
      window.speechSynthesis.cancel();
      setVoiceStatus("READY");
    } else {
      continuousModeRef.current = true;
      setContinuousMode(true);
      startListening();
    }
  };

  const handleSendChip = (chipPrompt) => {
    audioService.playCommand();
    askAura(chipPrompt);
  };

  const handleTextSubmit = (e) => {
    e.preventDefault();
    if (!textInput.trim()) return;
    audioService.playCommand();
    const query = textInput.trim();
    setTextInput("");
    askAura(query);
  };

  // Compute Arc Reactor state dynamically
  let coreState = "IDLE";
  if (voiceStatus.includes("TRANSMITTING") || voiceStatus.includes("RESPONDING")) {
    coreState = "SPEAKING";
  } else if (isListening) {
    coreState = "LISTENING";
  } else if (voiceStatus.includes("COMPUTING")) {
    coreState = "THINKING";
  } else if (voiceStatus.includes("FAULT") || voiceStatus.includes("ERROR") || voiceStatus.includes("RESTRICTED")) {
    coreState = "ERROR";
  }

  return (
    <main className="aura-voice-dashboard">
      <div className="voice-title-section">
        <div>
          <p className="module-page-eyebrow">AURA SENTINEL / AI COMMAND COPILOT</p>
          <h1>AURA AI ASSISTANT</h1>
          <p className="voice-description">
            Conversational cybersecurity co-pilot powered by Groq LLM. Speak or type commands naturally to query live telemetry, inspect the attack surface, or manage secured files.
          </p>
        </div>

        <div className="voice-system-status">
          <span className="pulse-indicator"></span>
          NEURAL VOICE AGENT READY
        </div>
      </div>

      <div className="voice-layout-container">
        {/* Left Interactive Control Panel with Holographic Arc Reactor */}
        <section className="voice-interface">
          <div className="voice-language-bar">
            <span>DIALECT:</span>
            <strong>{voiceLanguage.toUpperCase()}</strong>
            <div className="lang-toggles">
              <button
                className={`lang-btn ${voiceLanguage === "hindi" ? "active" : ""}`}
                onClick={() => {
                  audioService.playClick();
                  setVoiceLanguage("hindi");
                }}
              >
                हिंदी
              </button>
              <button
                className={`lang-btn ${voiceLanguage === "hinglish" ? "active" : ""}`}
                onClick={() => {
                  audioService.playClick();
                  setVoiceLanguage("hinglish");
                }}
              >
                HINGLISH
              </button>
              <button
                className={`lang-btn ${voiceLanguage === "english" ? "active" : ""}`}
                onClick={() => {
                  audioService.playClick();
                  setVoiceLanguage("english");
                }}
              >
                ENGLISH
              </button>
            </div>
          </div>

          {/* Holographic Arc Reactor Core Stage */}
          <div className="jarvis-arc-reactor-stage">
            <AuraCore state={coreState} size={220} interactive={true} />
            <div className="core-state-indicator">
              <span>CORE STATE: </span>
              <strong>{coreState}</strong>
            </div>
          </div>

          <div className="voice-status-panel">
            <span className="voice-status-label">CURRENT TELEMETRY STATUS</span>
            <h2>{voiceStatus}</h2>
            <p>
              {isListening
                ? "Listening for voice input... Say 'Stop AURA' or 'Bye' to end."
                : "Toggle the microphone below or use continuous hands-free dialogue mode."}
            </p>
          </div>

          {pendingFileAction && (
            <div className="pending-action-alert">
              <span className="alert-badge">ACTION CONFIRMATION REQUIRED</span>
              <p>
                AURA is requesting to <strong>{pendingFileAction.type.toUpperCase()}</strong> target files.
                Say <em>"Haan / Yes"</em> to execute or <em>"Nahi / Cancel"</em> to abort.
              </p>
            </div>
          )}

          <button
            className={`voice-mic-button ${continuousMode || isListening ? "active" : ""}`}
            onClick={toggleVoiceSession}
          >
            <span className="mic-icon">{continuousMode || isListening ? "◼" : "🎙"}</span>
            <span>{continuousMode ? "DISCONNECT VOICE CORE" : "ENGAGE AURA VOICE"}</span>
          </button>
        </section>

        {/* Right Conversation History Stream & Text Command Console */}
        <section className="voice-chat-transcript-panel">
          <div className="chat-panel-header">
            <span>DIALOGUE TRANSCRIPT FEED</span>
            <span className="live-chat-tag">AURA v0.1 • GROQ</span>
          </div>

          <div className="chat-scroll-area" ref={chatScrollRef}>
            {conversationHistory.length === 0 && !transcript ? (
              <div className="chat-empty-state">
                <div className="empty-state-icon">🎙</div>
                <p>AURA AI Command Console Ready.</p>
                <small>Speak or click a quick prompt chip below to initiate dialogue.</small>
              </div>
            ) : (
              conversationHistory.map((msg, idx) => (
                <div key={idx} className={`chat-message ${msg.role}`}>
                  <div className="chat-avatar">{msg.role === "user" ? "YOU" : "AURA"}</div>
                  <div className="chat-bubble">
                    <p>{msg.content}</p>
                  </div>
                </div>
              ))
            )}

            {transcript && (
              <div className="chat-message user live-interim">
                <div className="chat-avatar">LIVE</div>
                <div className="chat-bubble interim">
                  <p>{transcript}</p>
                </div>
              </div>
            )}
          </div>

          {/* Quick Prompt Command Chips */}
          <div className="voice-prompt-chips">
            {QUICK_PROMPTS.map((chip, i) => (
              <button
                key={i}
                className="prompt-chip"
                onClick={() => handleSendChip(chip.prompt)}
              >
                {chip.label}
              </button>
            ))}
          </div>

          {/* Direct Text Input Bar */}
          <form className="chat-input-bar" onSubmit={handleTextSubmit}>
            <input
              type="text"
              placeholder="Transmit instruction or query to AURA..."
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              className="chat-text-input"
            />
            <button
              type="submit"
              className="chat-send-btn"
              disabled={!textInput.trim()}
            >
              TRANSMIT ↵
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}
