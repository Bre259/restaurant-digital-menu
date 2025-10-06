# Deployment Guide

## Deploying to Netlify

This guide will walk you through deploying your Restaurant Digital Menu to Netlify.

### Prerequisites

1. A GitHub, GitLab, or Bitbucket account
2. This project repository pushed to your Git provider

### Method 1: Deploy with Git (Recommended)

1. **Push your code to a Git repository**

   - Create a new repository on GitHub, GitLab, or Bitbucket
   - Push your local code to the remote repository:
     ```bash
     git init
     git add .
     git commit -m "Initial commit"
     git remote add origin [your-repository-url]
     git push -u origin main
     ```

2. **Connect Netlify to your repository**

   - Go to [Netlify](https://netlify.com) and sign up or log in
   - Click "New site from Git"
   - Connect your Git provider (GitHub, GitLab, or Bitbucket)
   - Select your repository

3. **Configure build settings**

   - Leave the "Build command" empty (this is a static site)
   - Set the "Publish directory" to `src`
   - The configuration should look like:
     ```
     Build command: (Leave empty)
     Publish directory: src
     ```

4. **Deploy**
   - Click "Deploy site"
   - Netlify will build and deploy your site
   - You'll get a unique Netlify URL (e.g., `your-site-name.netlify.app`)

### Method 2: Deploy via Drag and Drop

1. **Prepare your files**

   - Make sure all your files are in the `src` directory
   - This should include:
     - `index.html`
     - `detail.html`
     - `menu.json`
     - `css/style.css`
     - `js/menu.js`
     - `js/detail.js`
     - `images/` directory (if you have images)

2. **Deploy**
   - Go to [Netlify](https://netlify.com)
   - Simply drag and drop the `src` folder onto the deployment area
   - Netlify will automatically deploy your site

### Method 3: Deploy using Netlify CLI

1. **Install Netlify CLI**

   ```bash
   npm install -g netlify-cli
   ```

2. **Login to Netlify**

   ```bash
   netlify login
   ```

3. **Initialize your project**

   ```bash
   netlify init
   ```

4. **Deploy**
   ```bash
   netlify deploy --prod
   ```
   - When prompted for the publish directory, enter `src`

### Custom Domain (Optional)

1. After deployment, go to your site settings in Netlify
2. Click on "Domain management"
3. Click "Add custom domain"
4. Follow the instructions to configure your domain

### Updating Your Site

To update your deployed site:

1. Make changes to your local files
2. Commit and push to your Git repository
3. If you used Method 1, Netlify will automatically rebuild and deploy
4. If you used Method 2, repeat the drag and drop process
5. If you used Method 3, run `netlify deploy --prod` again

## Troubleshooting

### Common Issues

1. **Images not loading**

   - Make sure all image paths in `menu.json` are correct
   - Ensure images are in the `src/images/` directory

2. **QR codes not working**

   - Check that the qrcode.js library is properly loaded
   - Verify that the CDN link is not blocked

3. **Menu items not saving**
   - The application uses localStorage for data persistence
   - Make sure your browser supports localStorage
   - Note that data is stored per-browser and per-device

### Need Help?

If you encounter any issues during deployment, check:

- Netlify's documentation: https://docs.netlify.com/
- This project's README.md for usage instructions
- Browser console for any JavaScript errors
