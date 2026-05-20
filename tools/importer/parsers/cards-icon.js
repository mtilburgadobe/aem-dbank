/* eslint-disable */
/* global WebImporter */

/**
 * Parser for cards-icon variant.
 * Base block: cards
 * Source: https://www.deutsche-bank.de/pk/sparen-und-anlegen/geldanlage-online/depot.html
 * Generated: 2026-05-20
 *
 * Extracts icon cards from a 4-column layout where each column contains
 * an SVG icon and a heading. Each card becomes a row with [icon, heading].
 */
export default function parse(element, { document }) {
  // Each column in the grid contains a contentsnippet with icon + heading
  const snippets = element.querySelectorAll('section.contentsnippet, .contentsnippet-wrapper section');

  const cells = [];

  snippets.forEach((snippet) => {
    // Extract icon image - may be an img with data URI src, or an SVG element
    let iconEl = snippet.querySelector('.contentsnippet__icon-container img, .contentsnippet__icon-wrapper img, figure img');

    // If no img found, check for inline SVG and create an img placeholder
    if (!iconEl) {
      const svg = snippet.querySelector('.contentsnippet__icon-container svg, .contentsnippet__icon-wrapper svg, figure svg');
      if (svg) {
        // Serialize SVG to a data URI img so it persists through import
        const svgString = new XMLSerializer().serializeToString(svg);
        iconEl = document.createElement('img');
        iconEl.src = `data:image/svg+xml;base64,${btoa(svgString)}`;
        iconEl.alt = '';
      }
    }

    // If icon img has a data:image src, ensure it's preserved by cloning
    if (iconEl && iconEl.src && iconEl.src.startsWith('data:')) {
      const img = document.createElement('img');
      img.src = iconEl.src;
      img.alt = iconEl.alt || '';
      iconEl = img;
    }

    // Extract heading from the content container
    const heading = snippet.querySelector('.contentsnippet__headline, .contentsnippet__content-container h3, .contentsnippet__content-container h2');

    // Build row: [icon cell, body cell]
    const iconCell = [];
    if (iconEl) {
      iconCell.push(iconEl);
    }

    const bodyCell = [];
    if (heading) {
      bodyCell.push(heading);
    }

    // Only add the row if we have meaningful content
    if (iconCell.length > 0 || bodyCell.length > 0) {
      cells.push([iconCell, bodyCell]);
    }
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-icon', cells });
  element.replaceWith(block);
}
