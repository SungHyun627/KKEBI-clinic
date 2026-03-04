interface ClientInfoFieldProps {
  label: string;
  value: string;
}

export default function ClientInfoField({ label, value }: ClientInfoFieldProps) {
  return (
    <div className="flex items-center gap-2">
      <span className="body-14 w-[74px] text-neutral-60">{label}</span>
      <span className="body-14 font-medium text-label-normal">{value}</span>
    </div>
  );
}
