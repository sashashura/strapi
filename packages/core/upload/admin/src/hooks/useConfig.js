import { useMutation, useQuery, useQueryClient } from 'react-query';
import { useNotification, useTracking } from '@strapi/helper-plugin';

import { axiosInstance } from '../utils';
import pluginId from '../pluginId';

const endpoint = `/${pluginId}/configuration`;
const queryKey = [pluginId, 'configuration'];

export const useConfig = () => {
  const queryClient = useQueryClient();
  const { trackUsage } = useTracking();
  const toggleNotification = useNotification();

  const config = useQuery(
    queryKey,
    async () => {
      const res = await axiosInstance({
        method: 'get',
        url: endpoint,
      });

      return res.data;
    },
    {
      onError: () =>
        toggleNotification({
          type: 'warning',
          message: { id: 'notification.error' },
        }),
    }
  );

  const putMutation = useMutation(
    (body) => {
      axiosInstance.put(endpoint, body);
    },
    {
      onSuccess() {
        trackUsage('didEditMediaLibraryConfig');
        queryClient.refetchQueries(queryKey, { active: true });
      },
      onError: () =>
        toggleNotification({
          type: 'warning',
          message: { id: 'notification.error' },
        }),
    }
  );

  return {
    config,
    mutation: putMutation,
  };
};
