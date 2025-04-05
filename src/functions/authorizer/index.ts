import { Resource } from 'sst';

export const handler = async (event: any) => {
  const apiKey = event.identitySource?.[0] as string;

  return {
    isAuthorized: !!(apiKey && apiKey === Resource.API_KEY.value),
  };
};
