/**
 * 🔍 NOT FOUND PAGE - PÁGINA 404
 *
 * Página 404 - Não encontrada
 */

import React from "react";
import { useNavigate } from "react-router-dom";

const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        <div>
          <div className="mx-auto h-16 w-16 bg-gradient-to-br from-red-500 to-pink-500 rounded-xl flex items-center justify-center">
            <span className="text-white font-bold text-2xl">!</span>
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            404 - Página não encontrada
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            A página que você está procurando não existe.
          </p>
        </div>
        <div className="mt-8 space-y-6">
          <div className="space-y-4">
            <button
              onClick={() => navigate("/")}
              className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Voltar ao Início
            </button>
            <button
              onClick={() => navigate(-1)}
              className="w-full flex justify-center py-2 px-4 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Voltar à Página Anterior
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
