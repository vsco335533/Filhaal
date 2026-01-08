import { useState, useRef } from "react";
import { Link } from "react-router-dom";

interface Letter {
  id: string;
  name: string;
  email?: string;
  subject?: string;
  message: string;
  createdAt: string;
}

const STORAGE_KEY = "filhaal_letters";

function loadLetters(): Letter[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as Letter[];
  } catch (e) {
    console.error("Failed to load letters:", e);
    return [];
  }
}

function saveLetters(list: Letter[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

export function LetterToEditor() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const formRef = useRef<HTMLFormElement | null>(null);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return alert("Please write your message.");

    const letter = {
      id: Date.now().toString(),
      name: name.trim() || "Anonymous",
      email: email.trim() || undefined,
      subject: subject.trim() || undefined,
      message: message.trim(),
      createdAt: new Date().toISOString(),
    };

    const next = [letter, ...loadLetters()];
    saveLetters(next);
    setSubmitted(true);
    setName("");
    setEmail("");
    setSubject("");
    setMessage("");
    if (formRef.current) formRef.current.reset();
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold mb-4">Letter to the Editor</h1>

      <p className="text-gray-700 mb-4">Share your feedback, a letter, or an article proposal. Submissions are reviewed by the editorial team. Admins can view submissions from the admin panel.</p>

      <form ref={formRef} onSubmit={onSubmit} className="bg-white border rounded p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Your name</label>
          <input value={name} onChange={(e) => setName(e.target.value)} className="mt-1 block w-full border rounded px-3 py-2" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 block w-full border rounded px-3 py-2" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Subject</label>
          <input value={subject} onChange={(e) => setSubject(e.target.value)} className="mt-1 block w-full border rounded px-3 py-2" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Message</label>
          <textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={6} className="mt-1 block w-full border rounded px-3 py-2" />
        </div>

        <div>
          <button className="px-4 py-2 bg-red-700 text-white rounded">Submit</button>
        </div>
      </form>

      {submitted && (
        <div className="mt-4 text-sm text-green-700">Thank you — your letter has been submitted.</div>
      )}

            <div className="mt-8">
        <Link to="/" className="text-sm text-gray-600 hover:underline">Back to home</Link>
      </div>
      
    </div>
  );
}

export default LetterToEditor;
