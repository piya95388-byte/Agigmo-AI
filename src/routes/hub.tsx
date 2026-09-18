import React, { useState, useRef } from "react";
import { executeIndependentMode, Mode } from "@/lib/autonomousEngine";
import { Mic, Send, Sun, Moon, Sparkles, Check, ChevronDown } from "lucide-react";

export default function HubChatInterface() {
  const [query, setQuery] = useState("");
  const [selectedMode, setSelectedMode] = useState<Mode>("better");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isListening, setIsListening] = useState(false);
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<string | null>(null);
  const [sources, setSources] = useState<Array<{ title: string; url: string }>>([]);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleInputResize = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setQuery(e.target.value);
    const target = e.target;
    target.style.height = "auto";
    target.style.height = `${target.scrollHeight}px`;
  };

  const toggleVoiceInput = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Voice recognition is not supported in this browser.");
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = true;

    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (event: any) => {
      const transcript = Array.from(event.results)
        .map((result: any) => result[0].transcript)
        .join("");
      setQuery(transcript);
    };
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);

    recognition.start();
  };

  const handleSubmit = async () => {
    if (!query.trim() || loading) return;

    setLoading(true);
    setResponse(null);
    setSources([]);

    try {
      const result = await executeIndependentMode(selectedMode, query);
      setResponse(result.text);
      setSources(result.sources);
    } catch (error) {
      console.error("Execution error:", error);
      setResponse("An error occurred while processing your request.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-300 ${isDarkMode ? "bg-gray-950 text-gray-100" : "bg-gray-50 text-gray-900"}`}>
      {/* Top Header */}
      <header className={`flex items-center justify-between px-4 py-3 border-b ${isDarkMode ? "border-gray-800 bg-gray-900/50" : "border-gray-200 bg-white/50"} backdrop-blur-md sticky top-0 z-50`}>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 flex items-center justify-center">
            <img src="/logo.svg" alt="Agigmo Logo" className="w-full h-full object-contain" />
          </div>

          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                isDarkMode ? "bg-gray-800 hover:bg-gray-700 text-emerald-400" : "bg-gray-200 hover:bg-gray-300 text-emerald-600"
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span className="capitalize">{selectedMode.replace("-", " ")}</span>
              <ChevronDown className="w-4 h-4" />
            </button>

            {isDropdownOpen && (
              <div className={`absolute left-0 mt-2 w-56 rounded-xl shadow-xl border overflow-hidden z-50 ${isDarkMode ? "bg-gray-900 border-gray-800 text-gray-200" : "bg-white border-gray-200 text-gray-800"}`}>
                {(["ultra-fast", "fast-lite", "fast", "better", "pro", "ultra", "deep-research", "perplexity-style"] as Mode[]).map((mode) => (
                  <button
                    key={mode}
                    onClick={() => {
                      setSelectedMode(mode);
                      setIsDropdownOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2.5 text-sm flex items-center justify-between transition-colors ${
                      isDarkMode ? "hover:bg-gray-800" : "hover:bg-gray-100"
                    } ${selectedMode === mode ? "font-bold text-emerald-500" : ""}`}
                  >
                    <span className="capitalize">{mode.replace("-", " ")}</span>
                    {selectedMode === mode && <Check className="w-4 h-4" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <button
          onClick={() => setIsDarkMode(!isDarkMode)}
          className={`p-2 rounded-full transition-colors ${isDarkMode ? "bg-gray-800 hover:bg-gray-700 text-yellow-400" : "bg-gray-200 hover:bg-gray-300 text-gray-700"}`}
          title="Toggle Theme"
        >
          {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-3xl w-full mx-auto px-4 py-6 flex flex-col gap-6 overflow-y-auto pb-32">
        {response ? (
          <div className={`p-5 rounded-2xl border ${isDarkMode ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200 shadow-sm"}`}>
            <div className="prose dark:prose-invert max-w-none whitespace-pre-wrap text-sm leading-relaxed">
              {response}
            </div>
            {sources.length > 0 && (
              <div className="mt-4 pt-4 border-t border-gray-700/50">
                <p className="text-xs font-semibold text-gray-400 mb-2">Sources:</p>
                <div className="flex flex-col gap-1.5">
                  {sources.map((src, index) => (
                    <a
                      key={index}
                      href={src.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-emerald-400 hover:underline truncate"
                    >
                      {index + 1}. {src.title}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center text-gray-500 my-auto">
            <Sparkles className="w-12 h-12 mb-3 text-emerald-500 animate-pulse" />
            <h2 className="text-xl font-semibold mb-1">Hello Agigmo</h2>
            <p className="text-sm max-w-sm">Your independent AI utility is active. Ask me anything!</p>
          </div>
        )}
      </main>

      {/* Footer Input Bar */}
      <footer className={`fixed bottom-0 left-0 right-0 p-4 border-t backdrop-blur-md transition-colors duration-300 ${isDarkMode ? "bg-gray-950/80 border-gray-800" : "bg-white/80 border-gray-200"}`}>
        <div className="max-w-3xl mx-auto flex items-end gap-2 p-2 rounded-2xl border shadow-lg transition-all focus-within:ring-2 focus-within:ring-emerald-500/50"
          style={{ backgroundColor: isDarkMode ? "#111827" : "#ffffff", borderColor: isDarkMode ? "#374151" : "#d1d5db" }}
        >
          <textarea
            ref={textareaRef}
            rows={1}
            value={query}
            onChange={handleInputResize}
            onKeyDown={handleKeyDown}
            placeholder="Agigmo independent engine..."
            className="flex-1 bg-transparent border-none outline-none resize-none px-3 py-2 text-sm max-h-40 overflow-y-auto leading-relaxed"
          />

          <div className="flex items-center gap-1.5 pb-1">
            <button
              onClick={toggleVoiceInput}
              className={`p-2 rounded-xl transition-colors ${isListening ? "bg-red-500 text-white animate-pulse" : isDarkMode ? "hover:bg-gray-800 text-gray-400" : "hover:bg-gray-100 text-gray-600"}`}
              title="Voice Input"
            >
              <Mic className="w-5 h-5" />
            </button>

            <button
              onClick={handleSubmit}
              disabled={loading || !query.trim()}
              className="p-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              title="Send Prompt"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
                                                                 }
                      
