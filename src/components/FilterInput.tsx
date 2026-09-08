interface FilterInputProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export function FilterInput({ value, onChange, placeholder }: FilterInputProps) {
  return (
    <input
      type="text"
      className="filter-input"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder ?? 'Buscar…'}
    />
  )
}
