import React, { useState } from 'react';
import { 
  ShieldCheck, Camera, Sparkles, ArrowRight, 
  MapPin, Calendar, HardDrive, Heart, Star, Download, Eye,
  Lock, KeyRound, CheckCircle2, ChevronRight, LogOut, Palette
} from 'lucide-react';
import { GallerySession, GalleryImage, User, StudioBrandingConfig } from '../types';
import { formatBytes } from '../services/storageService';
import { COLOR_PRESET_MAP, DEFAULT_BRANDING } from '../services/brandingService';
import { BrandIcon } from './BrandIcon';

interface PublicClientPortalProps {
  currentUser: User | null;
  galleries: GallerySession[];
  images: GalleryImage[];
  onOpenGallery: (galleryId: string) => void;
  onLogin: (email: string, pass: string, targetRole?: 'admin' | 'client') => boolean;
  onPinSubmit: (pin: string) => boolean;
  onOpenAuthModal?: (tab?: 'admin' | 'client' | 'pin') => void;
  onLogout?: () => void;
  onNavigateAdmin?: () => void;
  theme?: 'light' | 'dark';
  branding?: StudioBrandingConfig;
}

export const PublicClientPortal: React.FC<PublicClientPortalProps> = ({
  currentUser,
  galleries,
  images,
  onOpenGallery,
  onLogin,
  onPinSubmit,
  onOpenAuthModal,
  onLogout,
  onNavigateAdmin,
  theme = 'dark',
  branding,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const isDark = theme === 'dark';
  const colorTheme = branding ? COLOR_PRESET_MAP[branding.colorPreset] || COLOR_PRESET_MAP.blue : COLOR_PRESET_MAP.blue;

  // Client accessible galleries
  const clientGalleries = currentUser
    ? galleries.filter(g => 
        currentUser.role === 'admin' || 
        currentUser.assignedGalleryIds?.includes(g.id) || 
        g.clientIds?.includes(currentUser.id)
      )
    : galleries.filter(g => g.status === 'published');

  const filteredGalleries = clientGalleries.filter(g => {
    const matchesCategory = selectedCategory === 'all' || g.category === selectedCategory;
    const matchesSearch = g.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          g.location?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          g.subtitle?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className={`min-h-screen transition-colors duration-200 ${
      isDark ? 'bg-[#0F1012] text-slate-100' : 'bg-[#F8F9FA] text-slate-800'
    } pb-24`}>
      
      {/* Hero Section */}
      <div className={`relative overflow-hidden border-b transition-colors -mt-16 ${
        isDark ? 'border-slate-800 bg-[#0c0d0e] text-white' : 'border-slate-200 bg-slate-900 text-white'
      }`}>
        
        {/* Background Media (High Definition Image or Video) */}
        {branding?.portalHeroMediaType !== 'none' && (
          <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
            {branding?.portalHeroMediaType === 'video' && branding.portalHeroVideoUrl ? (
              <video
                key={branding.portalHeroVideoUrl}
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover scale-105"
                poster={branding.portalHeroBgImage || undefined}
                style={{
                  filter: branding.portalHeroBlur ? `blur(${branding.portalHeroBlur}px)` : undefined,
                }}
              >
                <source src={branding.portalHeroVideoUrl} type="video/mp4" />
                <source src={branding.portalHeroVideoUrl} type="video/webm" />
              </video>
            ) : (
              (branding?.portalHeroBgImage || DEFAULT_BRANDING.portalHeroBgImage) && (
                <img
                  src={branding?.portalHeroBgImage || DEFAULT_BRANDING.portalHeroBgImage}
                  alt="Hero Background"
                  className="w-full h-full object-cover scale-105 animate-in fade-in duration-700"
                  style={{
                    filter: branding?.portalHeroBlur ? `blur(${branding.portalHeroBlur}px)` : undefined,
                  }}
                />
              )
            )}

            {/* Configurable Color Overlay Layer */}
            <div 
              className="absolute inset-0 transition-all duration-300 pointer-events-none"
              style={{
                backgroundColor: branding?.portalHeroOverlayColor || '#090a0f',
                opacity: (branding?.portalHeroOverlayOpacity ?? 72) / 100,
              }}
            />

            {/* Smooth gradient blend into portal body */}
            <div 
              className={`absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t pointer-events-none ${
                isDark ? 'from-[#0F1012] via-[#0F1012]/80 to-transparent' : 'from-[#F8F9FA] via-[#F8F9FA]/80 to-transparent'
              }`} 
            />
          </div>
        )}

        {/* Subtle Background Pattern */}
        <div className="absolute inset-0 z-0 opacity-15 pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:24px_24px]" />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 sm:pt-28 pb-16 sm:pb-24 text-center space-y-6">
          
          <div className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider backdrop-blur-md shadow-md ${colorTheme.twBadgeBg} ${colorTheme.twBadgeBorder} ${colorTheme.twBadgeText}`}>
            <Sparkles className="w-3.5 h-3.5" />
            <span>{branding?.portalHeroBadge || 'Lumina Studio Pro • Plataforma Fotográfica'}</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight font-serif-display leading-tight max-w-3xl mx-auto drop-shadow-sm text-white">
            {branding?.portalHeroTitle || 'Galerías fotográficas privadas en'}{' '}
            <span className={`${colorTheme.twText} italic drop-shadow-sm`}>
              {branding?.portalHeroHighlight || 'máxima resolución.'}
            </span>
          </h1>

          <p className="text-sm sm:text-base max-w-2xl mx-auto leading-relaxed text-slate-200 drop-shadow-xs font-medium">
            {branding?.portalHeroSubtitle || 'Visualización, selección de favoritas y descarga directa en alta fidelidad RAW y 4K con almacenamiento seguro.'}
          </p>

          {/* TWO MAIN ACCESS OPTIONS (AS REQUESTED) */}
          {!currentUser ? (
            <div className="pt-6 max-w-3xl mx-auto">
              <p className={`text-xs font-semibold uppercase tracking-wider mb-4 ${
                isDark ? 'text-slate-400' : 'text-slate-500'
              }`}>
                Selecciona tu tipo de acceso para continuar:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-left">
                
                {/* OPTION 1: Ingresar como Administrador */}
                <div 
                  id="card-access-admin"
                  onClick={() => onOpenAuthModal?.('admin')}
                  className={`group relative p-6 sm:p-7 rounded-3xl border transition-all duration-200 cursor-pointer shadow-lg hover:shadow-2xl hover:-translate-y-1 ${
                    isDark 
                      ? 'bg-slate-900/90 hover:bg-slate-900 border-slate-700/80 hover:border-blue-500/80' 
                      : 'bg-white hover:bg-blue-50/40 border-slate-200 hover:border-blue-500'
                  }`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center group-hover:scale-110 group-hover:text-white transition-all ${colorTheme.twBadgeBg} ${colorTheme.twBorder} ${colorTheme.twText} group-hover:${colorTheme.twBg}`}>
                      <ShieldCheck className="w-6 h-6" />
                    </div>
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${
                      isDark 
                        ? 'bg-slate-800 text-slate-300 border-slate-700' 
                        : 'bg-slate-100 text-slate-600 border-slate-200'
                    }`}>
                      {branding?.adminCardBadge || 'Fotógrafos & Estudio'}
                    </span>
                  </div>

                  <h3 className={`text-xl font-bold font-serif-display mb-2 transition-colors ${
                    isDark ? 'text-white' : 'text-slate-900'
                  }`}>
                    {branding?.adminCardTitle || 'Ingresar como Administrador'}
                  </h3>

                  <p className={`text-xs leading-relaxed mb-6 ${
                    isDark ? 'text-slate-400' : 'text-slate-600'
                  }`}>
                    {branding?.adminCardDescription || 'Panel integral para gestión de sesiones, subida de fotografías RAW, control de clientes, métricas de almacenamiento y auditoría.'}
                  </p>

                  <div className="flex items-center justify-between pt-3 border-t border-slate-800/40">
                    <span className={`text-xs font-bold flex items-center gap-1.5 group-hover:translate-x-1 transition-transform ${colorTheme.twText}`}>
                      <span>Acceder al Panel</span>
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </div>

                {/* OPTION 2: Ingresar al Portal de Clientes */}
                <div 
                  id="card-access-client"
                  onClick={() => onOpenAuthModal?.('client')}
                  className={`group relative p-6 sm:p-7 rounded-3xl border transition-all duration-200 cursor-pointer shadow-lg hover:shadow-2xl hover:-translate-y-1 ${
                    isDark 
                      ? 'bg-slate-900/90 hover:bg-slate-900 border-slate-700/80 hover:border-indigo-500/80' 
                      : 'bg-white hover:bg-indigo-50/40 border-slate-200 hover:border-indigo-500'
                  }`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-600/15 border border-indigo-500/30 text-indigo-500 flex items-center justify-center group-hover:scale-110 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                      {branding?.logoType === 'image' && branding.logoImageUrl ? (
                        <img src={branding.logoImageUrl} alt="Logo" className="w-7 h-7 rounded object-cover" />
                      ) : (
                        <BrandIcon name={branding?.logoIcon || 'Camera'} className="w-6 h-6" />
                      )}
                    </div>
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${
                      isDark 
                        ? 'bg-slate-800 text-slate-300 border-slate-700' 
                        : 'bg-slate-100 text-slate-600 border-slate-200'
                    }`}>
                      {branding?.clientCardBadge || 'Clientes & Invitados'}
                    </span>
                  </div>

                  <h3 className={`text-xl font-bold font-serif-display mb-2 group-hover:text-indigo-500 transition-colors ${
                    isDark ? 'text-white' : 'text-slate-900'
                  }`}>
                    {branding?.clientCardTitle || 'Ingresar al Portal de Clientes'}
                  </h3>

                  <p className={`text-xs leading-relaxed mb-6 ${
                    isDark ? 'text-slate-400' : 'text-slate-600'
                  }`}>
                    {branding?.clientCardDescription || 'Accede con tu usuario o con el código PIN de tu sesión para explorar fotos en alta resolución, marcar favoritas y descargar archivos.'}
                  </p>

                  <div className="flex items-center justify-between pt-3 border-t border-slate-800/40">
                    <span className="text-xs font-bold text-indigo-500 flex items-center gap-1.5 group-hover:translate-x-1 transition-transform">
                      <span>Ver Galerías & PIN</span>
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </div>

              </div>
            </div>
          ) : (
            /* Logged in state summary */
            <div className={`p-6 rounded-3xl border max-w-2xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl ${
              isDark ? 'bg-slate-900/90 border-slate-700' : 'bg-white border-slate-200'
            }`}>
              <div className="flex items-center gap-4 text-left">
                <div className={`w-12 h-12 rounded-2xl text-white font-bold flex items-center justify-center text-lg shadow-md ${colorTheme.twBg}`}>
                  {currentUser.avatar ? (
                    <img src={currentUser.avatar} alt={currentUser.name} className="w-full h-full object-cover rounded-2xl" />
                  ) : (
                    currentUser.name.charAt(0)
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold">{currentUser.name}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${colorTheme.twBadgeBg} ${colorTheme.twBadgeBorder} ${colorTheme.twBadgeText}`}>
                      {currentUser.role === 'admin' ? 'Administrador' : currentUser.role === 'photographer' ? 'Fotógrafo' : 'Cliente'}
                    </span>
                  </div>
                  <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{currentUser.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {currentUser.role === 'admin' && onNavigateAdmin && (
                  <button
                    onClick={onNavigateAdmin}
                    className={`px-4 py-2 rounded-xl text-white text-xs font-bold shadow-md transition-all flex items-center gap-1.5 cursor-pointer ${colorTheme.twBg} ${colorTheme.twBgHover} ${colorTheme.twShadow}`}
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span>Ir al Dashboard</span>
                  </button>
                )}
                {onLogout && (
                  <button
                    onClick={onLogout}
                    className={`px-3 py-2 rounded-xl border text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer ${
                      isDark 
                        ? 'border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-rose-400' 
                        : 'border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-rose-600'
                    }`}
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Cerrar Sesión</span>
                  </button>
                )}
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Featured / Client Galleries Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 space-y-8">
        
        {/* Header & Filter Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4 border-slate-200 dark:border-slate-800">
          <div>
            <h2 className="text-2xl font-bold font-serif-display">
              {currentUser?.role === 'client' ? 'Tus Galerías Privadas Asignadas' : 'Galerías de Sesiones Fotográficas'}
            </h2>
            <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              {filteredGalleries.length} {filteredGalleries.length === 1 ? 'sesión disponible' : 'sesiones disponibles'} para visualización
            </p>
          </div>

          {/* Categories Pill Selector */}
          <div className="flex flex-wrap items-center gap-1.5">
            {[
              { id: 'all', label: 'Todas' },
              { id: 'boda', label: 'Bodas' },
              { id: 'editorial', label: 'Editorial' },
              { id: 'retrato', label: 'Retrato' },
              { id: 'eventos', label: 'Eventos' },
            ].map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
                  selectedCategory === cat.id
                    ? `${colorTheme.twBg} text-white shadow-xs`
                    : isDark 
                      ? 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800' 
                      : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Galleries Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGalleries.map(gallery => {
            const galleryImages = images.filter(img => img.galleryId === gallery.id);
            const totalBytes = galleryImages.reduce((acc, img) => acc + (img.fileSizeBytes || 0), 0);

            return (
              <div
                key={gallery.id}
                id={`gallery-card-${gallery.id}`}
                onClick={() => onOpenGallery(gallery.id)}
                className={`group rounded-3xl overflow-hidden border transition-all duration-300 cursor-pointer hover:shadow-2xl hover:-translate-y-1 flex flex-col justify-between ${
                  isDark ? 'bg-slate-900/80 border-slate-800 hover:border-slate-600' : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                {/* Cover Image */}
                <div className="relative aspect-16/10 overflow-hidden bg-slate-950">
                  <img
                    src={gallery.coverImage}
                    alt={gallery.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  
                  {/* Category Badge */}
                  <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-black/60 backdrop-blur-md text-white border border-white/20">
                    {gallery.category}
                  </span>

                  {/* Lock Indicator */}
                  {gallery.isPasswordProtected && (
                    <span className="absolute top-3 right-3 p-1.5 rounded-full bg-black/60 backdrop-blur-md text-amber-300 border border-amber-500/30" title="Galería protegida con PIN">
                      <Lock className="w-3.5 h-3.5" />
                    </span>
                  )}

                  {/* Bottom Meta on Image */}
                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <p className="text-xs font-semibold flex items-center gap-1.5 opacity-90">
                      <MapPin className="w-3 h-3 text-slate-300" />
                      <span>{gallery.location || 'Estudio Lumina'}</span>
                    </p>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-1.5">
                    <h3 className={`font-bold text-lg font-serif-display transition-colors line-clamp-1 group-hover:underline ${
                      isDark ? 'text-white' : 'text-slate-900'
                    }`}>
                      {gallery.title}
                    </h3>
                    <p className={`text-xs line-clamp-2 leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                      {gallery.subtitle || gallery.description}
                    </p>
                  </div>

                  <div className={`pt-3 border-t flex items-center justify-between text-xs ${
                    isDark ? 'border-slate-800 text-slate-400' : 'border-slate-100 text-slate-500'
                  }`}>
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1">
                        <Calendar className={`w-3.5 h-3.5 ${colorTheme.twText}`} />
                        <span>{gallery.eventDate}</span>
                      </span>
                      <span>•</span>
                      <span>{galleryImages.length} fotos</span>
                    </div>

                    <span className={`font-semibold flex items-center gap-1 group-hover:translate-x-1 transition-transform ${colorTheme.twText}`}>
                      <span>Ver galería</span>
                      <ChevronRight className="w-4 h-4" />
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>

    </div>
  );
};
