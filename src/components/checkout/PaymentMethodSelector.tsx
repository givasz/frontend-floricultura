import { useState } from 'react';

interface PaymentMethodSelectorProps {
  value: 'pix' | 'credit_card' | 'debit_card' | 'cash' | '';
  onChange: (method: 'pix' | 'credit_card' | 'debit_card' | 'cash') => void;
  needsChange: boolean;
  onNeedsChangeToggle: (needs: boolean) => void;
  changeFor: string;
  onChangeForInput: (value: string) => void;
  cartTotal: number;
  error?: string;
}

export function PaymentMethodSelector({
  value,
  onChange,
  needsChange,
  onNeedsChangeToggle,
  changeFor,
  onChangeForInput,
  cartTotal,
  error
}: PaymentMethodSelectorProps) {
  const [changeError, setChangeError] = useState('');

  const handleChangeForBlur = () => {
    const numValue = parseFloat(changeFor);
    if (needsChange && changeFor && numValue < cartTotal) {
      setChangeError(`O valor do troco não pode ser menor que o total do pedido (R$ ${cartTotal.toFixed(2)})`);
    } else {
      setChangeError('');
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Como você vai pagar? *
        </label>

        <div className="space-y-2">
          <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
            <input
              type="radio"
              name="paymentMethod"
              value="pix"
              checked={value === 'pix'}
              onChange={(e) => onChange(e.target.value as 'pix')}
              className="mr-3 h-4 w-4 text-green-600 focus:ring-green-500"
            />
            <div>
              <div className="font-medium">PIX</div>
            </div>
          </label>

          <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
            <input
              type="radio"
              name="paymentMethod"
              value="credit_card"
              checked={value === 'credit_card'}
              onChange={(e) => onChange(e.target.value as 'credit_card')}
              className="mr-3 h-4 w-4 text-green-600 focus:ring-green-500"
            />
            <div>
              <div className="font-medium">Cartão de Crédito</div>
            </div>
          </label>

          <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
            <input
              type="radio"
              name="paymentMethod"
              value="debit_card"
              checked={value === 'debit_card'}
              onChange={(e) => onChange(e.target.value as 'debit_card')}
              className="mr-3 h-4 w-4 text-green-600 focus:ring-green-500"
            />
            <div>
              <div className="font-medium">Cartão de Débito</div>
            </div>
          </label>

          <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
            <input
              type="radio"
              name="paymentMethod"
              value="cash"
              checked={value === 'cash'}
              onChange={(e) => onChange(e.target.value as 'cash')}
              className="mr-3 h-4 w-4 text-green-600 focus:ring-green-500"
            />
            <div>
              <div className="font-medium">Dinheiro</div>
            </div>
          </label>
        </div>

        {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
      </div>

      {value === 'cash' && (
        <div className="ml-7 space-y-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <label className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={needsChange}
              onChange={(e) => onNeedsChangeToggle(e.target.checked)}
              className="h-4 w-4 text-green-600 focus:ring-green-500 rounded"
            />
            <span className="ml-2 text-sm font-medium text-gray-700">
              Vai precisar de troco?
            </span>
          </label>

          {needsChange && (
            <div>
              <label htmlFor="changeFor" className="block text-sm font-medium text-gray-700 mb-1">
                Troco para quanto? (R$) *
              </label>
              <input
                type="number"
                id="changeFor"
                value={changeFor}
                onChange={(e) => onChangeForInput(e.target.value)}
                onBlur={handleChangeForBlur}
                step="0.01"
                min={cartTotal}
                placeholder={`Mínimo: R$ ${cartTotal.toFixed(2)}`}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <p className="mt-1 text-xs text-gray-500">
                Total do pedido: R$ {cartTotal.toFixed(2)}
              </p>
              {changeError && (
                <p className="mt-1 text-sm text-red-600">{changeError}</p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
