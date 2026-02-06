// --- ระบบจัดการโปรไฟล์ผู้ใช้งาน ---

function initUserProfile() {
    const loggedInUser = localStorage.getItem('sessionUser'); // ชื่อจากหน้า Login
    const loginNavBtn = document.getElementById('login-nav-btn');
    const userProfileNav = document.getElementById('user-profile-nav');
    const userActualName = document.getElementById('user-actual-name');
    const userAvatarImg = document.getElementById('user-avatar-img');

    if (loggedInUser) {
        // 1. ล็อกอินแล้ว: สลับการแสดงผล
        if (loginNavBtn) loginNavBtn.classList.add('hidden');
        if (userProfileNav) {
            userProfileNav.classList.remove('hidden');
            userProfileNav.classList.add('flex');
        }

        // 2. ดึงข้อมูลชื่อและรูปจากเครื่อง (ถ้าเคยตั้งไว้)
        const savedName = localStorage.getItem('profileName') || loggedInUser;
        const savedImg = localStorage.getItem('profileImg');

        if (userActualName) userActualName.innerText = savedName;
        if (savedImg) {
            if (userAvatarImg) userAvatarImg.src = savedImg;
        } else {
            // ถ้าไม่มีรูป ให้ใช้รูปตัวอักษรเริ่มต้นจากชื่อ
            if (userAvatarImg) userAvatarImg.src = `https://ui-avatars.com/api/?name=${savedName}&background=00f260&color=000`;
        }
    }
}

// ฟังก์ชันเปลี่ยนชื่อ
function changeProfileName() {
    const newName = prompt("กรุณากรอกชื่อที่ต้องการเปลี่ยน:");
    if (newName && newName.trim() !== "") {
        localStorage.setItem('profileName', newName);
        const nameEl = document.getElementById('user-actual-name');
        if (nameEl) nameEl.innerText = newName;

        // อัปเดตรูปเริ่มต้นตามชื่อใหม่
        if (!localStorage.getItem('profileImg')) {
            const avatarEl = document.getElementById('user-avatar-img');
            if (avatarEl) avatarEl.src = `https://ui-avatars.com/api/?name=${newName}&background=00f260&color=000`;
        }
    }
}

// ฟังก์ชันเปลี่ยนรูป (ด้วย URL) -> Merged with initUserProfile or separate? 
// The original code had initUserProfile defined twice in the second script block, one overriding the other.
// I will keep the one that seemed most complete or simply merge the functionality.
// Looking at the provided code:
// First block has `initUserProfile`, `changeProfileName`, `logout`, `document.addEventListener('DOMContentLoaded', initUserProfile)`.
// Then: `function changeProfileName() { ... window.location.reload(); }`
// Then: `function logout() { ... }`
// Then: `document.addEventListener('DOMContentLoaded', initUserProfile);`
// Then: `reader.onload ...` (Floating code? This looks like it belongs to an event listener).

// Let's Clean this up. The provided code has some copy-paste errors in the script tags (e.g. `reader.onload` outside a function).
// I will fix the obvious errors while preserving logic.

function logout() {
    if (confirm("ต้องการออกจากระบบใช่หรือไม่?")) {
        localStorage.removeItem('sessionUser');
        // ถ้าไม่อยากให้รูปหายตอน logout ให้เอาบรรทัดล่างนี้ออกครับ
        localStorage.removeItem('profileImgData');
        window.location.reload();
    }
}

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
    initUserProfile();

    // File input listener for profile image
    const fileInput = document.getElementById('file-input');
    const userAvatarImg = document.getElementById('user-avatar-img');
    if (fileInput) {
        fileInput.addEventListener('change', function () {
            const file = this.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function (e) {
                    const imageData = e.target.result;
                    if (userAvatarImg) userAvatarImg.src = imageData; // แสดงรูปทันที
                    localStorage.setItem('profileImgData', imageData); // บันทึกรูปเก็บไว้ในเครื่อง
                };
                reader.readAsDataURL(file); // อ่านไฟล์เป็น Base64
            }
        });
    }
});


