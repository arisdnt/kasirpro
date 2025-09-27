import { Calculator } from '@/components/ui/calculator';
import { useCalculatorStore } from '@/hooks/use-calculator-store';

export function CalculatorProvider() {
  const { isOpen, closeCalculator } = useCalculatorStore();

  return <Calculator isOpen={isOpen} onClose={closeCalculator} />;
}

export default CalculatorProvider;