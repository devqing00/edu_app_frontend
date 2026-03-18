type TextInputProps = {
  label: string;
  type?: string;
  value: string;
  placeholder?: string;
  onChange: (value: string) => void;
  required?: boolean;
};

export function AuthInput({
  label,
  type,
  value,
  onChange,
}: {
  label: string;
  type: string;
  value: string;
  onChange: (value: string) => void;
}) {
  const inputId = `auth-${label.toLowerCase().replace(/\s+/g, "-")}`;

  return (
    <div>
      <label
        htmlFor={inputId}
        className="mb-1 block text-xs font-medium uppercase tracking-wide text-brand-text-muted"
      >
        {label}
      </label>
      <input
        id={inputId}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        type={type}
        required
        className="w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-brand-neon"
      />
    </div>
  );
}

export function Input({
  label,
  value,
  placeholder,
  onChange,
  type = "text",
  required = true,
}: TextInputProps) {
  const inputId = `input-${label.toLowerCase().replace(/\s+/g, "-")}`;

  return (
    <div>
      <label
        htmlFor={inputId}
        className="mb-1 block text-xs font-medium uppercase tracking-wide text-brand-text-muted"
      >
        {label}
      </label>
      <input
        id={inputId}
        type={type}
        required={required}
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-2xl border border-zinc-200 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-brand-neon"
      />
    </div>
  );
}

export function DetailPill({ label, value }: { label: string; value: string }) {
  return (
    <article className="rounded-2xl bg-brand-bg p-3">
      <p className="text-[10px] uppercase tracking-wide text-brand-text-muted">{label}</p>
      <p className="mt-1 text-sm font-medium text-brand-dark line-clamp-2">{value}</p>
    </article>
  );
}

export function PanelCard({ title, content }: { title: string; content: string }) {
  return (
    <article className="rounded-2xl bg-zinc-900/95 p-4">
      <p className="text-xs uppercase tracking-wider text-zinc-500">{title}</p>
      <p className="mt-2 wrap-break-word text-sm text-zinc-200">{content}</p>
    </article>
  );
}

export function MetricCard({ value, label }: { value: string; label: string }) {
  return (
    <article className="rounded-2xl bg-brand-bg p-4">
      <p className="text-3xl font-light text-brand-dark">{value}</p>
      <p className="text-xs uppercase tracking-wide text-brand-text-muted">{label}</p>
    </article>
  );
}

export function MetricStack({
  value,
  label,
  dot,
}: {
  value: string;
  label: string;
  dot: string;
}) {
  return (
    <div className="flex items-end gap-1">
      <span className="text-2xl font-light leading-none sm:text-3xl">{value}</span>
      <span className="pb-1 text-xs text-brand-text-muted">
        {label}
        <span className={`ml-1 inline-block h-1.5 w-1.5 rounded-full ${dot}`} />
      </span>
    </div>
  );
}
