import ReactLoadingSkeleton from 'react-loading-skeleton';

type SkeletonType =
  | 'text'
  | 'alert'
  | 'accordion'
  | 'avatar'
  | 'breadcrumbs'
  | 'button'
  | 'buttonGroup'
  | 'captcha'
  | 'chip'
  | 'chart'
  | 'horizontalStepper'
  | 'verticalStepper'
  | 'icon'
  | 'iconBox'
  | 'progress'
  | 'rate'
  | 'field'
  | 'image'
  | 'title'
  | 'paragraph'
  | 'labelStartIcon'
  | 'labelEndIcon';

interface Props {
  type: SkeletonType;
}

const Skeleton = ({ type }: Props) => {
  const Component = SkeletonType(type);

  return Component;
};

export default Skeleton;

function TextSkeleton() {
  return (
    <ReactLoadingSkeleton
      width={52}
      height={12}
      className="!rounded-lg opacity-10"
      baseColor="#686D87"
    />
  );
}

function AlertSkeleton() {
  return (
    <div className="flex items-center w-[395px] h-[43px] relative">
      <ReactLoadingSkeleton
        className="!rounded-lg !absolute !h-full !w-full opacity-10"
        baseColor="#686D87"
      />

      <div className="flex items-center gap-2 mt-4 mr-4">
        <ReactLoadingSkeleton
          width={24}
          height={24}
          className="!rounded-full opacity-10"
          baseColor="#686D87"
        />
        <div className="h-3">
          <ReactLoadingSkeleton
            width={52}
            height={12}
            className="!rounded-lg opacity-10"
            baseColor="#686D87"
          />
        </div>
      </div>
    </div>
  );
}

function AccordionSkeleton() {
  return (
    <div className="flex items-center w-[395px] justify-between">
      <div className="flex items-center gap-2">
        <ReactLoadingSkeleton
          width={24}
          height={24}
          className="!rounded-full opacity-10"
          baseColor="#686D87"
        />
        <div className="h-3">
          <ReactLoadingSkeleton
            width={104}
            height={12}
            className="!rounded-lg opacity-10"
            baseColor="#686D87"
          />
        </div>
      </div>
      <ReactLoadingSkeleton
        width={24}
        height={24}
        className="!rounded-full opacity-10"
        baseColor="#686D87"
      />
    </div>
  );
}

function BreadcrumbsSkeleton() {
  return (
    <div className="flex items-center gap-4">
      <ReactLoadingSkeleton
        width={52}
        height={12}
        className="!rounded-lg opacity-10"
        baseColor="#686D87"
      />
      <ReactLoadingSkeleton
        width={52}
        height={12}
        className="!rounded-lg opacity-10"
        baseColor="#686D87"
      />
      <ReactLoadingSkeleton
        width={52}
        height={12}
        className="!rounded-lg opacity-10"
        baseColor="#686D87"
      />
    </div>
  );
}

function ButtonSkeleton() {
  return (
    <ReactLoadingSkeleton
      width={86}
      height={40}
      className="!rounded-lg opacity-10"
      baseColor="#686D87"
    />
  );
}

function ButtonGroupSkeleton() {
  return (
    <div className="flex items-center gap-4">
      <ReactLoadingSkeleton
        width={86}
        height={40}
        className="!rounded-lg opacity-10"
        baseColor="#686D87"
      />
      <ReactLoadingSkeleton
        width={86}
        height={40}
        className="!rounded-lg opacity-10"
        baseColor="#686D87"
      />
      <ReactLoadingSkeleton
        width={86}
        height={40}
        className="!rounded-lg opacity-10"
        baseColor="#686D87"
      />
    </div>
  );
}

