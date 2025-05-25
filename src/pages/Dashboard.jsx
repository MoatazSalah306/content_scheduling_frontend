
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getPosts } from '../services/postService';
import { getEnabledPlatforms, getPlatforms } from '../services/platformService';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Calendar } from '../components/ui/calendar';
import { Badge } from '../components/ui/badge';
import { 
  PlusIcon, 
  DocumentTextIcon, 
  CalendarDaysIcon,
  CheckCircleIcon,
  ClockIcon,
  PencilSquareIcon,
  Cog6ToothIcon,
  SignalIcon,
  SignalSlashIcon
} from '@heroicons/react/24/outline';
import { format, isSameDay, parseISO } from 'date-fns';

const Dashboard = ({ showAlert }) => {
  const [posts, setPosts] = useState([]);
  const [platforms, setPlatforms] = useState([]);
  const [enabledPlatforms, setEnabledPlatforms] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: '',
    date: ''
  });
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    loadData();
  }, [filters]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [postsResult, platformsResult, enabledPlatformsResult] = await Promise.all([
        getPosts(filters),
        getPlatforms(),
        getEnabledPlatforms()
      ]);

      if (postsResult.success) {
        console.log(postsResult.posts);
        setPosts(postsResult.posts);
      } else {
        showAlert('error', 'Failed to load posts');
      }

      if (platformsResult.success) {
        setPlatforms(platformsResult.platforms);
      } else {
        showAlert('error', 'Failed to load platforms');
      }

      if (enabledPlatformsResult.success) {
        setEnabledPlatforms(enabledPlatformsResult.platforms);
      } else {
        showAlert('error', 'Failed to load enabled platforms');
      }
    } catch (error) {
      showAlert('error', 'Error loading dashboard data');
    }
    setLoading(false);
  };

  const formatDate = (dateString) => {
    return format(new Date(dateString), 'MMM dd, yyyy HH:mm');
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      draft: { color: 'bg-gray-100 text-gray-800', icon: PencilSquareIcon, label: 'Draft' },
      scheduled: { color: 'bg-blue-100 text-blue-800', icon: ClockIcon, label: 'Scheduled' },
      published: { color: 'bg-green-100 text-green-800', icon: CheckCircleIcon, label: 'Published' }
    };
    
    const config = statusConfig[status] || statusConfig.draft;
    const IconComponent = config.icon;
    
    return (
      <Badge className={`${config.color} flex items-center gap-1`}>
        <IconComponent className="w-3 h-3" />
        {config.label}
      </Badge>
    );
  };

  const getPostsForDate = (date) => {
    return posts.filter(post => 
      post.status === 'scheduled' && 
      isSameDay(parseISO(post.scheduled_at), date)
    );
  };

  const getDateWithPosts = () => {
    const datesWithPosts = posts
      .filter(post => post.status === 'scheduled')
      .map(post => parseISO(post.scheduled_at));
    return datesWithPosts;
  };

  const selectedDatePosts = getPostsForDate(selectedDate);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Manage your social media posts and platforms</p>
        </div>
        <Button asChild className="gap-2">
          <Link to="/create-post">
            <PlusIcon className="w-4 h-4" />
            Create New Post
          </Link>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="flex items-center p-6">
            <DocumentTextIcon className="w-8 h-8 text-blue-500 mr-4" />
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Posts</p>
              <p className="text-2xl font-bold">{posts.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center p-6">
            <ClockIcon className="w-8 h-8 text-orange-500 mr-4" />
            <div>
              <p className="text-sm font-medium text-muted-foreground">Scheduled</p>
              <p className="text-2xl font-bold">{posts.filter(p => p.status === 'scheduled').length}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center p-6">
            <SignalIcon className="w-8 h-8 text-green-500 mr-4" />
            <div>
              <p className="text-sm font-medium text-muted-foreground">Active Platforms</p>
              <p className="text-2xl font-bold">{enabledPlatforms.length}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="list" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
          <TabsTrigger value="list" className="gap-2">
            <DocumentTextIcon className="w-4 h-4" />
            List View
          </TabsTrigger>
          <TabsTrigger value="calendar" className="gap-2">
            <CalendarDaysIcon className="w-4 h-4" />
            Calendar View
          </TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Posts Section */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DocumentTextIcon className="w-5 h-5" />
                    Recent Posts
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Filters */}
                  <div className="flex flex-col sm:flex-row gap-3">
                    <select
                      value={filters.status}
                      onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                      className="px-3 py-2 border border-input rounded-md bg-background"
                    >
                      <option value="">All Status</option>
                      <option value="draft">Draft</option>
                      <option value="scheduled">Scheduled</option>
                      <option value="published">Published</option>
                    </select>

                    <input
                      type="date"
                      value={filters.date}
                      onChange={(e) => setFilters({ ...filters, date: e.target.value })}
                      className="px-3 py-2 border border-input rounded-md bg-background"
                    />
                  </div>

                  {/* Posts List */}
                  {posts.length === 0 ? (
                    <div className="text-center py-8">
                      <DocumentTextIcon className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground mb-4">No posts found.</p>
                      <Button asChild variant="outline">
                        <Link to="/create-post">Create your first post</Link>
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {posts.map(post => (
                        <Card key={post.id} className="p-4">
                          <div className="flex justify-between items-start mb-3">
                            <h4 className="font-semibold text-lg">{post.title}</h4>
                            {getStatusBadge(post.status)}
                          </div>
                          <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
                            {post.content}
                          </p>
                          <div className="flex flex-wrap gap-2 mb-3">
                            {post.platforms?.map(p => (
                              <Badge key={p.type} variant="secondary" className="text-xs">
                                {p.type}
                              </Badge>
                            )) || <Badge variant="outline" className="text-xs">No platforms</Badge>}
                          </div>
                          <div className="flex justify-between items-center">
                            <p className="text-xs text-muted-foreground">
                              Scheduled: {formatDate(post.scheduled_at)}
                            </p>
                            <Button asChild size="sm" variant="outline">
                              <Link to={`/edit-post/${post.id}`}>
                                <PencilSquareIcon className="w-4 h-4 mr-1" />
                                Edit
                              </Link>
                            </Button>
                          </div>
                        </Card>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Platforms Section */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Cog6ToothIcon className="w-5 h-5" />
                    Platform Status
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {platforms.map(platform => {
                    const isActive = enabledPlatforms.some(ep => ep.id === platform.id);
                    return (
                      <div key={platform.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          {isActive ? (
                            <SignalIcon className="w-5 h-5 text-green-500" />
                          ) : (
                            <SignalSlashIcon className="w-5 h-5 text-gray-400" />
                          )}
                          <div>
                            <p className="font-medium">{platform.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {isActive ? 'Connected' : 'Disconnected'}
                            </p>
                          </div>
                        </div>
                        <Badge variant={isActive ? 'default' : 'secondary'}>
                          {isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>
                    );
                  })}
                  
                  <Button asChild variant="outline" className="w-full mt-4">
                    <Link to="/settings">
                      <Cog6ToothIcon className="w-4 h-4 mr-2" />
                      Manage Platforms
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="calendar" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Calendar */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CalendarDaysIcon className="w-5 h-5" />
                    Scheduled Posts Calendar
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    className="rounded-md border w-full"
                    modifiers={{
                      hasPost: getDateWithPosts()
                    }}
                    modifiersStyles={{
                      hasPost: { 
                        backgroundColor: 'hsl(var(--primary))', 
                        color: 'hsl(var(--primary-foreground))',
                        fontWeight: 'bold'
                      }
                    }}
                  />
                </CardContent>
              </Card>
            </div>

            {/* Selected Date Posts */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">
                    {format(selectedDate, 'MMM dd, yyyy')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {selectedDatePosts.length === 0 ? (
                    <div className="text-center py-8">
                      <CalendarDaysIcon className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">No posts scheduled for this date</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {selectedDatePosts.map(post => (
                        <Card key={post.id} className="p-3">
                          <div className="flex justify-between items-start mb-2">
                            <h5 className="font-medium text-sm">{post.title}</h5>
                            <Badge variant="secondary" className="text-xs">
                              {format(parseISO(post.scheduled_at), 'HH:mm')}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                            {post.content}
                          </p>
                          <div className="flex justify-between items-center">
                            <div className="flex gap-1">
                              {post.platforms?.slice(0, 2).map(p => (
                                <Badge key={p.type} variant="outline" className="text-xs">
                                  {p.type}
                                </Badge>
                              ))}
                              {post.platforms?.length > 2 && (
                                <Badge variant="outline" className="text-xs">
                                  +{post.platforms.length - 2}
                                </Badge>
                              )}
                            </div>
                            <Button asChild size="sm" variant="ghost">
                              <Link to={`/edit-post/${post.id}`}>
                                <PencilSquareIcon className="w-3 h-3" />
                              </Link>
                            </Button>
                          </div>
                        </Card>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
