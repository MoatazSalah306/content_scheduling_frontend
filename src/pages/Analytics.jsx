import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  ResponsiveContainer
} from 'recharts';
import {
  TrendingUp,
  Calendar,
  FileText,
  CheckCircle,
  Clock,
  XCircle,
  BarChart3,
  Activity,
  ExternalLink,
  ChevronLeft
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

const Analytics = () => {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [quickStats, setQuickStats] = useState(null);
  const [timeframe, setTimeframe] = useState('30');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPlatform, setSelectedPlatform] = useState(null);
  const [platformAnalytics, setPlatformAnalytics] = useState(null);
  const [platformLoading, setPlatformLoading] = useState(false);
  const [platformError, setPlatformError] = useState(null);

  // Colors for charts
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];
  const POST_STATUS_COLORS = {
    Draft: '#6b7280',
    Scheduled: '#3b82f6',
    Published: '#10b981'
  };
  const PLATFORM_STATUS_COLORS = {
    Pending: '#f59e0b',
    Published: '#10b981',
    Failed: '#ef4444'
  };

  useEffect(() => {
    fetchAnalytics();
    fetchQuickStats();
  }, [timeframe]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch(`http://127.0.0.1:8000/api/analytics?timeframe=${timeframe}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch analytics data: ${response.statusText}`);
      }

      const data = await response.json();
      setAnalyticsData(data.data || {
        active_platforms: [],
        publishing_stats: {
          success_rate: 0,
          platform_published: 0,
          platform_pending: 0,
          platform_failed: 0,
          draft_posts: 0,
          scheduled_posts: 0,
          published_posts: 0
        },
        posts_per_platform: [],
        status_counts: {
          post_statuses: [],
          platform_statuses: []
        },
        timeline_data: [],
        platform_performance: []
      });
      setError(null);
    } catch (err) {
      setError(err.message || 'An unexpected error occurred while fetching analytics data');
      console.error('Error fetching analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchQuickStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://127.0.0.1:8000/api/analytics/quick-stats?timeframe=7`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch quick stats: ${response.statusText}`);
      }

      const data = await response.json();
      setQuickStats(data.data || {
        total_posts: 0,
        published_today: 0,
        scheduled_posts: 0
      });
    } catch (err) {
      setError(err.message || 'An unexpected error occurred while fetching quick stats');
      console.error('Error fetching quick stats:', err);
    }
  };

  const fetchPlatformAnalytics = async (platformId) => {
    try {
      setPlatformLoading(true);
      setPlatformError(null);
      const token = localStorage.getItem('token');
      const response = await fetch(`http://127.0.0.1:8000/api/analytics/platform/${platformId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch platform analytics: ${response.statusText}`);
      }

      const data = await response.json();
      setPlatformAnalytics(data.data);
    } catch (err) {
      setPlatformError(err.message || 'An unexpected error occurred while fetching platform analytics');
      console.error('Error fetching platform analytics:', err);
    } finally {
      setPlatformLoading(false);
    }
  };

  const handlePlatformClick = (platform) => {
    setSelectedPlatform(platform);
    fetchPlatformAnalytics(platform.id);
  };

  const closePlatformModal = () => {
    setSelectedPlatform(null);
    setPlatformAnalytics(null);
  };

  const formatChartData = (data) => {
    return data?.map((item, index) => ({
      ...item,
      fill: COLORS[index % COLORS.length]
    })) || [];
  };

  const formatPlatformAnalyticsData = (analytics) => {
    if (!analytics) return [];
    
    // Group by date and transform for chart
    const groupedByDate = analytics.analytics.reduce((acc, item) => {
      if (!acc[item.date]) {
        acc[item.date] = {
          date: item.date,
          published: 0,
          pending: 0,
          failed: 0
        };
      }
      acc[item.date][item.platform_status] = item.count;
      return acc;
    }, {});

    return Object.values(groupedByDate);
  };

  const StatCard = ({ title, value, description, icon: Icon, trend }) => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
        {trend && (
          <div className="flex items-center pt-1">
            <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
            <span className="text-xs text-green-500">{trend}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center text-red-500">
              <XCircle className="h-12 w-12 mx-auto mb-4" />
              <p>{error}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Analytics</h1>
          <p className="text-muted-foreground">
            Track your content performance and engagement
          </p>
        </div>
        <Select value={timeframe} onValueChange={setTimeframe}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Select timeframe" />
          </SelectTrigger>
          <SelectContent style={{ backgroundColor: "white" }}>
            <SelectItem value="7">Last 7 days</SelectItem>
            <SelectItem value="30">Last 30 days</SelectItem>
            <SelectItem value="90">Last 90 days</SelectItem>
            <SelectItem value="365">Last year</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Quick Stats */}
      {quickStats && analyticsData && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Posts"
            value={quickStats.total_posts}
            description="All time posts created"
            icon={FileText}
          />
          <StatCard
            title="Published Today"
            value={quickStats.published_today}
            description="Posts published today"
            icon={CheckCircle}
          />
          <StatCard
            title="Scheduled"
            value={quickStats.scheduled_posts}
            description="Posts waiting to publish"
            icon={Clock}
          />
          <StatCard
            title="Active Platforms"
            value={analyticsData.active_platforms.length}
            description="Connected social platforms"
            icon={Activity}
          />
        </div>
      )}

      {/* Active Platforms */}
      {analyticsData && analyticsData.active_platforms?.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Active Platforms</CardTitle>
            <CardDescription>Your connected social platforms</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {analyticsData.active_platforms.map((platform, index) => (
                <div 
                  key={index} 
                  className="flex items-center justify-between p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => handlePlatformClick(platform)}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-primary"></div>
                    <div>
                      <div className="font-semibold">{platform.name}</div>
                      <div className="text-sm text-muted-foreground capitalize">{platform.type}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">
                      {platform.character_limit} chars
                    </Badge>
                    <ExternalLink className="h-4 w-4 text-muted-foreground" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Platform Analytics Modal */}
      <Dialog open={!!selectedPlatform} onOpenChange={closePlatformModal}>
        <DialogContent className="max-w-4xl max-h-[90vh] z-[1000] overflow-y-auto bg-white">
          {platformLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : platformError ? (
            <div className="text-center text-red-500">
              <XCircle className="h-12 w-12 mx-auto mb-4" />
              <p>{platformError}</p>
            </div>
          ) : platformAnalytics ? (
            <>
              <DialogHeader>
                <div className="flex items-center gap-4">
                  <button 
                    onClick={closePlatformModal}
                    className="p-1 rounded-full hover:bg-gray-100"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <div>
                    <DialogTitle>{platformAnalytics.platform.name} Analytics</DialogTitle>
                    <p className="text-sm text-muted-foreground">
                      Last {platformAnalytics.timeframe} days performance
                    </p>
                  </div>
                </div>
              </DialogHeader>

              <div className="grid gap-6">
                {/* Platform Summary */}
                <div className="grid gap-4 md:grid-cols-3">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Platform Type</CardTitle>
                      <Activity className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-xl font-bold capitalize">
                        {platformAnalytics.platform.type}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Character Limit</CardTitle>
                      <FileText className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-xl font-bold">
                        {platformAnalytics.platform.character_limit}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Total Posts</CardTitle>
                      <BarChart3 className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-xl font-bold">
                        {platformAnalytics.analytics.reduce((sum, item) => sum + item.count, 0)}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Platform Timeline */}
                <Card>
                  <CardHeader>
                    <CardTitle>Post Activity Timeline</CardTitle>
                    <CardDescription>
                      Posts by status over the last {platformAnalytics.timeframe} days
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={400}>
                      <LineChart data={formatPlatformAnalyticsData(platformAnalytics)}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line 
                          type="monotone" 
                          dataKey="published" 
                          stroke="#10b981" 
                          strokeWidth={2}
                          name="Published"
                        />
                        <Line 
                          type="monotone" 
                          dataKey="pending" 
                          stroke="#f59e0b" 
                          strokeWidth={2}
                          name="Pending"
                        />
                        <Line 
                          type="monotone" 
                          dataKey="failed" 
                          stroke="#ef4444" 
                          strokeWidth={2}
                          name="Failed"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                {/* Platform Status Distribution */}
                <Card>
                  <CardHeader>
                    <CardTitle>Status Distribution</CardTitle>
                    <CardDescription>
                      Breakdown of posts by current status
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={platformAnalytics.analytics.reduce((acc, item) => {
                            const existing = acc.find(i => i.status === item.platform_status);
                            if (existing) {
                              existing.count += item.count;
                            } else {
                              acc.push({
                                status: item.platform_status,
                                count: item.count
                              });
                            }
                            return acc;
                          }, [])}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ status, count }) => `${status}: ${count}`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="count"
                        >
                          {platformAnalytics.analytics.map((entry, index) => (
                            <Cell 
                              key={`cell-${index}`} 
                              fill={PLATFORM_STATUS_COLORS[entry.platform_status] || COLORS[index % COLORS.length]} 
                            />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>
            </>
          ) : null}
        </DialogContent>
      </Dialog>

      {/* Rest of the analytics components... */}
      {/* (Keep all the existing analytics components as they were) */}
      {analyticsData && (
        <>
          {/* Publishing Success Rate */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Publishing Performance
              </CardTitle>
              <CardDescription>
                Success rate and publishing statistics for the last {timeframe} days
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {analyticsData.publishing_stats.success_rate}%
                  </div>
                  <div className="text-sm text-muted-foreground">Platform Success Rate</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">
                    {analyticsData.publishing_stats.platform_published}
                  </div>
                  <div className="text-sm text-muted-foreground">Platform Published</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-600">
                    {analyticsData.publishing_stats.platform_pending}
                  </div>
                  <div className="text-sm text-muted-foreground">Platform Pending</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">
                    {analyticsData.publishing_stats.platform_failed}
                  </div>
                  <div className="text-sm text-muted-foreground">Platform Failed</div>
                </div>
              </div>
              
              <Separator className="my-4" />
              
              <div className="grid gap-4 md:grid-cols-3">
                <div className="text-center">
                  <div className="text-xl font-semibold">
                    {analyticsData.publishing_stats.draft_posts}
                  </div>
                  <div className="text-sm text-muted-foreground">Draft Posts</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-semibold text-blue-600">
                    {analyticsData.publishing_stats.scheduled_posts}
                  </div>
                  <div className="text-sm text-muted-foreground">Scheduled Posts</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-semibold text-green-600">
                    {analyticsData.publishing_stats.published_posts}
                  </div>
                  <div className="text-sm text-muted-foreground">Published Posts</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-6 md:grid-cols-2">
            {/* Posts per Platform */}
            <Card>
              <CardHeader>
                <CardTitle>Posts per Platform</CardTitle>
                <CardDescription>
                  Distribution of posts across social platforms
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={formatChartData(analyticsData.posts_per_platform)}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Post Status Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Post Status Distribution</CardTitle>
                <CardDescription>
                  Breakdown of posts by current status
                </CardDescription>
              </CardHeader>
              <CardContent>
                {analyticsData.status_counts.post_statuses.length === 0 ? (
                  <div className="text-center text-muted-foreground">
                    No post status data available
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={analyticsData.status_counts.post_statuses}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ status, count }) => `${status}: ${count}`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="count"
                      >
                        {analyticsData.status_counts.post_statuses.map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={POST_STATUS_COLORS[entry.status] || COLORS[index % COLORS.length]} 
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Platform Status Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Platform Status Distribution</CardTitle>
              <CardDescription>
                Breakdown of platform publishing status
              </CardDescription>
            </CardHeader>
            <CardContent>
              {analyticsData.status_counts.platform_statuses.length === 0 ? (
                <div className="text-center text-muted-foreground">
                  No platform status data available
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={analyticsData.status_counts.platform_statuses}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ status, count }) => `${status}: ${count}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="count"
                    >
                      {analyticsData.status_counts.platform_statuses.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={PLATFORM_STATUS_COLORS[entry.status] || COLORS[index % COLORS.length]} 
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>

          {/* Timeline Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Publishing Timeline</CardTitle>
              <CardDescription>
                Posts created over time by status
              </CardDescription>
            </CardHeader>
            <CardContent>
              {analyticsData.timeline_data.length === 0 ? (
                <div className="text-center text-muted-foreground">
                  No timeline data available
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={analyticsData.timeline_data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="published" 
                      stroke="#10b981" 
                      strokeWidth={2}
                      name="Published"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="scheduled" 
                      stroke="#3b82f6" 
                      strokeWidth={2}
                      name="Scheduled"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="draft" 
                      stroke="#6b7280" 
                      strokeWidth={2}
                      name="Draft"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="failed" 
                      stroke="#ef4444" 
                      strokeWidth={2}
                      name="Failed"
                    />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>

          {/* Platform Performance */}
          <Card>
            <CardHeader>
              <CardTitle>Platform Performance</CardTitle>
              <CardDescription>
                Success rates and statistics for each platform
              </CardDescription>
            </CardHeader>
            <CardContent>
              {analyticsData.platform_performance.length === 0 ? (
                <div className="text-center text-muted-foreground">
                  No platform performance data available
                </div>
              ) : (
                <div className="space-y-4">
                  {analyticsData.platform_performance.map((platform, index) => (
                    <div 
                      key={index} 
                      className="flex items-center justify-between p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                      onClick={() => handlePlatformClick({
                        id: index + 1, // This should be replaced with actual platform ID from your data
                        name: platform.name,
                        type: platform.type,
                        character_limit: platform.character_limit
                      })}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-primary"></div>
                        <div>
                          <div className="font-semibold">{platform.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {platform.total_posts} total posts
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <Badge variant="secondary">
                          {platform.published_posts} published
                        </Badge>
                        <Badge 
                          variant={platform.success_rate > 80 ? "default" : platform.success_rate > 60 ? "secondary" : "destructive"}
                        >
                          {platform.success_rate}% success
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default Analytics;