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
        
        if (response.ok) {
            const guest = await response.json();

            // CRITICAL: Match the capitalized aliases from your server.js
            // We use || to support both lowercase and uppercase just in case
            const idToSave = guest.GuestID || guest.guestid;
            const nameToSave = guest.FirstName || guest.firstname;

            if (idToSave) {
                localStorage.setItem('CURRENT_GUEST_ID', idToSave);
                localStorage.setItem('GUEST_NAME', nameToSave);
                
                alert(`Welcome back, ${nameToSave}!`);
                
                // Ensure this path is correct relative to your login.html
                window.location.href = "../index.html";
            } else {
                console.error("Server returned success but no GuestID found in response:", guest);
                alert("Login logic error: Data missing from server response.");
            }
        } else {
            const error = await response.text();
            alert("Login Failed: " + error);
        }
    } catch (err) {
        console.error("Login Error:", err);
        alert("Server connection failed. Is your backend running on port 3000?");
    }
});