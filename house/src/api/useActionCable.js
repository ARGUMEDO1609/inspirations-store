import { useEffect } from 'react';
import consumer from '../api/cable';

const useActionCable = (channel, handlers) => {
  useEffect(() => {
    const subscription = consumer.subscriptions.create(channel, {
      received(data) {
        if (handlers[data.type]) {
          handlers[data.type](data);
        }
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [channel, handlers]);
};

export default useActionCable;
