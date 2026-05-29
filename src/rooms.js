const API_BASE = "http://localhost:3000/api";

// Your image array
const roomImages = [
    "https://lh3.googleusercontent.com/aida-public/AB6AXuCHnuxnq8n7qwGW3CiW__aa-i13JIKpytuLkj5oUNopsRA2yg-2smP06sA5V8rfLgSrAfvRDLAYa0K2iJcokTP9BP59CRQ75FxUQyhgZpfOMQ1LeV5ZAg9AuzvK8ShKPuUMfQus4PI3QGA1ZSx659zYD1xU4A8ft2HUTNghJ5cgFZGeWFlpvBS39k-871HOnvP0Za7WFc9l6B4Rsbuj4KXefxF2eZ7aZKookcwRMRxZi6s9YIHkyguxFSpvxeR3Fy41fiTUCvOEuq1i", 
    "https://lh3.googleusercontent.com/aida-public/AB6AXuBwU78NkkRouXuXlnW6RuyiyqX545YjlMKnPFPURBgpK_KdaZ0gWcEfsBbQPrOiV_NqforGqhsJBdYdN4KAn0V7Q-8zPeKQIORyriQZGImnU8CVfovyJ1r3XPOsa5qFyvkQqcZb55R4d5vv5wCCaO2H1AJWzZYPvd08VxDWQ4v-G8Ji13ycTP65raP_ofQEJLBSJebpN8o-HywRbQ-x0bcPdPjQTxba7hxItbt0kWP7QQVcEOgLvxH1WN38K6kMqYM1lsFyCal6zO99",
    "https://lh3.googleusercontent.com/aida-public/AB6AXuD0GHXwBytD4lme-7omTwwjlKLnIK4l3-RFi0m1KSV0KwIfUUcQNpoeHBdCh2jZuZyjPPHKKsPzr240QpMzxqMLxKR_aqu4-WAk-Li3bQPmSoLIhmmD99U2r41JrQzIyl5bX6bvMk-Uh5XUp-W8QKmggyJoCE1NQftt7dfznE3Re9AW-4kyNUsPYaKJxmmN6xn91X9v76D2DfEeLrW3G43B7SCUyxnhjDmJybQeazeEw5Hjy1x4fVB29elC3DsZA-AWXzE-m4b-eIhG"
];

async function loadRooms() {
    const container = document.getElementById('room-container');
    
    try {
        const response = await fetch(`${API_BASE}/rooms`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const rooms = await response.json();
        container.innerHTML = '';

        // Added 'index' to the forEach parameters
        rooms.forEach((room, index) => {
            const price = room.PricePerNight || "0";
            const typeName = room.TypeName || "Standard Room";
            const isAvailable = room.RoomStatus === 'Available';
            
            // 1. SELECT RANDOM IMAGE
            // This cycles through 0, 1, 2 based on the room's position
            const imageSrc = roomImages[index % roomImages.length];
            
            const card = `
            <div class="bg-surface-container-lowest border border-slate-200 tonal-elevation-1 group">
                <div class="relative overflow-hidden aspect-[4/3]">
                    <img alt="${typeName}" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                         src="${imageSrc}"/>
                    <div class="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 font-label-caps text-primary">
                        FLOOR ${room.FloorNumber}
                    </div>
                </div>
                <div class="p-8">
                    <div class="flex justify-between items-start mb-4">
                        <div>
                            <h2 class="font-h3 text-h3 mb-1">Room ${room.RoomNumber}</h2>
                            <p class="text-sm text-outline mb-2">${typeName}</p>
                            <span class="font-label-caps text-xs ${isAvailable ? 'text-green-600' : 'text-red-600'} uppercase font-bold">
                                ${room.RoomStatus}
                            </span>
                        </div>
                        <div class="text-right">
                            <span class="font-h3 text-primary">$${price}</span>
                            <p class="font-label-caps text-[10px] text-outline">PER NIGHT</p>
                        </div>
                    </div>
                    <p class="text-body-sm text-on-surface-variant mb-6 line-clamp-2">
                        Experience the height of hospitality in our ${typeName.toLowerCase()}.
                    </p>
                    <button 
                        value="${room.RoomID}" 
                        onclick="handleBookingClick(this)"
                        ${!isAvailable ? 'disabled' : ''}
                        class="w-full bg-primary text-on-primary py-4 font-button uppercase tracking-widest hover:opacity-90 disabled:bg-slate-300 disabled:cursor-not-allowed transition-all">
                        ${isAvailable ? 'Book Now' : 'Occupied'}
                    </button>
                </div>
            </div>`;
            container.innerHTML += card;
        });
    } catch (error) {
        console.error("Fetch error:", error);
        container.innerHTML = `<p class="text-error p-8 text-center">Unable to load rooms. Please ensure the server is running.</p>`;
    }
}

function handleBookingClick(buttonElement) {
    const roomId = buttonElement.value;
    if (roomId) {
        window.location.href = `bookRoom.html?id=${roomId}`;
    }
}

window.addEventListener('DOMContentLoaded', loadRooms);