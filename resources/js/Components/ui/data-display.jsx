import { Link } from '@inertiajs/react';
import { AlertCircle, CheckCircle2, ChevronLeft, ChevronRight, Inbox, Plus, Search, X } from 'lucide-react';
import { Button } from '@/Components/ui/button';
import { Card, CardContent } from '@/Components/ui/card';
import { Input } from '@/Components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/Components/ui/table';

export function PageHeader({ title, description, icon: Icon, actionHref, actionLabel, actionIcon: ActionIcon = Plus, children }) {
    return (
        <section className="flex min-w-0 flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex min-w-0 items-start gap-3">
                {Icon ? (
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-blue-600 shadow-lg shadow-blue-500/25 sm:h-12 sm:w-12">
                        <Icon className="h-5 w-5 text-white sm:h-6 sm:w-6" />
                    </div>
                ) : null}
                <div className="min-w-0">
                    <h1 className="text-xl font-bold tracking-tight text-slate-950 sm:text-2xl">{title}</h1>
                    <p className="mt-0.5 text-sm text-slate-500">{description}</p>
                </div>
            </div>

            <div className="flex w-full flex-col gap-2 sm:flex-row sm:items-center md:w-auto">
                {children}
                {actionHref ? (
                    <Link href={actionHref} className="w-full sm:w-auto">
                        <Button className="h-10 w-full gap-2 shadow-sm shadow-blue-500/20 sm:w-auto">
                            <ActionIcon className="h-4 w-4" />
                            <span>{actionLabel}</span>
                        </Button>
                    </Link>
                ) : null}
            </div>
        </section>
    );
}

export function FlashMessage({ type, message }) {
    if (!message) return null;

    const isSuccess = type === 'success';
    const Icon = isSuccess ? CheckCircle2 : AlertCircle;
    const styles = isSuccess
        ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
        : 'border-red-200 bg-red-50 text-red-800';
    const iconStyles = isSuccess ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600';

    return (
        <div className={`flex items-center gap-3 rounded-lg border p-4 ${styles}`}>
            <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${iconStyles}`}>
                <Icon className="h-4 w-4" />
            </div>
            <p className="text-sm font-medium">{message}</p>
        </div>
    );
}

export function SummaryCard({ title, value, icon: Icon, tone = 'blue' }) {
    const formattedValue = new Intl.NumberFormat('id-ID').format(value || 0);
    const tones = {
        blue: 'bg-blue-50/70 text-blue-600 ring-blue-100',
        violet: 'bg-violet-50/70 text-violet-600 ring-violet-100',
        emerald: 'bg-emerald-50/70 text-emerald-600 ring-emerald-100',
        amber: 'bg-amber-50/70 text-amber-600 ring-amber-100',
    };

    return (
        <Card className="min-w-0 rounded-lg border-slate-200 shadow-sm">
            <CardContent className="flex min-w-0 items-center gap-3 p-3 sm:p-4">
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ring-1 ${tones[tone] || tones.blue}`}>
                    <Icon className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                    <p className="truncate text-xl font-bold text-slate-950 sm:text-2xl">{formattedValue}</p>
                    <p className="truncate text-xs font-medium text-slate-500">{title}</p>
                </div>
            </CardContent>
        </Card>
    );
}

export function SearchInput({ value, onChange, onClear, placeholder, className = '' }) {
    return (
        <div className={`relative min-w-0 ${className}`}>
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
                type="text"
                value={value}
                onChange={(event) => onChange(event.target.value)}
                placeholder={placeholder}
                className="h-10 pr-10 pl-10"
            />
            {value ? (
                <button
                    type="button"
                    onClick={onClear}
                    className="absolute right-2 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-md text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
                    aria-label="Bersihkan pencarian"
                >
                    <X className="h-4 w-4" />
                </button>
            ) : null}
        </div>
    );
}

export function SearchCard({ value, onChange, onClear, placeholder }) {
    return (
        <Card className="rounded-lg border-slate-200 shadow-sm">
            <CardContent className="p-4">
                <SearchInput value={value} onChange={onChange} onClear={onClear} placeholder={placeholder} />
            </CardContent>
        </Card>
    );
}

export function EmptyState({ title = 'Tidak ada data', description = 'Belum ada data yang terdaftar', compact = false }) {
    return (
        <div className={`flex flex-col items-center justify-center text-center ${compact ? 'py-10' : 'py-14'}`}>
            <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-lg bg-slate-100 sm:h-16 sm:w-16">
                <Inbox className="h-7 w-7 text-slate-400 sm:h-8 sm:w-8" />
            </div>
            <p className="font-medium text-slate-600">{title}</p>
            <p className="mt-1 text-sm text-slate-400">{description}</p>
        </div>
    );
}

