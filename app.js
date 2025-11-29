// Initialize Telegram Web App
if (window.Telegram && window.Telegram.WebApp) {
    const tg = window.Telegram.WebApp;
    tg.expand();
    tg.ready();
}

// Social Icon Animations - NEW FEATURE #2 (ALL ICONS)
function animateSocialIcon(event, iconType) {
    event.preventDefault();
    const link = event.currentTarget;
    link.classList.add('animating');
    
    const durations = {
        instagram: 600,
        vk: 600,
        telegram: 600,
        whatsapp: 800,
        website: 800
    };
    
    const duration = durations[iconType] || 600;
    
    setTimeout(() => {
        link.classList.remove('animating');
        // Open the link after animation
        window.open(link.href, '_blank');
    }, duration);
}

// Navigation function
function navigateTo(pageId) {
    // Hide all pages
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => page.classList.remove('active'));
    
    // Show selected page
    const targetPage = document.getElementById(`${pageId}-page`);
    if (targetPage) {
        targetPage.classList.add('active');
    }
    
    // Update navigation active state
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => item.classList.remove('active'));
    
    // Find and activate the corresponding nav item
    navItems.forEach(item => {
        if (item.onclick && item.onclick.toString().includes(`'${pageId}'`)) {
            item.classList.add('active');
        }
    });
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Initialize schedule if navigating to schedule page
    if (pageId === 'schedule') {
        initSchedule();
    }
    
    // Generate QR code if navigating to profile
    if (pageId === 'profile') {
        setTimeout(generateQRCode, 100);
    }
    
    // Generate swipeable services if navigating to services page
    if (pageId === 'services') {
        generateSwipeableServices();
    }
}

// Generate Swipeable Service Cards - NEW FEATURE #3
function generateSwipeableServices() {
    const servicesPage = document.getElementById('services-page');
    if (!servicesPage) return;
    
    const servicesData = [
        { icon: '🏋️', title: 'Индивидуальное', duration: '90 мин', price: '4500₽' },
        { icon: '👥', title: 'Парное', duration: '60 мин', price: '4500₽' },
        { icon: '👨‍👩‍👧‍👦', title: 'Групповое', duration: '60 мин', price: '2000₽' },
        { icon: '⚡', title: 'Интенсив', duration: '120 мин', price: '4500₽' }
    ];
    
    // Check if already generated
    if (servicesPage.querySelector('.services-container')) return;
    
    // Clear existing content
    servicesPage.innerHTML = '<h2 class="page-title">Услуги</h2>';
    
    // Create container
    const container = document.createElement('div');
    container.className = 'services-container';
    
    // Generate cards
    servicesData.forEach(service => {
        const card = document.createElement('div');
        card.className = 'service-card';
        card.innerHTML = `
            <div class="service-icon">${service.icon}</div>
            <div class="service-header">
                <span class="service-type">${service.title}</span>
                <span class="service-duration">${service.duration}</span>
            </div>
            <span class="service-price">${service.price}</span>
            <button class="service-cta" onclick="openRegistrationForm()">Записаться</button>
        `;
        container.appendChild(card);
    });
    
    servicesPage.appendChild(container);
}

// Registration Form Functions
function openRegistrationForm() {
    const modal = document.getElementById('registration-modal');
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Reset form
        const form = document.getElementById('registrationForm');
        if (form) form.reset();
        
        // Hide success message
        const successMsg = document.getElementById('successMessage');
        if (successMsg) successMsg.style.display = 'none';
        
        // Show form
        if (form) form.style.display = 'flex';
    }
}

