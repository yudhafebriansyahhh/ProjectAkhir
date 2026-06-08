import { Card, CardContent } from '@/Components/ui/card';

export function FormCard({ children, footer }) {
    return (
        <Card className="rounded-lg border-slate-200 shadow-sm">
            <CardContent className="p-4 sm:p-5">
                {children}
                {footer ? <div className="mt-6 border-t border-slate-100 pt-5">{footer}</div> : null}
            </CardContent>
        </Card>
    );
}

export function FormField({ label, required = false, error, hint, children }) {
    return (
        <div className="min-w-0">
            <label className="mb-2 block text-sm font-semibold text-slate-700">
                {label} {required ? <span className="text-red-500">*</span> : null}
            </label>
            {children}
            {error ? <p className="mt-1.5 text-xs font-medium text-red-600">{error}</p> : null}
            {hint ? <p className="mt-1.5 text-xs text-slate-500">{hint}</p> : null}
        </div>
    );
}

export function RadioCardGroup({ name, value, options, onChange }) {
    return (
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-5 sm:gap-3">
            {options.map((option) => (
                <label
                    key={option.value}
                    className={`flex h-11 cursor-pointer items-center justify-center rounded-lg border text-sm font-semibold transition ${
                        value === option.value
                            ? 'border-blue-500 bg-blue-50 text-blue-700 ring-1 ring-blue-200'
                            : 'border-slate-200 bg-white text-slate-600 hover:border-blue-200 hover:bg-blue-50'
                    }`}
                >
                    <input
                        type="radio"
                        name={name}
                        value={option.value}
                        checked={value === option.value}
                        onChange={(event) => onChange(event.target.value)}
                        className="sr-only"
                    />
                    {option.label}
                </label>
            ))}
        </div>
    );
}
