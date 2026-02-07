import Link from "next/link";
import Image from "next/image";

export const Logo = () => {
  return (
    <Link href="/">
      <div className="flex items-center gap-x-2.5 transition-all hover:opacity-80 group">
        <div className="size-9 p-1.5 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 shadow-[0_4px_12px_rgba(37,99,235,0.4)] flex items-center justify-center transition-transform group-hover:scale-105 group-hover:rotate-3">
          <Image
            src="/logo.svg"
            width={24}
            height={24}
            alt="Canvas"
            className="filter invert brightness-0"
          />
        </div>
        <div className="flex flex-col">
          <span className="text-lg font-black tracking-tighter leading-none text-foreground uppercase pt-1">
             Expert
          </span>
          <span className="text-[10px] font-bold text-muted-foreground/60 tracking-[0.2em] leading-none uppercase pl-0.5">
            Engine
          </span>
        </div>
      </div>
    </Link>
  );
};
