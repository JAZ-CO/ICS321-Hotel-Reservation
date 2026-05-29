const API_BASE = "http://localhost:3000/api";
const CURRENT_GUEST_ID = localStorage.getItem('CURRENT_GUEST_ID');

if (!CURRENT_GUEST_ID) {
    window.location.href = "login.html";
}

const ITEMS_PER_PAGE = 10;
let currentPage = 1;
let allMyBookings = [];
let allRooms = [];

async function init() {
    try {
        const [bookingsRes, roomsRes] = await Promise.all([
            fetch(`${API_BASE}/bookings`),
            fetch(`${API_BASE}/rooms`)
        ]);
        
        const allBookings = await bookingsRes.json();
        allRooms = await roomsRes.json();

        // Use == to allow string/number ID matching from localStorage
        allMyBookings = allBookings.filter(b => b.GuestID == CURRENT_GUEST_ID || b.guestid == CURRENT_GUEST_ID);
        
        renderPage(1);
    } catch (err) {
        console.error("Failed to load history:", err);
    }
}

function renderPage(page) {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    currentPage = page;
    const container = document.getElementById('reservations-container');
    
    container.style.opacity = '0';
    setTimeout(() => {
        container.innerHTML = '';
        const start = (page - 1) * ITEMS_PER_PAGE;
        const end = start + ITEMS_PER_PAGE;
        const pageItems = allMyBookings.slice(start, end);

        if (pageItems.length === 0) {
            container.innerHTML = '<p class="text-center py-10 text-slate-500">No reservations found.</p>';
        } else {
            pageItems.forEach(booking => {
                // Find matching room (handling potential casing differences)
                const room = allRooms.find(r => (r.RoomID || r.roomid) == (booking.RoomID || booking.roomid)) || {};
                container.innerHTML += createBookingCard(booking, room);
            });
        }
        renderPagination();
        container.style.opacity = '1';
    }, 100);
}

