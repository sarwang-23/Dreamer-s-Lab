# Building Dreams frontend

Run `npm install` once, then `npm run dev`. Use `npm run build` for production
and `npm run preview` to serve the build.

## Shared footer

`footer.js` owns the footer markup, artwork, navigation and social configuration.
`footer.css` contains its scoped styles. The footer uses the existing Outfit and
a locally hosted Instrument Serif, aliased as `BD Editorial` so other sections'
typography is unchanged. Its SIL license is in `assets/fonts/instrument-serif`.
`main.js` is the shared entry point for the footer and existing
page interactions; Vite bundles all of them for production.

Include `main.js` once per page/layout. Place `<div data-site-footer></div>` after
the page content to choose the footer's position. Without a host it mounts at the
end of the document body. Calling `mountFooter()` again returns the existing
footer, so nested layouts cannot add a second instance.

The journey artwork and closing signature have finite, viewport-triggered CSS
animations. Content is visible without animation support, and reduced motion is
respected. Back to top smoothly scrolls the current page (including nested pages),
returns keyboard focus to the top, and uses instant scrolling for reduced motion.

This checkout currently contains only `index.html`, with section navigation.
There are no separate About, Stories, Parents, Contact, legal or program pages.
The footer uses these existing destinations rather than inventing routes:

| Footer item | Existing destination |
| --- | --- |
| Dreamers Lab | `#dreamers-lab` |
| Student Entrepreneurs, Founders | `#program-founder` (FounderLab) |
| University Programs, Universities | `#program-venture` (VentureLab) |
| Students | `#journey` |
| Parents, FAQs | `#faq` |
| Our Story | `#approach` |
| Mentors, Community | `#network` |
| Contact | `#talk-to-us` (existing closing CTA) |

Links use Vite's base URL so they also resolve back to the homepage from future
nested pages. Add the shared entry point to any future main or legal layout.

No official social URLs were configured in the project. LinkedIn, Instagram and
YouTube therefore render as non-interactive labels. Set verified HTTPS URLs in
`SOCIAL_LINKS` in `footer.js` to activate them; configured links open in a new tab
with `noopener noreferrer` and accessible labels.