// Canvas Background Animation
const canvas = document.getElementById('bg-canvas');
if (canvas) {
    const ctx = canvas.getContext('2d');
    let width, height;
    let particles = [];
    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resize);
    resize();
    class Particle {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.size = Math.random() * 20 + 5;
            this.speedX = (Math.random() - 0.5) * 0.5;
            this.speedY = (Math.random() - 0.5) * 0.5;
            this.color = `hsla(${Math.random() * 360}, 70%, 50%, ${Math.random() * 0.1})`;
            this.shape = Math.random() > 0.5 ? 'circle' : 'square';
            this.angle = 0;
            this.spin = (Math.random() - 0.5) * 0.02;
        }
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            this.angle += this.spin;
            if (this.x > width || this.x < 0) this.speedX *= -1;
            if (this.y > height || this.y < 0) this.speedY *= -1;
        }
        draw() {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.angle);
            ctx.fillStyle = this.color;
            ctx.shadowBlur = 15;
            ctx.shadowColor = this.color;
            if (this.shape === 'circle') {
                ctx.beginPath();
                ctx.arc(0, 0, this.size, 0, Math.PI * 2);
                ctx.fill();
            } else {
                ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size);
            }
            ctx.restore();
        }
    }
    for (let i = 0; i < 40; i++) {
        particles.push(new Particle());
    }
    function animate() {
        ctx.clearRect(0, 0, width, height);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
        ctx.lineWidth = 1;
        for (let i = 0; i < particles.length; i++) {
            for (let j = i; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < 150) {
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        requestAnimationFrame(animate);
    }
    animate();
}

// Color Tool Logic (Swatches)
const swatches = document.querySelectorAll('.color-swatch');

// UI Interactions
const cursor = document.getElementById('cursor');
if (cursor) {
    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
    });
}

const navbar = document.getElementById('navbar');
if (navbar) {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('py-2');
            navbar.classList.remove('py-4');
            const panel = navbar.querySelector('.glass-panel');
            if (panel) panel.classList.add('bg-black/80');
        } else {
            navbar.classList.add('py-4');
            navbar.classList.remove('py-2');
            const panel = navbar.querySelector('.glass-panel');
            if (panel) panel.classList.remove('bg-black/80');
        }
    });
}

const observerOptions = { threshold: 0.1 };
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);
document.querySelectorAll('.glass-card, .gallery-item').forEach((card, index) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(50px)';
    card.style.transition = `all 0.6s ease-out ${index * 0.1}s`;
    observer.observe(card);
});

// Popup Logic
function openPopup() {
    const popup = document.getElementById("popup-ad");
    if (popup) popup.classList.remove("hidden");
}
function closePopup() {
    const popup = document.getElementById("popup-ad");
    if (popup) popup.classList.add("hidden");
}

// เปิด popup อัตโนมัติหลังโหลดเว็บ 2 วินาที
setTimeout(openPopup, 2000); // 2000ms = 2 seconds

// Search / Suggestions Logic
const suggestWords = [
    "เส้น", "สี", "รูปทรง", "รูปทรงตัน", "พื้นผิว", "เนื้อ",
    "แบบฝึกหัดที่1", "แบบฝึกหัดที่2", "แบบฝึกหัดที่3",
    "แบบฝึกหัดที่4", "แบบฝึกหัดที่5", "แบบฝึกหัดที่6",
    "บทที่1", "บทที่2", "บทที่3", "บทที่4", "บทที่5"
];

function showSuggestions() {
    let input = document.getElementById("searchInput").value.toLowerCase();
    let list = document.getElementById("suggestionList");

    if (!list) return;

    list.innerHTML = "";

    if (input === "") {
        list.style.display = "none";
        return;
    }

    let matched = suggestWords.filter(w => w.includes(input));

    if (matched.length === 0) {
        list.style.display = "none";
        return;
    }

    matched.forEach(word => {
        let li = document.createElement("li");
        li.innerText = word;
        li.onclick = () => {
            const inputEl = document.getElementById("searchInput");
            if (inputEl) inputEl.value = word;
            list.style.display = "none";
            goSearch();
        };
        list.appendChild(li);
    });

    list.style.display = "block";
}

