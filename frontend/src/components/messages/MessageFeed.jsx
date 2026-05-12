import React from 'react';
import MessageCard from './MessageCard';
import SkeletonCard from '../shared/SkeletonCard';
import EmptyState from '../shared/EmptyState';

const MessageFeed = ({ messages, isLoading, isError }) => {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3, 4].map((i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-12 text-center border border-danger/20 rounded-lg bg-danger/5">
        <p className="text-danger font-medium mb-4">Failed to load messages</p>
        <button className="btn-outline-gold" onClick={() => window.location.reload()}>
          Retry Connection
        </button>
      </div>
    );
  }

  if (!messages || messages.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="space-y-4 pb-12">
      {messages.map((message) => (
        <MessageCard key={message.id} message={message} />
      ))}
    </div>
  );
};

export default MessageFeed;
