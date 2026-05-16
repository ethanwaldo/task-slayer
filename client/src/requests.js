/**
 * 
 * @param {string} path
 * 
 */
export async function get(path) {
  const res = await fetch(path);
  return await res.json();
}

/**
 * 
 * @param {string} path
 * @param {any} body 
 * 
 */
export async function post(path, body) {
  await fetch(path, {
    method: "POST",
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

/**
 * 
 * @param {string} path
 * @param {any} body 
 * 
 */
export async function patch(path, body) {
  await fetch(path, {
    method: "PATCH",
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json',
    },
  });
}