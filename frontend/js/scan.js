document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    if (!token) return window.location.href = 'login.html';

    document.getElementById('scanForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const fileInput = document.getElementById('file');
        const formData = new FormData();
        formData.append('file', fileInput.files[0]);

        const res = await fetch('http://localhost:3000/scan', {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}` },
            body: formData
        });
        const data = await res.json();
        if (data.docId) {
            const matchesRes = await fetch(`http://localhost:3000/matches/${data.docId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const matches = await matchesRes.json();
            const matchesList = document.getElementById('matches');
            matchesList.innerHTML = '';
            matches.forEach(match => {
                const li = document.createElement('li');
                li.textContent = `Match: ${match.filename} (Similarity: ${match.similarity}%)`;
                matchesList.appendChild(li);
            });
        } else {
            alert(data.message || 'Scan failed');
        }
    });
});