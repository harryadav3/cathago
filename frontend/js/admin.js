document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('token');
    if (!token) return window.location.href = 'login.html';

    const res = await fetch('http://localhost:3000/admin/analytics', {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await res.json();
    if (!data.totalScans) return window.location.href = 'login.html';

    document.getElementById('totalScans').textContent = data.totalScans;
    document.getElementById('topUser').textContent = data.topUser;

    const requestsRes = await fetch('http://localhost:3000/admin/requests', {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    const requests = await requestsRes.json();
    const requestsList = document.getElementById('requests');
    requests.forEach(req => {
        const li = document.createElement('li');
        li.textContent = `${req.username} requests credits`;
        const approveBtn = document.createElement('button');
        approveBtn.textContent = 'Approve';
        approveBtn.onclick = () => approveRequest(req.id);
        li.appendChild(approveBtn);
        requestsList.appendChild(li);
    });

    document.getElementById('logout').addEventListener('click', () => {
        localStorage.removeItem('token');
        window.location.href = 'index.html';
    });
});

async function approveRequest(requestId) {
    const token = localStorage.getItem('token');
    const res = await fetch(`http://localhost:3000/admin/credits/approve/${requestId}`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await res.json();
    alert(data.message || 'Request approved');
    window.location.reload();
}