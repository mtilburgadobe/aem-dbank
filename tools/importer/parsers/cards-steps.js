/* eslint-disable */
/* global WebImporter */

/**
 * Parser for cards-steps variant.
 * Base block: cards
 * Source: https://www.deutsche-bank.de/pk/sparen-und-anlegen/geldanlage-online/depot.html
 * Selector: .contentsnippetlist
 * Generated: 2026-05-20
 *
 * Source structure:
 *   .contentsnippetlist > .contentsnippetlist__content-container > .contentsnippetlist__content > ol > li
 *     Each li contains:
 *       - .contentsnippet__icon-container > figure > img (numbered step icon SVG)
 *       - .contentsnippet__content-container > header > h3.contentsnippet__headline (heading)
 *       - .contentsnippet__content-container > .contentsnippet__body > p (description)
 *
 * Target structure (cards block):
 *   One row per card: [icon image] | [heading + description]
 */
export default function parse(element, { document }) {
  // Select all list items (each represents a step card)
  const items = element.querySelectorAll('ol > li, .contentsnippetlist__ordered-list > li');

  const cells = [];

  items.forEach((item) => {
    // Extract the icon image - look within the section/snippet structure
    const snippet = item.querySelector('.contentsnippet, section');
    const iconContainer = snippet
      ? snippet.querySelector('.contentsnippet__icon-container, .contentsnippet__icon-wrapper')
      : item.querySelector('.contentsnippet__icon-container, .contentsnippet__icon-wrapper');
    const icon = iconContainer
      ? iconContainer.querySelector('img')
      : item.querySelector('figure img, .contentsnippet__icon-container img');

    // Extract the heading
    const heading = item.querySelector('.contentsnippet__headline, h3, h4');

    // Extract the body/description paragraph(s)
    const bodyEl = item.querySelector('.contentsnippet__body');
    const bodyContent = bodyEl || item.querySelector('.contentsnippet__content-container p');

    // Build image cell - the icon for this step
    const imageCell = [];
    if (icon) {
      imageCell.push(icon);
    }

    // Build body cell - heading + description
    const bodyCell = [];
    if (heading) {
      bodyCell.push(heading);
    }
    if (bodyContent) {
      bodyCell.push(bodyContent);
    }

    // Each row is an array of cells: [imageCell, bodyCell]
    cells.push([imageCell, bodyCell]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-steps', cells });
  element.replaceWith(block);
}