function CaptchaSkeleton() {
  return (
    <div className="flex items-center justify-center w-[142px] h-[48px] relative flex-col">
      <div className="absolute h-full w-full">
        <ReactLoadingSkeleton
          className="!rounded-lg !h-full !w-full opacity-10"
          baseColor="#686D87"
        />
      </div>

      <div className="flex items-center gap-2">
        <div className="h-4 w-4">
          <ReactLoadingSkeleton
            width={16}
            height={16}
            className="!rounded-full opacity-10"
            baseColor="#686D87"
          />
        </div>
        <div className="h-4 w-4">
          <ReactLoadingSkeleton
            width={16}
            height={16}
            className="!rounded-full opacity-10"
            baseColor="#686D87"
          />
        </div>
        <div className="h-4 w-4">
          <ReactLoadingSkeleton
            width={16}
            height={16}
            className="!rounded-full opacity-10"
            baseColor="#686D87"
          />
        </div>
        <div className="h-4 w-4">
          <ReactLoadingSkeleton
            width={16}
            height={16}
            className="!rounded-full opacity-10"
            baseColor="#686D87"
          />
        </div>
      </div>
    </div>
  );
}

function ChipSkeleton() {
  return (
    <ReactLoadingSkeleton
      width={56}
      height={24}
      className="!rounded-lg opacity-10"
      baseColor="#686D87"
    />
  );
}

function ChartSkeleton() {
  return (
    <div className="flex items-center w-[298px] h-[179px] relative">
      <ReactLoadingSkeleton
        className="!rounded-lg !absolute top-0 !h-full !w-full opacity-10"
        baseColor="#686D87"
      />

      <div className="flex items-end gap-2 justify-center w-full">
        <div className="h-9 w-4">
          <ReactLoadingSkeleton
            width={16}
            height={36}
            className="!rounded-lg opacity-10"
            baseColor="#686D87"
          />
        </div>
        <div className="w-4 h-[49px]">
          <ReactLoadingSkeleton
            width={16}
            height={49}
            className="!rounded-lg opacity-10"
            baseColor="#686D87"
          />
        </div>
        <div className="w-4 h-[63px]">
          <ReactLoadingSkeleton
            width={16}
            height={63}
            className="!rounded-lg opacity-10"
            baseColor="#686D87"
          />
        </div>
        <div className="w-4 h-[41px]">
          <ReactLoadingSkeleton
            width={16}
            height={41}
            className="!rounded-lg opacity-10"
            baseColor="#686D87"
          />
        </div>
        <div className="w-4 h-8">
          <ReactLoadingSkeleton
            width={16}
            height={32}
            className="!rounded-lg opacity-10"
            baseColor="#686D87"
          />
        </div>
      </div>
    </div>
  );
}

function HorizontalStepperSkeleton() {
  return (
    <div className="flex items-center gap-10">
      <div className="flex items-center gap-2">
        <ReactLoadingSkeleton
          width={24}
          height={24}
          className="!rounded-full opacity-10"
          baseColor="#686D87"
        />
        <div className="[&>span]:h-[15px] [&>span]:block ">
          <ReactLoadingSkeleton
            width={82}
            height={12}
            className="!rounded-lg opacity-10"
            baseColor="#686D87"
          />
        </div>
      </div>
      <div className="flex items-center gap-2">
        <ReactLoadingSkeleton
          width={24}
          height={24}
          className="!rounded-full opacity-10"
          baseColor="#686D87"
        />
        <div className="[&>span]:h-[15px] [&>span]:block ">
          <ReactLoadingSkeleton
            width={82}
            height={12}
            className="!rounded-lg opacity-10"
            baseColor="#686D87"
          />
        </div>
      </div>
      <div className="flex items-center gap-2">
        <ReactLoadingSkeleton
          width={24}
          height={24}
          className="!rounded-full opacity-10"
          baseColor="#686D87"
        />
        <div className="[&>span]:h-[15px] [&>span]:block ">
          <ReactLoadingSkeleton
            width={82}
            height={12}
            className="!rounded-lg opacity-10"
            baseColor="#686D87"
          />
        </div>
      </div>
    </div>
  );
}

