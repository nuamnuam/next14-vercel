# Arzinja version 2

This is **Arzinja Version 2** project.

### ENV variables

```dotenv
NEXT_PUBLIC_STRAPI_API_BASE_URL=
NEXT_PUBLIC_API_BASE_URL=
NEXT_PUBLIC_STRAPI_MEDIA_BASE_URL=

# NEXT SEO
NEXTAUTH_URL=
NEXT_PUBLIC_SITE_NAME=

NEXT_PUBLIC_GOOGLE_ANALYTICS=
NEXT_PUBLIC_FB_ID=
```

### Libraries

| Dependency                                                             | Version    | Use              |
| ---------------------------------------------------------------------- | ---------- | ---------------- |
| [next](https://nextjs.org/docs/getting-started)                        | 14.2.3     | NextJS           |
| [date-fns](https://github.com/date-fns/date-fns)                       | 2.28.0     | Date Format      |
| [axios](https://axios-http.com/)                                       | 0.27.2     | Requests         |
| [swiper](https://swiperjs.com/react)                                   | 11.1.1     | Swiper slider    |
| [nextjs-progressbar](https://www.npmjs.com/package/nextjs-progressbar) | 0.0.14     | Progressbar      |
| [qs](https://github.com/ljharb/qs)                                     | 6.11.0     | Query String     |
| [react-query](https://react-query-v3.tanstack.com/overview)            | 3.39.3     | Queries          |
| [react-use](https://github.com/streamich/react-use)                    | 17.4.0     | Extra Hooks      |
| [zustand](https://github.com/pmndrs/zustand)                           | 4.0.0-rc.1 | State Management |

## Getting Started

- Create your own `.env` file. An example is provided in `.env.sample`
- Run `yarn` to install dependencies
- Run `yarn prepare` for install git hooks
- After that, run `yarn dev` to get it up and running locally

### Scripts

| Script            | What it does                                                                 |
| ----------------- | ---------------------------------------------------------------------------- |
| dev               | starts the application in development mode w/ lint concurrently              |
| build             | creates an optimised production build of your application                    |
| export            | starts the application in production mode. run `build` first before doing so |
| start             | generates the static pages                                                   |
| lint              | runs eslint                                                                  |
| prettier:check    | runs prettier check on source                                                |
| prettier:fix      | tells prettier to automagically fix errors                                   |
| prepare           | installs husky                                                               |
| generate:icons    | generate icons components                                                    |
| generate:tailwind | export tailwind variables into `/src/theme.ts`                               |

### Generate Icons

Move icons svg files to `/src/assets/icons` folder.

> **Note:** The names should be like `{name}-icon.svg`

Then run `yarn generate:icons` for generate react components in `/src/components/Icons`

### Create Block

Make a folder with your own block name in `/src/components/Blocks` with a `index.tsx` file.
Then for the boilerplate can use of this block as dynamic block you should add this to `/src/utils/block-components.ts`
list.

For example create `/src/components/Block/Example/index.tsx` file:

```tsx
import { BlockProps } from '@/types';

const Example: React.FC<BlockProps> = () => {
  return <div>component body</div>;
};

export default Example;
```

And add it to `block-components.ts` like this:

```typescript
import dynamic from 'next/dynamic';

export const blockComponents: Record<string, any> = {
  example: dynamic(() => import('@/components/Blocks/Example')),
};
```

### Block Props

You can see these interfaces in `/src/types/index.ts` file.
