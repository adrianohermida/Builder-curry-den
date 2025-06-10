/**
 * 🚀 ONBOARDING PAGE - PÁGINA DE ONBOARDING
 *
 * Página de onboarding placeholder
 */

import React from "react";

const OnboardingPage: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
            <span className="text-white font-bold text-2xl">L</span>
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Bem-vindo ao Lawdesk CRM
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Sistema jurídico integrado para escritórios de advocacia
          </p>
        </div>
        <div className="mt-8 space-y-6">
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600 text-sm">✓</span>
              </div>
              <span className="text-gray-700">CRM Jurídico Completo</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600 text-sm">✓</span>
              </div>
              <span className="text-gray-700">Gestão de Processos</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600 text-sm">✓</span>
              </div>
              <span className="text-gray-700">IA Jurídica Integrada</span>
            </div>
          </div>

          <div>
            <button
              type="button"
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Começar Agora
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingPage;
