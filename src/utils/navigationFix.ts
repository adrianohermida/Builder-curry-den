/**
 * 🔧 NAVIGATION FIX UTILITY
 * Handles URL parameter synchronization and routing fixes
 */

export const getModuleFromUrl = (): string => {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get("module") || "dashboard";
};

export const setModuleInUrl = (module: string): void => {
  const url = new URL(window.location.href);
  url.searchParams.set("module", module);
  window.history.pushState({}, "", url.toString());
};

export const syncUrlWithModule = (expectedModule: string): void => {
  const currentModule = getModuleFromUrl();
  if (currentModule !== expectedModule) {
    setModuleInUrl(expectedModule);
  }
};

// Redirect helper for common module name mismatches
export const handleModuleRedirect = (): string => {
  const currentPath = window.location.pathname;
  const urlParams = new URLSearchParams(window.location.search);
  const module = urlParams.get("module");

  // Handle clientes URL specifically
  if (currentPath.includes("/crm-modern") && module === "clientes") {
    return "clientes";
  }

  // Handle other common redirects
  const redirectMap: Record<string, string> = {
    clients: "clientes",
    customers: "clientes",
    contacts: "contatos",
    business: "negocios",
    deals: "negocios",
    processes: "processos",
    contracts: "contratos",
    tasks: "tarefas",
    financial: "financeiro",
    documents: "documentos",
  };

  if (module && redirectMap[module]) {
    setModuleInUrl(redirectMap[module]);
    return redirectMap[module];
  }

  return module || "dashboard";
};

export default {
  getModuleFromUrl,
  setModuleInUrl,
  syncUrlWithModule,
  handleModuleRedirect,
};
