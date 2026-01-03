"use client"

import * as React from "react"
import Link from 'next/link';
import { Server, ChevronRight } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

interface MockDashboardProps {
  modules: string[];
}

export function MockDashboard({ modules }: MockDashboardProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  // Initialize activeModule from URL, or default to first module
  const activeModule = searchParams.get('module') || modules[0];

  // Keep track of visited modules to only render iframes for them
  const [visitedModules, setVisitedModules] = React.useState<Set<string>>(new Set([activeModule]));

  React.useEffect(() => {
    if (activeModule && !visitedModules.has(activeModule)) {
      setVisitedModules(prev => new Set(prev).add(activeModule));
    }
  }, [activeModule, visitedModules]);

  const handleModuleClick = (module: string) => {
    // Update URL without full page reload
    const newParams = new URLSearchParams(searchParams.toString());
    newParams.set('module', module);
    router.push(`/?${newParams.toString()}`);
  };

  return (
    <div className="flex h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 font-sans">
       {/* Sidebar */}
       <aside className="w-64 border-r border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex flex-col fixed md:relative h-full z-20 flex-shrink-0">
          <div className="p-6 border-b border-zinc-200 dark:border-zinc-800">
            <div className="flex items-center gap-2 font-bold text-xl tracking-tight">
               <div className="w-8 h-8 bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-900 flex items-center justify-center rounded-lg shadow-sm">
                  <Server className="w-5 h-5" />
               </div>
               <span className="bg-clip-text text-transparent bg-gradient-to-r from-zinc-900 to-zinc-500 dark:from-white dark:to-zinc-400">
                 Mock Hub
               </span>
            </div>
            <p className="text-xs text-zinc-500 mt-2 font-medium">
               API Documentation Console
            </p>
          </div>

          <nav className="flex-1 overflow-y-auto p-4 space-y-1">
             <div className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-3 px-3">
               Modules
             </div>
             {modules.map((module) => (
               <button
                 key={module}
                 onClick={() => handleModuleClick(module)}
                 className={`w-full group flex items-center justify-between px-3 py-2.5 rounded-md text-sm font-medium transition-all duration-200 ${
                    activeModule === module
                      ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 shadow-sm'
                      : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800/50'
                 }`}
               >
                 <div className="flex items-center gap-3">
                   <div className={`w-2 h-2 rounded-full transition-colors ${activeModule === module ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]' : 'bg-zinc-300 dark:bg-zinc-700'}`} />
                   <span className="capitalize">{module}</span>
                 </div>
                 {activeModule === module && <ChevronRight className="w-4 h-4 text-zinc-400" />}
               </button>
             ))}
          </nav>
          
          <div className="p-4 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50">
            <div className="flex items-center justify-between text-xs text-zinc-400">
               <span>Status: Online</span>
               <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            </div>
          </div>
       </aside>

       {/* Main Content - Full Screen Iframe with Keep-Alive */}
       <main className="flex-1 flex flex-col h-full overflow-hidden bg-white relative">
          {modules.map(module => {
            // Only render iframe if it has been visited at least once
            if (!visitedModules.has(module)) return null;

            return (
              <iframe 
                key={module}
                src={`/api/mock/${module}/openapi`} 
                className="w-full h-full border-0 absolute inset-0 bg-white"
                style={{ 
                  visibility: activeModule === module ? 'visible' : 'hidden',
                  zIndex: activeModule === module ? 10 : 0
                }}
                title={`${module} API Documentation`}
              />
            );
          })}
       </main>
    </div>
  );
}
