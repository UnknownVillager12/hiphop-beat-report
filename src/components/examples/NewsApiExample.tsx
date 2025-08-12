import React from 'react';
import { useNews, useCreateNews, useDeleteNews } from '@/hooks/useNews';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Plus, Trash2 } from 'lucide-react';

// Example component showing how to use the news API hooks
export const NewsApiExample = () => {
  const { data: newsArticles, isLoading, error } = useNews();
  const createNewsMutation = useCreateNews();
  const deleteNewsMutation = useDeleteNews();

  const handleCreateNews = () => {
    createNewsMutation.mutate({
      title: "Sample News Article",
      excerpt: "This is a sample excerpt",
      content: "This is the full content of the article",
      author: "John Doe",
      category: "Hip-Hop",
      tags: ["sample", "demo"]
    });
  };

  const handleDeleteNews = (id: string) => {
    deleteNewsMutation.mutate(id);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading news articles...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center">
        <p className="text-destructive">Error loading news articles</p>
        <p className="text-sm text-muted-foreground mt-2">
          Make sure your API server is running on the configured URL
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">News API Example</h2>
        <Button 
          onClick={handleCreateNews}
          disabled={createNewsMutation.isPending}
        >
          {createNewsMutation.isPending ? (
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
          ) : (
            <Plus className="h-4 w-4 mr-2" />
          )}
          Create Sample Article
        </Button>
      </div>

      <div className="grid gap-4">
        {newsArticles?.map((article) => (
          <Card key={article.id}>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">{article.title}</CardTitle>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleDeleteNews(article.id)}
                disabled={deleteNewsMutation.isPending}
              >
                {deleteNewsMutation.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Trash2 className="h-4 w-4" />
                )}
              </Button>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-2">{article.excerpt}</p>
              <div className="flex gap-2 text-sm text-muted-foreground">
                <span>By {article.author}</span>
                <span>•</span>
                <span>{article.category}</span>
                <span>•</span>
                <span>{article.readTime}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};