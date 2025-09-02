# Restaurant Digital Menu

A simple restaurant menu application that displays food items with their prices and pictures. Each menu item has a QR code that, when scanned, displays the name and price of the food item.

## Features

- Display menu items with images, names, and prices
- Generate scannable QR codes for each menu item
- Mobile-responsive design for easy viewing on any device
- Simple and intuitive user interface

## Technology Stack

- **Frontend**: HTML, CSS, JavaScript
- **QR Code Generation**: [qrcode.js](https://github.com/davidshimjs/qrcodejs) library
- **Data Storage**: JSON file

## Project Structure

```
src/
├── index.html          # Main menu page
├── detail.html         # Item detail page
├── menu.json           # Menu data
├── css/
│   └── style.css       # Styling
├── js/
│   ├── menu.js         # Main menu functionality
│   └── detail.js       # Item detail functionality
└── images/             # Food images
```

## How to Use

1. Open `src/index.html` in a web browser to view the menu
2. Each menu item displays:
   - Food image
   - Item name
   - Price
   - QR code
3. Scan the QR code with a mobile device to view item details
4. The QR code will redirect to a detail page showing the item name and price

## Customization

To add or modify menu items:
1. Edit `src/menu.json` to add or change menu items
2. Add corresponding images to the `src/images/` directory
3. Update the image paths in the JSON file

## QR Code Functionality

Each menu item has a unique QR code that encodes a URL pointing to the item details page with the item ID as a parameter:
`detail.html?id={itemId}`

When scanned, the QR code will lead to a page displaying:
- Item name
- Item price
- Item description

## Browser Compatibility

This application uses modern JavaScript features and should work in all modern browsers (Chrome, Firefox, Safari, Edge).

## License

This project is open source and available under the MIT License.