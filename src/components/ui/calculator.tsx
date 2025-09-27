import { useState, useCallback, useRef, useEffect } from 'react';
import { X, Calculator as CalculatorIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface CalculatorProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Calculator({ isOpen, onClose }: CalculatorProps) {
  const [display, setDisplay] = useState('0');
  const [previousValue, setPreviousValue] = useState<number | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [waitingForNewValue, setWaitingForNewValue] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 80 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);

  const inputNumber = useCallback((num: string) => {
    if (waitingForNewValue) {
      setDisplay(num);
      setWaitingForNewValue(false);
    } else {
      setDisplay(display === '0' ? num : display + num);
    }
  }, [display, waitingForNewValue]);

  const inputOperation = useCallback((nextOperation: string) => {
    const inputValue = parseFloat(display);

    if (previousValue === null) {
      setPreviousValue(inputValue);
    } else if (operation) {
      const currentValue = previousValue || 0;
      const newValue = calculate(currentValue, inputValue, operation);

      setDisplay(String(newValue));
      setPreviousValue(newValue);
    }

    setWaitingForNewValue(true);
    setOperation(nextOperation);
  }, [display, previousValue, operation]);

  const calculate = (firstValue: number, secondValue: number, operation: string): number => {
    switch (operation) {
      case '+':
        return firstValue + secondValue;
      case '-':
        return firstValue - secondValue;
      case '×':
        return firstValue * secondValue;
      case '÷':
        return firstValue / secondValue;
      case '=':
        return secondValue;
      default:
        return secondValue;
    }
  };

  const performCalculation = useCallback(() => {
    const inputValue = parseFloat(display);

    if (previousValue !== null && operation) {
      const newValue = calculate(previousValue, inputValue, operation);
      setDisplay(String(newValue));
      setPreviousValue(null);
      setOperation(null);
      setWaitingForNewValue(true);
    }
  }, [display, previousValue, operation]);

  const clear = useCallback(() => {
    setDisplay('0');
    setPreviousValue(null);
    setOperation(null);
    setWaitingForNewValue(false);
  }, []);

  const clearEntry = useCallback(() => {
    setDisplay('0');
    setWaitingForNewValue(false);
  }, []);

  const inputDecimal = useCallback(() => {
    if (waitingForNewValue) {
      setDisplay('0.');
      setWaitingForNewValue(false);
    } else if (display.indexOf('.') === -1) {
      setDisplay(display + '.');
    }
  }, [display, waitingForNewValue]);

  const backspace = useCallback(() => {
    if (display.length > 1) {
      setDisplay(display.slice(0, -1));
    } else {
      setDisplay('0');
    }
  }, [display]);

  // Drag handlers
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget || (e.target as HTMLElement).classList.contains('drag-handle')) {
      setIsDragging(true);
      const rect = cardRef.current?.getBoundingClientRect();
      if (rect) {
        setDragStart({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top
        });
      }
      e.preventDefault();
    }
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging && cardRef.current) {
        const newX = e.clientX - dragStart.x;
        const newY = e.clientY - dragStart.y;
        
        // Keep within viewport bounds
        const maxX = window.innerWidth - 320;
        const maxY = window.innerHeight - 500;
        
        const boundedX = Math.max(0, Math.min(newX, maxX));
        const boundedY = Math.max(0, Math.min(newY, maxY));
        
        setPosition({ x: boundedX, y: boundedY });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragStart]);

  // Position calculator to the right initially
  useEffect(() => {
    if (isOpen) {
      const initialX = window.innerWidth - 340; // 320px width + 20px margin
      const initialY = 80;
      setPosition({ x: Math.max(0, initialX), y: initialY });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 pointer-events-none">
      <Card 
        ref={cardRef}
        className="absolute w-80 bg-white shadow-2xl border-gray-200 pointer-events-auto select-none"
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          cursor: isDragging ? 'grabbing' : 'default'
        }}
      >
        {/* Header */}
        <div 
          className="flex items-center justify-between p-3 border-b border-gray-200 drag-handle cursor-grab active:cursor-grabbing"
          onMouseDown={handleMouseDown}
        >
          <div className="flex items-center gap-2 pointer-events-none">
            <CalculatorIcon className="h-4 w-4 text-gray-600" />
            <span className="text-sm font-medium text-gray-700">Kalkulator</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-7 w-7 p-0 hover:bg-gray-100 pointer-events-auto"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Display */}
        <div className="p-4 pb-0">
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
            <div className="text-right">
              {operation && (
                <div className="text-xs text-gray-500 mb-1">
                  {previousValue} {operation}
                </div>
              )}
              <div className="text-2xl font-mono font-semibold text-gray-900 break-all">
                {display}
              </div>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="p-4 pt-0">
          <div className="grid grid-cols-4 gap-2">
            {/* Row 1 */}
            <Button
              variant="outline"
              onClick={clear}
              className="h-10 text-sm font-medium hover:bg-red-50 hover:text-red-600 hover:border-red-200"
            >
              C
            </Button>
            <Button
              variant="outline"
              onClick={clearEntry}
              className="h-10 text-sm font-medium hover:bg-orange-50 hover:text-orange-600 hover:border-orange-200"
            >
              CE
            </Button>
            <Button
              variant="outline"
              onClick={backspace}
              className="h-10 text-sm font-medium hover:bg-gray-50"
            >
              ⌫
            </Button>
            <Button
              variant="outline"
              onClick={() => inputOperation('÷')}
              className="h-10 text-sm font-medium hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200"
            >
              ÷
            </Button>

            {/* Row 2 */}
            <Button
              variant="outline"
              onClick={() => inputNumber('7')}
              className="h-10 text-sm font-medium hover:bg-gray-50"
            >
              7
            </Button>
            <Button
              variant="outline"
              onClick={() => inputNumber('8')}
              className="h-10 text-sm font-medium hover:bg-gray-50"
            >
              8
            </Button>
            <Button
              variant="outline"
              onClick={() => inputNumber('9')}
              className="h-10 text-sm font-medium hover:bg-gray-50"
            >
              9
            </Button>
            <Button
              variant="outline"
              onClick={() => inputOperation('×')}
              className="h-10 text-sm font-medium hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200"
            >
              ×
            </Button>

            {/* Row 3 */}
            <Button
              variant="outline"
              onClick={() => inputNumber('4')}
              className="h-10 text-sm font-medium hover:bg-gray-50"
            >
              4
            </Button>
            <Button
              variant="outline"
              onClick={() => inputNumber('5')}
              className="h-10 text-sm font-medium hover:bg-gray-50"
            >
              5
            </Button>
            <Button
              variant="outline"
              onClick={() => inputNumber('6')}
              className="h-10 text-sm font-medium hover:bg-gray-50"
            >
              6
            </Button>
            <Button
              variant="outline"
              onClick={() => inputOperation('-')}
              className="h-10 text-sm font-medium hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200"
            >
              -
            </Button>

            {/* Row 4 */}
            <Button
              variant="outline"
              onClick={() => inputNumber('1')}
              className="h-10 text-sm font-medium hover:bg-gray-50"
            >
              1
            </Button>
            <Button
              variant="outline"
              onClick={() => inputNumber('2')}
              className="h-10 text-sm font-medium hover:bg-gray-50"
            >
              2
            </Button>
            <Button
              variant="outline"
              onClick={() => inputNumber('3')}
              className="h-10 text-sm font-medium hover:bg-gray-50"
            >
              3
            </Button>
            <Button
              variant="outline"
              onClick={() => inputOperation('+')}
              className="h-10 text-sm font-medium hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200"
            >
              +
            </Button>

            {/* Row 5 */}
            <Button
              variant="outline"
              onClick={() => inputNumber('0')}
              className="col-span-2 h-10 text-sm font-medium hover:bg-gray-50"
            >
              0
            </Button>
            <Button
              variant="outline"
              onClick={inputDecimal}
              className="h-10 text-sm font-medium hover:bg-gray-50"
            >
              .
            </Button>
            <Button
              onClick={performCalculation}
              className="h-10 text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white"
            >
              =
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default Calculator;