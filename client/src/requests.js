export async function get(path) {
  const res = await fetch(path);
  return await res.json();
}

export async function post(path, body) {
  const res = await fetch(path, {
    method: "POST",
    body: JSON.stringify(body),
    headers: { "Content-Type": "application/json" },
  });
  return await res.json();
}

export async function patch(path, body) {
  const res = await fetch(path, {
    method: "PATCH",
    body: JSON.stringify(body),
    headers: { "Content-Type": "application/json" },
  });
  return await res.json();
}

export async function del(path) {
  const res = await fetch(path, { method: "DELETE" });
  return await res.json();
}
