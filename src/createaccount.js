const API_BASE = "http://localhost:3000/api";

document.getElementById('registerForm').addEventListener('submit', async (e) => {
    e.preventDefault(); 

    // 1. Collect the data (Updated keys to match server.js expectations)
    const formData = {
        FirstName: document.getElementById('firstName').value.trim(),
        LastName: document.getElementById('lastName').value.trim(),
        PhoneNumber: document.getElementById('phoneNumber').value.trim(),
        Email: document.getElementById('emailAddress').value.trim(),
        NationalID: document.getElementById('nationalID').value.trim(),
        Address: document.getElementById('address').value.trim()
    };

    // 2. Simple Validation
    if (Object.values(formData).some(value => !value)) {
        alert("Please fill in all fields.");
        return;
    }

    try {
        // 3. Send the POST request
        const response = await fetch(`${API_BASE}/guests`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        if (response.ok) {
            const result = await response.json();
            alert("Account created successfully! Redirecting to login...");
            
            // Redirect to login page
            setTimeout(() => {
                window.location.href = "login.html";
            }, 1500);
        } else {
            const errorText = await response.text();
            alert("Registration failed: " + errorText);
        }
    } catch (err) {
        console.error("Connection Error:", err);
        alert("Could not connect to the server. Is your backend running on port 3000?");
    }
});