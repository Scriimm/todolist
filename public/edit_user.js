document.addEventListener('DOMContentLoaded', function() {
    const userId = new URLSearchParams(window.location.search).get('userId');
    fetchUserData(userId);
    document.getElementById('update-form').addEventListener('submit', function(event) {
        event.preventDefault();
        updateUser(userId);
    });
});

function fetchUserData(userId) {
    const jwtToken = localStorage.getItem('jwt');
    fetch(`/api/users/${userId}`, {
        headers: {
            'Authorization': `Bearer ${jwtToken}`
        }
    })
    .then(response => response.json())
    .then(user => {
        document.getElementById('username').value = user.username;
        document.getElementById('email').value = user.email;
    })
    .catch(error => console.error('Failed to fetch user data:', error));
}

function updateUser(userId) {
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const jwtToken = localStorage.getItem('jwt');

    
    fetch(`/api/users/update/${userId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${jwtToken}`
        },
        body: JSON.stringify({ username, email })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        alert(data.message);
        window.location.href = 'admin.html';  // Redirect back to admin page
    })
    .catch(error => {
        console.error('Failed to update user:', error);
        alert('Failed to update user: ' + error.message);
    });
}