function VerticalStepperSkeleton() {
  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex items-center gap-2">
        <ReactLoadingSkeleton
          width={24}
          height={24}
          className="!rounded-full opacity-10"
          baseColor="#686D87"
        />
        <div className="[&>span]:h-[15px] [&>span]:block ">
          <ReactLoadingSkeleton
            width={82}
            height={12}
            className="!rounded-lg opacity-10"
            baseColor="#686D87"
          />
        </div>
      </div>
      <div className="flex items-center gap-2">
        <ReactLoadingSkeleton
          width={24}
          height={24}
          className="!rounded-full opacity-10"
          baseColor="#686D87"
        />
        <div className="[&>span]:h-[15px] [&>span]:block ">
          <ReactLoadingSkeleton
            width={82}
            height={12}
            className="!rounded-lg opacity-10"
            baseColor="#686D87"
          />
        </div>
      </div>
      <div className="flex items-center gap-2">
        <ReactLoadingSkeleton
          width={24}
          height={24}
          className="!rounded-full opacity-10"
          baseColor="#686D87"
        />
        <div className="[&>span]:h-[15px] [&>span]:block ">
          <ReactLoadingSkeleton
            width={82}
            height={12}
            className="!rounded-lg opacity-10"
            baseColor="#686D87"
          />
        </div>
      </div>
    </div>
  );
}

function IconSkeleton() {
  return (
    <ReactLoadingSkeleton
      width={24}
      height={24}
      className="!rounded-full opacity-10"
      baseColor="#686D87"
    />
  );
}

function IconBoxSkeleton() {
  return (
    <ReactLoadingSkeleton
      width={56}
      height={56}
      className="!rounded-lg opacity-10"
      baseColor="#686D87"
    />
  );
}

function ProgressSkeleton() {
  return (
    <div className="flex flex-col">
      <ReactLoadingSkeleton
        width={300}
        height={8}
        className="!rounded-lg opacity-10"
        baseColor="#686D87"
      />

      <div className="flex items-center justify-between">
        <ReactLoadingSkeleton
          width={30}
          height={12}
          className="!rounded-lg opacity-10"
          baseColor="#686D87"
        />
        <ReactLoadingSkeleton
          width={30}
          height={12}
          className="!rounded-lg opacity-10"
          baseColor="#686D87"
        />
        <ReactLoadingSkeleton
          width={30}
          height={12}
          className="!rounded-lg opacity-10"
          baseColor="#686D87"
        />
        <ReactLoadingSkeleton
          width={30}
          height={12}
          className="!rounded-lg opacity-10"
          baseColor="#686D87"
        />
        <ReactLoadingSkeleton
          width={30}
          height={12}
          className="!rounded-lg opacity-10"
          baseColor="#686D87"
        />
      </div>
    </div>
  );
}

function RateSkeleton() {
  return (
    <div className="flex items-center gap-2">
      <ReactLoadingSkeleton
        width={24}
        height={24}
        className="!rounded-full opacity-10"
        baseColor="#686D87"
      />
      <ReactLoadingSkeleton
        width={24}
        height={24}
        className="!rounded-full opacity-10"
        baseColor="#686D87"
      />
      <ReactLoadingSkeleton
        width={24}
        height={24}
        className="!rounded-full opacity-10"
        baseColor="#686D87"
      />
      <ReactLoadingSkeleton
        width={24}
        height={24}
        className="!rounded-full opacity-10"
        baseColor="#686D87"
      />
      <ReactLoadingSkeleton
        width={24}
        height={24}
        className="!rounded-full opacity-10"
        baseColor="#686D87"
      />
    </div>
  );
}

function FieldSkeleton() {
  return (
    <div className="flex items-start flex-col">
      <ReactLoadingSkeleton
        width={73}
        height={16}
        className="!rounded-lg opacity-10"
        baseColor="#686D87"
      />
      <ReactLoadingSkeleton
        width={249}
        height={48}
        className="!rounded-lg opacity-10"
        baseColor="#686D87"
      />
    </div>
  );
}

