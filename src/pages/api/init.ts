import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(_: NextApiRequest, res: NextApiResponse) {
  try {
    const settingsResponse = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/setting?section=site`,
    );

    if (!settingsResponse.ok) {
      res
        .status(settingsResponse.status)
        .json({ error: 'Failed to fetch settings' });
      return;
    }

    const settings = await settingsResponse.json();

    const [lang_base_url, default_icon_base_url, live_chat_status] = [
      'languages-base-url',
      'currencies-base-url',
      'Livechat-status',
    ].map((setting) => {
      const result = settings?.result?.find((item: any) => item.key === setting)
        ?.value;
      return result;
    });

    if (!lang_base_url) {
      res
        .status(400)
        .json({ error: 'Language base URL not found in settings' });
      return;
    }

    res.status(200).json({
      lang_base_url,
      default_icon_base_url,
      live_chat_status,
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
