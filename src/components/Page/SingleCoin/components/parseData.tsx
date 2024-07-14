import Image from 'next/image';
import * as cheerio from 'cheerio';
import { renderToString } from 'react-dom/server';
import { SuccessCurrencySingleResponse } from '@/requests/single-coin/getStrapiSingleCoin';

interface HeadingType {
  text: string;
  id: string;
}

export const parseBodyTags = (i: string) => {
  const $ = cheerio.load(i);

  // remove all inline styles
  $('*').each(function (idx, i) {
    $(i).removeAttr('style dir aria-level');
  });
  $('ul').each(function (idx, i) {
    $(i).addClass('list-disc pr-10 my-3');
  });
  $('ul li').each(function (idx, i) {
    const item = $(i);
    // remove extra tags in h2 tags
    // for example <h2><strong>some text</strong></h2>
    // turns to <h2>some text</h2>
    item.text(item.text());
  });
  $('figure.image img').each(function (idx, i) {
    const item = $(i);
    item.parent().removeClass('image').addClass('my-8');
  });

  $('img').each(function (idx, i) {
    const item = $(i);
    const attr = item.attr() || {};
    if (!attr.src) return;

    const img = renderToString(
      attr.width ? (
        <Image
          // normalize src
          src={attr.src.startsWith('//') ? 'https:' + attr.src : attr.src}
          width={Number(attr.width)}
          height={Number(attr.height)}
          alt={attr.alt || 'image'}
          className="rounded-lg"
        />
      ) : (
        <img
          // normalize src
          src={attr.src.startsWith('//') ? 'https:' + attr.src : attr.src}
          alt={attr.alt || 'image'}
          className="rounded-lg"
          loading="lazy"
        />
      ),
    );

    item.replaceWith(img);
  });

  const headings: HeadingType[] = [];
  $('h2, h3, h4, h5, h6').each(function (idx, i) {
    const item = $(i);

    item.addClass('text-dark-800 font-bold');
    // remove extra tags in h2 tags
    // for example <h2><strong>some text</strong></h2>
    // turns to <h2>some text</h2>
    item.text(item.text());

    if (item.prop('tagName') === 'H2') {
      const id = 'section_' + idx;
      const text = item.text();
      item.attr('id', id);
      headings.push({ text, id });
      item.addClass('text-2xl mb-3');
    } else if (item.prop('tagName') === 'H3') item.addClass('text-xl mb-3');
    else if (item.prop('tagName') === 'H4') item.addClass('text-base mb-2');
  });

  $('p').each(function (idx, i) {
    $(i).addClass('mb-6');
  });

  $('a').each(function (idx, i) {
    $(i).addClass('text-primary-600 underline');
  });

  return {
    headings,
    html: $.html(),
  };
};

export default function parseData(d: SuccessCurrencySingleResponse) {
  const attr = d?.data[0]?.attributes;
  if (!attr) return {};
  const parsedTags = parseBodyTags(attr.page_content?.description || '');
  return {
    ...attr,
    html: parsedTags.html,
    headings: parsedTags.headings,
  };
}

export const parseFaqTags = (i: string) => {
  const $ = cheerio.load(i);

  // remove all inline styles
  $('*').each(function (idx, i) {
    $(i).removeAttr('style dir data-sourcepos');
  });

  $('p, li').each(function (idx, i) {
    const item = $(i);
    item.text(item.text());
  });

  return $.html();
};
export const removeTags = (i: string) => {
  const $ = cheerio.load(i);

  // remove all inline styles
  $('*').each(function (idx, i) {
    const item = $(i);

    item.text(item.text());
  });

  return $.text();
};

interface FaqItemProps {
  id: number;
  question: string;
  answer: string;
}

export function parseFaqData(
  arr: SuccessCurrencySingleResponse['data'][number]['attributes']['faqs']['data'],
): FaqItemProps[] {
  return arr.map((i) => ({
    id: i.id,
    question: removeTags(i.attributes.question),
    answer: parseFaqTags(i.attributes.answer),
  }));
}
