import React from 'react';
import { Link } from 'react-router-dom';
import { Play, Download, Search, Zap } from 'lucide-react';
import { Button } from '@/components/ui';
import { BannerAd } from '@/components/ads/AdBanner';

const LandingPage: React.FC = () => {
  const features = [
    {
      icon: Search,
      title: 'Discover Memes',
      description: 'Search through thousands of audio and video memes by emotion, keyword, or type.',
    },
    {
      icon: Download,
      title: 'Easy Downloads',
      description: 'One-click downloads in high quality for your content creation needs.',
    },
    {
      icon: Play,
      title: 'Preview First',
      description: 'Listen or watch before downloading to find the perfect meme.',
    },
    {
      icon: Zap,
      title: 'Always Fresh',
      description: 'New memes added regularly to keep your content trending.',
    },
  ];

  const stats = [
    { label: 'Memes Available', value: '10,000+' },
    { label: 'Downloads', value: '1M+' },
    { label: 'Content Creators', value: '50K+' },
    { label: 'New Daily', value: '100+' },
  ];

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-32">
          <div className="text-center">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl lg:text-6xl">
              The Ultimate
              <span className="text-primary-600 block sm:inline"> Meme Library</span>
            </h1>
            <p className="mt-4 sm:mt-6 text-base sm:text-lg leading-7 sm:leading-8 text-gray-600 max-w-2xl mx-auto px-4 sm:px-0">
              Download high-quality audio and video memes for your content creation. 
              Perfect for TikTok, YouTube, Instagram, and more.
            </p>
            <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-x-6 px-4 sm:px-0">
              <Button size="lg" className="w-full sm:w-auto min-w-[200px]" asChild>
                <Link to="/library">
                  Browse Library
                </Link>
              </Button>
              <Button variant="outline" size="lg" className="w-full sm:w-auto min-w-[200px]" asChild>
                <Link to="/auth/register">
                  Get Started Free
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Background decoration */}
        <div className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]">
          <div className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-primary-200 to-primary-400 opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]" />
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-primary-600 py-12 sm:py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-6 sm:gap-8 md:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl font-bold text-white sm:text-3xl lg:text-4xl">
                  {stat.value}
                </div>
                <div className="mt-1 sm:mt-2 text-xs sm:text-sm text-primary-100">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 sm:py-24 lg:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl lg:text-4xl">
              Everything you need for viral content
            </h2>
            <p className="mt-4 sm:mt-6 text-base sm:text-lg leading-7 sm:leading-8 text-gray-600">
              Our platform provides content creators with the tools and resources 
              needed to create engaging, shareable content.
            </p>
          </div>
          <div className="mx-auto mt-12 sm:mt-16 lg:mt-24 max-w-2xl lg:max-w-none">
            <dl className="grid max-w-xl grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:max-w-none lg:grid-cols-4 lg:gap-x-8 lg:gap-y-16">
              {features.map((feature) => (
                <div key={feature.title} className="flex flex-col mobile-card p-6 sm:p-4 lg:p-0 lg:shadow-none lg:border-none lg:bg-transparent">
                  <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
                    <feature.icon className="h-6 w-6 sm:h-5 sm:w-5 flex-none text-primary-600" aria-hidden="true" />
                    {feature.title}
                  </dt>
                  <dd className="mt-3 sm:mt-4 flex flex-auto flex-col text-sm sm:text-base leading-6 sm:leading-7 text-gray-600">
                    <p className="flex-auto">{feature.description}</p>
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>

      {/* Ad Banner */}
      <div className="py-8">
        <BannerAd className="mx-auto" />
      </div>

      {/* CTA Section */}
      <div className="bg-primary-50">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:py-16 lg:py-24 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl lg:text-4xl">
              Ready to create viral content?
            </h2>
            <p className="mx-auto mt-4 sm:mt-6 max-w-2xl text-base sm:text-lg leading-7 sm:leading-8 text-gray-600 px-4 sm:px-0">
              Join thousands of content creators who use Meme Library to make their content stand out.
            </p>
            <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-x-6 px-4 sm:px-0">
              <Button size="lg" className="w-full sm:w-auto min-w-[200px]" asChild>
                <Link to="/auth/register">
                  Start Creating Now
                </Link>
              </Button>
              <Button variant="outline" size="lg" className="w-full sm:w-auto min-w-[200px]" asChild>
                <Link to="/library">
                  Explore Library
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;