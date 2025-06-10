/**
 * ULTIMATE OPTIMIZED HEADER V2
 * Modern, clean header with theme switching and user management
 * Focus: Accessibility, Performance, Mobile-first design
 */

import React, {
  useState,
  useMemo,
  useCallback,
  useRef,
  useEffect,
} from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Bell,
  Settings,
  User,
  Moon,
  Sun,
  Palette,
  LogOut,
  Menu,
  X,
  Shield,
  HelpCircle,
  ExternalLink,
  ChevronDown,
} from "lucide-react";
import { ThemeConfig } from "@/lib/ultimateDesignSystem";
import { performanceUtils } from "@/lib/performanceUtils";

// ===== TYPES =====
interface HeaderProps {
  theme: ThemeConfig;
  onThemeChange: (theme: ThemeConfig) => void;
  onToggleSidebar: () => void;
  sidebarExpanded: boolean;
  isMobile: boolean;
}

interface ThemeOption {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<{ size?: number }>;
  preview: string;
}

interface UserMenuItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ size?: number }>;
  action: () => void;
  external?: boolean;
  divider?: boolean;
  role?: ("user" | "admin")[];
}

// ===== CONSTANTS =====
const THEME_OPTIONS: ThemeOption[] = [
  {
    id: "clear",
    name: "Clear",
    description: "Tema claro profissional",
    icon: Sun,
    preview: "linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)",
  },
  {
    id: "dark",
    name: "Dark",
    description: "Tema escuro elegante",
    icon: Moon,
    preview: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
  },
  {
    id: "color",
    name: "Color",
    description: "Tema colorido vibrante",
    icon: Palette,
    preview: "linear-gradient(135deg, #faf5ff 0%, #f3e8ff 100%)",
  },
];

// ===== MEMOIZED COMPONENTS =====
const NotificationBadge = React.memo<{ count: number }>(({ count }) => {
  if (count === 0) return null;

  return (
    <span
      style={{
        position: "absolute",
        top: "-4px",
        right: "-4px",
        backgroundColor: "var(--color-error)",
        color: "white",
        borderRadius: "50%",
        width: "20px",
        height: "20px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "0.75rem",
        fontWeight: "600",
        minWidth: "20px",
      }}
    >
      {count > 99 ? "99+" : count}
    </span>
  );
});

const ThemePreview = React.memo<{ option: ThemeOption; isActive: boolean }>(
  ({ option, isActive }) => (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "var(--spacing-sm)",
        padding: "var(--spacing-sm) var(--spacing-md)",
        borderRadius: "var(--radius-md)",
        backgroundColor: isActive ? "var(--surface-secondary)" : "transparent",
        cursor: "pointer",
        transition: "all var(--duration-normal) var(--easing-default)",
      }}
    >
      <div
        style={{
          width: "24px",
          height: "24px",
          borderRadius: "var(--radius-sm)",
          background: option.preview,
          border: "2px solid var(--border-primary)",
        }}
      />
      <div style={{ flex: 1 }}>
        <div
          style={{
            fontWeight: 600,
            fontSize: "0.875rem",
            color: "var(--text-primary)",
          }}
        >
          {option.name}
        </div>
        <div
          style={{
            fontSize: "0.75rem",
            color: "var(--text-secondary)",
            lineHeight: 1.2,
          }}
        >
          {option.description}
        </div>
      </div>
    </div>
  ),
);

