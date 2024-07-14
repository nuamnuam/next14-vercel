export type BlockPropsChildren = BlockProps;

export interface BlockProps<T = BlockPropsChildren> {
  heading?: string;
  headingCopy?: string;
  subHeading?: string;
  paragraph?: string;
  paragraphCopy?: string;
  boxHeading?: string;
  boxParagraphCopy?: string;
  page?: string;
  copy?: string;
  caption?: string;
  padding?: 'small' | 'medium' | 'large';
  bgImage?: number;
  icon?: string;
  hoverIcon?: string;
  type?: string;
  image?: number;
  bottomImage?: number;
  hoverImage?: number;
  url?: string;
  bgColour?: string;
  columns?: number;
  contentBlocks?: T[];
}

export interface ContentBlock {
  layout: string;
  attributes: PageAttribute;
}

export type HasCTA = {
  ctaHeadingCopy?: string;
  ctaParagraphCopy?: string;
  ctaUrl?: string;
  ctaCopy?: string;
  ctaButtonUrl?: string;
  ctaButtonCopy?: string;
  ctaBgImage?: string;
};

export interface PageAttribute {
  heading: string;
  heading_copy: string;
  sub_heading: string;
  paragraph?: string;
  paragraph_copy?: string;
  box_heading?: string;
  box_paragraph_copy?: string;
  page?: string;
  copy?: string;
  caption?: string;
  padding?: 'small' | 'medium' | 'large';
  bg_image?: string;
  icon?: string;
  hover_icon?: string;
  type?: string;
  image?: string;
  bottom_image?: string;
  hover_image?: string;
  url?: string;
  bg_colour?: string;
  columns?: string;
  content_blocks?: ContentBlock[];

  // cta
  cta_heading_copy?: string;
  cta_paragraph_copy?: string;
  cta_url?: string;
  cta_copy?: string;
  cta_button_url?: string;
  cta_button_copy?: string;
  cta_bg_image?: string;
}

type Keys = Record<string, string>;

export default function propsMapper(
  attributes: PageAttribute,
): BlockProps & HasCTA {
  const keys: Keys = {
    heading: 'heading',
    heading_copy: 'headingCopy',
    sub_heading: 'subHeading',
    paragraph: 'paragraph',
    paragraph_copy: 'paragraphCopy',
    box_heading: 'boxHeading',
    box_paragraph_copy: 'boxParagraphCopy',
    page: 'page',
    copy: 'copy',
    caption: 'caption',
    padding: 'padding',
    bg_image: 'bgImage',
    icon: 'icon',
    hover_icon: 'hoverIcon',
    type: 'type',
    image: 'image',
    bottom_image: 'bottomImage',
    hover_image: 'hoverImage',
    url: 'url',
    bg_colour: 'bgColour',
    columns: 'columns',
    content_blocks: 'contentBlocks',

    // CTA
    cta_heading_copy: 'ctaHeadingCopy',
    cta_paragraph_copy: 'ctaParagraphCopy',
    cta_url: 'ctaUrl',
    cta_copy: 'ctaCopy',
    cta_button_url: 'ctaButtonUrl',
    cta_button_copy: 'ctaButtonCopy',
    cta_bg_image: 'ctaBgImage',
  };

  const shouldInt = [
    'bgImage',
    'image',
    'bottomImage',
    'hoverImage',
    'columns',
  ];

  const items: any = {};

  for (const key of Object.keys(keys)) {
    const blockKey = keys[key];
    const attribute = attributes[key as keyof PageAttribute];

    if (typeof attribute === 'string') {
      items[blockKey] = shouldInt.includes(attribute)
        ? parseInt(attribute)
        : attribute;
    } else if (Array.isArray(attribute)) {
      if (key == 'content_blocks')
        items[blockKey] = attribute?.map((x) => propsMapper(x.attributes));
    }
  }

  return items as BlockProps & HasCTA;
}