function ImageSkeleton() {
  return (
    <div className="flex items-center w-[298px] h-[179px] relative">
      <ReactLoadingSkeleton
        className="!rounded-lg opacity-10 !absolute top-0 !h-full !w-full"
        baseColor="#686D87"
      />

      <div className="flex items-center justify-center w-full">
        <div className="h-4 w-7">
          <ReactLoadingSkeleton
            width={28}
            height={16}
            className="!rounded-lg opacity-10 -rotate-[55deg] -translate-x-[18px] translate-y-[2px]"
            baseColor="#686D87"
          />
        </div>
        <div className="h-4 w-16">
          <ReactLoadingSkeleton
            width={64}
            height={16}
            className="!rounded-lg -rotate-[55deg] opacity-10"
            baseColor="#686D87"
          />
        </div>
        <div className="h-4 w-10">
          <ReactLoadingSkeleton
            width={40}
            height={16}
            className="!rounded-lg -rotate-[55deg] translate-x-[21px]  translate-y-[2px] opacity-10"
            baseColor="#686D87"
          />
        </div>
      </div>
    </div>
  );
}

function TitleSkeleton() {
  return (
    <ReactLoadingSkeleton
      width={192}
      height={24}
      className="!rounded-lg opacity-10"
      baseColor="#686D87"
    />
  );
}

function ParagraphSkeleton() {
  return (
    <div>
      <ReactLoadingSkeleton
        width={290}
        height={12}
        className="!rounded-lg opacity-10"
        baseColor="#686D87"
      />
      <ReactLoadingSkeleton
        width={290}
        height={12}
        className="!rounded-lg opacity-10"
        baseColor="#686D87"
      />
      <ReactLoadingSkeleton
        width={290}
        height={12}
        className="!rounded-lg opacity-10"
        baseColor="#686D87"
      />
      <ReactLoadingSkeleton
        width={290}
        height={12}
        className="!rounded-lg opacity-10"
        baseColor="#686D87"
      />
    </div>
  );
}

function LabelStartIconSkeleton() {
  return (
    <div className="flex items-center gap-2">
      <div className="[&>span]:h-[21px] [&>span]:block ">
        <ReactLoadingSkeleton
          width={52}
          height={12}
          className="!rounded-lg mt-1 opacity-10"
          baseColor="#686D87"
        />
      </div>
      <ReactLoadingSkeleton
        width={16}
        height={16}
        className="!rounded-full opacity-10"
        baseColor="#686D87"
      />
    </div>
  );
}

function LabelEndIconSkeleton() {
  return (
    <div className="flex items-center gap-2">
      <ReactLoadingSkeleton
        width={16}
        height={16}
        className="!rounded-full opacity-10"
        baseColor="#686D87"
      />
      <div className="[&>span]:h-[21px] [&>span]:block ">
        <ReactLoadingSkeleton
          width={52}
          height={12}
          className="!rounded-lg mt-1 opacity-10"
          baseColor="#686D87"
        />
      </div>
    </div>
  );
}

function SkeletonType(SkeletonType: SkeletonType) {
  switch (SkeletonType) {
    case 'text':
      return <TextSkeleton />;
    case 'alert':
      return <AlertSkeleton />;
    case 'accordion':
      return <AccordionSkeleton />;
    case 'avatar':
      return <ReactLoadingSkeleton />;
    case 'breadcrumbs':
      return <BreadcrumbsSkeleton />;
    case 'button':
      return <ButtonSkeleton />;
    case 'buttonGroup':
      return <ButtonGroupSkeleton />;
    case 'captcha':
      return <CaptchaSkeleton />;
    case 'chip':
      return <ChipSkeleton />;
    case 'chart':
      return <ChartSkeleton />;
    case 'horizontalStepper':
      return <HorizontalStepperSkeleton />;
    case 'verticalStepper':
      return <VerticalStepperSkeleton />;
    case 'icon':
      return <IconSkeleton />;
    case 'iconBox':
      return <IconBoxSkeleton />;
    case 'progress':
      return <ProgressSkeleton />;
    case 'rate':
      return <RateSkeleton />;
    case 'field':
      return <FieldSkeleton />;
    case 'image':
      return <ImageSkeleton />;
    case 'title':
      return <TitleSkeleton />;
    case 'paragraph':
      return <ParagraphSkeleton />;
    case 'labelStartIcon':
      return <LabelStartIconSkeleton />;
    case 'labelEndIcon':
      return <LabelEndIconSkeleton />;
    default:
      return <ReactLoadingSkeleton />;
  }
}
