const API_BASE = "http://localhost:3000/api";

document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const name  = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();

    if (!name || !email) {
        alert("Please enter both your name and email.");
        return;
    }

    try {
        const response = await fetch(`${API_BASE}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email })
        });
        alert("a");
        if (response.ok) {
            const guest = await response.json();
            localStorage.setItem('CURRENT_GUEST_ID', guest.guestid);
            localStorage.setItem('GUEST_NAME', guest.firstname);
            alert(`Welcome back, ${guest.firstname}!`);
            window.location.href = "../index.html";
        } else {
            const error = await response.text();
            alert("Login Failed: " + error);
        }
    } catch (err) {
        console.error("Login Error:", err);
        alert("Server connection failed.");
    }
});