function goSearch() {
    const inputEl = document.getElementById("searchInput");
    if (!inputEl) return;

    let keyword = inputEl.value.toLowerCase();

    if (keyword.includes("เส้น")) {
        window.location.href = "https://lersros-lookchin.my.canva.site/dag-iij7i8k";
    }
    else if (keyword.includes("สี")) {
        window.location.href = "https://lersros-lookchin.my.canva.site/color";
    }
    else if (keyword.includes("รูปทรง")) {
        window.location.href = "https://lersros-lookchin.my.canva.site/shape-form";
    }
    else if (keyword.includes("พื้นผิว")) {
        window.location.href = "https://lersros-lookchin.my.canva.site/line";
    }
    else if (keyword.includes("รูปทรงตัน")) {
        window.location.href = "https://lersros-lookchin.my.canva.site/form";
    }
    else if (keyword.includes("เนื้อ")) {
        window.location.href = "https://lersros-lookchin.my.canva.site/value";
    }
    else if (keyword.includes("แบบฝึกหัดที่1")) {
        window.location.href = "แบบฝึกหัด1.html";
    }
    else if (keyword.includes("แบบฝึกหัดที่2")) {
        window.location.href = "แบบฝึกหัด2.html";
    }
    else if (keyword.includes("แบบฝึกหัดที่3")) {
        window.location.href = "แบบฝึกหัด3.html";
    }
    else if (keyword.includes("แบบฝึกหัดที่4")) {
        window.location.href = "แบบฝึกหัด4.html";
    }
    else if (keyword.includes("แบบฝึกหัดที่5")) {
        window.location.href = "แบบฝึกหัด5.html";
    }
    else if (keyword.includes("แบบฝึกหัดที่6")) {
        window.location.href = "แบบฝึกหัด6.html";
    }
    else if (keyword.includes("บทที่1")) {
        window.location.href = "https://lersros-lookchin.my.canva.site/1";
    }
    else if (keyword.includes("บทที่2")) {
        window.location.href = "https://lersros-lookchin.my.canva.site/archival-palette";
    }
    else if (keyword.includes("บทที่3")) {
        window.location.href = "https://lersros-lookchin.my.canva.site/dahaaz35ibu";
    }
    else if (keyword.includes("บทที่4")) {
        window.location.href = "https://lersros-lookchin.my.canva.site/4";
    }
    else if (keyword.includes("บทที่5")) {
        window.location.href = "https://lersros-lookchin.my.canva.site/5";
    }
    else {
        alert("ไม่พบข้อมูลที่ค้นหา");
    }
}

// Color Tool Logic Part 2 - (Overrides/Completes the previous logic)
let currentHue = 0;
let harmonyMode = "analogous";

function updateColors(hue) {
    currentHue = hue;
    applyColors();
}

function setHarmony(mode) {
    harmonyMode = mode;
    applyColors();
}

function applyColors() {
    const display = document.querySelectorAll("#color-display .color-swatch");
    if (display.length < 3) return;

    // คำนวณสีตาม Harmony
    let hue1 = parseInt(currentHue);
    let hue2, hue3;
    if (harmonyMode === "analogous") {
        hue2 = hue1 + 30;
        hue3 = hue1 + 60;
    } else if (harmonyMode === "complementary") {
        hue2 = (hue1 + 180) % 360;
        hue3 = (hue2 + 30) % 360;
    }
    display[0].style.background = `hsl(${hue1}, 80%, 50%)`;
    display[1].style.background = `hsl(${hue2}, 80%, 50%)`;
    display[2].style.background = `hsl(${hue3}, 80%, 50%)`;
}

// Ensure initial run for color tool
window.addEventListener('load', () => {
    updateColors(0);
});
