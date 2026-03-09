import { createConsumer } from '@rails/actioncable';

const cableUrl = import.meta.env.VITE_CABLE_URL || 'ws://127.0.0.1:3000/cable';
const consumer = createConsumer(cableUrl);

export default consumer;
