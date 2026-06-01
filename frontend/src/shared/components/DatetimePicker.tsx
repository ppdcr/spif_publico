import { useState, useRef, useEffect } from 'react'
import { Calendar, Clock, ChevronLeft, ChevronRight, X } from 'lucide-react'
import { useFormContext, Controller } from 'react-hook-form'

const MESES = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
]
const DIAS_SEMANA = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']

interface DateTimePickerProps {
    name: string
    placeholder?: string
    optional?: boolean
}

function parseLocalDatetime(value: string | null | undefined): { date: Date | null; time: string } {
    if (!value) {
        const now = new Date()
        const hh = String(now.getHours()).padStart(2, '0')
        const mm = String(now.getMinutes()).padStart(2, '0')
        return { date: null, time: `${hh}:${mm}` }
    }
    const d = new Date(value)
    const hh = String(d.getHours()).padStart(2, '0')
    const mm = String(d.getMinutes()).padStart(2, '0')
    return { date: d, time: `${hh}:${mm}` }
}

function buildISOString(date: Date, time: string): string {
    const [hh, mm] = time.split(':').map(Number)
    const d = new Date(date)
    d.setHours(hh, mm, 0, 0)
    // Format as local datetime string (without timezone conversion)
    const pad = (n: number) => String(n).padStart(2, '0')
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(hh)}:${pad(mm)}`
}

function Calendar_({ selectedDate, onSelect }: { selectedDate: Date | null; onSelect: (d: Date) => void }) {
    const today = new Date()
    const [viewYear, setViewYear] = useState(selectedDate?.getFullYear() ?? today.getFullYear())
    const [viewMonth, setViewMonth] = useState(selectedDate?.getMonth() ?? today.getMonth())

    const firstDay = new Date(viewYear, viewMonth, 1).getDay()
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate()

    const prevMonth = () => {
        if (viewMonth === 0) { setViewMonth(11); setViewYear(v => v - 1) }
        else setViewMonth(m => m - 1)
    }
    const nextMonth = () => {
        if (viewMonth === 11) { setViewMonth(0); setViewYear(v => v + 1) }
        else setViewMonth(m => m + 1)
    }

    const isSelected = (d: number) =>
        selectedDate &&
        selectedDate.getDate() === d &&
        selectedDate.getMonth() === viewMonth &&
        selectedDate.getFullYear() === viewYear

    const isToday = (d: number) =>
        today.getDate() === d &&
        today.getMonth() === viewMonth &&
        today.getFullYear() === viewYear

    return (
        <div className="p-3 w-full">
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
                <button
                    type="button"
                    onClick={prevMonth}
                    className="p-1.5 rounded-lg hover:bg-spif-card text-spif-secondary hover:text-spif-text transition-colors"
                >
                    <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-xs font-black uppercase tracking-widest text-spif-text">
                    {MESES[viewMonth]} {viewYear}
                </span>
                <button
                    type="button"
                    onClick={nextMonth}
                    className="p-1.5 rounded-lg hover:bg-spif-card text-spif-secondary hover:text-spif-text transition-colors"
                >
                    <ChevronRight className="w-4 h-4" />
                </button>
            </div>

            {/* Weekday headers */}
            <div className="grid grid-cols-7 mb-1">
                {DIAS_SEMANA.map(d => (
                    <div key={d} className="text-center text-[10px] font-bold uppercase tracking-wider text-spif-secondary opacity-60 py-1">
                        {d}
                    </div>
                ))}
            </div>

            {/* Day grid */}
            <div className="grid grid-cols-7 gap-0.5">
                {Array.from({ length: firstDay }).map((_, i) => (
                    <div key={`empty-${i}`} />
                ))}
                {Array.from({ length: daysInMonth }).map((_, i) => {
                    const day = i + 1
                    const selected = isSelected(day)
                    const todayDay = isToday(day)
                    return (
                        <button
                            key={day}
                            type="button"
                            onClick={() => onSelect(new Date(viewYear, viewMonth, day))}
                            className={`
                aspect-square w-full flex items-center justify-center rounded-lg text-xs font-medium transition-all
                ${selected
                                    ? 'bg-spif-primary text-spif-bg font-black shadow-lg shadow-spif-primary/30'
                                    : todayDay
                                        ? 'text-spif-primary font-black border border-spif-primary/30 hover:bg-spif-primary/10'
                                        : 'text-spif-text hover:bg-spif-card'
                                }
              `}
                        >
                            {day}
                        </button>
                    )
                })}
            </div>
        </div>
    )
}

function TimeInput({ value, onChange }: { value: string; onChange: (v: string) => void }) {
    const [hh, mm] = value.split(':').map(Number)

    const adjust = (field: 'h' | 'm', delta: number) => {
        if (field === 'h') {
            const next = ((hh + delta + 24) % 24)
            onChange(`${String(next).padStart(2, '0')}:${String(mm).padStart(2, '0')}`)
        } else {
            const next = ((mm + delta + 60) % 60)
            onChange(`${String(hh).padStart(2, '0')}:${String(next).padStart(2, '0')}`)
        }
    }

    return (
        <div className="flex items-center justify-center gap-1 py-3 border-t border-spif-card-border">
            <Clock className="w-3.5 h-3.5 text-spif-secondary opacity-50 mr-1" />

            {/* Hours */}
            <div className="flex flex-col items-center">
                <button type="button" onClick={() => adjust('h', 1)}
                    className="p-1 text-spif-secondary hover:text-spif-text transition-colors">
                    <ChevronLeft className="w-3 h-3 rotate-90" />
                </button>
                <input
                    type="number" min={0} max={23} value={String(hh).padStart(2, '0')}
                    onChange={e => {
                        const v = Math.min(23, Math.max(0, Number(e.target.value)))
                        onChange(`${String(v).padStart(2, '0')}:${String(mm).padStart(2, '0')}`)
                    }}
                    className="w-10 text-center text-sm font-black text-spif-text bg-spif-card rounded-lg py-1 border border-spif-card-border focus:outline-none focus:border-spif-primary transition-colors [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none"
                />
                <button type="button" onClick={() => adjust('h', -1)}
                    className="p-1 text-spif-secondary hover:text-spif-text transition-colors">
                    <ChevronLeft className="w-3 h-3 -rotate-90" />
                </button>
            </div>

            <span className="text-sm font-black text-spif-secondary mb-0.5">:</span>

            {/* Minutes */}
            <div className="flex flex-col items-center">
                <button type="button" onClick={() => adjust('m', 5)}
                    className="p-1 text-spif-secondary hover:text-spif-text transition-colors">
                    <ChevronLeft className="w-3 h-3 rotate-90" />
                </button>
                <input
                    type="number" min={0} max={59} value={String(mm).padStart(2, '0')}
                    onChange={e => {
                        const v = Math.min(59, Math.max(0, Number(e.target.value)))
                        onChange(`${String(hh).padStart(2, '0')}:${String(v).padStart(2, '0')}`)
                    }}
                    className="w-10 text-center text-sm font-black text-spif-text bg-spif-card rounded-lg py-1 border border-spif-card-border focus:outline-none focus:border-spif-primary transition-colors [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none"
                />
                <button type="button" onClick={() => adjust('m', -5)}
                    className="p-1 text-spif-secondary hover:text-spif-text transition-colors">
                    <ChevronLeft className="w-3 h-3 -rotate-90" />
                </button>
            </div>
        </div>
    )
}

export function DateTimePicker({ name, placeholder = 'Selecionar data', optional = false }: DateTimePickerProps) {
    const { control } = useFormContext()
    const [calendarOpen, setCalendarOpen] = useState(false)
    const ref = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setCalendarOpen(false)
            }
        }
        document.addEventListener('mousedown', handler)
        return () => document.removeEventListener('mousedown', handler)
    }, [])

    return (
        <Controller
            name={name}
            control={control}
            render={({ field }) => {
                const { date, time } = parseLocalDatetime(field.value)

                const handleDateSelect = (d: Date) => {
                    field.onChange(buildISOString(d, time))
                    setCalendarOpen(false)
                }

                const handleTimeChange = (t: string) => {
                    if (date) field.onChange(buildISOString(date, t))
                }

                const handleClear = () => {
                    field.onChange(optional ? null : '')
                    setCalendarOpen(false)
                }

                const formattedDate = date
                    ? date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })
                    : null

                return (
                    <div className="space-y-2">
                        {/* Date trigger */}
                        <div ref={ref} className="relative">
                            <div
                                role="button"
                                tabIndex={0}
                                onClick={() => setCalendarOpen(v => !v)}
                                onKeyDown={e => {
                                    if (e.key === 'Enter' || e.key === ' ') {
                                        e.preventDefault()
                                        setCalendarOpen(v => !v)
                                    }
                                }}
                                className={`
                  w-full flex items-center gap-3 px-4 py-3 rounded-2xl border transition-all text-left cursor-pointer select-none
                  ${calendarOpen
                                        ? 'border-spif-primary bg-spif-card shadow-lg shadow-spif-primary/10'
                                        : 'border-spif-card-border bg-spif-card hover:border-spif-secondary'
                                    }
                `}
                            >
                                <Calendar className={`w-4 h-4 flex-shrink-0 transition-colors ${calendarOpen ? 'text-spif-primary' : 'text-spif-secondary opacity-50'}`} />
                                <span className={`flex-1 text-sm ${date ? 'font-medium text-spif-text' : 'text-spif-secondary opacity-50'}`}>
                                    {formattedDate ?? placeholder}
                                </span>
                                {date && (
                                    <button
                                        type="button"
                                        onClick={e => { e.stopPropagation(); handleClear() }}
                                        className="p-0.5 rounded-md hover:bg-spif-card-border text-spif-secondary hover:text-spif-text transition-colors"
                                    >
                                        <X className="w-3.5 h-3.5" />
                                    </button>
                                )}
                            </div>

                            {/* Calendar popover */}
                            {calendarOpen && (
                            <div
                                className="
                                absolute bottom-full left-0
                                z-50 mb-2 w-[320px]
                                bg-spif-card border border-spif-card-border
                                rounded-2xl shadow-2xl shadow-black/20
                                "
                            >
                                <Calendar_ selectedDate={date} onSelect={handleDateSelect} />
                            </div>
                            )}
                        </div>

                        {/* Time input — só aparece quando uma data está selecionada */}
                        {date && (
                            <div className="bg-spif-card border border-spif-card-border rounded-2xl animate-in fade-in slide-in-from-top-1 duration-300">
                                <TimeInput value={time} onChange={handleTimeChange} />
                            </div>
                        )}
                    </div>
                )
            }}
        />
    )
}