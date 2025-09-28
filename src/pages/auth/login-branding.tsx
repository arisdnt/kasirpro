import { getStoreInfoForLogin } from "@/config/store-info";

export function LoginBranding() {
  const storeInfo = getStoreInfoForLogin();

  return (
    <div className="flex-[3] bg-gradient-to-br from-blue-600 via-blue-700 to-purple-700 flex items-end justify-start p-8 relative overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{backgroundImage: `url(${storeInfo.backgroundImage})`}}
      />
      <div className="absolute inset-0 bg-[#476EAE] mix-blend-multiply opacity-60"></div>
      <div className="text-center text-white max-w-lg relative z-10">
        <div className="bg-white/10 backdrop-blur-md p-6 border border-white/20 shadow-2xl">
          <div className="space-y-2 mb-5">
            <h1 className="text-4xl font-bold tracking-tight text-white drop-shadow-lg">
              {storeInfo.name}
            </h1>
            {storeInfo.tagline && (
              <p className="text-xl text-white/90 font-medium">{storeInfo.tagline}</p>
            )}
            <div className="w-16 h-1 bg-white/30 mx-auto"></div>
          </div>

          {storeInfo.features && storeInfo.features.length > 0 && (
            <div className="space-y-2 mb-5">
              {storeInfo.features.map((feature) => (
                <div key={feature} className="flex items-center space-x-4 text-white/90">
                  <div className="w-3 h-3 bg-white/60 shadow-sm"></div>
                  <span className="font-medium">{feature}</span>
                </div>
              ))}
            </div>
          )}

          {(storeInfo.address || storeInfo.phone || storeInfo.operatingHours) && (
            <div className="border-t border-white/20 pt-4 space-y-1">
              {storeInfo.address && (
                <p className="text-sm text-white/80">{storeInfo.address}</p>
              )}
              {storeInfo.phone && (
                <p className="text-sm text-white/80">{storeInfo.phone}</p>
              )}
              {storeInfo.operatingHours && (
                <p className="text-sm text-white/80">{storeInfo.operatingHours}</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}