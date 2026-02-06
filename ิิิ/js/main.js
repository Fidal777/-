
// --- ระบบจัดการโปรไฟล์ผู้ใช้งาน ---

// Expose functions to global scope for dynamic loading
window.changeProfileName = changeProfileName;
window.logout = logout;
window.goSearch = goSearch;
window.setHarmony = setHarmony;
window.updateColors = updateColors;
window.closePopup = closePopup;
window.openPopup = openPopup;
window.initApp = initApp;

function initUserProfile() {
    const loggedInUser = localStorage.getItem('sessionUser'); // ชื่อจากหน้า Login
    const loginNavBtn = document.getElementById('login-nav-btn');
    const userProfileNav = document.getElementById('user-profile-nav');
    const userActualName = document.getElementById('user-actual-name');
    const userAvatarImg = document.getElementById('user-avatar-img');
    const fileInput = document.getElementById('file-input'); // Move definition here for scope visibility

    // Check if elements exist before accessing them (important for dynamic loading)
    if (loggedInUser && loginNavBtn && userProfileNav && userActualName && userAvatarImg) {
        // 1. ล็อกอินแล้ว: สลับการแสดงผล
        loginNavBtn.classList.add('hidden');
        userProfileNav.classList.remove('hidden');
        userProfileNav.classList.add('flex');

        // 2. ดึงข้อมูลชื่อและรูปจากเครื่อง (ถ้าเคยตั้งไว้)
        const savedName = localStorage.getItem('profileName') || loggedInUser;
        const savedImg = localStorage.getItem('profileImgData'); // Consistent key usage

        userActualName.innerText = savedName;
        if (savedImg) {
            userAvatarImg.src = savedImg;
        } else {
            // ถ้าไม่มีรูป ให้ใช้รูปตัวอักษรเริ่มต้นจากชื่อ
            userAvatarImg.src = `https://ui-avatars.com/api/?name=${savedName}&background=00f260&color=000`;
        }
    }

    // Event listener for file input (moved inside conditional check where element is used)
    if (fileInput) {
        fileInput.addEventListener('change', function () {
            const file = this.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function (e) {
                    const imageData = e.target.result;
                    const userAvatarImg = document.getElementById('user-avatar-img'); // Re-query just in case
                    if (userAvatarImg) userAvatarImg.src = imageData;
                    localStorage.setItem('profileImgData', imageData);
                };
                reader.readAsDataURL(file);
            }
        });
    }
}

function changeProfileName() {
    const newName = prompt("กรุณากรอกชื่อที่ต้องการเปลี่ยน:");
    if (newName && newName.trim() !== "") {
        localStorage.setItem('profileName', newName);
        // Update UI immediately without reload if possible, otherwise reload
        const nametext = document.getElementById('user-actual-name');
        if (nametext) nametext.innerText = newName;

        // Update avatar if it was based on name
        if (!localStorage.getItem('profileImgData')) {
            const userAvatarImg = document.getElementById('user-avatar-img');
            if (userAvatarImg) userAvatarImg.src = `https://ui-avatars.com/api/?name=${newName}&background=00f260&color=000`;
        }
    }
}

function logout() {
    if (confirm("ต้องการออกจากระบบใช่หรือไม่?")) {
        localStorage.removeItem('sessionUser');
        // localStorage.removeItem('profileImgData'); // Optional: Keep image or remove
        window.location.reload();
    }
}


// Canvas Background Animation
function initCanvas() {
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

        particles = []; // clear old ones just in case
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
}

// Color Tool Logic
let currentHarmony = 'analogous';
let currentHue = 0; // State from previous script block

function setHarmony(type) {
    currentHarmony = type;
    const slider = document.querySelector('input[type="range"]');
    if (slider) updateColors(slider.value);
}

function updateColors(hue) {
    currentHue = parseInt(hue);

    let colors = [];
    if (currentHarmony === 'analogous') {
        colors = [`hsl(${currentHue}, 70%, 60%)`, `hsl(${(currentHue + 30) % 360}, 70%, 60%)`, `hsl(${(currentHue + 60) % 360}, 70%, 60%)`];
    } else if (currentHarmony === 'complementary') {
        colors = [`hsl(${currentHue}, 80%, 55%)`, `hsl(${(currentHue + 30) % 360}, 80%, 40%)`, `hsl(${(currentHue + 180) % 360}, 80%, 55%)`];
    }

    const display = document.querySelectorAll("#color-display .color-swatch");
    if (display.length >= 3) {
        let hue1 = parseInt(currentHue);
        let hue2, hue3;

        if (currentHarmony === "analogous") {
            hue2 = hue1 + 30;
            hue3 = hue1 + 60;
        } else if (currentHarmony === "complementary") {
            hue2 = (hue1 + 180) % 360;
            hue3 = (hue2 + 30) % 360;
        }

        display[0].style.backgroundColor = `hsl(${hue1}, 80%, 50%)`;
        display[1].style.backgroundColor = `hsl(${hue2}, 80%, 50%)`;
        display[2].style.backgroundColor = `hsl(${hue3}, 80%, 50%)`;
    } else {
        const swatches = document.querySelectorAll('.color-swatch');
        swatches.forEach((swatch, index) => {
            if (colors[index]) {
                swatch.style.backgroundColor = colors[index];
            }
        });
    }
}


// UI Interactions
function initUI() {
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

    // Intersection Observer for Animations
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
}

// Popup Ad Logic
function openPopup() {
    const popup = document.getElementById("popup-ad");
    if (popup) popup.classList.remove("hidden");
}
function closePopup() {
    const popup = document.getElementById("popup-ad");
    if (popup) popup.classList.add("hidden");
}


// Search Logic
function goSearch() {
    const searchInput = document.getElementById("searchInput");
    if (!searchInput) return;

    let keyword = searchInput.value.toLowerCase();

    // Redirect logic
    if (keyword.includes("เส้น")) {
        window.location.href = "https://lersros-lookchin.my.canva.site/dag-iij7i8k";
    }
    // ... (rest of logic) ...
    else {
        alert("ไม่พบข้อมูลที่ค้นหา");
    }
}

// Initialize Everything after load
function initApp() {
    console.log("App Initialized");
    initUserProfile();
    initCanvas();
    initUI();

    // Initialize Color Slider
    const slider = document.querySelector('input[type="range"]');
    if (slider) updateColors(slider.value);

    // Auto popup
    setTimeout(openPopup, 2000);
}
