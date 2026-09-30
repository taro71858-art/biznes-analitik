import { CalculatedFinancials, FinancialValues, ParsedAnalysis } from '../types';

export function calculateFinancialMetrics(values: FinancialValues): CalculatedFinancials {
  const revenue = Math.max(0, Number(values.revenue) || 0);
  const rent = Math.max(0, Number(values.rent) || 0);
  const salaries = Math.max(0, Number(values.salaries) || 0);
  const ads = Math.max(0, Number(values.ads) || 0);
  const other = Math.max(0, Number(values.other) || 0);

  const totalExpenses = rent + salaries + ads + other;
  const profit = revenue - totalExpenses;
  
  // Margin (Return on sales): Profit / Revenue * 100
  const margin = revenue > 0 ? (profit / revenue) * 100 : (profit === 0 ? 0 : -100);

  // Break-even point (Точка безубыточности):
  // At this current cost structure, break-even revenue is the exact sum of expenses needed to reach zero profit.
  const breakEven = totalExpenses;
  const safetyMarginAmount = revenue - breakEven;
  const safetyMarginPct = revenue > 0 
    ? ((revenue - breakEven) / revenue) * 100 
    : (breakEven === 0 ? 0 : -100);

  // Expense distribution percentages
  const rentPct = totalExpenses > 0 ? (rent / totalExpenses) * 100 : 0;
  const salariesPct = totalExpenses > 0 ? (salaries / totalExpenses) * 100 : 0;
  const adsPct = totalExpenses > 0 ? (ads / totalExpenses) * 100 : 0;
  const otherPct = totalExpenses > 0 ? (other / totalExpenses) * 100 : 0;

  return {
    totalExpenses,
    profit,
    margin,
    breakEven,
    safetyMarginPct,
    safetyMarginAmount,
    isProfitable: profit > 0,
    isBreakEven: profit === 0,
    expenseShares: {
      rentPct,
      salariesPct,
      adsPct,
      otherPct,
    },
  };
}

export function formatCurrency(amount: number, currency: string = '₽'): string {
  const isNegative = amount < 0;
  const absolute = Math.abs(amount);
  const formatted = new Intl.NumberFormat('ru-RU', {
    maximumFractionDigits: 0,
  }).format(Math.round(absolute));

  return `${isNegative ? '−' : ''}${formatted} ${currency}`;
}

export function formatPercent(value: number): string {
  const prefix = value > 0 ? '+' : '';
  return `${prefix}${value.toFixed(1)}%`;
}

/**
 * Parses Gemini's structured response according to the requested format:
 * Вывод: ...
 * Причина: ...
 * Расчёт: ...
 * 3 действия:
 * 1. ...
 * 2. ...
 * 3. ...
 */
export function parseAiAnalysis(text: string): ParsedAnalysis {
  let conclusion = '';
  let reason = '';
  let calculation = '';
  const actions: string[] = [];

  if (!text) {
    return { conclusion: '', reason: '', calculation: '', actions: [], rawText: '' };
  }

  // Normalize newlines
  const cleanText = text.replace(/\r\n/g, '\n');

  const cleanSectionText = (val: string) => {
    return val
      .replace(/^\s*\*\*?:\s*/, '')
      .replace(/^\s*:\s*/, '')
      .replace(/\*\*$/, '')
      .trim();
  };

  // Match Вывод
  const conclusionMatch = cleanText.match(/(?:^|\n)(?:[*#\s]*)(?:Вывод|Вердикт|Главный вывод)[:\s*]*([\s\S]*?)(?=(?:\n(?:[*#\s]*)(?:Причина|Почему|Расчёт|Расчет|3 действия|Действия)|$))/i);
  if (conclusionMatch) {
    conclusion = cleanSectionText(conclusionMatch[1]);
  }

  // Match Причина
  const reasonMatch = cleanText.match(/(?:^|\n)(?:[*#\s]*)(?:Причина|Почему так)[:\s*]*([\s\S]*?)(?=(?:\n(?:[*#\s]*)(?:Расчёт|Расчет|3 действия|Действия)|$))/i);
  if (reasonMatch) {
    reason = cleanSectionText(reasonMatch[1]);
  }

  // Match Расчёт
  const calcMatch = cleanText.match(/(?:^|\n)(?:[*#\s]*)(?:Расчёт|Расчет|Математика)[:\s*]*([\s\S]*?)(?=(?:\n(?:[*#\s]*)(?:3 действия|Три действия|Действия)|$))/i);
  if (calcMatch) {
    calculation = cleanSectionText(calcMatch[1]);
  }

  // Match 3 действия
  const actionsMatch = cleanText.match(/(?:^|\n)(?:[*#\s]*)(?:3 действия|Три действия|Рекомендации|Действия)[:\s*]*([\s\S]*?)$/i);
  if (actionsMatch) {
    const rawActionsSection = cleanSectionText(actionsMatch[1]);
    const lines = rawActionsSection.split(/\n/);
    let currentAction = '';

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed) continue;
      
      const isNewItem = /^(\d+[\.\)]|[-*•])\s+/.test(trimmed);
      if (isNewItem) {
        if (currentAction) {
          actions.push(cleanSectionText(currentAction));
        }
        currentAction = trimmed.replace(/^(\d+[\.\)]|[-*•])\s+/, '');
      } else if (currentAction) {
        currentAction += ' ' + trimmed;
      } else {
        currentAction = trimmed;
      }
    }
    if (currentAction) {
      actions.push(cleanSectionText(currentAction));
    }
  }

  return {
    conclusion: conclusion || (actions.length === 0 && !reason && !calculation ? cleanText : 'Анализ завершён.'),
    reason,
    calculation,
    actions,
    rawText: cleanText,
  };
}
