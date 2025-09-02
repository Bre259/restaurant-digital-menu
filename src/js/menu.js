// Check if we're on the item detail page
const urlParams = new URLSearchParams(window.location.search);
const itemId = urlParams.get('id');

if (itemId) {
    // We're on the item detail page
    displayItemDetails(itemId);
} else {
    // We're on the main menu page
    loadMenuItems();
}

// Load menu items from JSON file
async function loadMenuItems() {
    try {
        const response = await fetch('menu.json');
        const menuItems = await response.json();
        const menuContainer = document.getElementById('menu-container');
        
        menuItems.forEach(item => {
            const menuItemElement = createMenuItemElement(item);
            menuContainer.appendChild(menuItemElement);
        });
    } catch (error) {
        console.error('Error loading menu items:', error);
    }
}

// Create a menu item element
function createMenuItemElement(item) {
    const menuItem = document.createElement('div');
    menuItem.className = 'menu-item';
    
    // Create a unique URL for this item's QR code
    const itemUrl = `${window.location.origin}${window.location.pathname}?id=${item.id}`;
    
    menuItem.innerHTML = `
        <img src="${item.image}" alt="${item.name}">
        <div class="item-details">
            <h2>${item.name}</h2>
            <p>${item.description}</p>
            <div class="price">$${item.price.toFixed(2)}</div>
            <div class="qr-code-container">
                <div id="qrcode-${item.id}"></div>
            </div>
        </div>
    `;
    
    // Generate QR code after the element is added to the DOM
    setTimeout(() => {
        new QRCode(document.getElementById(`qrcode-${item.id}`), {
            text: itemUrl,
            width: 100,
            height: 100,
            correctLevel: QRCode.CorrectLevel.H
        });
    }, 0);
    
    return menuItem;
}

// Display item details for the QR code scan page
async function displayItemDetails(id) {
    try {
        const response = await fetch('menu.json');
        const menuItems = await response.json();
        const item = menuItems.find(i => i.id === id);
        
        if (item) {
            document.body.innerHTML = `
                <header>
                    <h1>Item Details</h1>
                </header>
                <main>
                    <div class="item-detail-container">
                        <h1>${item.name}</h1>
                        <p class="item-detail-info">${item.description}</p>
                        <p class="item-detail-price">$${item.price.toFixed(2)}</p>
                        <a href="index.html" class="back-link">Back to Menu</a>
                    </div>
                </main>
            `;
        } else {
            document.body.innerHTML = `
                <header>
                    <h1>Item Not Found</h1>
                </header>
                <main>
                    <div class="item-detail-container">
                        <p>Sorry, the item you're looking for doesn't exist.</p>
                        <a href="index.html" class="back-link">Back to Menu</a>
                    </div>
                </main>
            `;
        }
    } catch (error) {
        console.error('Error loading item details:', error);
    }
}