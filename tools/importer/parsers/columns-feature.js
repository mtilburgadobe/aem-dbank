/* eslint-disable */
/* global WebImporter */

/**
 * Parser for columns-feature
 * Base block: columns
 * Source: https://www.deutsche-bank.de/pk/sparen-und-anlegen/geldanlage-online/depot.html
 * Selectors: .colctrl__50-50 (within specific parent containers)
 * Structure: 50-50 two-column layout with text on one side and image on the other.
 * Handles both normal and reversed (colctrl--reverse) column order.
 * Generated: 2026-05-20
 */
export default function parse(element, { document }) {
  // The source element is a .colctrl__50-50 container with two columns:
  // .colctrl__alpha and .colctrl__beta
  // In reversed layout (colctrl--reverse), the visual order is swapped
  const alphaCol = element.querySelector(':scope > .colctrl__alpha .colctrl__wrapper');
  const betaCol = element.querySelector(':scope > .colctrl__beta .colctrl__wrapper');

  // Detect which column has the image and which has the text
  // by checking content type rather than assuming position
  const alphaHasImage = alphaCol && alphaCol.querySelector('picture, img') && !alphaCol.querySelector('h2, h3, h4');
  const betaHasImage = betaCol && betaCol.querySelector('picture, img') && !betaCol.querySelector('h2, h3, h4');

  let textCol;
  let imageCol;

  if (alphaHasImage) {
    imageCol = alphaCol;
    textCol = betaCol;
  } else if (betaHasImage) {
    imageCol = betaCol;
    textCol = alphaCol;
  } else {
    // Fallback: alpha is text, beta is image (or both are text)
    textCol = alphaCol;
    imageCol = betaCol;
  }

  // Build content for the text column
  const textContent = [];
  if (textCol) {
    // Extract heading (h3, h2, h4 as fallback)
    const heading = textCol.querySelector('h3, h2, h4, [class*="heading"]');
    if (heading) textContent.push(heading);

    // Extract paragraph text
    const paragraphs = textCol.querySelectorAll('p');
    paragraphs.forEach((p) => {
      if (p.textContent.trim()) textContent.push(p);
    });

    // Extract any CTA links if present (handles variation)
    const links = textCol.querySelectorAll('a.btn, a.button, a[class*="cta"]');
    links.forEach((link) => textContent.push(link));
  }

  // Build content for the image column
  const imageContent = [];
  if (imageCol) {
    const picture = imageCol.querySelector('picture');
    const img = imageCol.querySelector('img');
    if (picture) {
      imageContent.push(picture);
    } else if (img) {
      imageContent.push(img);
    }
  }

  // Build cells array: one row with two columns
  // Preserve the visual order: if reversed, image comes first visually
  const isReversed = element.classList.contains('colctrl--reverse');
  const cells = [];

  if (isReversed) {
    // Reversed: image on left, text on right (visual order)
    cells.push([
      imageContent.length === 1 ? imageContent[0] : imageContent,
      textContent.length === 1 ? textContent[0] : textContent,
    ]);
  } else {
    // Normal: text on left, image on right
    cells.push([
      textContent.length === 1 ? textContent[0] : textContent,
      imageContent.length === 1 ? imageContent[0] : imageContent,
    ]);
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-feature', cells });
  element.replaceWith(block);
}
