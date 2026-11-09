export default function Avatar({
  name,
  tint = "#FFE28A",
  size = 36,
}: {
  name: string;
  tint?: string;
  size?: number;
}) {
  // 中文名取最后一个字（阿榆→榆、小鹿→鹿），英文名取首字母
  const first = name.trim().charAt(0);
  const initial = /[a-zA-Z]/.test(first)
    ? first.toUpperCase()
    : name.trim().slice(-1);

  return (
    <span
      className="grid shrink-0 place-items-center rounded-full font-semibold text-[#4a3527] select-none"
      style={{
        width: size,
        height: size,
        background: tint,
        fontSize: Math.round(size * 0.4),
      }}
    >
      {initial}
    </span>
  );
}
