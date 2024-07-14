import { LangFileNames } from '@/language/langTypes';

const getLang = (
  ids: LangFileNames | LangFileNames[],
): Array<Record<string, string>> => {
  const locale =
    typeof window !== 'undefined' ? localStorage.getItem('locale') : 'fa';

  if (ids) {
    const result: Array<Record<string, string>> = [];
    if (Array.isArray(ids)) {
      ids.forEach((id) => {
        const messages = require(`./../../public/lang/${
          locale || 'fa'
        }/${id}.json`);
        const parsedMessages = [JSON.parse(JSON.stringify(messages))];
        const filteredData = parsedMessages.map((obj) => {
          const newObj: Record<string, string> = {};
          Object.keys(obj).forEach((key) => {
            newObj[key] = obj[key];
          });
          return newObj;
        });
        result.push(filteredData[0]);
      });
    } else {
      const messages = require(`./../../public/lang/fa/${ids}.json`);
      const parsedMessages = [JSON.parse(JSON.stringify(messages))];
      const filteredData = parsedMessages.map((obj) => {
        const newObj: Record<string, string> = {};
        Object.keys(obj).forEach((key) => {
          newObj[key] = obj[key];
        });
        return newObj;
      });
      result.push(filteredData[0]);
    }
    return result;
  }
  return [];
};

export default getLang;
