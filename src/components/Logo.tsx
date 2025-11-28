interface LogoProps {
  className?: string;
}

export function Logo({ className = "h-10" }: LogoProps) {
  return (
    <div className={`${className} flex items-center gap-2`}>
      <svg viewBox="0 0 48 48" className="h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* UAO Text */}
        <rect width="48" height="48" rx="8" fill="#e63946"/>
        <text x="24" y="30" textAnchor="middle" fill="white" fontSize="18" fontWeight="bold" fontFamily="Arial, sans-serif">UAO</text>
      </svg>
      <div className="flex items-center">
        <span className="leading-none font-[Jura] font-normal text-[20px]">CreAI Maker</span>
      </div>
    </div>
  );
}