function closeRegistrationForm() {
    const modal = document.getElementById('registration-modal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
}

// Phone input formatting
function formatPhoneNumber(input) {
    let value = input.value.replace(/\D/g, '');
    
    if (value.length > 0) {
        if (value[0] !== '7') {
            value = '7' + value;
        }
        
        let formatted = '+7';
        if (value.length > 1) {
            formatted += '(' + value.substring(1, 4);
        }
        if (value.length >= 5) {
            formatted += ')' + value.substring(4, 7);
        }
        if (value.length >= 8) {
            formatted += '-' + value.substring(7, 9);
        }
        if (value.length >= 10) {
            formatted += '-' + value.substring(9, 11);
        }
        
        input.value = formatted;
    }
}

// Handle registration form submission
function handleRegistrationSubmit(event) {
    event.preventDefault();
    
    const form = event.target;
    const formData = new FormData(form);
    
    // Collect form data
    const data = {
        name: formData.get('name'),
        age: formData.get('age'),
        level: formData.get('level'),
        metro: formData.get('metro') || 'Не указано',
        camp_interest: formData.get('camp_interest'),
        phone: formData.get('phone'),
        comment: formData.get('comment') || 'Нет комментариев'
    };
    
    // Format message for Telegram
    const message = `🎉 Заявка на занятия\n\n` +
        `👤 Имя: ${data.name}\n` +
        `🎂 Возраст: ${data.age}\n` +
        `🛹 Уровень: ${data.level}\n` +
        `🚇 Район/Метро: ${data.metro}\n` +
        `⛺ Кэмпы: ${data.camp_interest}\n` +
        `📞 Телефон: ${data.phone}\n` +
        `💬 Комментарий: ${data.comment}`;
    
    // Log to console (in production, send to Telegram API)
    console.log('Registration data:', data);
    console.log('Telegram message to @maximkiselev:', message);
    
    // Show success message
    form.style.display = 'none';
    const successMsg = document.getElementById('successMessage');
    if (successMsg) {
        successMsg.style.display = 'block';
    }
    
    // Auto close after 3 seconds
    setTimeout(() => {
        closeRegistrationForm();
    }, 3000);
}

// Generate calendar dates (30 days forward, unlimited backward)
function generateCalendar() {
    const calendar = document.getElementById('calendar');
    if (!calendar) return;
    
    calendar.innerHTML = '';
    
    const today = new Date();
    const days = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
    const daysShort = ['ВС', 'ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ'];
    const months = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];
    
    // Generate 30 days backward
    for (let i = -30; i < 0; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);
        
        const dayElement = document.createElement('div');
        dayElement.className = 'calendar-day small';
        
        dayElement.innerHTML = `
            <span class="day-name">${daysShort[date.getDay()]}</span>
            <span class="day-number">${date.getDate()}</span>
            <span class="day-date">${months[date.getMonth()].substring(0, 3)}</span>
        `;
        
        dayElement.onclick = function() {
            document.querySelectorAll('.calendar-day').forEach(d => d.classList.remove('selected'));
            this.classList.add('selected');
            generateScheduleSlots(date);
        };
        
        calendar.appendChild(dayElement);
    }
    
    // Generate current week (7 days) - LARGE
    for (let i = 0; i < 7; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);
        
        const dayElement = document.createElement('div');
        dayElement.className = 'calendar-day large';
        if (i === 0) dayElement.classList.add('selected');
        
        dayElement.innerHTML = `
            <span class="day-name">${daysShort[date.getDay()]}</span>
            <span class="day-number">${date.getDate()}</span>
            <span class="day-date">${months[date.getMonth()]}</span>
        `;
        
        dayElement.onclick = function() {
            document.querySelectorAll('.calendar-day').forEach(d => d.classList.remove('selected'));
            this.classList.add('selected');
            generateScheduleSlots(date);
        };
        
        calendar.appendChild(dayElement);
    }
    
    // Generate 23 more days forward (total 30 forward) - SMALL
    for (let i = 7; i <= 30; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);
        
        const dayElement = document.createElement('div');
        dayElement.className = 'calendar-day small';
        
        dayElement.innerHTML = `
            <span class="day-name">${daysShort[date.getDay()]}</span>
            <span class="day-number">${date.getDate()}</span>
            <span class="day-date">${months[date.getMonth()].substring(0, 3)}</span>
        `;
        
        dayElement.onclick = function() {
            document.querySelectorAll('.calendar-day').forEach(d => d.classList.remove('selected'));
            this.classList.add('selected');
            generateScheduleSlots(date);
        };
        
        calendar.appendChild(dayElement);
    }
    
    // Scroll to today (31st element, accounting for 30 past days)
    setTimeout(() => {
        const todayElement = calendar.children[30];
        if (todayElement) {
            todayElement.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
        }
    }, 100);
}

