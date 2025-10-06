# Restaurant Digital Menu

A simple restaurant menu application that displays food items with their prices and pictures. Each menu item has a QR code that, when scanned, displays the name and price of the food item.

## Features

- Display menu items with images, names, and prices
- Generate scannable QR codes for each menu item
- Mobile-responsive design for easy viewing on any device
- Simple and intuitive user interface
- Bilingual support (English and Arabic)
- Category filtering (Lunch, Breakfast, Dinner, Drinks)
- Currency selection (USD and YER)
- Admin functionality to add, edit, and delete menu items

## Technology Stack

- **Frontend**: HTML, CSS, JavaScript
- **QR Code Generation**: [qrcode.js](https://github.com/davidshimjs/qrcodejs) library
- **Data Storage**: JSON file and localStorage

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

## Deployment

### Deploying to Netlify

1. Sign up for a free account at [Netlify](https://netlify.com)
2. Install the Netlify CLI: `npm install -g netlify-cli`
3. Login to Netlify: `netlify login`
4. Initialize your project: `netlify init`
5. Deploy your site: `netlify deploy --prod`

Alternatively, you can deploy by:

1. Going to [Netlify](https://netlify.com)
2. Clicking "New site from Git"
3. Connecting your Git repository (GitHub, GitLab, or Bitbucket)
4. Selecting your repository
5. Setting the build settings:
   - Build command: (Leave empty for static sites)
   - Publish directory: `src`
6. Clicking "Deploy site"

### Local Development

To run the application locally:

1. Navigate to the project directory
2. Run `node server.js`
3. Open your browser to `http://localhost:3000`

## Browser Compatibility

This application uses modern JavaScript features and should work in all modern browsers (Chrome, Firefox, Safari, Edge).

## License

This project is open source and available under the MIT License.
