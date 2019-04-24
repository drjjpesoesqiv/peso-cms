# peso-cms
Peso is a CMS that stores it's pages as mongo documents.  The editor has multiple CodeMirror panels, each representing a section of the final HTML document: HTML, CSS, Javascript, JSON.  Each document can be pulled over an Express rest API.

```
/:page
```
pulls a compiled HTML document

```
/:page/:format
```
pulls a specific section of the HTML document. `/worldclock/css` would pull the CSS for the document worldclock.

![screenshot](https://res.cloudinary.com/hl2vrcvpj/image/upload/v1556130081/peso-cms/Capture.jpg)
![screenshot](https://res.cloudinary.com/hl2vrcvpj/image/upload/v1556130081/peso-cms/Capture2.jpg)
