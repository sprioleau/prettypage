![Social Card][social-card-url]

![Vercel Status](https://img.shields.io/github/deployments/sprioleau/prettypage/production?label=vercel&logo=vercel&style=for-the-badge)

# Pretty Page

Take pixel-perfect screenshots of any website. This project employs serverless functions to handle creating a customizable webpage screenshot. It uses a headless browser to take a screenshot and composites it with custom graphics and a user-selected background color.

## 🔗 Links

- 🚀 Deployed at [prettypage.vercel.app][deployed-url]

## Screenshots

![Homepage Screenshot][homepage-screenshot-url] 

![Color Page Screenshot][success-page-screenshot-url] 

_Screenshots via [Pretty Page](https://prettypage.vercel.app/)_

## 💿 Installation

Clone this repo

```bash
git clone https://github.com/sprioleau/prettypage.git
```

Install via yarn

```bash
yarn install
```

Run developemnt server

```bash
yarn dev
```

<details>
<summary>Dealing with common install error</summary>

If you see the following error, you'll need to install a version of Chromium for the app to use. 

>_Error: Could not find expected browser (chrome) locally. Run `npm install` to download the correct Chromium revision (884014)._

To resolve, make sure you've run `yarn install` and run:

```bash
node node_modules/puppeteer-core/install.js
```

You should see something like: 

```bash
Downloading Chromium r884014 - 113.6 Mb [==============      ] 71% 3.1s 
```

Then, re-run `yarn dev` to start the dev server.
</details>

## 🛠 Built With

| Technology            | Used For                            |
| :-------------------- | :--------------------------------   |
| JavaScript            | -                                   |
| Next.js               | Static site generation              |
| Puppeteer             | Controlling headless Chrome browser |
| Chrome AWS Lambda     | Chrome binary                       |
| Sharp                 | Image processing                    |
| Chakra UI             | 😍 UI Framework for React           |

## ✨ Features
- [x] Takes website screenshots with headless browser
- [x] Waits for idle network before screenshot capture
- [x] Custom-designed browser window mock-ups by resolution
- [x] Dark mode toggle

## ⬆️ Future Updates

- [ ] Retry screenshot on timeout
- [x] Add some example sites for quick app demos
- [x] Capture another screenshot from success page

## 👨🏾‍💻 Author

**San'Quan Prioleau**

- [Profile][github-url]
- [Website][website]
- [LinkedIn][linkedin]

## 🎗 Support

Issues, and feature requests are welcome!

Give a ⭐️ if you like this project!

## Acknowledgements

- Inspired by [screen.guru](https://screen.guru)

<!-- Author Details -->
[github-url]: https://github.com/spriolau "San'Quan Prioleau on Github"
[website]: https://sprioleau.dev "San'Quan Prioleau's personal website"
[linkedin]: https://www.linkedin.com/in/sanquanprioleau/
[headshot_url]: https://avatars.githubusercontent.com/u/49278940?v=4 "San'Quan Prioleau headshot"

<!-- Project Details -->
[deployed-url]: https://prettypage.vercel.app
[social-card-url]: https://prettypage.vercel.app/images/pretty-page-social-card.png "Social Card"
[homepage-screenshot-url]: https://prettypage.vercel.app/images/screenshots/homepage.png "Homepage Screenshot"
[success-page-screenshot-url]: https://prettypage.vercel.app/images/screenshots/success-page.gif "Success Page GIF"
