import React from "react";

export function TechStackLogos() {
  return (
    
    <div className="w-full max-w-4xl grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-8 items-center justify-center opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
     
      {/* 1. Next.js */}
      <div className="flex items-center justify-center gap-2 group transition-all duration-300">
        <svg
          role="img"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 fill-current group-hover:fill-[#ff00ff] group-hover:animate-spin"
        >
          <path d="M18.665 21.978C16.758 23.255 14.465 24 12 24 5.373 24 0 18.627 0 12S5.373 0 12 0s12 5.373 12 12c0 3.584-1.574 6.801-4.072 9.093l-9.945-12.274-2.071-2.553V20.75h2.464v-6.72l7.18 8.883-2.891 3.565v-.001-.499zM7.536 20.75h-2.464V3.339h2.464v17.411z" />
        </svg>
        <span className="font-bold text-lg tracking-tight  group-hover:text-[#ff00ff] transition-colors">Next.js</span>
      </div>

      {/* 2. React */}
      <div className="flex items-center justify-center gap-2 group transition-all duration-300">
        <svg
          viewBox="-10.5 -9.45 21 18.9"
          className="h-6 w-6 fill-current group-hover:text-[#149ECA] group-hover:animate-spin"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="0" cy="0" r="2" fill="currentColor"></circle>
          <g stroke="currentColor" strokeWidth="1" fill="none">
            <ellipse rx="10" ry="4.5"></ellipse>
            <ellipse rx="10" ry="4.5" transform="rotate(60)"></ellipse>
            <ellipse rx="10" ry="4.5" transform="rotate(120)"></ellipse>
          </g>
        </svg>
        <span className="font-bold text-lg tracking-tight group-hover:text-[#149ECA] transition-colors">React</span>
      </div>

      {/* 3. Stripe */}
      <div className="flex items-center justify-center gap-2 group transition-all duration-300">
        <svg
          role="img"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 fill-current group-hover:fill-[#635BFF] group-hover:animate-bounce"
        >
          <path d="M13.976 9.15c-2.172-.806-3.356-1.426-3.356-2.915 0-1.178 1.108-1.741 2.272-1.741 1.933 0 3.92.807 5.302 1.875L20 2.262C17.927.92 15.484.06 12.97.06c-4.632 0-8.23 2.449-8.23 6.946 0 5.488 5.61 6.649 8.243 7.643 2.923 1.096 3.193 2.108 3.193 3.328 0 1.254-1.233 1.996-3.155 1.996-2.529 0-4.966-1.16-6.685-2.735L4.47 21.26c2.28 2.001 4.965 2.68 7.965 2.68 4.966 0 8.878-2.368 8.878-7.387 0-4.996-4.52-6.143-7.337-7.402z" />
        </svg>
        <span className="font-bold text-lg tracking-tight group-hover:text-[#635BFF] transition-colors">Stripe</span>
      </div>

      {/* 4. Vercel */}
      <div className="flex items-center justify-center gap-2 group transition-all duration-300">
        <svg
          role="img"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 fill-foreground group-hover:fill-[#07d080] group-hover:animate-spin"
        >
          <path d="M24 22.525H0l12-21.05 12 21.05z" />
        </svg>
        <span className="font-bold text-lg tracking-tight group-hover:text-[#07d080] transition-colors">Vercel</span>
      </div>

      {/* 5. Tailwind CSS */}
      <div className="flex items-center justify-center gap-2 group transition-all duration-300">
        <svg
          role="img"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 fill-current group-hover:fill-[#06B6D4] group-hover:animate-bounce"
        >
          <path d="M12.001,4.8c-3.2,0-5.2,1.6-6,4.8c1.2-1.6,2.6-2.2,4.2-1.8c0.913,0.228,1.565,0.89,2.288,1.624 C13.666,10.618,15.027,12,18.001,12c3.2,0,5.2-1.6,6-4.8c-1.2,1.6-2.6,2.2-4.2,1.8c-0.913-0.228-1.565-0.89-2.288-1.624 C16.337,6.182,14.976,4.8,12.001,4.8z M6.001,12c-3.2,0-5.2,1.6-6,4.8c1.2-1.6,2.6-2.2,4.2-1.8c0.913,0.228,1.565,0.89,2.288,1.624 c1.177,1.194,2.538,2.576,5.512,2.576c3.2,0,5.2-1.6,6-4.8c-1.2,1.6-2.6,2.2-4.2,1.8c-0.913-0.228-1.565-0.89-2.288-1.624 C10.337,13.382,8.976,12,6.001,12z" />
        </svg>
        <span className="font-bold text-lg tracking-tight group-hover:text-[#06B6D4] transition-colors">Tailwind</span>
      </div>

      {/* 6. Supabase */}
      <div className="flex items-center justify-center gap-2 group transition-all duration-300">
        
    
        <svg
          role="img"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 fill-current group-hover:fill-[#3ECF8E] group-hover:animate-ping"
        >
          <path d="M21.362 9.354H12L13.437.914a.425.425 0 0 0-.671-.402L2.638 14.646H12L10.563 23.086a.425.425 0 0 0 .671.402l10.128-14.134z" />
        </svg>
        <span className="font-bold text-lg tracking-tight group-hover:text-[#3ECF8E] transition-colors">Supabase</span>
      </div>
 
    </div>
    
  );
}