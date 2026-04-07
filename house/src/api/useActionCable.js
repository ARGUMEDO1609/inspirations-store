import { useEffect } from 'react';
import { getCableConsumer } from '../api/cable';

const useActionCable = (channel, handlers, enabled = true) => {
  useEffect(() => {
    if (!enabled) {
      return undefined;
    }

    const consumer = getCableConsumer();
    if (!consumer) {
      return undefined;
    }

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
  }, [channel, handlers, enabled]);
};

export default useActionCable;