// ===== MAIN HEADER COMPONENT =====
const UltimateOptimizedHeader: React.FC<HeaderProps> = ({
  theme,
  onThemeChange,
  onToggleSidebar,
  sidebarExpanded,
  isMobile,
}) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [notificationCount] = useState(7);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [themeMenuOpen, setThemeMenuOpen] = useState(false);

  const userMenuRef = useRef<HTMLDivElement>(null);
  const themeMenuRef = useRef<HTMLDivElement>(null);

  // ===== USER MANAGEMENT =====
  const currentUser = useMemo(
    () => ({
      name: "João Silva",
      email: "joao.silva@lawdesk.com.br",
      role: theme.role,
      avatar: null,
    }),
    [theme.role],
  );

  // ===== USER MENU ITEMS =====
  const userMenuItems = useMemo((): UserMenuItem[] => {
    const baseItems: UserMenuItem[] = [
      {
        id: "profile",
        label: "Meu Perfil",
        icon: User,
        action: () => navigate("/configuracoes-usuario"),
      },
      {
        id: "settings",
        label: "Configurações",
        icon: Settings,
        action: () => navigate("/configuracoes-usuario"),
      },
      {
        id: "divider1",
        label: "",
        icon: User,
        action: () => {},
        divider: true,
      },
      {
        id: "portal-client",
        label: "Portal do Cliente",
        icon: ExternalLink,
        external: true,
        action: () => window.open("https://cliente.lawdesk.com.br", "_blank"),
      },
      {
        id: "support",
        label: "Suporte",
        icon: HelpCircle,
        external: true,
        action: () => window.open("https://suporte.lawdesk.com.br", "_blank"),
      },
      {
        id: "divider2",
        label: "",
        icon: User,
        action: () => {},
        divider: true,
      },
    ];

    // Add admin-specific items
    if (theme.role === "admin") {
      baseItems.push(
        {
          id: "switch-user",
          label: "Modo Cliente",
          icon: User,
          action: () => onThemeChange({ ...theme, role: "user" as const }),
        },
        {
          id: "admin-panel",
          label: "Painel Admin",
          icon: Shield,
          action: () => navigate("/beta"),
          role: ["admin"],
        },
      );
    } else {
      baseItems.push({
        id: "switch-admin",
        label: "Modo Admin",
        icon: Shield,
        action: () => onThemeChange({ ...theme, role: "admin" as const }),
      });
    }

    baseItems.push(
      {
        id: "divider3",
        label: "",
        icon: User,
        action: () => {},
        divider: true,
      },
      {
        id: "logout",
        label: "Sair",
        icon: LogOut,
        action: () => {
          // Handle logout
          console.log("Logout");
        },
      },
    );

    return baseItems;
  }, [theme.role, navigate, onThemeChange]);

  // ===== HANDLERS =====
  const handleSearch = useCallback(
    performanceUtils.componentOptimization.debounce((query: string) => {
      if (query.trim()) {
        // Implement search functionality
        console.log("Searching for:", query);
      }
    }, 300),
    [],
  );

  const handleThemeChange = useCallback(
    (newMode: string) => {
      const newTheme: ThemeConfig = { ...theme, mode: newMode as any };
      onThemeChange(newTheme);
      setThemeMenuOpen(false);
      performanceUtils.accessibilityUtils.announce(
        `Tema alterado para ${newMode}`,
        "polite",
      );
    },
    [theme, onThemeChange],
  );

  const toggleUserMenu = useCallback(() => {
    setUserMenuOpen((prev) => !prev);
    setThemeMenuOpen(false);
  }, []);

  const toggleThemeMenu = useCallback(() => {
    setThemeMenuOpen((prev) => !prev);
    setUserMenuOpen(false);
  }, []);

  // ===== EFFECTS =====

  // Close menus on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target as Node)
      ) {
        setUserMenuOpen(false);
      }
      if (
        themeMenuRef.current &&
        !themeMenuRef.current.contains(event.target as Node)
      ) {
        setThemeMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle ESC key
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setUserMenuOpen(false);
        setThemeMenuOpen(false);
      }
    };

    document.addEventListener("keydown", handleEscKey);
    return () => document.removeEventListener("keydown", handleEscKey);
  }, []);

  // ===== STYLES =====
  const headerStyles = useMemo(
    () => ({
      container: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 var(--spacing-lg)",
        height: "4rem",
        backgroundColor: "var(--surface-primary)",
        borderBottom: "1px solid var(--border-primary)",
        position: "sticky" as const,
        top: 0,
        zIndex: 30,
      },

      leftSection: {
        display: "flex",
        alignItems: "center",
        gap: "var(--spacing-lg)",
      },

      searchContainer: {
        position: "relative" as const,
        display: isMobile ? "none" : "flex",
        alignItems: "center",
        backgroundColor: "var(--surface-secondary)",
        borderRadius: "var(--radius-lg)",
        padding: "0 var(--spacing-md)",
        width: "400px",
        maxWidth: "400px",
        border: "1px solid var(--border-primary)",
        transition: "all var(--duration-normal) var(--easing-default)",
      },

      searchInput: {
        width: "100%",
        padding: "var(--spacing-sm) 0",
        backgroundColor: "transparent",
        border: "none",
        outline: "none",
        color: "var(--text-primary)",
        fontSize: "0.875rem",
      },

      rightSection: {
        display: "flex",
        alignItems: "center",
        gap: "var(--spacing-md)",
      },

      iconButton: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "40px",
        height: "40px",
        borderRadius: "var(--radius-md)",
        backgroundColor: "transparent",
        border: "none",
        color: "var(--text-secondary)",
        cursor: "pointer",
        transition: "all var(--duration-normal) var(--easing-default)",
        position: "relative" as const,
      },

      userButton: {
        display: "flex",
        alignItems: "center",
        gap: "var(--spacing-sm)",
        padding: "var(--spacing-sm) var(--spacing-md)",
        borderRadius: "var(--radius-md)",
        backgroundColor: "transparent",
        border: "1px solid var(--border-primary)",
        color: "var(--text-primary)",
        cursor: "pointer",
        transition: "all var(--duration-normal) var(--easing-default)",
      },

      avatar: {
        width: "32px",
        height: "32px",
        borderRadius: "50%",
        backgroundColor: "var(--primary-500)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "white",
        fontWeight: "600",
        fontSize: "0.875rem",
      },

      dropdown: {
        position: "absolute" as const,
        top: "calc(100% + 8px)",
        right: 0,
        backgroundColor: "var(--surface-primary)",
        border: "1px solid var(--border-primary)",
        borderRadius: "var(--radius-lg)",
        boxShadow: "var(--shadow-lg)",
        padding: "var(--spacing-sm)",
        minWidth: "240px",
        zIndex: 50,
        opacity: 1,
        transform: "translateY(0)",
        transition: "all var(--duration-normal) var(--easing-default)",
      },
    }),
    [isMobile],
  );

  // ===== RENDER =====
  return (
    <header style={headerStyles.container} className="header-optimized">
      {/* Left Section */}
      <div style={headerStyles.leftSection}>
        {/* Mobile Menu Toggle */}
        {isMobile && (
          <button
            style={headerStyles.iconButton}
            onClick={onToggleSidebar}
            aria-label="Toggle menu"
          >
            <Menu size={20} />
          </button>
        )}

        {/* Search */}
        <div style={headerStyles.searchContainer}>
          <Search size={18} color="var(--text-tertiary)" />
          <input
            style={headerStyles.searchInput}
            type="text"
            placeholder="Buscar clientes, processos, documentos..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              handleSearch(e.target.value);
            }}
            aria-label="Buscar"
          />
        </div>
      </div>

      {/* Right Section */}
      <div style={headerStyles.rightSection}>
        {/* Theme Selector */}
        <div style={{ position: "relative" }} ref={themeMenuRef}>
          <button
            style={headerStyles.iconButton}
            onClick={toggleThemeMenu}
            aria-label="Alterar tema"
            aria-expanded={themeMenuOpen}
          >
            {theme.mode === "dark" ? (
              <Moon size={20} />
            ) : theme.mode === "color" ? (
              <Palette size={20} />
            ) : (
              <Sun size={20} />
            )}
          </button>

          {themeMenuOpen && (
            <div style={headerStyles.dropdown}>
              <div
                style={{
                  fontSize: "0.875rem",
                  fontWeight: "600",
                  color: "var(--text-primary)",
                  marginBottom: "var(--spacing-sm)",
                  padding: "0 var(--spacing-sm)",
                }}
              >
                Escolher Tema
              </div>
              {THEME_OPTIONS.map((option) => (
                <button
                  key={option.id}
                  onClick={() => handleThemeChange(option.id)}
                  style={{
                    width: "100%",
                    border: "none",
                    backgroundColor: "transparent",
                    textAlign: "left",
                    borderRadius: "var(--radius-md)",
                    marginBottom: "var(--spacing-xs)",
                  }}
                  aria-label={`Alterar para tema ${option.name}`}
                >
                  <ThemePreview
                    option={option}
                    isActive={theme.mode === option.id}
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Notifications */}
        <button
          style={headerStyles.iconButton}
          aria-label={`Notificações (${notificationCount})`}
        >
          <Bell size={20} />
          <NotificationBadge count={notificationCount} />
        </button>

        {/* User Menu */}
        <div style={{ position: "relative" }} ref={userMenuRef}>
          <button
            style={headerStyles.userButton}
            onClick={toggleUserMenu}
            aria-label="Menu do usuário"
            aria-expanded={userMenuOpen}
          >
            <div style={headerStyles.avatar}>
              {currentUser.name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()}
            </div>
            {!isMobile && (
              <>
                <div style={{ textAlign: "left" }}>
                  <div
                    style={{
                      fontSize: "0.875rem",
                      fontWeight: "600",
                      color: "var(--text-primary)",
                    }}
                  >
                    {currentUser.name}
                  </div>
                  <div
                    style={{
                      fontSize: "0.75rem",
                      color: "var(--text-secondary)",
                    }}
                  >
                    {theme.role === "admin" ? "Administrador" : "Usuário"}
                  </div>
                </div>
                <ChevronDown
                  size={16}
                  style={{
                    transform: userMenuOpen ? "rotate(180deg)" : "rotate(0deg)",
                    transition:
                      "transform var(--duration-normal) var(--easing-default)",
                  }}
                />
              </>
            )}
          </button>

          {userMenuOpen && (
            <div style={headerStyles.dropdown}>
              {userMenuItems.map((item) => {
                if (item.divider) {
                  return (
                    <div
                      key={item.id}
                      style={{
                        height: "1px",
                        backgroundColor: "var(--border-primary)",
                        margin: "var(--spacing-sm) 0",
                      }}
                    />
                  );
                }

                if (item.role && !item.role.includes(theme.role)) {
                  return null;
                }

                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      item.action();
                      setUserMenuOpen(false);
                    }}
                    style={{
                      width: "100%",
                      display: "flex",
                      alignItems: "center",
                      gap: "var(--spacing-sm)",
                      padding: "var(--spacing-sm) var(--spacing-md)",
                      border: "none",
                      backgroundColor: "transparent",
                      color: "var(--text-primary)",
                      borderRadius: "var(--radius-md)",
                      cursor: "pointer",
                      transition:
                        "all var(--duration-normal) var(--easing-default)",
                      textAlign: "left",
                      fontSize: "0.875rem",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor =
                        "var(--surface-secondary)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "transparent";
                    }}
                    aria-label={item.label}
                  >
                    <item.icon size={16} />
                    <span style={{ flex: 1 }}>{item.label}</span>
                    {item.external && <ExternalLink size={14} />}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default UltimateOptimizedHeader;
