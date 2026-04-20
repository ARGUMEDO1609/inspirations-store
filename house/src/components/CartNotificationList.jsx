import { useCartNotification } from '../context/CartNotificationContext';

const variantStyles = {
  success: 'border-emerald-400 bg-emerald-500/10 text-emerald-300',
  info: 'border-sky-400 bg-sky-500/10 text-sky-200',
  error: 'border-rose-500 bg-rose-500/10 text-rose-200'
};

const CartNotificationList = () => {
  const { notifications, removeNotification } = useCartNotification();

  if (notifications.length === 0) return null;

  return (
    <div className="pointer-events-none fixed bottom-6 right-6 z-[1000] flex max-w-xs flex-col gap-3">
      {notifications.map(({ id, message, variant }) => (
        <div
          key={id}
          className={`pointer-events-auto flex items-center justify-between gap-3 rounded-[1.4rem] border px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.24em] shadow-2xl ${variantStyles[variant] || variantStyles.info}`}
        >
          <span className="flex-1 leading-relaxed text-[var(--text-primary)]">
            {message}
          </span>
          <button
            onClick={() => removeNotification(id)}
            className="text-xs uppercase tracking-[0.28em] text-[var(--text-muted)] transition hover:text-[var(--text-primary)]"
          >
            Cerrar
          </button>
        </div>
      ))}
    </div>
  );
};

export default CartNotificationList;
