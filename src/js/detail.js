// Get the item ID from URL parameters
const urlParams = new URLSearchParams(window.location.search);
const itemId = urlParams.get('id');

// Load and display item details
async function loadItemDetails() {
    if (!itemId) {
        document.querySelector('.item-detail-container').innerHTML = `
            <p>Invalid item ID.</p>
            <a href="index.html" class="back-link">Back to Menu</a>
        `;
        return;
    }

    try {
        const response = await fetch('menu.json');
        const menuItems = await response.json();
        const item = menuItems.find(i => i.id === itemId);
        
        if (item) {
            document.getElementById('item-name').textContent = item.name;
            document.getElementById('item-description').textContent = item.description;
            document.getElementById('item-price').textContent = `$${item.price.toFixed(2)}`;
        } else {
            document.querySelector('.item-detail-container').innerHTML = `
                <p>Item not found.</p>
                <a href="index.html" class="back-link">Back to Menu</a>
            `;
        }
    } catch (error) {
        console.error('Error loading item details:', error);
        document.querySelector('.item-detail-container').innerHTML = `
            <p>Error loading item details.</p>
            <a href="index.html" class="back-link">Back to Menu</a>
        `;
    }
}

// Load item details when page loads
document.addEventListener('DOMContentLoaded', loadItemDetails);