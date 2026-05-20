/* eslint-disable */
/* global WebImporter */

import carouselHeroParser from './parsers/carousel-hero.js';
import cardsOverlayParser from './parsers/cards-overlay.js';
import cardsArticleParser from './parsers/cards-article.js';
import columnsMixedParser from './parsers/columns-mixed.js';
import heroBannerParser from './parsers/hero-banner.js';

import cleanupTransformer from './transformers/corporates-cleanup.js';
import sectionsTransformer from './transformers/corporates-sections.js';

const parsers = {
  'carousel-hero': carouselHeroParser,
  'cards-overlay': cardsOverlayParser,
  'cards-article': cardsArticleParser,
  'columns-mixed': columnsMixedParser,
  'hero-banner': heroBannerParser,
};

const transformers = [
  cleanupTransformer,
  sectionsTransformer,
];

const PAGE_TEMPLATE = {
  name: 'corporates-homepage',
  description: 'DB Corporates homepage with hero carousel, product cards, and corporate banking information',
  urls: [
    'https://corporates.db.com/',
  ],
  blocks: [
    {
      name: 'carousel-hero',
      instances: ['.mod-stage'],
    },
    {
      name: 'cards-overlay',
      instances: [
        '.cms-row.row-index-1 .itm-tile .mod-text-box.type-image-background',
        '.cms-row.row-index-4 .cnt-generic.type-2 .mod-text-box.type-image-background',
      ],
    },
    {
      name: 'cards-article',
      instances: [
        '.cms-row.row-index-11 .cnt-generic.type-3 .mod-text-box.type-default',
        '.cms-row.row-index-16 .cnt-generic.type-3 .mod-text-box',
      ],
    },
    {
      name: 'columns-mixed',
      instances: ['.cms-row.row-index-13, .cms-row.row-index-14'],
    },
    {
      name: 'hero-banner',
      instances: ['.cms-row.row-index-15 .mod-text-box.type-image-background'],
    },
  ],
  sections: [
    {
      id: 'section-1',
      name: 'Hero',
      selector: '.cms-row.row-index-1',
      style: null,
      blocks: ['carousel-hero', 'cards-overlay'],
      defaultContent: [],
    },
    {
      id: 'section-2',
      name: 'Introduction',
      selector: '.cms-row.row-index-2',
      style: null,
      blocks: [],
      defaultContent: ['.mod-page-headline h1', '.mod-page-headline p'],
    },
    {
      id: 'section-3',
      name: 'Solutions Grid',
      selector: '.cms-row.row-index-4',
      style: 'grey',
      blocks: ['cards-overlay'],
      defaultContent: ['.cms-row.row-index-4 .container-headline'],
    },
    {
      id: 'section-4',
      name: 'Feature Cards',
      selector: '.cms-row.row-index-11',
      style: null,
      blocks: ['cards-article'],
      defaultContent: [],
    },
    {
      id: 'section-5',
      name: 'Stay Updated',
      selector: ['.cms-row.row-index-13', '.cms-row.row-index-14'],
      style: null,
      blocks: ['columns-mixed'],
      defaultContent: [],
    },
    {
      id: 'section-6',
      name: 'Flow Banner',
      selector: '.cms-row.row-index-15',
      style: null,
      blocks: ['hero-banner'],
      defaultContent: [],
    },
    {
      id: 'section-7',
      name: 'Awards',
      selector: '.cms-row.row-index-16',
      style: 'grey',
      blocks: ['cards-article'],
      defaultContent: ['.cms-row.row-index-16 .container-headline'],
    },
  ],
};

function executeTransformers(hookName, element, payload) {
  const enhancedPayload = {
    ...payload,
    template: PAGE_TEMPLATE,
  };

  transformers.forEach((transformerFn) => {
    try {
      transformerFn.call(null, hookName, element, enhancedPayload);
    } catch (e) {
      console.error(`Transformer failed at ${hookName}:`, e);
    }
  });
}

function findBlocksOnPage(document, template) {
  const pageBlocks = [];

  template.blocks.forEach((blockDef) => {
    blockDef.instances.forEach((selector) => {
      const elements = document.querySelectorAll(selector);
      elements.forEach((element) => {
        pageBlocks.push({
          name: blockDef.name,
          selector,
          element,
          section: blockDef.section || null,
        });
      });
    });
  });

  return pageBlocks;
}

export default {
  transform: (payload) => {
    const { document, url, params } = payload;

    const main = document.body;

    executeTransformers('beforeTransform', main, payload);

    const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);

    pageBlocks.forEach((block) => {
      const parser = parsers[block.name];
      if (parser) {
        try {
          parser(block.element, { document, url, params });
        } catch (e) {
          console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
        }
      }
    });

    executeTransformers('afterTransform', main, payload);

    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    const path = WebImporter.FileUtils.sanitizePath(
      new URL(params.originalURL).pathname.replace(/\/$/, '').replace(/\.html$/, '') || '/index',
    );

    return [{
      element: main,
      path,
      report: {
        title: document.title,
        template: PAGE_TEMPLATE.name,
        blocks: pageBlocks.map((b) => b.name),
      },
    }];
  },
};