function createBookingCard(booking, room) {
    // Standardize variables from server JSON
    const bID = booking.BookingID || booking.bookingid;
    const rID = booking.RoomID || booking.roomid;
    const bStatus = (booking.BookingStatus || booking.bookingstatus || "").toLowerCase();
    const rNum = room.RoomNumber || room.roomnumber || 'TBD';
    const total = booking.TotalAmount || booking.totalamount || 0;
    
    let statusConfig = { class: "", icon: "", badgeText: bStatus.toUpperCase(), actions: "" };

    switch (bStatus) {
        case 'confirmed':
            statusConfig.class = "bg-green-50 text-green-700 border-green-100";
            statusConfig.icon = "check_circle";
            statusConfig.actions = `<button data-booking-id="${bID}" data-room-id="${rID}" class="cancel-btn text-error text-sm font-semibold hover:underline">Cancel Reservation</button>`;
            break;
        case 'checked-in':
            statusConfig.class = "bg-blue-50 text-blue-700 border-blue-100";
            statusConfig.icon = "concierge";
            statusConfig.actions = `<button class="bg-primary text-white px-4 py-2 text-sm rounded-lg hover:opacity-90 flex items-center gap-2"><span class="material-symbols-outlined text-sm">key</span> Digital Key</button>`;
            break;
        case 'cancelled':
            statusConfig.class = "bg-error-container text-on-error-container border-error/20";
            statusConfig.icon = "cancel";
            statusConfig.actions = `<button class="bg-slate-100 text-slate-600 px-4 py-2 text-sm rounded-lg cursor-not-allowed">Cancelled</button>`;
            break;
        default:
            statusConfig.class = "bg-slate-100 text-slate-500 border-slate-200";
            statusConfig.icon = "history";
            statusConfig.actions = `<button class="flex items-center gap-2 text-slate-700 px-4 py-2 text-sm hover:bg-slate-50 rounded-lg"><span class="material-symbols-outlined text-sm">download</span> Invoice</button>`;
    }

    const checkIn = new Date(booking.CheckInDate || booking.checkindate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    const checkOut = new Date(booking.CheckOutDate || booking.checkoutdate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

    return `
        <div class="group bg-white border border-outline-variant flex flex-col lg:flex-row overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 rounded-lg ${bStatus === 'cancelled' ? 'opacity-75' : ''}">
            <div class="lg:w-1/3 h-48 lg:h-auto relative overflow-hidden bg-slate-100">
                <img class="w-full h-full object-cover ${bStatus === 'cancelled' ? 'grayscale' : ''}" src="https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=800" />
            </div>
            <div class="lg:w-2/3 p-8 flex flex-col justify-between">
                <div>
                    <div class="flex justify-between items-start mb-4">
                        <div>
                            <span class="text-label-caps text-secondary uppercase mb-1 block">Room ${rNum}</span>
                            <h3 class="text-h3 font-h3 ${bStatus === 'cancelled' ? 'text-slate-400' : 'text-slate-900'}">LuxeStay Reservation</h3>
                        </div>
                        <div class="text-right">
                            <span class="text-label-caps text-slate-400 block mb-1">ID</span>
                            <span class="font-mono text-sm font-bold text-slate-700">#BK-${bID}</span>
                        </div>
                    </div>
                    <div class="grid grid-cols-2 md:grid-cols-4 gap-6 py-4 border-y border-slate-100 mb-6">
                        <div><span class="text-xs text-slate-400 block uppercase">Check-in</span><span class="font-bold">${checkIn}</span></div>
                        <div><span class="text-xs text-slate-400 block uppercase">Check-out</span><span class="font-bold">${checkOut}</span></div>
                        <div><span class="text-xs text-slate-400 block uppercase">Guests</span><span class="font-bold">${booking.NumberOfGuests || booking.numberofguests || 1}</span></div>
                        <div><span class="text-xs text-slate-400 block uppercase">Total</span><span class="font-bold">$${parseFloat(total).toFixed(2)}</span></div>
                    </div>
                </div>
                <div class="flex flex-wrap items-center justify-between gap-4">
                    <div class="flex items-center gap-2 ${statusConfig.class} px-4 py-1.5 rounded-full border">
                        <span class="material-symbols-outlined text-sm" style="font-variation-settings: 'FILL' 1;">${statusConfig.icon}</span>
                        <span class="text-label-caps">${statusConfig.badgeText}</span>
                    </div>
                    <div class="flex gap-3">${statusConfig.actions}</div>
                </div>
            </div>
        </div>`;
}

// Global click listener for Cancellation
document.getElementById('reservations-container').addEventListener('click', async (event) => {
    const btn = event.target.closest('.cancel-btn');
    if (!btn) return;

    const bID = btn.getAttribute('data-booking-id');
    const rID = btn.getAttribute('data-room-id');

    if (!confirm("Are you sure you want to cancel this reservation?")) return;

    try {
        // We use the PATCH endpoints defined in your server.js
        const [bookingRes, roomRes] = await Promise.all([
            fetch(`${API_BASE}/bookings/${bID}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ BookingStatus: 'Cancelled' })
            }),
            fetch(`${API_BASE}/rooms/${rID}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ RoomStatus: 'Available' })
            })
        ]);

        if (bookingRes.ok && roomRes.ok) {
            alert("Reservation cancelled successfully.");
            init(); // Reload all data
        } else {
            alert("Failed to update. Check console for details.");
        }
    } catch (err) {
        console.error("Network error:", err);
        alert("Server connection failed.");
    }
});

function renderPagination() {
    const nav = document.getElementById('pagination-controls');
    const totalPages = Math.ceil(allMyBookings.length / ITEMS_PER_PAGE);
    nav.innerHTML = '';
    if (totalPages <= 1) return;

    const prevBtn = document.createElement('button');
    prevBtn.className = `w-10 h-10 flex items-center justify-center rounded border border-outline-variant ${currentPage === 1 ? 'text-slate-200 cursor-not-allowed' : 'text-slate-600 hover:bg-slate-50'}`;
    prevBtn.innerHTML = '<span class="material-symbols-outlined">chevron_left</span>';
    prevBtn.disabled = currentPage === 1;
    prevBtn.onclick = () => renderPage(currentPage - 1);
    nav.appendChild(prevBtn);

    for (let i = 1; i <= totalPages; i++) {
        const btn = document.createElement('button');
        const isActive = i === currentPage;
        btn.className = `w-10 h-10 flex items-center justify-center rounded border ${isActive ? 'border-primary bg-primary text-white font-bold' : 'border-outline-variant text-slate-600 hover:bg-slate-50'}`;
        btn.innerText = i;
        btn.onclick = () => renderPage(i);
        nav.appendChild(btn);
    }

    const nextBtn = document.createElement('button');
    nextBtn.className = `w-10 h-10 flex items-center justify-center rounded border border-outline-variant ${currentPage === totalPages ? 'text-slate-200 cursor-not-allowed' : 'text-slate-600 hover:bg-slate-50'}`;
    nextBtn.innerHTML = '<span class="material-symbols-outlined">chevron_right</span>';
    nextBtn.disabled = currentPage === totalPages;
    nextBtn.onclick = () => renderPage(currentPage + 1);
    nav.appendChild(nextBtn);
}

document.addEventListener('DOMContentLoaded', init);