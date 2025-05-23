import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";

import {
  faFacebookF,
  faXTwitter,
  faInstagram,
  faTiktok,
} from "@fortawesome/free-brands-svg-icons";

import {
  Mail,
  MapPin,
  Globe,
  Users,
  ClipboardList,
  House,
  LogIn,
  Contact,
} from "lucide-react";

config.autoAddCss = false;

export default function Footer() {
  return (
    <footer className="bg-blue-600 dark:bg-gray-900 text-white dark:text-gray-200 pb-20 sm:pb-0 transition-colors duration-300">
      <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 text-center sm:text-left">
        {/* Branding */}
        <div className="flex flex-col items-center sm:items-start space-y-4">
          <h2 className="text-2xl font-semibold notranslate" translate="no">
            HospitAPP
          </h2>
          <p className="text-sm max-w-xs leading-relaxed">
            La forma más rápida, segura e inteligente de encontrar atención
            médica en Colombia.
          </p>
          <div className="flex space-x-3 mt-3">
            {[
              { icon: faFacebookF, label: "Facebook" },
              { icon: faXTwitter, label: "Twitter" },
              { icon: faInstagram, label: "Instagram" },
              { icon: faTiktok, label: "TikTok" },
            ].map((social, index) => (
              <a
                key={index}
                href="#"
                aria-label={social.label}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/40 dark:bg-white/10 dark:hover:bg-white/30 transition-all hover:scale-110"
              >
                <FontAwesomeIcon
                  icon={social.icon}
                  className="text-white text-lg"
                />
              </a>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div className="mt-8 sm:mt-0">
          <h3 className="text-lg font-semibold flex items-center justify-center sm:justify-start">
            <Globe className="w-5 h-5 mr-2" /> Explorar
          </h3>
          <ul className="text-sm space-y-2 mt-3">
            <li>
              <a
                href="/"
                className="hover:underline flex items-center justify-center sm:justify-start"
              >
                <House className="w-4 h-4 mr-2" /> Inicio
              </a>
            </li>
            <li>
              <a
                href="/specialties"
                className="hover:underline flex items-center justify-center sm:justify-start"
              >
                <ClipboardList className="w-4 h-4 mr-2" /> Especialidades
              </a>
            </li>
            <li>
              <a
                href="/login"
                className="hover:underline flex items-center justify-center sm:justify-start"
              >
                <LogIn className="w-4 h-4 mr-2" /> Iniciar sesión
              </a>
            </li>
            <li>
              <a
                href="/manual"
                className="hover:underline flex items-center justify-center sm:justify-start"
              >
                <ClipboardList className="w-4 h-4 mr-2" /> Manual de uso
              </a>
            </li>
          </ul>
        </div>

        {/* About */}
        <div className="mt-8 sm:mt-0">
          <h3 className="text-lg font-semibold flex items-center justify-center sm:justify-start">
            <Users className="w-5 h-5 mr-2" /> Sobre Nosotros
          </h3>
          <ul className="text-sm space-y-2 mt-3">
            <li>
              <a
                href="/about"
                className="hover:underline flex items-center justify-center sm:justify-start"
              >
                Quiénes somos
              </a>
            </li>
            <li>
              <a
                href="/faqs"
                className="hover:underline flex items-center justify-center sm:justify-start"
              >
                FAQs
              </a>
            </li>
          </ul>
        </div>

        {/* Contact */}
        <div className="mt-8 sm:mt-0">
          <h3 className="text-lg font-semibold flex items-center justify-center sm:justify-start">
            <Contact className="w-5 h-5 mr-2" /> Contacto
          </h3>
          <ul className="text-sm space-y-2 mt-3">
            <li className="flex items-center justify-center sm:justify-start">
              <Mail className="w-4 h-4 mr-2" /> admin@hospitapp.com
            </li>
            <li className="flex items-center justify-center sm:justify-start">
              <MapPin className="w-4 h-4 mr-2" /> Medellín, Antioquia, Colombia
            </li>
          </ul>
        </div>
      </div>

      {/* Copyright */}
      <div className="bg-blue-700 dark:bg-gray-800 py-4 mt-10 transition-colors duration-300">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm opacity-90">
          <p className="mb-2">
            © 2025 HospitAPP. Todos los derechos reservados.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href="/privacy-policy" className="hover:underline">
              Política de Privacidad
            </a>
            <a href="/terms-of-service" className="hover:underline">
              Términos de Servicio
            </a>
            <a href="/cookies-policy" className="hover:underline">
              Política de Cookies
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
