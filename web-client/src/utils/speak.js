/** Speak English text in the browser (Web Speech API). */
export function speakEnglish(text) {
  if (typeof window === "undefined" || !text?.trim()) return;
  const u = new SpeechSynthesisUtterance(text.trim());
  u.lang = "en-US";
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(u);
}
