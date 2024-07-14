import React, { FC } from 'react';
import Link from 'next/link';
import { styled } from '@mui/material/styles';

import { Button, Spinner } from '@/components/Common';
import DefaultBlog from '@/assets/images/DefaultBlog.png';
import type { Blog as BlogType } from '@/types/blog';
import { useLandingContent } from '@/requests/home/home';
import useBlogs from '@/requests/home/useBlogs';

import type { HomeProps } from '../types';

const Blog: FC<HomeProps> = ({ blogs, data, isLoading }) => {
  const { data: blogsResponse } = useLandingContent(!data);
  const { data: blogsItems, isLoading: isBlogsLoading } = useBlogs(!blogs);

  const pageData = data || blogsResponse?.data.attributes;
  const blogsData = blogs || blogsItems?.result;
  const isComponentLoading = isLoading || isBlogsLoading;

  if (!pageData)
    return (
      <div className="flex items-center justify-center mt-8">
        <Spinner />
      </div>
    );

  const { cta, ctaUrl, description, title } = pageData.Blog_SH;

  return (
    <div className="py-8 md:py-[72px]">
      <div className="container">
        <div className="mb-10 flex items-center justify-between flex-row">
          <span className="text-2xl font-bold text-dark-700 md:text-[28px]">
            {title}
          </span>
          <span
            dangerouslySetInnerHTML={{ __html: description }}
            className="mt-4  hidden text-center text-sm font-medium leading-6 text-dark-500 md:mt-0 md:mr-6 md:hidden md:text-right lg:block"
          />
          <Button className="mr-auto md:block">
            <Link href={ctaUrl}>{cta}</Link>
          </Button>
        </div>
        <div className="flex lg:grid lg:grid-cols-4  w-full justify-between gap-6 overflow-y-hidden overflow-x-auto lg:overflow-x-hidden pb-8 lg:pb-0">
          {isComponentLoading ? (
            <div className="w-full flex justify-center py-10">
              <Spinner />
            </div>
          ) : (
            blogsData
              ?.slice(0, 4)
              .map((item, index) => <BlogCard {...item} key={index} />)
          )}
        </div>
      </div>
    </div>
  );
};

const BlogCard: React.FC<BlogType> = ({
  post_id,
  post_title,
  post_link,
  post_image,
}) => {
  return (
    <Link href={post_link} key={post_id} target="_blank">
      <StyledBlogCardWrapper className="lg:grid lg:col-span-1 min-w-[247px] max-w-[247px] flex-1 lg:max-w-fit">
        <div
          className="rounded-lg transition duration-300 w-full h-32 bg-dark-50 bg-cover"
          style={{ backgroundImage: `url('${post_image}')` }}
        ></div>
        <span className="my-4 block font-bold text-dark-700 transition duration-300 group-hover:text-dark-400">
          {post_title}
        </span>
      </StyledBlogCardWrapper>
    </Link>
  );
};

const StyledBlogCardWrapper = styled('div')(() => ({
  '.thumb': {
    backgroundImage: `url('${DefaultBlog.src}')`,
    paddingTop: '7.6rem',
  },
}));

export default Blog;
