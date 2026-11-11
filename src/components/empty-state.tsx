/** 统一的空状态：图标 + 标题 + 说明 + 操作。
 *  原来六处各写各的（虚线框 / 纯文字 / 图标距顶部 12 / 16），节奏全不一样。 */
export default function EmptyState({
  icon,
  title,
  description,
  children,
  className = "",
}: {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`px-8 py-14 text-center ${className}`}>
      {icon && (
        <div className="mx-auto mb-3 grid h-11 w-11 place-items-center rounded-full bg-surface text-ink-mute shadow-soft">
          {icon}
        </div>
      )}
      <p className="text-body-lg font-medium text-ink-soft">{title}</p>
      {description && (
        <p className="mx-auto mt-1.5 max-w-[250px] text-note leading-relaxed text-ink-mute">
          {description}
        </p>
      )}
      {children && (
        <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
          {children}
        </div>
      )}
    </div>
  );
}