export function DataTable({ columns, data, getRowKey, emptyState, className = '', rowClassName, asCard = true }) {
    const content = (
            <Table>
                <TableHeader>
                    <TableRow className="bg-slate-50 hover:bg-slate-50">
                        {columns.map((column) => (
                            <TableHead key={column.key} className={column.headerClassName}>
                                {column.header}
                            </TableHead>
                        ))}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.length > 0 ? (
                        data.map((item, index) => (
                            <TableRow key={getRowKey(item, index)} className={rowClassName?.(item, index)}>
                                {columns.map((column) => (
                                    <TableCell key={column.key} className={column.cellClassName}>
                                        {column.render ? column.render(item, index) : item[column.key]}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={columns.length}>{emptyState}</TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
    );

    if (!asCard) {
        return <div className={`overflow-hidden rounded-lg border border-slate-200 ${className}`}>{content}</div>;
    }

    return (
        <Card className={`overflow-hidden rounded-lg border-slate-200 shadow-sm ${className}`}>
            {content}
        </Card>
    );
}

export function CardGrid({ data, getCardKey, renderCard, emptyState, className = '', emptyClassName = '' }) {
    if (data.length === 0) {
        return (
            <Card className={`rounded-lg border-slate-200 shadow-sm ${emptyClassName}`}>
                <CardContent className="p-4">{emptyState}</CardContent>
            </Card>
        );
    }

    return <div className={className}>{data.map((item, index) => renderCard(item, index, getCardKey(item, index)))}</div>;
}

export function Pagination({ pagination }) {
    if (pagination.last_page <= 1) return null;

    return (
        <Card className="rounded-lg border-slate-200 shadow-sm">
            <CardContent className="flex flex-col items-center justify-between gap-3 p-4 lg:flex-row lg:px-5">
                <p className="text-center text-sm text-slate-500 lg:text-left">
                    Menampilkan <span className="font-semibold text-slate-700">{pagination.from}</span> -{' '}
                    <span className="font-semibold text-slate-700">{pagination.to}</span> dari{' '}
                    <span className="font-semibold text-slate-700">{pagination.total}</span> data
                </p>
                <div className="flex flex-wrap items-center justify-center gap-1">
                    {pagination.links.map((link, index) => {
                        const isFirst = index === 0;
                        const isLast = index === pagination.links.length - 1;

                        return (
                            <Link key={`${link.label}-${index}`} href={link.url || '#'} preserveState preserveScroll>
                                <Button
                                    variant={link.active ? 'default' : 'outline'}
                                    size="sm"
                                    className={`h-8 min-w-[32px] px-2 text-xs ${!link.url ? 'pointer-events-none opacity-50' : ''}`}
                                    disabled={!link.url}
                                >
                                    {isFirst ? (
                                        <ChevronLeft className="h-4 w-4" />
                                    ) : isLast ? (
                                        <ChevronRight className="h-4 w-4" />
                                    ) : (
                                        <span dangerouslySetInnerHTML={{ __html: link.label }} />
                                    )}
                                </Button>
                            </Link>
                        );
                    })}
                </div>
            </CardContent>
        </Card>
    );
}

export function ClientPagination({ page, perPage, total, onPageChange }) {
    const lastPage = Math.max(1, Math.ceil(total / perPage));

    if (lastPage <= 1) return null;

    const from = (page - 1) * perPage + 1;
    const to = Math.min(page * perPage, total);
    const pageWindow = Array.from({ length: lastPage }, (_, index) => index + 1)
        .filter((item) => item === 1 || item === lastPage || Math.abs(item - page) <= 1)
        .reduce((items, item, index, source) => {
            if (index > 0 && item - source[index - 1] > 1) {
                items.push(`ellipsis-${item}`);
            }

            items.push(item);
            return items;
        }, []);

    return (
        <div className="flex flex-col items-center justify-between gap-3 border-t border-slate-100 pt-4 lg:flex-row">
            <p className="text-center text-sm text-slate-500 lg:text-left">
                Menampilkan <span className="font-semibold text-slate-700">{from}</span> -{' '}
                <span className="font-semibold text-slate-700">{to}</span> dari{' '}
                <span className="font-semibold text-slate-700">{total}</span> data
            </p>
            <div className="flex flex-wrap items-center justify-center gap-1">
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-8 min-w-[32px] px-2"
                    disabled={page <= 1}
                    onClick={() => onPageChange(page - 1)}
                >
                    <ChevronLeft className="h-4 w-4" />
                </Button>
                {pageWindow.map((item) =>
                    typeof item === 'string' ? (
                        <span key={item} className="px-1 text-sm text-slate-400">
                            ...
                        </span>
                    ) : (
                        <Button
                            key={item}
                            type="button"
                            variant={item === page ? 'default' : 'outline'}
                            size="sm"
                            className="h-8 min-w-[32px] px-2 text-xs"
                            onClick={() => onPageChange(item)}
                        >
                            {item}
                        </Button>
                    ),
                )}
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-8 min-w-[32px] px-2"
                    disabled={page >= lastPage}
                    onClick={() => onPageChange(page + 1)}
                >
                    <ChevronRight className="h-4 w-4" />
                </Button>
            </div>
        </div>
    );
}
