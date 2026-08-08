import { useEffect } from 'react';
import { getCableConsumer } from '../api/cable';

const useActionCable = (channel, handlers, enabled = true) => {
  useEffect(() => {
    if (!enabled) {
      return undefined;
    }

    let subscription;
    let active = true;

    (async () => {
      const consumer = await getCableConsumer();
      if (!consumer || !active) {
        return;
      }
      subscription = consumer.subscriptions.create(channel, {
        received(data) {
          if (handlers[data.type]) {
            handlers[data.type](data);
          }
        }
      });
    })();

    return () => {
      active = false;
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, [channel, handlers, enabled]);
};

export default useActionCable;
