const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";

export async function training(equipmentArr) {
  const res = await fetch(`${API_BASE}/api/training`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ equipmentArr }),
  });

  // Helpful debugging if backend returns HTML or non-JSON
  const contentType = res.headers.get("content-type") || "";
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Backend error ${res.status}: ${text.slice(0, 200)}`);
  }
  if (!contentType.includes("application/json")) {
    const text = await res.text();
    throw new Error(`Expected JSON but got: ${contentType}. Body: ${text.slice(0, 200)}`);
  }

  const data = await res.json();
  return data.text;
}
