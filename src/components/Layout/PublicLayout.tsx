/**
 * 🎯 PUBLIC LAYOUT - LAYOUT PARA PÁGINAS PÚBLICAS
 *
 * Layout específico para páginas públicas:
 * - Login, registro, landing pages
 * - Header minimalista
 * - Footer com links úteis
 * - Otimizado para conversão
 * - Responsividade total
 * - SEO otimizado
 */

import React from "react";
import { Outlet, useNavigate, Link } from "react-router-dom";
import {
  Twitter,
  Linkedin,
  Mail,
  Phone,
  MapPin,
  Shield,
  Lock,
  Award,
  ExternalLink,
} from "lucide-react";

// Design System
import { ultimateDesignSystem } from "@/lib/ultimateDesignSystem";

// UI Components
import Button from "@/components/ui/OptimizedButton";

// ===== TYPES =====
interface PublicLayoutProps {
  children?: React.ReactNode;
  variant?: "default" | "centered" | "split" | "minimal";
  showHeader?: boolean;
  showFooter?: boolean;
  className?: string;
}

interface FooterLink {
  label: string;
  href: string;
  external?: boolean;
}

interface FooterSection {
  title: string;
  links: FooterLink[];
}

// ===== FOOTER CONFIGURATION =====
const FOOTER_SECTIONS: FooterSection[] = [
  {
    title: "Produto",
    links: [
      { label: "Recursos", href: "/recursos" },
      { label: "Preços", href: "/precos" },
      { label: "Demonstração", href: "/demo" },
      { label: "Segurança", href: "/seguranca" },
    ],
  },
  {
    title: "Empresa",
    links: [
      { label: "Sobre", href: "/sobre" },
      { label: "Blog", href: "/blog" },
      { label: "Carreiras", href: "/carreiras" },
      { label: "Contato", href: "/contato" },
    ],
  },
  {
    title: "Suporte",
    links: [
      { label: "Central de Ajuda", href: "/ajuda" },
      { label: "Documentação", href: "/docs", external: true },
      { label: "Status", href: "/status", external: true },
      { label: "Comunidade", href: "/comunidade" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacidade", href: "/privacidade" },
      { label: "Termos", href: "/termos" },
      { label: "LGPD", href: "/lgpd" },
      { label: "Cookies", href: "/cookies" },
    ],
  },
];

const SOCIAL_LINKS = [
  {
    icon: Twitter,
    href: "https://twitter.com/lawdesk",
    label: "Twitter",
  },
  {
    icon: Linkedin,
    href: "https://linkedin.com/company/lawdesk",
    label: "LinkedIn",
  },
];

// ===== PUBLIC LAYOUT COMPONENT =====
const PublicLayout: React.FC<PublicLayoutProps> = ({
  children,
  variant = "default",
  showHeader = true,
  showFooter = true,
  className = "",
}) => {
  const navigate = useNavigate();

  // ===== RENDER FUNCTIONS =====
  const renderHeader = () => {
    if (!showHeader) return null;

    return (
      <header className="sticky top-0 z-50 border-b border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center">
                <span className="text-white font-bold text-sm">L</span>
              </div>
              <span className="text-xl font-bold text-gray-900 dark:text-gray-100">
                Lawdesk
              </span>
            </Link>

            {/* Navigation Links */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link
                to="/recursos"
                className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 transition-colors"
              >
                Recursos
              </Link>
              <Link
                to="/precos"
                className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 transition-colors"
              >
                Preços
              </Link>
              <Link
                to="/sobre"
                className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 transition-colors"
              >
                Sobre
              </Link>
              <Link
                to="/contato"
                className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 transition-colors"
              >
                Contato
              </Link>
            </nav>

            {/* Auth Buttons */}
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                onClick={() => navigate("/login")}
                className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
              >
                Entrar
              </Button>
              <Button
                variant="primary"
                onClick={() => navigate("/registro")}
                className="hidden sm:inline-flex"
              >
                Começar Grátis
              </Button>
            </div>
          </div>
        </div>
      </header>
    );
  };

  const renderFooter = () => {
    if (!showFooter) return null;

    return (
      <footer className="bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
            {/* Brand Section */}
            <div className="lg:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center">
                  <span className="text-white font-bold text-sm">L</span>
                </div>
                <span className="text-xl font-bold text-gray-900 dark:text-gray-100">
                  Lawdesk
                </span>
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md">
                A plataforma completa de CRM jurídico que transforma a gestão do
                seu escritório com tecnologia moderna e segura.
              </p>

              {/* Trust Indicators */}
              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Shield size={16} className="text-green-500" />
                  <span>100% Seguro</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Lock size={16} className="text-green-500" />
                  <span>LGPD Compliant</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Award size={16} className="text-green-500" />
                  <span>OAB Aprovado</span>
                </div>
              </div>

              {/* Social Links */}
              <div className="flex items-center gap-3">
                {SOCIAL_LINKS.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    aria-label={social.label}
                  >
                    <social.icon size={20} />
                  </a>
                ))}
              </div>
            </div>

            {/* Footer Links */}
            {FOOTER_SECTIONS.map((section) => (
              <div key={section.title}>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">
                  {section.title}
                </h3>
                <ul className="space-y-3">
                  {section.links.map((link) => (
                    <li key={link.label}>
                      {link.external ? (
                        <a
                          href={link.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 transition-colors flex items-center gap-1"
                        >
                          {link.label}
                          <ExternalLink size={12} />
                        </a>
                      ) : (
                        <Link
                          to={link.href}
                          className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 transition-colors"
                        >
                          {link.label}
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Bottom Section */}
          <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              {/* Copyright */}
              <div className="text-gray-500 dark:text-gray-400 text-sm">
                © 2024 Lawdesk. Todos os direitos reservados.
              </div>

              {/* Contact Info */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                <div className="flex items-center gap-2">
                  <Mail size={14} />
                  <a
                    href="mailto:contato@lawdesk.com.br"
                    className="hover:text-gray-700 dark:hover:text-gray-300"
                  >
                    contato@lawdesk.com.br
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <Phone size={14} />
                  <a
                    href="tel:+5511999999999"
                    className="hover:text-gray-700 dark:hover:text-gray-300"
                  >
                    (11) 99999-9999
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin size={14} />
                  <span>São Paulo, SP</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    );
  };

  const renderContent = () => {
    const variants = {
      default: "container mx-auto px-4 sm:px-6 lg:px-8 py-8",
      centered:
        "flex items-center justify-center min-h-[calc(100vh-4rem)] px-4 sm:px-6 lg:px-8",
      split: "grid lg:grid-cols-2 min-h-screen",
      minimal: "w-full",
    };

    return <main className={variants[variant]}>{children || <Outlet />}</main>;
  };

  // ===== MAIN RENDER =====
  return (
    <div
      className={`
        min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100
        ${className}
      `}
    >
      {renderHeader()}
      {renderContent()}
      {renderFooter()}
    </div>
  );
};

export default React.memo(PublicLayout);
