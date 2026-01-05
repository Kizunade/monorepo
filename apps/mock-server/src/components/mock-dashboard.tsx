"use client"

import * as React from "react"
import Link from 'next/link';
import { Server, ChevronRight, ChevronDown } from "lucide-react";
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

  const groupedModules = React.useMemo(() => {
    const groups: Record<string, string[]> = {};
    const uncategorized: string[] = [];

    modules.forEach(mod => {
      const parts = mod.split('/');
      if (parts.length > 1) {
        const category = parts[0];
        if (!groups[category]) groups[category] = [];
        groups[category].push(mod);
      } else {
        uncategorized.push(mod);
      }
    });

    return { groups, uncategorized };
  }, [modules]);

  // Track expanded categories
  const [expandedCategories, setExpandedCategories] = React.useState<Set<string>>(() => {
    const initial = new Set<string>();
    // Always expand the category of the active module
    if (activeModule) {
      const parts = activeModule.split('/');
      if (parts.length > 1) {
        initial.add(parts[0]);
      } else if (groupedModules.uncategorized.includes(activeModule)) {
        initial.add('general');
      }
    }
    // Also expand all by default if needed, or just the active one. 
    // Let's expand all by default for better discovery if no active module is deep
    if (initial.size === 0 && Object.keys(groupedModules.groups).length > 0) {
      initial.add(Object.keys(groupedModules.groups)[0]);
    }
    return initial;
  });

  React.useEffect(() => {
    if (activeModule && !visitedModules.has(activeModule)) {
      setVisitedModules(prev => new Set(prev).add(activeModule));
    }

    // Auto-expand the category when active module changes
    if (activeModule) {
      const parts = activeModule.split('/');
      if (parts.length > 1) {
        setExpandedCategories(prev => {
          if (prev.has(parts[0])) return prev;
          return new Set(prev).add(parts[0]);
        });
      } else if (groupedModules.uncategorized.includes(activeModule)) {
        setExpandedCategories(prev => {
          if (prev.has('general')) return prev;
          return new Set(prev).add('general');
        });
      }
    }
  }, [activeModule, visitedModules, groupedModules.uncategorized]);

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => {
      const next = new Set(prev);
      if (next.has(category)) {
        next.delete(category);
      } else {
        next.add(category);
      }
      return next;
    });
  };

  const handleModuleClick = (module: string) => {
    // Update URL without full page reload
    const newParams = new URLSearchParams(searchParams.toString());
    newParams.set('module', module);
    router.push(`/?${newParams.toString()}`);
  };

  const renderModuleButton = (module: string, displayName: string) => (
    <button
      key={module}
      onClick={() => handleModuleClick(module)}
      className={`w-full group flex items-center justify-between px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${activeModule === module
        ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 shadow-sm'
        : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800/50'
        }`}
    >
      <div className="flex items-center gap-3">
        <div className={`w-1.5 h-1.5 rounded-full transition-colors ${activeModule === module ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]' : 'bg-zinc-300 dark:bg-zinc-700'}`} />
        <span className="capitalize">{displayName}</span>
      </div>
      {activeModule === module && <ChevronRight className="w-4 h-4 text-zinc-400" />}
    </button>
  );

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

        <nav className="flex-1 overflow-y-auto p-4 space-y-2">
          {Object.entries(groupedModules.groups).map(([category, categoryModules]) => {
            const isExpanded = expandedCategories.has(category);
            return (
              <div key={category} className="space-y-1">
                <button
                  onClick={() => toggleCategory(category)}
                  className="w-full flex items-center justify-between px-3 py-2 text-xs font-semibold text-zinc-400 uppercase tracking-wider hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors"
                >
                  <span>{category}</span>
                  {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                </button>

                {isExpanded && (
                  <div className="space-y-0.5 animate-in slide-in-from-top-1 duration-200">
                    {categoryModules.map(module =>
                      renderModuleButton(module, module.split('/')[1])
                    )}
                  </div>
                )}
              </div>
               );
             })}

          {groupedModules.uncategorized.length > 0 && (
            <div className="space-y-1">
              {(Object.keys(groupedModules.groups).length > 0) && (
                <button 
                  onClick={() => toggleCategory('general')}
                  className="w-full flex items-center justify-between px-3 py-2 text-xs font-semibold text-zinc-400 uppercase tracking-wider hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors"
                >
                  <span>General</span>
                  {expandedCategories.has('general') ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                </button>
              )}
              {(!Object.keys(groupedModules.groups).length || expandedCategories.has('general')) && (
                <div className="space-y-0.5 animate-in slide-in-from-top-1 duration-200">
                  {groupedModules.uncategorized.map(module =>
                    renderModuleButton(module, module)
                  )}
                </div>
              )}
            </div>
          )}
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