// Generate schedule slots - Hourly view (60-minute increments)
function generateScheduleSlots(date) {
    const container = document.getElementById('schedule-slots');
    if (!container) return;
    
    container.innerHTML = '';
    
    // Check if this is the test date (Nov 29, 2025)
    const isTestDate = date.getDate() === 29 && date.getMonth() === 10 && date.getFullYear() === 2025;
    
    // Sample schedule data for test date
    const testSchedule = {
        '09:00': { type: 'unavailable', text: 'нет записи' },
        '10:00': { type: 'available', trainer: 'Павел Мушкин', location: 'Севкабель' },
        '11:00': { type: 'booked', trainer: 'Павел Мушкин', location: 'Севкабель', lessonType: 'Индивидуальное', duration: '90 мин' },
        '12:00': { type: 'booked', trainer: 'Павел Мушкин', location: 'Севкабель', lessonType: 'Индивидуальное', duration: '90 мин (продолжение)' },
        '13:00': { type: 'booked', trainer: 'Даниэль Васильев', location: 'Жесть', lessonType: 'Групповое', capacity: '6/10' },
        '14:00': { type: 'booked', trainer: 'Даниэль Васильев', location: 'Жесть', lessonType: 'Групповое', capacity: '6/10 (продолжение)' },
        '15:00': { type: 'available', trainer: 'Павел Мушкин', location: 'Севкабель' },
        '16:00': { type: 'available', trainer: 'Даниэль Васильев', location: 'Жесть' },
        '17:00': { type: 'group', trainer: 'Павел Мушкин', location: 'Севкабель', capacity: '4/8' },
        '18:00': { type: 'unavailable', text: 'нет записи' },
        '19:00': { type: 'booked', trainer: 'Павел Мушкин', location: 'Севкабель', lessonType: 'Парное', duration: '60 мин' },
        '20:00': { type: 'available', trainer: 'Даниэль Васильев', location: 'Жесть' },
        '21:00': { type: 'available', trainer: 'Павел Мушкин', location: 'Севкабель' },
        '22:00': { type: 'available', trainer: 'Даниэль Васильев', location: 'Жесть' },
        '23:00': { type: 'unavailable', text: 'нет записи' }
    };
    
    const trainers = ['Павел Мушкин', 'Даниэль Васильев'];
    const locations = ['Севкабель', 'Жесть'];
    
    // Generate hourly slots from 09:00 to 23:00
    for (let hour = 9; hour <= 23; hour++) {
        const timeString = `${String(hour).padStart(2, '0')}:00`;
        
        let slotData;
        if (isTestDate && testSchedule[timeString]) {
            slotData = testSchedule[timeString];
        } else {
            // Generate random data for other dates
            const rand = Math.random();
            if (hour < 10 || hour > 22) {
                slotData = { type: 'unavailable', text: 'нет записи' };
            } else if (rand < 0.35) {
                slotData = { type: 'available', trainer: trainers[Math.floor(Math.random() * trainers.length)], location: locations[Math.floor(Math.random() * locations.length)] };
            } else if (rand < 0.5) {
                const capacity = `${Math.floor(Math.random() * 8) + 1}/${Math.floor(Math.random() * 4) + 6}`;
                slotData = { type: 'group', trainer: trainers[Math.floor(Math.random() * trainers.length)], location: locations[Math.floor(Math.random() * locations.length)], capacity: capacity };
            } else if (rand < 0.75) {
                const lessonTypes = ['Индивидуальное', 'Парное', 'Групповое'];
                slotData = { type: 'booked', trainer: trainers[Math.floor(Math.random() * trainers.length)], location: locations[Math.floor(Math.random() * locations.length)], lessonType: lessonTypes[Math.floor(Math.random() * lessonTypes.length)], duration: '60 мин' };
            } else {
                slotData = { type: 'unavailable', text: 'нет записи' };
            }
        }
        
        const slot = document.createElement('div');
        slot.className = `time-slot ${slotData.type}`;
        
        let slotContent = `<span class="slot-time">${timeString}</span>`;
        
        if (slotData.type === 'unavailable') {
            slotContent += `<div class="slot-info"><span class="slot-unavailable-text">${slotData.text}</span></div>`;
        } else if (slotData.type === 'available') {
            slotContent += `
                <div class="slot-info">
                    <div class="slot-details">
                        <span class="slot-trainer">${slotData.trainer}</span>
                        <span class="slot-location">${slotData.location}</span>
                    </div>
                </div>
            `;
            slot.onclick = function() {
                showBooking('slot', timeString, slotData.trainer, slotData.location);
            };
        } else if (slotData.type === 'group') {
            slotContent += `
                <div class="slot-info">
                    <div class="slot-details">
                        <span class="slot-trainer">${slotData.trainer}</span>
                        <span class="slot-location">${slotData.location}</span>
                    </div>
                    <span class="slot-capacity">${slotData.capacity}</span>
                </div>
            `;
            slot.onclick = function() {
                showBooking('group', timeString, slotData.trainer, slotData.location);
            };
        } else if (slotData.type === 'booked') {
            slotContent += `
                <div class="slot-info">
                    <div class="slot-details">
                        <span class="slot-trainer">${slotData.trainer}</span>
                        <span class="slot-location">${slotData.location}</span>
                        <span class="slot-type">${slotData.lessonType} • ${slotData.duration}</span>
                    </div>
                </div>
            `;
        }
        
        slot.innerHTML = slotContent;
        container.appendChild(slot);
    }
}

