import React from 'react';
import Image from 'next/image';

import useBlogs from '@/requests/home/useBlogs';
import { Button, Spinner } from '@/components/Common';
import { formatedDate } from '@/utils';
import { useLang } from '@/hooks';

interface Props {
  coin: string;
}

export default function News({ coin }: Props) {
  const [singleCoin] = useLang(['singleCoin']);

  const { data, isLoading } = useBlogs(Boolean(coin), coin);

  if (isLoading)
    return (
      <div className="flex items-center justify-center mt-8">
        <Spinner />
      </div>
    );

  return (
    <section className="mt-4 p-4 md:mt-20 md:p-0">
      <div className="flex items-center justify-between">
        <h2 className="text-[28px] font-black text-dark-700">
          {singleCoin.newsAndAnalysis}
        </h2>
        <a
          target="_blank"
          rel="noreferrer noopener"
          href="https://arzinja.info/blog"
        >
          <Button variant="primary">{singleCoin.viewMore}</Button>
        </a>
      </div>
      <div className="mt-8 flex w-full justify-between gap-x-6 overflow-y-hidden overflow-x-auto md:w-auto">
        {data?.result?.splice(0, 4).map((i, idx) => (
          <a
            className="min-w-[281px]"
            key={idx}
            target="_blank"
            rel="noreferrer noopener"
            href={i.post_link}
          >
            <Image
              width={306}
              height={123}
              src={i.post_image}
              alt={i.post_title}
              className="rounded-lg"
            />

            <h3 className="font-bold text-base text-dark-700 my-4">
              {i.post_title}
            </h3>
            <h4 className="text-xs font-medium text-dark-400">
              {formatedDate({
                date: i.post_date,
                withExtra: false,
              })}
            </h4>
          </a>
        ))}
      </div>
    </section>
  );
}
