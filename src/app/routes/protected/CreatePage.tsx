import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, Input } from '@/components/ui';
import { Sparkles, Clock, Send } from 'lucide-react';
import { supabase } from '@/services/supabase';
import { useToast } from '@/hooks/useToast';

const CreatePage: React.FC = () => {
  const { showSuccess, showError } = useToast();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      showError('Email is required', 'Validation');
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase
        .from('create_interest')
        .insert({ email: email.trim(), name: name.trim() || null, message: message.trim() || null });
      if (error) throw error;
      showSuccess('Thanks! We will reach out when Create is live.', 'Submitted');
      setName('');
      setEmail('');
      setMessage('');
    } catch (err: any) {
      showError(err.message || 'Failed to submit interest', 'Error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-xl w-full bg-white rounded-lg shadow-lg border border-gray-200 p-8">
        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-primary-100 mb-6">
          <Sparkles className="h-8 w-8 text-primary-600" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 text-center">
          Create (beta) coming soon
        </h1>
        <p className="text-gray-600 mb-6 text-center">
          Tell us you’re interested and we’ll notify you when creation tools launch.
        </p>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <Input
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name (optional)"
          />
          <Input
            label="Email *"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">What do you need?</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="Describe your use-case or features you want"
            />
          </div>
          <Button type="submit" loading={loading} className="w-full bg-primary-600 hover:bg-primary-700 text-white border-primary-600">
            <Send className="h-4 w-4 mr-2" />
            Notify Me
          </Button>
        </form>
        <div className="flex items-center justify-center text-sm text-gray-500 mt-6">
          <Clock className="h-4 w-4 mr-2" />
          <span>We’ll only email for Create updates.</span>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 justify-center mt-6">
          <Button asChild>
            <Link to="/library">Browse Library</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/">Go Home</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CreatePage;