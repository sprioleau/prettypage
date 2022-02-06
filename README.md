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
- [ ] Add some example sites for quick app demos
- [ ] Capture another screenshot from success page

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
