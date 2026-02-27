import React, { useState, useRef, useContext } from "react";
import "./HomePage.css";
import { apiRequest } from "../../lib/apiRequest";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/authContext";
import HomeHead from "../../Components/HomeHead/HomeHead";

const PROMPT = "The quick brown fox jumps over the lazy dog";

function HomePage() {
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const [text, setText] = useState("");
  const keystrokesRef = useRef([]);
  const startTimeRef = useRef(null);
  const isSubmittingRef = useRef(false);

  const handleKeyDown = (e) => {
    if (!startTimeRef.current) {
      startTimeRef.current = Date.now();
    }

    const now = Date.now();
    const strokes = keystrokesRef.current;

    // Calculate flight time (time between previous keyUp and current keyDown)
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
    const now = Date.now();
    const strokes = keystrokesRef.current;

    // Find last keyDown without keyUp
    const lastStroke = [...strokes]
      .reverse()
      .find((s) => s.key === e.key && s.keyUpTime === null);

    if (lastStroke) {
      lastStroke.keyUpTime = now;
      lastStroke.dwellTime = now - lastStroke.keyDownTime;
    }
  };

  const handleSubmit = async () => {
    if (isSubmittingRef.current) return;
    if (!text.trim()) return;

    try {
      isSubmittingRef.current = true;

      const sessionData = {
        promptText: PROMPT,
        typedText: text,
        keystrokes: keystrokesRef.current,
      };
      

      await apiRequest.post("/sessions", sessionData);

      // Reset after successful submission
      keystrokesRef.current = [];
      startTimeRef.current = null;
      setText("");

      alert("Session saved successfully!");
    } catch (error) {
      console.error("Submission error:", error);
      if (error.response?.status === 401) {
        navigate("/login");
      }
    } finally {
      isSubmittingRef.current = false;
    }
  };

  return (
    <div className="home-container">
      <HomeHead />

      <h2>Typing Test</h2>
      <p className="prompt">{PROMPT}</p>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        onKeyUp={handleKeyUp}
        placeholder="Please rewrite the sentence here ..."
        className="typing-box"
      />

      <button onClick={handleSubmit} className="submit-btn">
        Submit
      </button>
    </div>
  );
}

export default HomePage;