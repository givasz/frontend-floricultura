interface RecipientInfoFormProps {
  recipientName: string;
  onRecipientNameChange: (value: string) => void;
  recipientPhone: string;
  onRecipientPhoneChange: (value: string) => void;
  nameError?: string;
  phoneError?: string;
}

export function RecipientInfoForm({
  recipientName,
  onRecipientNameChange,
  recipientPhone,
  onRecipientPhoneChange,
  nameError,
  phoneError
}: RecipientInfoFormProps) {
  const formatPhone = (value: string) => {
    // Remove tudo que não é número
    const numbers = value.replace(/\D/g, '');

    // Aplica a máscara (11) 91234-5678
    if (numbers.length <= 2) {
      return numbers;
    } else if (numbers.length <= 7) {
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
    } else if (numbers.length <= 11) {
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7)}`;
    }
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhone(e.target.value);
    onRecipientPhoneChange(formatted);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">
        Informações do Destinatário
      </h3>

      <div>
        <label htmlFor="recipientName" className="block text-sm font-medium text-gray-700 mb-1">
          Nome de quem vai receber *
        </label>
        <input
          type="text"
          id="recipientName"
          value={recipientName}
          onChange={(e) => onRecipientNameChange(e.target.value)}
          placeholder="Ex: Maria Silva"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        {nameError && (
          <p className="mt-1 text-sm text-red-600">{nameError}</p>
        )}
      </div>

      <div>
        <label htmlFor="recipientPhone" className="block text-sm font-medium text-gray-700 mb-1">
          Telefone de quem vai receber *
        </label>
        <input
          type="tel"
          id="recipientPhone"
          value={recipientPhone}
          onChange={handlePhoneChange}
          placeholder="(11) 91234-5678"
          maxLength={15}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        {phoneError && (
          <p className="mt-1 text-sm text-red-600">{phoneError}</p>
        )}
      </div>
    </div>
  );
}
