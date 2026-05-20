/* eslint-disable */
/* global WebImporter */

/**
 * Parser for cards-article variant.
 * Base block: cards
 * Source: https://corporates.db.com/
 * Selectors: .cms-row.row-index-11 .cnt-generic.type-3 .mod-text-box.type-default,
 *            .cms-row.row-index-16 .cnt-generic.type-3 .mod-text-box
 * Generated: 2026-05-20
 *
 * Source structure per card (.mod-text-box):
 *   .media > a.img > figure.image-wrapper > img
 *   .content-wrapper > h3 (overline/category)
 *   .content-wrapper > .content > h2 > a (main heading with link)
 *   .content-wrapper > .content > p.text (description)
 *   .content-wrapper > .content > a.button (CTA)
 *
 * Target: Standard cards block - each row = one card with [image] | [body content]
 */
export default function parse(element, { document }) {
  // The element is the container (cnt-generic.type-3) holding multiple card items
  // Each card is a .mod-text-box section
  const cardItems = element.querySelectorAll(':scope .mod-text-box, :scope.mod-text-box');

  // If no card items found at nested level, the element itself might be a single card
  const items = cardItems.length > 0 ? cardItems : [element];

  const cells = [];

  items.forEach((card) => {
    // Extract image
    const img = card.querySelector('.media img, .image-wrapper img, figure img');

    // Extract overline/category (h3 above the main content)
    const overline = card.querySelector('.content-wrapper > h3, .content-wrapper h3');

    // Extract main heading (h2 with link inside .content)
    const heading = card.querySelector('.content h2, .content-wrapper .content h2');

    // Extract description text
    const description = card.querySelector('.content p.text, .content p');

    // Extract CTA button link
    const ctaButton = card.querySelector('.content a.button, .content a.type-primary');

    // Build the image cell
    const imageCell = [];
    if (img) {
      const picture = document.createElement('picture');
      const imgEl = document.createElement('img');
      imgEl.src = img.src;
      imgEl.alt = img.alt || '';
      picture.appendChild(imgEl);
      imageCell.push(picture);
    }

    // Build the body cell with all text content
    const bodyCell = [];

    if (overline) {
      const overlineEl = document.createElement('p');
      overlineEl.textContent = overline.textContent.trim();
      bodyCell.push(overlineEl);
    }

    if (heading) {
      // Preserve the heading with its link
      const h2 = document.createElement('h2');
      const link = heading.querySelector('a');
      if (link) {
        const a = document.createElement('a');
        a.href = link.href;
        // Get visible text (exclude hidden-title spans)
        const visibleText = Array.from(link.childNodes)
          .filter((node) => !(node.nodeType === 1 && node.classList && node.classList.contains('hidden-title')))
          .map((node) => node.textContent.trim())
          .filter(Boolean)
          .join(' ');
        a.textContent = visibleText || link.textContent.trim();
        h2.appendChild(a);
      } else {
        h2.textContent = heading.textContent.trim();
      }
      bodyCell.push(h2);
    }

    if (description) {
      const p = document.createElement('p');
      p.textContent = description.textContent.trim();
      bodyCell.push(p);
    }

    if (ctaButton) {
      const a = document.createElement('a');
      a.href = ctaButton.href;
      // Get visible text excluding hidden-title
      const visibleText = Array.from(ctaButton.childNodes)
        .filter((node) => !(node.nodeType === 1 && node.classList && node.classList.contains('hidden-title')))
        .map((node) => node.textContent.trim())
        .filter(Boolean)
        .join(' ');
      a.textContent = visibleText || ctaButton.textContent.trim();
      const p = document.createElement('p');
      p.appendChild(a);
      bodyCell.push(p);
    }

    // Each card is a row with [image, body]
    if (imageCell.length > 0 || bodyCell.length > 0) {
      cells.push([imageCell.length > 0 ? imageCell : '', bodyCell.length > 0 ? bodyCell : '']);
    }
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-article', cells });
  element.replaceWith(block);
}
