import Image from "next/image";

export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black text-white">
      {/* Logo */}
      <Image
        src="/images/logo.jpg"
        alt="FocusTube"
        className="mb-6"
        width={80}
        height={80}
      />

      {/* App name */}
      <h1 className="text-xl font-semibold tracking-wide">
        Focus<span className="text-blue-500">Tube</span>
      </h1>

      {/* Subtle message */}
      <p className="mt-3 text-sm text-neutral-400">
        Preparing your focus session…
      </p>

      {/* Minimal pulse */}
      <div className="mt-6 h-1 w-32 rounded-full bg-neutral-800 overflow-hidden">
        <div className="h-full w-1/2 bg-blue-500 animate-pulse" />
      </div>
    </div>
  );
}
