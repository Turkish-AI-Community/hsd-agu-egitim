// Production: empty string (same origin, served by FastAPI)
// Development: localhost:8000 (separate backend server)
const API_BASE = import.meta.env.VITE_API_BASE ?? "";

export interface CreditRequest {
  age: number;
  sex: string;
  job: number;
  housing: string;
  saving_accounts: string | null;
  checking_account: string | null;
  credit_amount: number;
  duration: number;
  purpose: string;
  session_id?: string;
}

export interface CreditResponse {
  prediction: string;
  probability: number;
  threshold: number;
}

export async function predictCreditRisk(
  data: CreditRequest
): Promise<CreditResponse> {
  const response = await fetch(`${API_BASE}/predict`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => null);
    throw new Error(error?.detail ?? "Tahmin isteği başarısız oldu");
  }

  return response.json();
}

export async function checkHealth(): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE}/health`);
    return response.ok;
  } catch {
    return false;
  }
}

export interface ChatMessage {
  role: "user" | "model";
  content: string;
  timestamp?: string;
}

export interface ChatResponse {
  reply: string;
  session_id: string;
}

export async function sendChatMessage(
  message: string,
  sessionId: string
): Promise<ChatResponse> {
  const response = await fetch(`${API_BASE}/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message, session_id: sessionId }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => null);
    throw new Error(error?.detail ?? "Mesaj gönderilemedi");
  }

  return response.json();
}

export async function getChatHistory(
  sessionId: string
): Promise<ChatMessage[]> {
  const response = await fetch(`${API_BASE}/chat/history/${sessionId}`);
  if (!response.ok) return [];
  return response.json();
}
