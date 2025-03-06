document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('token');
    if (!token) return window.location.href = 'login.html';

    const res = await fetch('http://localhost:3000/user/profile', {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await res.json();
    if (!data.username) return window.location.href = 'login.html';

    document.getElementById('username').textContent = data.username;
    document.getElementById('credits').textContent = data.credits;

    if (document.getElementById('scans')) {
        const scansList = document.getElementById('scans');
        data.scans.forEach(scan => {
            const li = document.createElement('li');
            li.textContent = `Doc ID: ${scan.id} - ${scan.filename}`;
            scansList.appendChild(li);
        });
    }

    document.getElementById('logout').addEventListener('click', () => {
        localStorage.removeItem('token');
        window.location.href = 'index.html';
    });
});

async function requestCredits() {
    const token = localStorage.getItem('token');
    const res = await fetch('http://localhost:3000/credits/request', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await res.json();
    alert(data.message || 'Credit request sent!');
}