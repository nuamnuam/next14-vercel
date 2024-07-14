import { showToast } from '@/components/ToastProvider';
import { authStore } from '@/store';

const PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export type UploaderResponse = {
  data: any | null;
  error: string | null;
};

export default async function formUploader(
  data: FormData,
  routeName: string,
): Promise<UploaderResponse> {
  const token = authStore.getState().token;

  try {
    const response = await fetch(PUBLIC_API_URL + routeName, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: data,
    });

    if (!response.ok) {
      const errorBody = await response.json();
      if (errorBody?.result && !Array.isArray(errorBody?.result)) {
        const errors = errorBody?.result;
        const finalError: string[] = [];
        Object.values(errors).forEach((item) => {
          finalError.push(item as string);
        });
        showToast.danger(finalError);
      } else if (errorBody?.message) {
        showToast.danger(errorBody?.message);
      }

      return { data: null, error: errorBody || 'API Error' };
    }

    const responseData = await response.json();
    return { data: responseData, error: null };
  } catch (e) {
    showToast.danger('An unknown error occurred');
    return { data: null, error: 'An unknown error occurred' };
  }
}