// Initialize schedule
function initSchedule() {
    generateCalendar();
    generateScheduleSlots(new Date());
}

// Show booking alert
function showBooking(type, time, trainer, location) {
    let message = '';
    
    if (type === 'slot') {
        message = `Записаться на ${time}?\nТренер: ${trainer}\nМесто: ${location}`;
    } else if (type === 'group') {
        message = `Записаться на групповое занятие ${time}?\nТренер: ${trainer}\nМесто: ${location}`;
    } else if (type === 'camp') {
        message = 'Записаться в зимний лагерь ПИТЕРСКЕЙТКЭМП?\n6-11 января';
    } else if (type === 'enroll') {
        message = 'Записаться в скейткласс?\nМы свяжемся с вами для уточнения деталей.';
    }
    
    // Use Telegram alert if available, otherwise use native alert
    if (window.Telegram && window.Telegram.WebApp) {
        window.Telegram.WebApp.showAlert(message);
    } else {
        alert(message);
    }
}

// Update current date display
function updateCurrentDate() {
    const dateElement = document.getElementById('currentDate');
    if (!dateElement) return;
    
    const now = new Date();
    const days = ['воскресенье', 'понедельник', 'вторник', 'среда', 'четверг', 'пятница', 'суббота'];
    const months = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];
    
    const dayName = days[now.getDay()];
    const date = now.getDate();
    const month = months[now.getMonth()];
    
    dateElement.textContent = `Сегодня ${dayName}, ${date} ${month}`;
}

// Generate QR Code
function generateQRCode() {
    const canvas = document.getElementById('qrCodeCanvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const size = 250;
    canvas.width = size;
    canvas.height = size;
    
    // Generate unique ID for test mode
    const userId = Math.floor(Math.random() * 100000);
    const qrData = `SKATECLASS_USER_${userId}`;
    
    // Simple QR-like pattern (for demo purposes)
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, size, size);
    
    ctx.fillStyle = 'black';
    const moduleSize = size / 25;
    
    // Generate random pattern
    for (let row = 0; row < 25; row++) {
        for (let col = 0; col < 25; col++) {
            if (Math.random() > 0.5) {
                ctx.fillRect(col * moduleSize, row * moduleSize, moduleSize, moduleSize);
            }
        }
    }
    
    // Add corner markers
    const markerSize = moduleSize * 7;
    drawQRMarker(ctx, 0, 0, markerSize);
    drawQRMarker(ctx, size - markerSize, 0, markerSize);
    drawQRMarker(ctx, 0, size - markerSize, markerSize);
}

function drawQRMarker(ctx, x, y, size) {
    ctx.fillStyle = 'black';
    ctx.fillRect(x, y, size, size);
    ctx.fillStyle = 'white';
    ctx.fillRect(x + size / 7, y + size / 7, size * 5 / 7, size * 5 / 7);
    ctx.fillStyle = 'black';
    ctx.fillRect(x + size * 2 / 7, y + size * 2 / 7, size * 3 / 7, size * 3 / 7);
}

