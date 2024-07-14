import React, { useCallback, useEffect, useRef, useState } from 'react';
import clsx from 'classnames';

import { useBreakpoint, useLang } from '@/hooks';

import Icon from '../Icon';

interface Props {
  height?: number;
  title?: string | React.ReactNode;
  content: string | React.ReactNode;
  showMoreLabel?: string | React.ReactNode;
  showLessLabel?: string | React.ReactNode;
  showLessMoreClassnames?: string;
  allowCollapse?: boolean;
  showEffect?: boolean;
}

const ParagraphBox: React.FC<Props> = ({
  height = 110,
  content,
  title,
  showMoreLabel,
  showLessLabel,
  showLessMoreClassnames,
  allowCollapse = true,
  showEffect = true,
}) => {
  const [global] = useLang(['global']);
  const bodyRef = useRef<HTMLParagraphElement>(null);
  const { isDesktop } = useBreakpoint();
  const [expanded, setExpanded] = useState(false);
  const [fullHeight, setFullHeihgt] = useState(0);

  useEffect(() => {
    if (bodyRef.current == null) return;
    setFullHeihgt(bodyRef.current.clientHeight);
  }, [expanded]);

  const onChange = useCallback(() => {
    if (!allowCollapse && expanded) return;
    setExpanded(!expanded);
  }, [expanded]);

  return (
    <div
      className={clsx(
        'relative',
        allowCollapse && 'pb-8',
        !allowCollapse && expanded && 'pb-0',
      )}
    >
      <div
        className={clsx(
          'relative overflow-hidden transition-all duration-300',
          !showEffect && 'after:hidden',
          height >= fullHeight && 'after:hidden',
          expanded && 'overflow-y-auto !no-scrollbar',
          !expanded &&
            'after:absolute after:top-1/2 after:bottom-0 after:left-0 after:w-full after:bg-gradient-to-t after:from-white',
        )}
        style={{
          height: expanded
            ? `${fullHeight}px`
            : isDesktop
            ? height > fullHeight
              ? `${fullHeight}px`
              : `${height}px`
            : `${height * 3}px`,
        }}
      >
        {title ? (
          <h2
            className="mt-0 mb-4 text-xl font-medium text-dark-700"
            dangerouslySetInnerHTML={{ __html: title as string }}
          />
        ) : (
          <></>
        )}
        {typeof content === 'string' ? (
          <p ref={bodyRef} dangerouslySetInnerHTML={{ __html: content }} />
        ) : (
          <p ref={bodyRef}>{content}</p>
        )}
      </div>
      {height < fullHeight && (
        <div
          className={clsx(
            'absolute bottom-0 right-0 z-10 flex w-full cursor-pointer justify-center',
            showLessMoreClassnames,
          )}
          onClick={onChange}
        >
          {(allowCollapse || !expanded) && (
            <div className="flex items-center justify-center">
              <span className="ml-2 text-sm text-primary-600">
                {expanded
                  ? showLessLabel || global.close
                  : showMoreLabel || global.showAllText}
              </span>
              <Icon
                icon="ArrowDown-TwoTone"
                size={24}
                className={clsx(
                  'transition-all duration-300 [&>*]:fill-primary-500',
                  expanded && 'rotate-180',
                )}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ParagraphBox;
