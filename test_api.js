
(async () => {
    try {
        const res = await fetch('http://localhost:3000/api/newsletters');
        if (!res.ok) {
            throw new Error(`Status: ${res.status} ${res.statusText}`);
        }
        const data = await res.json();
        console.log('Success:', data);
    } catch (error) {
        console.error('Fetch failed:', error);
    }
})();
