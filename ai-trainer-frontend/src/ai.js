export async function training(equipmentArr) {
  const res = await fetch("http://localhost:4000/api/training", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ equipmentArr }),
  });

  if (!res.ok) {
    throw new Error("Failed to fetch workout");
  }

  const data = await res.json();
  return data.text;
}
