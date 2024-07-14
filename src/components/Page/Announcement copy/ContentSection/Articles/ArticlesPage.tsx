import NotifIcon from '@/components/Icons/announcement/NotifIcon';
import LeftArrowIcon from '@/components/Icons/LeftArrowIcon';
import CoinsIcon from '@/components/Icons/announcement/CoinsIcon';
import TransactioIcon from '@/components/Icons/TransactioIcon';
import UpdatesIcon from '@/components/Icons/UpdatesIcon';
import { Card, Chip } from '@/components/Common';
import { getLang } from '@/utils';
import { useLang } from '@/hooks';

interface ICardRow {
  title: string;
  date: string;
  important: boolean;
}
interface ICardItem {
  list: string;
  icon: React.ReactNode;
  important: boolean;
}
interface IArticle {
  title: string;
  link: string;
  date: string;
  important: boolean;
}
interface IArticles {
  list: IArticle[];
  icon: React.ReactNode;
  title: string;
}

const [announcement, global] = getLang(['announcement', 'global']);

const CardRow = ({ title, date, important }: ICardRow) => {
  const [global] = useLang(['global']);

  return (
    <div className="flex items-center justify-between  border-b border-dark-50">
      <div className="flex items-center justify-start gap-x-4 p-4 pr-4 md:pb-6 md:pt-6">
        {important && <Chip variant="danger" label={global.important} />}
        <h3 className="text-sm font-medium text-dark-700">{title}</h3>
      </div>
      <div className="hidden items-center justify-start gap-x-4 pr-4 pl-4 sm:flex">
        <p className="m-0 text-sm font-medium text-dark-400">{date}</p>
        <LeftArrowIcon />
      </div>
    </div>
  );
};

const CardItem = ({ list, icon, title }: IArticles) => {
  return (
    <Card
      classNames="shadow-card w-full md:max-w-[469px]"
      header={
        <div className="flex items-center justify-start gap-x-2 border-b-2 border-dark-50 p-4">
          {icon}
          <h2 className="text-xl font-medium text-dark-700">{title}</h2>
        </div>
      }
    >
      {list.map((row: IArticle) => {
        return <CardRow key={row.title} {...row} />;
      })}
    </Card>
  );
};

const ArticlesPage = () => {
  return (
    <div className="flex flex-wrap gap-6">
      {data.map((item: IArticles) => {
        return <CardItem key={item.title} {...item} />;
      })}
    </div>
  );
};

export default ArticlesPage;

const data: IArticles[] = [
  {
    title: announcement.arzinjaImportantArticles,
    icon: <NotifIcon />,
    list: [
      {
        title: announcement.addBitCoinsBTC_CBT_NBQ,
        date: announcement.sampleDate,
        important: true,
        link: '',
      },
      {
        title: announcement.addBitCoinsBTC_CBT_NBQ,
        date: announcement.sampleDate,
        important: true,
        link: '',
      },
      {
        title: announcement.addBitCoinsBTC_CBT_NBQ,
        date: announcement.sampleDate,
        important: false,
        link: '',
      },
      {
        title: announcement.addBitCoinsBTC_CBT_NBQ,
        date: announcement.sampleDate,
        important: false,
        link: '',
      },
      {
        title: announcement.addBitCoinsBTC_CBT_NBQ,
        date: announcement.sampleDate,
        important: false,
        link: '',
      },
    ],
  },
  {
    title: global.newBitCoins,
    icon: <CoinsIcon />,
    list: [
      {
        title: announcement.addBitCoinsBTC_CBT_NBQ,
        date: announcement.sampleDate,
        important: true,
        link: '',
      },
      {
        title: announcement.addBitCoinsBTC_CBT_NBQ,
        date: announcement.sampleDate,
        important: true,
        link: '',
      },
      {
        title: announcement.addBitCoinsBTC_CBT_NBQ,
        date: announcement.sampleDate,
        important: false,
        link: '',
      },
      {
        title: announcement.addBitCoinsBTC_CBT_NBQ,
        date: announcement.sampleDate,
        important: false,
        link: '',
      },
      {
        title: announcement.addBitCoinsBTC_CBT_NBQ,
        date: announcement.sampleDate,
        important: false,
        link: '',
      },
    ],
  },
  {
    title: global.transaction,
    icon: <TransactioIcon />,
    list: [
      {
        title: announcement.addBitCoinsBTC_CBT_NBQ,
        date: announcement.sampleDate,
        important: true,
        link: '',
      },
      {
        title: announcement.addBitCoinsBTC_CBT_NBQ,
        date: announcement.sampleDate,
        important: true,
        link: '',
      },
      {
        title: announcement.addBitCoinsBTC_CBT_NBQ,
        date: announcement.sampleDate,
        important: false,
        link: '',
      },
      {
        title: announcement.addBitCoinsBTC_CBT_NBQ,
        date: announcement.sampleDate,
        important: false,
        link: '',
      },
      {
        title: announcement.addBitCoinsBTC_CBT_NBQ,
        date: announcement.sampleDate,
        important: false,
        link: '',
      },
    ],
  },
  {
    title: global.updates,
    icon: <UpdatesIcon />,
    list: [
      {
        title: announcement.addBitCoinsBTC_CBT_NBQ,
        date: announcement.sampleDate,
        important: true,
        link: '',
      },
      {
        title: announcement.addBitCoinsBTC_CBT_NBQ,
        date: announcement.sampleDate,
        important: true,
        link: '',
      },
      {
        title: announcement.addBitCoinsBTC_CBT_NBQ,
        date: announcement.sampleDate,
        important: false,
        link: '',
      },
      {
        title: announcement.addBitCoinsBTC_CBT_NBQ,
        date: announcement.sampleDate,
        important: false,
        link: '',
      },
      {
        title: announcement.addBitCoinsBTC_CBT_NBQ,
        date: announcement.sampleDate,
        important: false,
        link: '',
      },
    ],
  },
];
