import { createConsumer } from '@rails/actioncable';

const cableUrl = import.meta.env.VITE_CABLE_URL || 'ws://127.0.0.1:3000/cable';
const token = localStorage.getItem('token');
const consumer = createConsumer(`${cableUrl}${token ? `?token=${token}` : ''}`);


export default consumer;
