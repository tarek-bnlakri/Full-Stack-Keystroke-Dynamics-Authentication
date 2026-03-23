import React, { useState, useRef, useEffect } from "react";
import "./HomePage.css";
import { apiRequest } from "../../lib/apiRequest";
import { useNavigate } from "react-router-dom";
import Profile from "../../Components/Profile/Profile";
import { texts } from "../../data/texts";

function HomePage() {
  const navigate = useNavigate();
  const REQUIRED_ATTEMPTS = 5;

  const [text, setText] = useState("");
  const [subsessions, setSubsessions] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [indexOfText, setIndexOfText] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  const keystrokesRef = useRef([]);

  // Restore subsessions from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("subsessions");
    const savedIndex = localStorage.getItem("promptIndex");

    if (saved ) {
      const parsed = JSON.parse(saved);
      setSubsessions(parsed);
      console.log(`Restored ${parsed.length} attempt(s) from previous session`);
    }
    if (savedIndex !== null) {
      setIndexOfText(Number(savedIndex));
    }
  }, []);

  // Mobile detection
  useEffect(() => {
    const isMobileDevice = () => {
      const userAgent = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      );
      const screenSize = window.innerWidth < 1024 || window.innerHeight < 600;
      const hasTouch = navigator.maxTouchPoints > 1;
      return userAgent || screenSize || hasTouch;
    };

    setIsMobile(isMobileDevice());
    const handler = () => setIsMobile(isMobileDevice());
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);

  const isRecordableKey = (key) => {
    return key.length === 1 || key === "Backspace";
  };

  const handlePaste = (e) => {
    e.preventDefault();
    alert("Pasting is not allowed. Please type manually.");
  };

  const handleKeyDown = (e) => {
      if (e.key === "Enter") {
        e.preventDefault(); // prevent newline in textarea
        handleSubmit();
      return;
  }

    if (!isRecordableKey(e.key)) return;

    const now = Date.now();
    const strokes = keystrokesRef.current;

    if (strokes.length > 0) {
      const prevStroke = strokes[strokes.length - 1];
      if (prevStroke.keyUpTime) {
        prevStroke.flightTime = now - prevStroke.keyUpTime;
      }
    }

    strokes.push({
      key: e.key,
      keyDownTime: now,
      keyUpTime: null,
      dwellTime: null,
      flightTime: null,
    });
  };

  const handleKeyUp = (e) => {
    if (!isRecordableKey(e.key)) return;

    const now = Date.now();
    const strokes = keystrokesRef.current;

    const lastStroke = [...strokes]
      .reverse()
      .find((s) => s.key === e.key && s.keyUpTime === null);

    if (lastStroke) {
      lastStroke.keyUpTime = now;
      lastStroke.dwellTime = now - lastStroke.keyDownTime;
    }
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;
    if (!text.trim()) return;

    if (text.trim() !== texts[indexOfText].trim()) {
      alert("Text does not match!");
      return;
    }

    const newSubsession = {
      typedText: text,
      keystrokes: [...keystrokesRef.current],
      timestamp: Date.now(),
    };

    setText("");
    keystrokesRef.current = [];

    const updatedSubsessions = [...subsessions, newSubsession];
    setSubsessions(updatedSubsessions);

    // Persist to localStorage after every attempt
    localStorage.setItem("subsessions", JSON.stringify(updatedSubsessions));
    localStorage.setItem("promptIndex", indexOfText);

    if (updatedSubsessions.length < REQUIRED_ATTEMPTS) return;

    try {
      setIsSubmitting(true);

      await apiRequest.post("/sessions", {
        promptText: texts[indexOfText],
        subsessions: updatedSubsessions,
      });

      // Success — clear everything
      setSubsessions([]);
      const nextIndex = (indexOfText + 1) % texts.length;
      setIndexOfText(nextIndex);

      localStorage.removeItem("subsessions");
      localStorage.setItem("promptIndex", nextIndex); 
      alert("Session saved successfully!");

    } catch (error) {
      console.error("Submission error:", error);

      // Rollback state and sync localStorage
      setSubsessions(subsessions);
      localStorage.setItem("subsessions", JSON.stringify(subsessions));

      alert("Something went wrong. Please retype and submit again.");
      if (error.response?.status === 401) {
        navigate("/login");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isMobile) {
    return (
      <div className="device-warning">
        <h2>Desktop Only</h2>
        <p>This typing test must be completed on a laptop or desktop computer.</p>
        <p>Please switch devices to continue.</p>
      </div>
    );
  }

  return (
    <div>
      <Profile />
      <div className="home-container">
        <h2>Typing Test</h2>
        <p className="prompt">{texts[indexOfText]}</p>
        <p className="prompt">
          Attempt {subsessions.length + 1} of {REQUIRED_ATTEMPTS}
        </p>

        <textarea
          autoFocus
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          onKeyUp={handleKeyUp}
          onPaste={handlePaste}
          placeholder="Please rewrite the sentence here ..."
          className="typing-box"
        />

        <button
          disabled={isSubmitting || !text.trim()}
          onClick={handleSubmit}
          className="submit-btn"
        >
          {isSubmitting ? "Saving..." : "Submit"}
        </button>
      </div>
    </div>
  );
}

export default HomePage;