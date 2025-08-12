import { useEffect } from 'react';
import { useNewsStore } from '@/stores/newsStore';
import { useUserStore } from '@/stores/userStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export const ZustandExample = () => {
  const { 
    news, 
    loading: newsLoading, 
    error: newsError, 
    getAllNews, 
    clearError: clearNewsError 
  } = useNewsStore();

  const { 
    users, 
    loading: userLoading, 
    error: userError, 
    getAllUsers, 
    clearError: clearUserError 
  } = useUserStore();

  useEffect(() => {
    getAllNews();
    getAllUsers();
  }, [getAllNews, getAllUsers]);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>News with Zustand</CardTitle>
        </CardHeader>
        <CardContent>
          {newsLoading && <p>Loading news...</p>}
          {newsError && (
            <div className="text-red-500">
              {newsError}
              <Button onClick={clearNewsError} variant="outline" size="sm" className="ml-2">
                Clear Error
              </Button>
            </div>
          )}
          <div className="space-y-2">
            {news.map((article) => (
              <div key={article.id} className="p-3 border rounded">
                <h4 className="font-semibold">{article.title}</h4>
                <p className="text-sm text-muted-foreground">{article.excerpt}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Users with Zustand</CardTitle>
        </CardHeader>
        <CardContent>
          {userLoading && <p>Loading users...</p>}
          {userError && (
            <div className="text-red-500">
              {userError}
              <Button onClick={clearUserError} variant="outline" size="sm" className="ml-2">
                Clear Error
              </Button>
            </div>
          )}
          <div className="space-y-2">
            {users.map((user) => (
              <div key={user.id} className="p-3 border rounded">
                <h4 className="font-semibold">{user.name}</h4>
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};