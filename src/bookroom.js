const API_BASE = "http://localhost:3000/api";

const CURRENT_GUEST_ID = parseInt(localStorage.getItem('CURRENT_GUEST_ID'));
const GUEST_NAME = localStorage.getItem('GUEST_NAME');

if (!CURRENT_GUEST_ID) {
    window.location.href = "../login/login.html";
}

let currentRoom = null;

function initDates() {
    const checkin  = document.getElementById('checkin');
    const checkout = document.getElementById('checkout');
    const today = new Date().toISOString().split('T')[0];
    checkin.min   = today;
    checkin.value = today;
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];
    checkout.min   = tomorrowStr;
    checkout.value = tomorrowStr;
    checkin.addEventListener('change', (e) => {
        const nextDay = new Date(e.target.value);
        nextDay.setDate(nextDay.getDate() + 1);
        checkout.min = nextDay.toISOString().split('T')[0];
        if (checkout.value <= e.target.value) checkout.value = checkout.min;
        updatePriceBreakdown();
    });
    checkout.addEventListener('change', updatePriceBreakdown);
}

async function loadRoomDetails() {
    const urlParams = new URLSearchParams(window.location.search);
    const roomId = urlParams.get('id');

    if (!roomId) {
        alert("No room selected. Returning to rooms.");
        window.location.href = '../rooms/rooms.html';
        return;
    }

    try {
        const response = await fetch(`${API_BASE}/rooms`);
        const rooms = await response.json();

        currentRoom = rooms.find(r => r.RoomID == roomId);

        if (!currentRoom) {
            alert("Room not found.");
            window.location.href = '../rooms/rooms.html';
            return;
        }

        document.getElementById('room-name').innerText        = currentRoom.Capacity + " Guests";
        document.getElementById('room-price').innerText       = `$${currentRoom.PricePerNight}`;
        document.getElementById('room-description').innerText = currentRoom.TypeName;
        document.getElementById('room-location').innerText    = `${currentRoom.RoomNumber}`;

        const nameEl = document.getElementById('guest-name');
        if (nameEl) nameEl.textContent = GUEST_NAME;

        updatePriceBreakdown();
    } catch (err) {
        console.error("Error loading details:", err);
    }
}

function updatePriceBreakdown() {
    if (!currentRoom) return 0;

    const start    = new Date(document.getElementById('checkin').value);
    const end      = new Date(document.getElementById('checkout').value);
    const diffTime = Math.abs(end - start);
    const nights   = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;

    const price      = parseFloat(currentRoom.PricePerNight || 0);
    const subtotal   = price * nights;
    const discount   = subtotal * 0.10;
    const serviceFee = 120;
    const grandTotal = (subtotal - discount) + serviceFee;

    document.getElementById('price-card').innerHTML = `
        <div class="flex justify-between mb-2">
            <span class="text-sm">${nights} Night(s) Stay</span>
            <span class="text-sm font-semibold">$${subtotal.toFixed(2)}</span>
        </div>
        <div class="flex justify-between mb-2 text-green-600">
            <span class="text-sm">10% Member Discount</span>
            <span class="text-sm font-semibold">-$${discount.toFixed(2)}</span>
        </div>
        <div class="flex justify-between mb-4">
            <span class="text-sm">Service Fee</span>
            <span class="text-sm font-semibold">$${serviceFee}</span>
        </div>
        <hr class="border-slate-200 mb-4"/>
        <div class="flex justify-between items-center">
            <span class="text-xl font-bold">Total</span>
            <span id="grand-total" class="text-2xl font-bold text-black">$${grandTotal.toFixed(0)}</span>
        </div>
    `;
    return grandTotal;
}

document.getElementById('confirmBookingBtn').addEventListener('click', async () => {
    if (!currentRoom) {
        alert("No room available to book.");
        return;
    }

    if (currentRoom.RoomStatus !== 'Available') {
        alert("Sorry, this room is no longer available.");
        window.location.href = '../rooms/rooms.html';
        return;
    }

    const total = updatePriceBreakdown();

    const bookingData = {
        guestid:        CURRENT_GUEST_ID,
        roomid:         parseInt(currentRoom.RoomID),
        checkindate:    document.getElementById('checkin').value,
        checkoutdate:   document.getElementById('checkout').value,
        bookingstatus:  'Confirmed',
        numberofguests: parseInt(currentRoom.Capacity) || 1,
        totalamount:    parseFloat(total)
    };

    try {
        const response = await fetch(`${API_BASE}/bookings`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(bookingData)
        });

        if (response.ok) {
            const roomUpdateResponse = await fetch(`${API_BASE}/rooms/${currentRoom.RoomID}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ RoomStatus: 'Occupied' })
            });

            if (roomUpdateResponse.ok) {
                alert("Booking successful!");
                window.location.href = '../index.html';
            } else {
                console.error("Room update failed:", await roomUpdateResponse.text());
                alert("Booking saved but room status not updated.");
                window.location.href = '../index.html';
            }
        } else {
            const contentType = response.headers.get('content-type');
            const err = contentType && contentType.includes('application/json')
                ? JSON.stringify(await response.json())
                : await response.text();
            alert("Booking failed: " + err);
        }
    } catch (err) {
        console.error("Fetch error:", err);
        alert("Could not connect to server.");
    }
});

document.addEventListener('DOMContentLoaded', () => {
    initDates();
    loadRoomDetails();
});