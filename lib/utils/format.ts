export function formatQuantity(
  qty: number, 
  category: 'WEIGHT' | 'UNIT', 
  t: (key: string) => string
): string {
  if (category === 'UNIT') {
    return `${qty}`;
  }

  if (qty >= 1000) {
    const kgValue = qty / 1000;
    const formatted = parseFloat(kgValue.toFixed(2)).toString().replace('.', ',');
    return `${formatted} ${t('units.kg')}`;
  }

  return `${qty} ${qty > 0 ? t('units.g') : ''}`;
}

export function formatProgressRange(
  current: number,
  total: number,
  category: 'WEIGHT' | 'UNIT',
  t: (key: string) => string
): string {
  if (category === 'UNIT') {
    return `${current} / ${total}`;
  }

  const currentKg = current >= 1000;
  const totalKg = total >= 1000;

  // Si les deux sont en kg ou les deux en g, on n'affiche l'unité qu'à la fin
  if (currentKg === totalKg) {
    const formatValue = (v: number) => {
      if (v >= 1000) return parseFloat((v / 1000).toFixed(2)).toString().replace('.', ',');
      return v.toString();
    };
    const unit = t(currentKg ? 'units.kg' : 'units.g');
    return `${formatValue(current)} / ${formatValue(total)} ${unit}`;
  }

  // Sinon (ex: 800g / 1.2kg), on affiche les deux unités pour plus de clarté
  return `${formatQuantity(current, category, t)} / ${formatQuantity(total, category, t)}`;
}
