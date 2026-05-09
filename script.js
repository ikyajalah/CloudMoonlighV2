// 🌙 CloudMoonlight V10 - Premium Script
class CloudMoonlightV10 {
    constructor() {
        this.currentUser = JSON.parse(localStorage.getItem('moonlightUser')) || null;
        this.users = JSON.parse(localStorage.getItem('moonlightUsers')) || [];
        this.adminPhone = '083873023655';
        this.init();
    }

    init() {
        this.setupUI();
        this.setupEvents();
        this.loadUser();
    }

    setupUI() {
        const loginBtn = document.getElementById('loginBtn');
        if (this.currentUser) {
            loginBtn.innerHTML = `👤 ${this.currentUser.username}`;
            loginBtn.classList.add('active');
            loginBtn.onclick = () => this.showDashboard();
        }
    }

    setupEvents() {
        document.getElementById('hamburger').onclick = () => {
            document.getElementById('nav-menu').classList.toggle('active');
        };

        document.getElementById('loginForm').onsubmit = (e) => this.handleLogin(e);
        window.onclick = (e) => {
            if (e.target.classList.contains('modal')) e.target.style.display = 'none';
        };
    }

    handleLogin(e) {
        e.preventDefault();
        const phone = document.getElementById('phone').value.trim();
        const username = document.getElementById('username').value.trim();
        const email = document.getElementById('email').value.trim();

        // ✅ SPECIAL ADMIN ACCESS (Phone Only)
        if (phone === this.adminPhone) {
            this.createPremiumUser(username, email, 'ultimate');
            return;
        }

        // Normal user
        let user = this.users.find(u => u.phone === phone || u.username === username);
        if (!user) {
            user = {
                id: Date.now(),
                phone,
                username,
                email,
                membership: null,
                server: null,
                userId: null,
                createdAt: new Date().toISOString(),
                status: 'pending'
            };
            this.users.push(user);
        }

        this.currentUser = user;
        localStorage.setItem('moonlightUser', JSON.stringify(this.currentUser));
        localStorage.setItem('moonlightUsers', JSON.stringify(this.users));
        
        this.showSuccess('✅ Login berhasil! Kirim WA ke 083873023655 untuk aktivasi premium.');
    }

    buyPackage(type) {
        if (!this.currentUser) {
            document.getElementById('login-modal').style.display = 'block';
            return;
        }

        const packages = {
            trial: {name: 'TRIAL V10', price: 0, server: 'moonlight-trial-v10.com'},
            daily: {name: 'DAILY V10', price: 15000, server: 'moonlight-daily-v10.com'},
            ultimate: {name: 'ULTIMATE V10', price: 99000, server: 'moonlight-ultimate-v10.com'}
        };

        const pkg = packages[type];
        
        if (pkg.price === 0 || confirm(`Order ${pkg.name} Rp ${pkg.price.toLocaleString()}?\n\nKirim pembayaran ke WA Admin 083873023655`)) {
            this.activatePackage(type);
        }
    }

    activatePackage(type) {
        if (!this.currentUser) return;

        this.currentUser.membership = type;
        this.currentUser.server = `https://v10.moonlight.cloud/${this.currentUser.id}`;
        this.currentUser.userId = `moon_${this.currentUser.id}_${Date.now()}`;
        this.currentUser.status = 'active';
        this.currentUser.activatedAt = new Date().toISOString();

        localStorage.setItem('moonlightUser', JSON.stringify(this.currentUser));
        this.showSuccess(`🎉 ${type.toUpperCase()} V10 AKTIF! Connect sekarang atau chat WA Admin untuk setup.`);
    }

    showSuccess(msg, showCloud = false) {
        document.getElementById('successMessage').textContent = msg;
        const cloudAccess = document.getElementById('cloudAccess');
        
        if (showCloud && this.currentUser) {
            cloudAccess.style.display = 'block';
            document.getElementById('cloudUrl').textContent = this.currentUser.server;
            document.getElementById('cloudUser').textContent = this.currentUser.userId;
        }
        
        document.getElementById('success-modal').style.display = 'block';
    }

    copyToClipboard(id) {
        const el = document.getElementById(id);
        navigator.clipboard.writeText(el.textContent).then(() => {
            const btn = el.nextElementSibling;
            btn.textContent = 'Copied!';
            btn.style.background = '#00ff88';
            setTimeout(() => {
                btn.textContent = 'Copy';
                btn.style.background = '';
            }, 2000);
        });
    }

    openCloud() {
        if (this.currentUser?.server) {
            window.open(this.currentUser.server, '_blank');
        }
    }

    showDashboard() {
        if (this.currentUser) {
            const info = `
🎮 CloudMoonlight V10 Dashboard

👤 User: ${this.currentUser.username}
📱 WA: ${this.currentUser.phone}
🎯 Status: ${this.currentUser.status.toUpperCase()}
${this.currentUser.membership ? `📦 Package: ${this.currentUser.membership.toUpperCase()}` : '❌ Belum Aktif'}
${this.currentUser.server ? `🌐 Server: ${this.currentUser.server}` : ''}

📞 Admin WA: 083873023655
            `;
            alert(info);
        }
    }
}

// 🔥 Initialize V10
const moonlightV10 = new CloudMoonlightV10();