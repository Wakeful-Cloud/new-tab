# New Tab

[![GitHub Continuous Deployment Status](https://img.shields.io/github/actions/workflow/status/wakeful-cloud/new-tab/cd.yml?label=Deployment&style=flat-square)](https://github.com/wakeful-cloud/new-tab/actions/workflows/cd.yml)

A simple browser extension that displays a random image along with bookmarks on the new tab page. Compatible with all Chromium-based browsers (Brave, Chrome, Edge, Opera, Vivaldi, etc.) and Firefox. Built with [Solid](https://solidjs.com), [UnoCSS](https://unocss.dev)/[Tailwind](https://tailwindcss.com), and [Vite](https://vitejs.dev).

![Screenshot 1](screenshots/screenshot-1.jpg)

![Screenshot 2](screenshots/screenshot-2.jpg)

![Screenshot 3](screenshots/screenshot-3.jpg)

## Documentation

### Installation

#### Chromium-based Browsers

1. [Download the `new-tab.crx` file from the latest release](https://github.com/wakeful-cloud/new-tab/releases/latest/download/new-tab.crx)
2. Go to `chrome://extensions` (regardless of which browser you're using)
3. Drag the downloaded `new-tab.crx` file onto the page (it's a little finicky and can take a few attempts to work)
4. Click `Add extension`

#### Firefox

1. [Download the `new-tab.xpi` file from the latest release](https://github.com/wakeful-cloud/new-tab/releases/latest/download/new-tab.xpi)
2. Go to `about:addons`
3. Click the gear icon in the top right corner
4. Select `Install Add-on From File...`
5. Select the downloaded `new-tab.xpi` file
6. Click `Add`

### Development

#### Setup

1. Clone the repository:

```sh
git clone https://github.com/wakeful-cloud/new-tab.git
```

2. Install dependencies:

```sh
npm install
```

3. Start the development server:

```sh
npm run dev
```

4. Build the extension:

```sh
npm run build
```

#### Environment Variables

| Name                       | Description                                                        | Default/Required |
| -------------------------- | ------------------------------------------------------------------ | ---------------- |
| `VITE_PEXELS_API_KEY`      | [API key for Pexels](https://www.pexels.com/api/new/)              | Required         |
| `VITE_UNSPLASH_ACCESS_KEY` | [Access key for Unsplash](https://unsplash.com/oauth/applications) | Required         |
