function formatNumberCurrency(number) {
  const numberFormatCurrency = Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
  return numberFormatCurrency.format(number);
}

function formatNumberPercent(number) {
  const numberFormatPercent = Intl.NumberFormat('pt-BR', {
    style: 'decimal',
    currency: 'BRL',
    maximumFractionDigits: 2,
  });
  return numberFormatPercent.format(number);
}

export { formatNumberCurrency, formatNumberPercent };
