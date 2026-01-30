import imgLogo from "../imports/figma:asset/78c3356d89abac3549232f8f013af8f0b95725f6.png";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <div className={`relative ${className}`}>
      <img 
        src={imgLogo} 
        alt="EdgeData Logo" 
        className="w-full h-full object-contain"
      />
    </div>
  );
}
