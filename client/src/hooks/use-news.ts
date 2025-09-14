import { useQuery } from '@tanstack/react-query';
import { NewsResponse } from '@shared/schema';
import { useSettings } from '@/contexts/settings-context';

interface UseNewsProps {
  temperature?: number;
  condition?: string;
  page?: number;
  pageSize?: number;
}

export const useNews = ({ temperature, condition, page = 1, pageSize = 20 }: UseNewsProps = {}) => {
  const { settings } = useSettings();

  const enabledCategories = Object.entries(settings.newsCategories)
    .filter(([_, enabled]) => enabled)
    .map(([category, _]) => category)
    .join(',');

  return useQuery<NewsResponse>({
    queryKey: ['/api/news', temperature, condition, enabledCategories, page, pageSize, settings.weatherFiltering],
    queryFn: async () => {
      const params = new URLSearchParams({
        categories: enabledCategories || 'general',
        page: page.toString(),
        pageSize: pageSize.toString(),
      });

      if (settings.weatherFiltering && temperature && condition) {
        params.append('temperature', temperature.toString());
        params.append('condition', condition);
      }

      const response = await fetch(`/api/news?${params}`, {
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch news data');
      }
      
      return response.json();
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 15 * 60 * 1000, // 15 minutes
  });
};
