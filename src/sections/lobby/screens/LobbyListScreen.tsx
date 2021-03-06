import {MatchComponent} from '../components/MatchComponent';
import React, {useCallback, useEffect} from 'react';
import {FlatList} from 'react-native';
import {Endpoint} from 'api/endpoint';
import {Match} from 'api/types/match';
import {useQuery} from 'api/useQuery';
import {Box} from 'components/Box';
import {EmptyStateView} from 'components/EmptyStateView';
import {LoadingView} from 'components/LoadingView';
import {ToastType} from 'components/toast/Toast';
import {useToast} from 'components/toast/ToastProvider';

const ListEmptyComponent = () => {
  return <EmptyStateView message="No matches found" />;
};

export const LobbyListScreen = () => {
  const {showToast} = useToast();

  const {data, error, isLoading, refresh, isRefreshing} = useQuery<Endpoint.openMatches>({
    endpoint: Endpoint.openMatches,
  });

  useEffect(() => {
    if (error) {
      showToast({message: error.message, type: ToastType.error});
    }
  }, [error, showToast]);

  const renderItem = useCallback(({item}: {item: Match}) => {
    return <MatchComponent match={item} />;
  }, []);

  if (isLoading) {
    return <LoadingView message="Loading matches" />;
  }

  const matches = data ?? [];

  return (
    <Box flex={1} backgroundColor="background">
      <FlatList
        data={matches}
        ListEmptyComponent={ListEmptyComponent}
        renderItem={renderItem}
        onRefresh={refresh}
        refreshing={isRefreshing}
        keyExtractor={item => item.id}
      />
    </Box>
  );
};
