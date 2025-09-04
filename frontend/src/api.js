// frontend/src/api.js
const API_URL = import.meta.env.VITE_API_URL;

async function registerUser(data) {
  try {
    const res = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error || "Registration failed");
    }

    return await res.json();
  } catch (err) {
    console.error("Registration error:", err.message);
    throw err;
  }
}

// ตัวอย่าง function สำหรับ login
async function loginUser(data) {
  try {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error || "Login failed");
    }

    return await res.json();
  } catch (err) {
    console.error("Login error:", err.message);
    throw err;
  }
}

export { registerUser, loginUser };
