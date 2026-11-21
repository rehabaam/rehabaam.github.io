# Ahmad Samra — personal website

Single-page site served by GitHub Pages at https://rehabaam.github.io.

The design is laid out like a physics paper. The header is an interactive spacetime grid: the cursor acts as a point mass that bends the grid, and test particles fall around it.

- `index.html`: the page content
- `assets/css/site.css`: styles, with light and dark themes defined as CSS custom properties
- `assets/js/spacetime.js`: the canvas animation and the theme toggle (no dependencies)

To preview locally:

```bash
python3 -m http.server 8000
```