// Simulate QR code scan with blue glow effect
function simulateQRScan() {
    // Add blue glow animation to QR code
    const qrContainer = document.getElementById('qrCodeContainer');
    if (qrContainer) {
        qrContainer.style.animation = 'qrGlow 0.6s ease-out';
        setTimeout(() => {
            qrContainer.style.animation = '';
        }, 600);
    }
    
    // Show notification to user
    showNotification('Рады что вы с нами, ждем вас на следующем занятии!');
    
    // Update first upcoming lesson status with new layout
    const firstLesson = document.querySelector('[data-lesson-id="1"]');
    if (firstLesson) {
        const iconElement = firstLesson.querySelector('.lesson-icon');
        if (iconElement) {
            iconElement.innerHTML = `<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="none">
                <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path>
            </svg>`;
            iconElement.classList.remove('clock-icon-animated');
            iconElement.classList.add('thumbs-up-icon-green');
        }
        firstLesson.classList.add('past-lesson');
    }
    
    // Simulate admin notification (in console for demo)
    console.log('Admin notification: Завершено занятие с Пользователь #12345, №1, Индивидуальное');
}

// Show notification
function showNotification(message) {
    if (window.Telegram && window.Telegram.WebApp) {
        window.Telegram.WebApp.showAlert(message);
    } else {
        alert(message);
    }
}

// Close modal when clicking outside
window.addEventListener('click', function(event) {
    const registrationModal = document.getElementById('registration-modal');
    if (event.target === registrationModal) {
        closeRegistrationForm();
    }
});

// Update copyright year
function updateCopyrightYear() {
    const yearElement = document.getElementById('copyrightYear');
    if (!yearElement) return;
    
    const currentYear = new Date().getFullYear();
    yearElement.textContent = `2015 - ${currentYear}`;
}

// Update Live Status Text - NEW FEATURE #1
function updateLiveStatusText() {
    const textElement = document.getElementById('liveStatusText');
    const avatarElement = document.querySelector('.trainer-avatar');
    if (!textElement) return;
    
    const now = new Date();
    const currentHour = now.getHours();
    
    // Check schedule for next 3 hours
    // Based on current time, determine which trainer is available
    
    // Simplified logic: Check if time is within training hours
    if (currentHour >= 10 && currentHour < 14) {
        // Даниэль available in the morning/afternoon
        textElement.textContent = 'сегодня можно позаниматься с Даниэлем. Скейт-парк Вираж в Севкабеле';
        if (avatarElement) {
            avatarElement.src = 'https://static.tildacdn.com/tild3434-3065-4361-a338-376232663732/photo.jpg';
            avatarElement.alt = 'Даниэль';
        }
    } else if (currentHour >= 14 && currentHour < 20) {
        // Павел available in the afternoon/evening
        textElement.textContent = 'сегодня можно позаниматься с Павелем. Скейт-парк Жесть на Московской';
        if (avatarElement) {
            avatarElement.src = 'https://static.tildacdn.com/tild3434-3065-4361-a338-376232663732/photo.jpg';
            avatarElement.alt = 'Павел';
        }
    } else if (currentHour >= 20 && currentHour < 23) {
        // Evening session with Даниэль
        textElement.textContent = 'сегодня можно позаниматься с Даниэлем. Скейт-парк Вираж в Севкабеле';
        if (avatarElement) {
            avatarElement.src = 'https://static.tildacdn.com/tild3434-3065-4361-a338-376232663732/photo.jpg';
            avatarElement.alt = 'Даниэль';
        }
    } else {
        // Default or no trainers available
        textElement.textContent = 'сегодня можно позаниматься с Даниэлем. Скейт-парк Вираж в Севкабеле';
        if (avatarElement) {
            avatarElement.src = 'https://static.tildacdn.com/tild3434-3065-4361-a338-376232663732/photo.jpg';
            avatarElement.alt = 'Даниэль';
        }
    }
}

// Initialize app on load
window.addEventListener('DOMContentLoaded', () => {
    // Set initial page
    navigateTo('home');
    
    // Update live status text
    updateLiveStatusText();
    
    // Update current date
    updateCurrentDate();
    
    // Update copyright year
    updateCopyrightYear();
    
    // Generate QR code
    generateQRCode();
    
    // Update date every minute
    setInterval(updateCurrentDate, 60000);
    
    // Update live status text every 10 minutes
    setInterval(updateLiveStatusText, 600000);
    
    // Setup phone input formatting
    const phoneInput = document.getElementById('phoneInput');
    if (phoneInput) {
        phoneInput.addEventListener('input', function() {
            formatPhoneNumber(this);
        });
    }
    
    // Setup registration form submission
    const registrationForm = document.getElementById('registrationForm');
    if (registrationForm) {
        registrationForm.addEventListener('submit', handleRegistrationSubmit);
    }
});
