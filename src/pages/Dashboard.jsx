
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
  SignalSlashIcon,
  ChartBarIcon,
  EyeIcon,
  ShareIcon,
  BoltIcon,
  ExclamationTriangleIcon,
  RocketLaunchIcon
} from '@heroicons/react/24/outline';
import { 
  CheckCircleIcon as CheckCircleIconSolid,
  ClockIcon as ClockIconSolid,
  DocumentTextIcon as DocumentTextIconSolid
} from '@heroicons/react/24/solid';
import { format, isSameDay, parseISO, startOfDay } from 'date-fns';

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
      draft: { 
        color: 'bg-amber-100 text-amber-800 border-amber-200', 
        icon: PencilSquareIcon, 
        label: 'Draft',
        iconSolid: DocumentTextIconSolid
      },
      scheduled: { 
        color: 'bg-blue-100 text-blue-800 border-blue-200', 
        icon: ClockIcon, 
        label: 'Scheduled',
        iconSolid: ClockIconSolid
      },
      published: { 
        color: 'bg-emerald-100 text-emerald-800 border-emerald-200', 
        icon: CheckCircleIcon, 
        label: 'Published',
        iconSolid: CheckCircleIconSolid
      }
    };
    
    const config = statusConfig[status] || statusConfig.draft;
    const IconComponent = config.iconSolid;
    
    return (
      <Badge className={`${config.color} border flex items-center gap-1.5 px-2.5 py-1`}>
        <IconComponent className="w-3.5 h-3.5" />
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
      .map(post => startOfDay(parseISO(post.scheduled_at)));
    return datesWithPosts;
  };

  const selectedDatePosts = getPostsForDate(selectedDate);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-3 border-blue-600 mx-auto mb-6"></div>
          <p className="text-slate-600 text-lg font-medium">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="container mx-auto px-6 py-8 space-y-8">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
              Dashboard
            </h1>
            <p className="text-slate-600 text-lg">Manage your social media presence with ease</p>
          </div>
          <Button asChild size="lg" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-200">
            <Link to="/create-post" className="gap-2">
              <PlusIcon className="w-5 h-5" />
              Create New Post
            </Link>
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-slate-600">Total Posts</p>
                  <p className="text-3xl font-bold text-slate-900">{posts.length}</p>
                  <p className="text-xs text-slate-500">All your content</p>
                </div>
                <div className="h-16 w-16 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <DocumentTextIconSolid className="w-8 h-8 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-slate-600">Scheduled</p>
                  <p className="text-3xl font-bold text-slate-900">{posts.filter(p => p.status === 'scheduled').length}</p>
                  <p className="text-xs text-slate-500">Ready to publish</p>
                </div>
                <div className="h-16 w-16 bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <ClockIconSolid className="w-8 h-8 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-slate-600">Active Platforms</p>
                  <p className="text-3xl font-bold text-slate-900">{enabledPlatforms.length}</p>
                  <p className="text-xs text-slate-500">Connected accounts</p>
                </div>
                <div className="h-16 w-16 bg-gradient-to-br from-emerald-500 to-green-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <RocketLaunchIcon className="w-8 h-8 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-lg">
          <CardContent className="p-0">
            <Tabs defaultValue="list" className="w-full">
              <div className="px-6 pt-6 pb-0">
                <TabsList className="grid w-full grid-cols-2 lg:w-[400px] bg-slate-100/80 p-1">
                  <TabsTrigger value="list" className="gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm">
                    <DocumentTextIcon className="w-4 h-4" />
                    List View
                  </TabsTrigger>
                  <TabsTrigger value="calendar" className="gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm">
                    <CalendarDaysIcon className="w-4 h-4" />
                    Calendar View
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="list" className="p-6 space-y-6">
                <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
                  {/* Posts Section */}
                  <div className="xl:col-span-3">
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 mb-6">
                        <ChartBarIcon className="w-6 h-6 text-blue-600" />
                        <h2 className="text-xl font-semibold text-slate-900">Recent Posts</h2>
                      </div>

                      {/* Filters */}
                      <div className="flex flex-col sm:flex-row gap-3 mb-6">
                        <select
                          value={filters.status}
                          onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                          className="px-4 py-2.5 border border-slate-200 rounded-lg bg-white/80 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
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
                          className="px-4 py-2.5 border border-slate-200 rounded-lg bg-white/80 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        />
                      </div>

                      {/* Posts List */}
                      {posts.length === 0 ? (
                        <div className="text-center py-16">
                          <div className="w-20 h-20 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center mx-auto mb-6">
                            <DocumentTextIcon className="w-10 h-10 text-slate-400" />
                          </div>
                          <h3 className="text-xl font-semibold text-slate-900 mb-2">No posts yet</h3>
                          <p className="text-slate-600 mb-6">Create your first post to get started with social media management.</p>
                          <Button asChild variant="outline" size="lg" className="gap-2">
                            <Link to="/create-post">
                              <PlusIcon className="w-4 h-4" />
                              Create your first post
                            </Link>
                          </Button>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {posts.map(post => (
                            <Card key={post.id} className="bg-white/80 backdrop-blur-sm border-0 shadow-md hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5">
                              <CardContent className="p-6">
                                <div className="flex justify-between items-start mb-4">
                                  <h4 className="font-semibold text-lg text-slate-900 line-clamp-1">{post.title}</h4>
                                  {getStatusBadge(post.status)}
                                </div>
                                <p className="text-slate-600 text-sm mb-4 line-clamp-2">
                                  {post.content}
                                </p>
                                <div className="flex flex-wrap gap-2 mb-4">
                                  {post.platforms?.map(p => (
                                    <Badge key={p.type} variant="secondary" className="text-xs bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors">
                                      {p.type}
                                    </Badge>
                                  )) || <Badge variant="outline" className="text-xs">No platforms</Badge>}
                                </div>
                                <div className="flex justify-between items-center">
                                  <div className="flex items-center gap-2 text-xs text-slate-500">
                                    <ClockIcon className="w-4 h-4" />
                                    Scheduled: {formatDate(post.scheduled_at)}
                                  </div>
                                  <Button asChild size="sm" variant="outline" className="gap-1.5">
                                    <Link to={`/edit-post/${post.id}`}>
                                      <PencilSquareIcon className="w-4 h-4" />
                                      Edit
                                    </Link>
                                  </Button>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Platforms Section */}
                  <div className="xl:col-span-1">
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 mb-6">
                        <Cog6ToothIcon className="w-6 h-6 text-emerald-600" />
                        <h2 className="text-xl font-semibold text-slate-900">Platforms</h2>
                      </div>

                      <div className="space-y-3">
                        {platforms.map(platform => {
                          const isActive = enabledPlatforms.some(ep => ep.id === platform.id);
                          return (
                            <Card key={platform.id} className="bg-white/80 backdrop-blur-sm border-0 shadow-md hover:shadow-lg transition-all duration-200">
                              <CardContent className="p-4">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-3">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                      isActive 
                                        ? 'bg-gradient-to-br from-emerald-500 to-green-500' 
                                        : 'bg-gradient-to-br from-slate-200 to-slate-300'
                                    }`}>
                                      {isActive ? (
                                        <SignalIcon className="w-5 h-5 text-white" />
                                      ) : (
                                        <SignalSlashIcon className="w-5 h-5 text-slate-500" />
                                      )}
                                    </div>
                                    <div>
                                      <p className="font-medium text-slate-900">{platform.name}</p>
                                      <p className="text-xs text-slate-500">
                                        {isActive ? 'Connected & Active' : 'Not Connected'}
                                      </p>
                                    </div>
                                  </div>
                                  <Badge variant={isActive ? 'default' : 'secondary'} className={
                                    isActive 
                                      ? 'bg-emerald-100 text-emerald-800 border-emerald-200' 
                                      : 'bg-slate-100 text-slate-600'
                                  }>
                                    {isActive ? 'Active' : 'Inactive'}
                                  </Badge>
                                </div>
                              </CardContent>
                            </Card>
                          );
                        })}
                      </div>
                      
                      <Button asChild variant="outline" className="w-full mt-6 gap-2">
                        <Link to="/settings">
                          <Cog6ToothIcon className="w-4 h-4" />
                          Manage Platforms
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="calendar" className="p-6 space-y-6">
                <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
                  {/* Calendar */}
                  <div className="xl:col-span-3">
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 mb-6">
                        <CalendarDaysIcon className="w-6 h-6 text-purple-600" />
                        <h2 className="text-xl font-semibold text-slate-900">Scheduled Posts Calendar</h2>
                      </div>
                      
                      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-md">
                        <CardContent className="p-6">
                          <Calendar
                            mode="single"
                            selected={selectedDate}
                            onSelect={setSelectedDate}
                            className="rounded-lg border-0 w-full"
                            modifiers={{
                              hasPost: getDateWithPosts()
                            }}
                            modifiersStyles={{
                              hasPost: { 
                                backgroundColor: 'rgb(99 102 241)', 
                                color: 'white',
                                fontWeight: 'bold',
                                borderRadius: '6px'
                              }
                            }}
                          />
                        </CardContent>
                      </Card>
                    </div>
                  </div>

                  {/* Selected Date Posts */}
                  <div className="xl:col-span-1">
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 mb-6">
                        <EyeIcon className="w-6 h-6 text-indigo-600" />
                        <h2 className="text-lg font-semibold text-slate-900">
                          {format(selectedDate, 'MMM dd, yyyy')}
                        </h2>
                      </div>

                      {selectedDatePosts.length === 0 ? (
                        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-md">
                          <CardContent className="p-6 text-center">
                            <div className="w-16 h-16 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center mx-auto mb-4">
                              <CalendarDaysIcon className="w-8 h-8 text-slate-400" />
                            </div>
                            <h3 className="font-medium text-slate-900 mb-2">No posts scheduled</h3>
                            <p className="text-sm text-slate-600">No posts are scheduled for this date.</p>
                          </CardContent>
                        </Card>
                      ) : (
                        <div className="space-y-3">
                          {selectedDatePosts.map(post => (
                            <Card key={post.id} className="bg-white/80 backdrop-blur-sm border-0 shadow-md hover:shadow-lg transition-all duration-200">
                              <CardContent className="p-4">
                                <div className="flex justify-between items-start mb-3">
                                  <h5 className="font-medium text-sm text-slate-900 line-clamp-2">{post.title}</h5>
                                  <Badge variant="secondary" className="text-xs bg-indigo-100 text-indigo-800 ml-2 shrink-0">
                                    {format(parseISO(post.scheduled_at), 'HH:mm')}
                                  </Badge>
                                </div>
                                <p className="text-xs text-slate-600 mb-3 line-clamp-2">
                                  {post.content}
                                </p>
                                <div className="flex justify-between items-center">
                                  <div className="flex gap-1 flex-wrap">
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
                                  <Button asChild size="sm" variant="ghost" className="h-8 w-8 p-0">
                                    <Link to={`/edit-post/${post.id}`}>
                                      <PencilSquareIcon className="w-4 h-4" />
                                    </Link>
                                  </Button>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
