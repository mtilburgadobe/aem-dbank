/* eslint-disable */
/* global WebImporter */

/**
 * Parser for columns-promo
 * Base block: columns
 * Source: https://www.deutsche-bank.de/pk/sparen-und-anlegen/geldanlage-online/depot.html
 * Selectors: #happy-hour .colctrl__30-60, #parsys-columncontrol_487523-columnControlCol2Parsys-columncontrol_copy .colctrl__30-60
 * Generated: 2026-05-20
 *
 * Structure: Two-column promotional layout (30/60 split)
 *   Column 1 (image): Large promotional image, optionally linked
 *   Column 2 (content): Heading + benefit list + CTA button
 */
export default function parse(element, { document }) {
  // --- Column 1: Image extraction ---
  // Source has .colctrl__alpha containing an image (possibly wrapped in a link)
  const alphaCol = element.querySelector(':scope > .colctrl__alpha');
  const imageEl = element.querySelector('.colctrl__alpha img.image__img, .colctrl__alpha img');
  const imageLink = element.querySelector('.colctrl__alpha a.image__link, .colctrl__alpha a');

  const imageCell = [];
  if (imageEl) {
    // If image is wrapped in a link, preserve the link with the image inside
    if (imageLink && imageLink.contains(imageEl)) {
      const link = document.createElement('a');
      link.href = imageLink.href || imageLink.getAttribute('href');
      const img = document.createElement('img');
      img.src = imageEl.src || imageEl.getAttribute('src');
      if (imageEl.alt) img.alt = imageEl.alt;
      link.appendChild(img);
      imageCell.push(link);
    } else {
      const img = document.createElement('img');
      img.src = imageEl.src || imageEl.getAttribute('src');
      if (imageEl.alt) img.alt = imageEl.alt;
      imageCell.push(img);
    }
  }

  // --- Column 2: Content extraction ---
  // Source has .colctrl__beta containing heading, list, and CTA
  const betaCol = element.querySelector(':scope > .colctrl__beta');
  const contentCell = [];

  if (betaCol) {
    // Extract heading (h2, h3, or h4)
    const heading = betaCol.querySelector('h2, h3, h4');
    if (heading) {
      const h = document.createElement(heading.tagName.toLowerCase());
      h.textContent = heading.textContent.trim();
      contentCell.push(h);
    }

    // Extract list (ul or ol with benefits/features)
    const list = betaCol.querySelector('ul, ol');
    if (list) {
      const newList = document.createElement(list.tagName.toLowerCase());
      const items = list.querySelectorAll('li');
      items.forEach((li) => {
        const newLi = document.createElement('li');
        newLi.textContent = li.textContent.trim();
        newList.appendChild(newLi);
      });
      contentCell.push(newList);
    }

    // Extract paragraphs (if any, as alternative to list)
    if (!list) {
      const paragraphs = betaCol.querySelectorAll('section p, .text p');
      paragraphs.forEach((p) => {
        const newP = document.createElement('p');
        newP.textContent = p.textContent.trim();
        if (newP.textContent) contentCell.push(newP);
      });
    }

    // Extract CTA button(s)
    const ctaLinks = betaCol.querySelectorAll('.calltoaction a, a.btn, a.button');
    ctaLinks.forEach((cta) => {
      const link = document.createElement('a');
      link.href = cta.href || cta.getAttribute('href');
      link.textContent = (cta.querySelector('.btn-value') || cta).textContent.trim();
      if (cta.title) link.title = cta.title;
      const p = document.createElement('p');
      const strong = document.createElement('strong');
      strong.appendChild(link);
      p.appendChild(strong);
      contentCell.push(p);
    });
  }

  // Build cells: single row with two columns [image, content]
  const cells = [
    [imageCell, contentCell],
  ];

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-promo', cells });
  element.replaceWith(block);
}
