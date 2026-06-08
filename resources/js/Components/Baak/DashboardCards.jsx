import { Link } from '@inertiajs/react';
import { ChevronRight } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card';

export function DashboardPanel({ title, description, action, className = '', headerClassName = '', contentClassName = '', children }) {
    return (
        <Card className={`min-w-0 rounded-lg border-slate-200 shadow-sm ${className}`}>
            <CardHeader className={`p-4 pb-2 sm:p-5 sm:pb-2 ${headerClassName}`}>
                {action ? (
                    <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                            <CardTitle className="text-base font-bold text-slate-950">{title}</CardTitle>
                            {description ? <CardDescription>{description}</CardDescription> : null}
                        </div>
                        {action}
                    </div>
                ) : (
                    <>
                        <CardTitle className="text-base font-bold text-slate-950">{title}</CardTitle>
                        {description ? <CardDescription>{description}</CardDescription> : null}
                    </>
                )}
            </CardHeader>
            <CardContent className={`min-w-0 p-4 pt-2 sm:p-5 sm:pt-2 ${contentClassName}`}>{children}</CardContent>
        </Card>
    );
}

export function StatCard({ metric, formatNumber }) {
    const Icon = metric.icon;

    return (
        <Card className="min-w-0 rounded-lg border-slate-200 shadow-sm">
            <CardContent className="p-3 sm:p-5">
                <div className="flex items-start justify-between gap-2">
                    <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg sm:h-10 sm:w-10 ${metric.iconBg}`}>
                        <Icon className={`h-4 w-4 sm:h-5 sm:w-5 ${metric.accent}`} />
                    </div>
                    <Link href={metric.href} className="text-xs font-semibold text-slate-400 transition hover:text-blue-600">
                        Detail
                    </Link>
                </div>

                <div className="mt-4 sm:mt-5">
                    <p className="truncate text-xs font-medium text-slate-500 sm:text-sm">{metric.title}</p>
                    <div className="mt-1 min-w-0">
                        <p className="truncate text-xl font-bold text-slate-950 sm:text-3xl">{formatNumber(metric.value)}</p>
                        <p className="mt-0.5 truncate text-xs font-semibold text-slate-500">{metric.caption}</p>
                    </div>
                    <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-100 sm:mt-4">
                        <div
                            className="h-full rounded-full bg-blue-600"
                            style={{ width: `${Math.min(100, Math.max(0, metric.progress))}%` }}
                        />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

export function AlertCard({ alert, formatNumber }) {
    const Icon = alert.icon;
    const Wrapper = alert.href ? Link : 'div';
    const wrapperProps = alert.href ? { href: alert.href } : {};

    return (
        <Wrapper
            {...wrapperProps}
            className={`flex min-w-0 flex-col justify-between gap-3 rounded-lg border ${alert.border} ${alert.bg} p-3 transition hover:shadow-sm sm:flex-row sm:items-center`}
        >
            <div className="flex min-w-0 items-center gap-2 sm:gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white sm:h-9 sm:w-9">
                    <Icon className={`h-4 w-4 ${alert.tone}`} />
                </div>
                <span className="min-w-0 text-xs font-semibold leading-snug text-slate-700 sm:truncate sm:text-sm">{alert.label}</span>
            </div>
            <span className={`text-lg font-bold leading-none ${alert.tone}`}>{formatNumber(alert.value)}</span>
        </Wrapper>
    );
}

export function QuickActionCard({ action }) {
    const Icon = action.icon;

    return (
        <Link
            href={route(action.route)}
            className="group flex min-w-0 items-center justify-between gap-2 rounded-lg border border-slate-200 bg-white p-3 transition hover:border-blue-200 hover:bg-blue-50"
        >
            <div className="flex min-w-0 items-center gap-2 sm:gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 transition group-hover:bg-white sm:h-9 sm:w-9">
                    <Icon className="h-4 w-4 text-slate-600 transition group-hover:text-blue-600" />
                </div>
                <span className="min-w-0 truncate text-xs font-semibold text-slate-700 sm:text-sm">{action.label}</span>
            </div>
            <ChevronRight className="h-4 w-4 shrink-0 text-slate-300 transition group-hover:text-blue-600" />
        </Link>
    );
}

export function EmptyChart({ icon: Icon, label }) {
    return (
        <div className="flex h-[220px] flex-col items-center justify-center text-center sm:h-[260px]">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-slate-100">
                <Icon className="h-5 w-5 text-slate-400" />
            </div>
            <p className="text-sm font-medium text-slate-500">{label}</p>
        </div>
    );
}
