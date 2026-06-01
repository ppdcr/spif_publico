import {
  type InputHTMLAttributes,
  type SelectHTMLAttributes,
  type TextareaHTMLAttributes,
  type ReactNode,
  type LabelHTMLAttributes
} from 'react'
import {
  Controller,
  FormProvider,
  useFormContext,
} from 'react-hook-form'

export { FormProvider }

export function FormItem({ children, className, ...props }: { children: ReactNode, className?: string }) {
  return <div className={`flex flex-col gap-2 ${className || ''}`} {...props}>{children}</div>
}

export function FormLabel({ children, className, ...props }: LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label
      {...props}
      className={`text-sm font-semibold text-spif-secondary mb-1 ${className || ''}`}
    >
      {children}
    </label>
  )
}

export function FormError({ name }: { name: string }) {
  const { formState: { errors } } = useFormContext()
  const error = errors[name]
  if (!error) return null
  return <span className="text-red-400 text-xs mt-1 font-medium">{String(error.message)}</span>
}

interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
  name: string
  isNumber?: boolean
}

export function FormInput({ name, className, isNumber, ...props }: FormInputProps) {
  const { register } = useFormContext()

  return (
    <input
      {...register(name, { valueAsNumber: isNumber })}
      {...props}
      className={`w-full px-4 py-3 rounded-lg border border-spif-card-border bg-spif-card text-spif-text text-base outline-none focus:border-spif-primary focus:ring-1 focus:ring-spif-primary fade-out placeholder:text-spif-secondary/50 ${className || ''}`}
    />
  )
}

export function FormTextarea({ name, className, ...props }: { name: string } & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const { register } = useFormContext()

  return (
    <textarea
      {...register(name)}
      {...props}
      className={`w-full px-4 py-3 rounded-lg border border-spif-card-border bg-spif-card text-spif-text text-base outline-none focus:border-spif-primary focus:ring-1 focus:ring-spif-primary fade-out resize-none leading-relaxed placeholder:text-spif-secondary/50 ${className || ''}`}
    />
  )
}

export function FormBooleanSelect({ name, className, ...props }: { name: string } & Omit<SelectHTMLAttributes<HTMLSelectElement>, 'value' | 'onChange'>) {
  const { control } = useFormContext()

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <select
          {...props}
          className={`w-full px-4 py-3 rounded-lg border border-spif-card-border bg-spif-card text-spif-text text-base outline-none cursor-pointer focus:border-spif-primary focus:ring-1 focus:ring-spif-primary fade-out ${className || ''}`}
          value={field.value === true ? 'true' : 'false'}
          onChange={(e) => field.onChange(e.target.value === 'true')}
        >
          <option value="false">Não</option>
          <option value="true">Sim</option>
        </select>
      )}
    />
  )
}

export function FormCheckboxGroup({ name, options }: { name: string; options: string[] }) {
  const { control } = useFormContext()

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <div className="flex flex-wrap gap-2">
          {options.map((opt) => {
            const checked = (field.value as string[] | undefined)?.includes(opt) ?? false
            return (
              <button
                key={opt}
                type="button"
                onClick={() => {
                  const current: string[] = field.value ?? []
                  field.onChange(
                    checked ? current.filter((v) => v !== opt) : [...current, opt]
                  )
                }}
                className={`px-4 py-2 rounded-lg text-sm font-medium border fade-out animate-in duration-300 ${checked
                    ? 'border-spif-primary bg-spif-primary/10 text-spif-primary'
                    : 'border-spif-card-border bg-spif-card text-spif-secondary hover:text-spif-text hover:border-spif-primary/50'
                  }`}
              >
                {opt}
              </button>
            )
          })}
        </div>
      )}
    />
  )
}