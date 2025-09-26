import { brandingFeatures } from "./login-constants";

export function LoginBranding() {
  return (
    <div className="flex-[3] bg-gradient-to-br from-blue-600 via-blue-700 to-purple-700 flex items-end justify-start p-8 relative overflow-hidden">
      <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{backgroundImage: 'url(/bglogin.jpg)'}}></div>
      <div className="absolute inset-0 bg-[#476EAE] mix-blend-multiply opacity-60"></div>
      <div className="text-center text-white max-w-lg relative z-10">
        <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 shadow-2xl">
          <div className="w-20 h-20 mx-auto bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-white/30 mb-6 shadow-lg">
            <div className="text-3xl font-bold">🏪</div>
          </div>

          <div className="space-y-3 mb-8">
            <h1 className="text-4xl font-bold tracking-tight text-white drop-shadow-lg">KasirPro</h1>
            <p className="text-xl text-white/90 font-medium">Control Center</p>
            <div className="w-16 h-1 bg-white/30 rounded-full mx-auto"></div>
          </div>

          <div className="space-y-4 mb-8">
            {brandingFeatures.map((feature) => (
              <div key={feature} className="flex items-center space-x-4 text-white/90">
                <div className="w-3 h-3 bg-white/60 rounded-full shadow-sm"></div>
                <span className="font-medium">{feature}</span>
              </div>
            ))}
          </div>

          <div className="border-t border-white/20 pt-6">
            <p className="text-sm text-white/80 font-medium">
              Solusi POS terpercaya untuk bisnis retail modern
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}