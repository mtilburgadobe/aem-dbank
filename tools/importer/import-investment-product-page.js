/* eslint-disable */
/* global WebImporter */

import heroProductParser from './parsers/hero-product.js';
import cardsIconParser from './parsers/cards-icon.js';
import cardsStepsParser from './parsers/cards-steps.js';
import columnsFeatureParser from './parsers/columns-feature.js';
import columnsPromoParser from './parsers/columns-promo.js';
import tablePricingParser from './parsers/table-pricing.js';
import tabsComparisonParser from './parsers/tabs-comparison.js';
import accordionLegalParser from './parsers/accordion-legal.js';
import accordionFaqParser from './parsers/accordion-faq.js';

import cleanupTransformer from './transformers/deutsche-bank-cleanup.js';
import sectionsTransformer from './transformers/deutsche-bank-sections.js';

const parsers = {
  'hero-product': heroProductParser,
  'cards-icon': cardsIconParser,
  'cards-steps': cardsStepsParser,
  'columns-feature': columnsFeatureParser,
  'columns-promo': columnsPromoParser,
  'table-pricing': tablePricingParser,
  'tabs-comparison': tabsComparisonParser,
  'accordion-legal': accordionLegalParser,
  'accordion-faq': accordionFaqParser,
};

const transformers = [
  cleanupTransformer,
  sectionsTransformer,
];

const PAGE_TEMPLATE = {
  name: 'investment-product-page',
  description: 'Investment product page for online securities depot/brokerage account',
  urls: [
    'https://www.deutsche-bank.de/pk/sparen-und-anlegen/geldanlage-online/depot.html',
  ],
  blocks: [
    {
      name: 'hero-product',
      instances: ['.dynamic-container-stage'],
    },
    {
      name: 'cards-icon',
      instances: ['#parsys-columncontrol_365142-columnControlCol1Parsys-columncontrol .colctrl__25-25-25-25'],
    },
    {
      name: 'columns-feature',
      instances: [
        '#parsys-columncontrol_263516-columnControlCol2Parsys-columncontrol_copy .colctrl__50-50',
        '#parsys-columncontrol_263516-columnControlCol2Parsys-columncontrol_copy_c .colctrl__50-50',
      ],
    },
    {
      name: 'table-pricing',
      instances: ['.table.comp.comp--padded'],
    },
    {
      name: 'columns-promo',
      instances: [
        '#happy-hour .colctrl__30-60',
        '#parsys-columncontrol_487523-columnControlCol2Parsys-columncontrol_copy .colctrl__30-60',
      ],
    },
    {
      name: 'cards-steps',
      instances: ['.contentsnippetlist'],
    },
    {
      name: 'tabs-comparison',
      instances: ['.giga-tab'],
    },
    {
      name: 'accordion-legal',
      instances: ['#parsys-columncontrol_487523-columnControlCol2Parsys-columncontrol_340917_653381460-columnControlCol1Parsys-accordion_copy_copy__740162962'],
    },
    {
      name: 'accordion-faq',
      instances: ['#root-accordion_905335099__470306153'],
    },
  ],
  sections: [
    {
      id: 'section-1',
      name: 'Hero',
      selector: '.stage-area',
      style: null,
      blocks: ['hero-product'],
      defaultContent: [],
    },
    {
      id: 'section-2',
      name: 'Introduction',
      selector: '#parsys-columncontrol_365142-columnControlCol1Parsys-text_copy_copy_copy_',
      style: null,
      blocks: [],
      defaultContent: [
        '#parsys-columncontrol_365142-columnControlCol1Parsys-text_copy_copy_copy_ h2',
        '#parsys-columncontrol_365142-columnControlCol1Parsys-text_copy_copy_copy_ p',
      ],
    },
    {
      id: 'section-3',
      name: 'Key Benefits',
      selector: '#parsys-columncontrol_365142-columnControlCol1Parsys-columncontrol',
      style: null,
      blocks: ['cards-icon'],
      defaultContent: [],
    },
    {
      id: 'section-4',
      name: 'Additional Features',
      selector: '#parsys-columncontrol_263516-columnControlCol2Parsys-text_copy_copy',
      style: null,
      blocks: ['columns-feature'],
      defaultContent: [
        '#parsys-columncontrol_263516-columnControlCol2Parsys-text_copy_copy h2',
      ],
    },
    {
      id: 'section-5',
      name: 'Pricing',
      selector: '#parsys-columncontrol_copy_c_1273061504-columnControlCol2Parsys-experiencefragment_1',
      style: null,
      blocks: ['table-pricing'],
      defaultContent: [],
    },
    {
      id: 'section-6',
      name: 'Happy Hour Promo',
      selector: '#happy-hour',
      style: 'grey',
      blocks: ['columns-promo'],
      defaultContent: [],
    },
    {
      id: 'section-7',
      name: 'How It Works',
      selector: '#parsys-columncontrol_copy_c_2069414751-columnControlCol1Parsys-text',
      style: null,
      blocks: ['cards-steps'],
      defaultContent: [
        '#parsys-columncontrol_copy_c_2069414751-columnControlCol1Parsys-text h2',
      ],
    },
    {
      id: 'section-8',
      name: 'Trading Comparison',
      selector: '.comp--giga-tab',
      style: null,
      blocks: ['tabs-comparison'],
      defaultContent: [],
    },
    {
      id: 'section-9',
      name: 'Depot Switch Promo',
      selector: '#parsys-columncontrol_487523',
      style: 'grey',
      blocks: ['columns-promo', 'accordion-legal'],
      defaultContent: [],
    },
    {
      id: 'section-10',
      name: 'FAQ',
      selector: '#root-accordion_905335099__470306153',
      style: null,
      blocks: ['accordion-faq'],
      defaultContent: ['#Fragen h2'],
    },
    {
      id: 'section-11',
      name: 'Disclaimers',
      selector: '.disclaimer',
      style: null,
      blocks: [],
      defaultContent: [],
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
      new URL(params.originalURL).pathname.replace(/\/$/, '').replace(/\.html$/, ''),
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
