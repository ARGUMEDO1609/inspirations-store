const formatterCache = new Map();

const getFormatter = (minimumFractionDigits, maximumFractionDigits) => {
  const key = `${minimumFractionDigits}-${maximumFractionDigits}`;

  if (!formatterCache.has(key)) {
    formatterCache.set(
      key,
      new Intl.NumberFormat('es-CO', {
        style: 'decimal',
        minimumFractionDigits,
        maximumFractionDigits
      })
    );
  }

  return formatterCache.get(key);
};

export const formatCOP = (value, options = {}) => {
  const { minimumFractionDigits = 0, maximumFractionDigits = 0 } = options;
  const numeric = Number(value);

  if (Number.isNaN(numeric)) {
    return `${getFormatter(minimumFractionDigits, maximumFractionDigits).format(0)} COP`;
  }

  return `${getFormatter(minimumFractionDigits, maximumFractionDigits).format(numeric)} COP`;
};
