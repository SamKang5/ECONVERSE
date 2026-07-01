import type { PetState } from "../types";

interface PetDisplayProps {
  petState: PetState;
  showStats?: boolean;
}

export function PetDisplay({ petState, showStats = true }: PetDisplayProps) {
  const { name, species, equipped, level, points } = petState;

  // Render Background Accessory
  const renderBackground = () => {
    switch (equipped.background) {
      case "acc-b1": // Sàn Wall Street
        return (
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-[#0a122c] to-indigo-950 overflow-hidden rounded-2xl pointer-events-none">
            {/* Grid line patterns */}
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px]"></div>
            {/* Stock candles */}
            <svg className="absolute bottom-0 right-0 w-full h-24 opacity-20 text-emerald-400" fill="none">
              <path d="M10 80h10v-30h-10zm25 0h10v-50h-10zm25 0h10v-20h-10zm25 0h10v-60h-10zm25 0h10v-40h-10zm25 0h10v-75h-10zm25 0h10v-65h-10z" fill="currentColor" />
              <path d="M15 40v10M40 20v10M65 55v15M90 10v15M115 35v15M140 5v10" stroke="currentColor" strokeWidth="2" />
            </svg>
            <svg className="absolute bottom-0 left-0 w-full h-16 opacity-10 text-rose-400" fill="none">
              <path d="M10 60h8v-15H10zm20 0h8v-30h-8zm20 0h8v-10h-8zm20 0h8v-40h-8zm20 0h8v-20h-8z" fill="currentColor" />
            </svg>
            <div className="absolute top-3 right-3 text-[10px] font-mono text-emerald-400 animate-pulse flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
              WALL STREET LIVE +8.4%
            </div>
          </div>
        );
      case "acc-b2": // Kho tiền vàng
        return (
          <div className="absolute inset-0 bg-gradient-to-br from-[#1e1b10] via-slate-900 to-[#120e03] overflow-hidden rounded-2xl pointer-events-none">
            {/* Golden coins particles */}
            <div className="absolute bottom-0 left-0 right-0 h-16 bg-amber-500/15 filter blur-xs"></div>
            {/* Heap of gold SVGs */}
            <svg className="absolute bottom-0 inset-x-0 h-12 w-full text-amber-500/30" viewBox="0 0 100 20" preserveAspectRatio="none">
              <path d="M0 20 Q15 5, 30 15 T60 8 T90 15 T100 20 Z" fill="currentColor" />
              <circle cx="20" cy="12" r="3" fill="#fbbf24" className="opacity-40" />
              <circle cx="45" cy="5" r="2" fill="#f59e0b" className="opacity-50" />
              <circle cx="75" cy="9" r="4" fill="#fbbf24" className="opacity-40" />
            </svg>
            <div className="absolute top-3 right-3 text-[10px] font-mono text-amber-400 flex items-center gap-1">
              <span>🪙 GOLD VAULT SECURE</span>
            </div>
          </div>
        );
      default:
        // Default clean gradient
        return (
          <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl pointer-events-none">
            <div className="absolute inset-0 opacity-5 bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:14px_24px]"></div>
          </div>
        );
    }
  };

  return (
    <div className="relative flex flex-col items-center p-6 rounded-2xl border border-slate-800 bg-slate-900/60 shadow-xl overflow-hidden min-h-[340px] justify-between">
      {/* Background card layout */}
      {renderBackground()}

      {/* Level bar badge */}
      <div className="relative z-10 w-full flex justify-between items-center bg-slate-950/75 backdrop-blur-md px-3 py-1.5 rounded-full border border-slate-800 text-xs text-white">
        <span className="font-medium text-cyan-400 flex items-center gap-1">
          🛡️ Sinh Vật: <span className="capitalize text-white font-semibold">{species}</span>
        </span>
        <div className="flex items-center gap-1.5">
          <span className="bg-gradient-to-r from-blue-500 to-cyan-500 text-[10px] font-bold px-2 py-0.5 rounded-full">
            LV {level}
          </span>
          <span className="font-mono font-bold text-amber-400">{points} XP</span>
        </div>
      </div>

      {/* Main Avatar Drawing inside an SVG */}
      <div className="relative z-10 w-44 h-44 flex items-center justify-center my-4">
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full drop-shadow-[0_10px_15px_rgba(0,0,0,0.6)]"
        >
          {/* Shadow of pet */}
          <ellipse cx="50" cy="88" rx="24" ry="5" fill="#000000" className="opacity-45" />

          {/* Clothing - Back Layer (eg. cape body) */}
          {equipped.clothing === "acc-c1" && (
            <path
              d="M30 70 C30 70 12 85 24 88 C36 90 50 88 50 88 C50 88 64 90 76 88 C88 85 70 70 70 70 Z"
              fill="#dc2626"
              stroke="#991b1b"
              strokeWidth="1"
            />
          )}

          {/* Pet Base Body and Ears */}
          {species === "gấu" && (
            <g>
              {/* Ears */}
              <circle cx="32" cy="35" r="10" fill="#eab308" stroke="#ca8a04" strokeWidth="1.5" />
              <circle cx="32" cy="35" r="6" fill="#fef08a" />
              <circle cx="68" cy="35" r="10" fill="#eab308" stroke="#ca8a04" strokeWidth="1.5" />
              <circle cx="68" cy="35" r="6" fill="#fef08a" />
              {/* Core Head */}
              <circle cx="50" cy="58" r="28" fill="#f59e0b" stroke="#d97706" strokeWidth="2" />
              {/* Cheeks blush */}
              <circle cx="34" cy="65" r="4.5" fill="#f43f5e" className="opacity-40" />
              <circle cx="66" cy="65" r="4.5" fill="#f43f5e" className="opacity-40" />
              {/* Snout */}
              <ellipse cx="50" cy="64" rx="10" ry="7" fill="#fef08a" />
              <polygon points="46,60 54,60 50,64" fill="#451a03" />
              <path d="M50 64 v4 M47 68 Q50 70 53 68" stroke="#451a03" strokeWidth="1.5" fill="none" />
              {/* Eyes */}
              <circle cx="38" cy="54" r="3.5" fill="#1e293b" />
              <circle cx="37" cy="53" r="1" fill="#ffffff" />
              <circle cx="62" cy="54" r="3.5" fill="#1e293b" />
              <circle cx="61" cy="53" r="1" fill="#ffffff" />
            </g>
          )}

          {species === "mèo" && (
            <g>
              {/* Ears */}
              <polygon points="22,42 22,22 42,35" fill="#94a3b8" stroke="#64748b" strokeWidth="1.5" />
              <polygon points="25,38 25,26 38,34" fill="#fda4af" />
              <polygon points="78,42 78,22 58,35" fill="#94a3b8" stroke="#64748b" strokeWidth="1.5" />
              <polygon points="75,38 75,26 62,34" fill="#fda4af" />
              {/* Head */}
              <circle cx="50" cy="58" r="28" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="2" />
              {/* Whiskers */}
              <path d="M22 60 H10 M24 64 H12" stroke="#64748b" strokeWidth="1.5" />
              <path d="M78 60 H90 M76 64 H88" stroke="#64748b" strokeWidth="1.5" />
              {/* Cheeks blush */}
              <circle cx="33" cy="66" r="4" fill="#ef4444" className="opacity-40" />
              <circle cx="67" cy="66" r="4" fill="#ef4444" className="opacity-40" />
              {/* Snout */}
              <ellipse cx="50" cy="63" rx="7" ry="5" fill="#fda4af" />
              <polygon points="48,61 52,61 50,63" fill="#e11d48" />
              <path d="M50 63 Q48 66 46 65 M50 63 Q52 66 54 65" stroke="#e11d48" strokeWidth="1.5" fill="none" />
              {/* Eyes */}
              <ellipse cx="37" cy="52" rx="3.5" ry="4.5" fill="#0f172a" />
              <circle cx="36" cy="50" r="1.2" fill="#ffffff" />
              <ellipse cx="63" cy="52" rx="3.5" ry="4.5" fill="#0f172a" />
              <circle cx="62" cy="50" r="1.2" fill="#ffffff" />
            </g>
          )}

          {species === "khủng long" && (
            <g>
              {/* Spikes on head */}
              <polygon points="40,25 50,14 60,25" fill="#22c55e" stroke="#166534" strokeWidth="1.5" />
              <polygon points="30,32 37,20 45,30" fill="#22c55e" stroke="#166534" strokeWidth="1.5" />
              <polygon points="70,32 63,20 55,30" fill="#22c55e" stroke="#166534" strokeWidth="1.5" />
              {/* Head */}
              <rect x="25" y="36" width="50" height="48" rx="20" fill="#4ade80" stroke="#16a34a" strokeWidth="2" />
              {/* Chubby cheeks */}
              <circle cx="32" cy="66" r="5" fill="#ef4444" className="opacity-40" />
              <circle cx="68" cy="66" r="5" fill="#ef4444" className="opacity-40" />
              {/* Snout / Nostrils */}
              <ellipse cx="50" cy="70" rx="14" ry="8" fill="#86efac" />
              <circle cx="45" cy="68" r="2.2" fill="#14532d" />
              <circle cx="55" cy="68" r="2.2" fill="#14532d" />
              {/* Satisfied smiling line */}
              <path d="M42 74 Q50 78 58 74" stroke="#14532d" strokeWidth="2" fill="none" />
              {/* Intelligent eyes */}
              <ellipse cx="38" cy="52" rx="3.5" ry="5" fill="#1e293b" />
              <circle cx="37" cy="50" r="1.2" fill="#ffffff" />
              <ellipse cx="62" cy="52" rx="3.5" ry="5" fill="#1e293b" />
              <circle cx="61" cy="50" r="1.2" fill="#ffffff" />
            </g>
          )}

          {/* Clothing - Front Layer */}
          {equipped.clothing === "acc-c1" && (
            <g>
              {/* Royal Golden clasp */}
              <circle cx="50" cy="80" r="4.5" fill="#facc15" stroke="#ca8a04" strokeWidth="1" />
              <polygon points="48,80 50,77 52,80 50,83" fill="#d97706" />
            </g>
          )}

          {equipped.clothing === "acc-c2" && (
            <g>
              {/* Suit and Tie */}
              <path d="M28 78 L50 90 L72 78 L65 86 L50 90 L35 86 Z" fill="#1e293b" stroke="#0f172a" strokeWidth="1" />
              {/* White collar */}
              <polygon points="44,79 50,85 41,84" fill="#ffffff" />
              <polygon points="56,79 50,85 59,84" fill="#ffffff" />
              {/* Golden Dollar Tie */}
              <polygon points="49,83 51,83 52,90 50,91 48,90" fill="#facc15" />
              {/* Mini dollar sign on the tie */}
              <text x="50" y="88" fill="#15803d" fontSize="5" fontWeight="bold" textAnchor="middle" alignmentBaseline="middle">
                $
              </text>
            </g>
          )}

          {/* Glasses Layer */}
          {equipped.glasses === "acc-g1" && (
            <g className="animate-bounce" style={{ animationDuration: "3s" }}>
              {/* Thug Life pixelated shades */}
              <rect x="25" y="46" width="50" height="9" fill="#000000" rx="1" />
              {/* Mini white pixels to represent glare */}
              <rect x="27" y="48" width="4" height="2" fill="#ffffff" />
              <rect x="52" y="48" width="4" height="2" fill="#ffffff" />
              {/* Extended arms */}
              <rect x="22" y="46" width="4" height="4" fill="#000000" />
              <rect x="74" y="46" width="4" height="4" fill="#000000" />
            </g>
          )}

          {equipped.glasses === "acc-g2" && (
            <g>
              {/* Nerd glasses */}
              <circle cx="38" cy="52" r="9" fill="none" stroke="#dc2626" strokeWidth="2.5" />
              <circle cx="62" cy="52" r="9" fill="none" stroke="#dc2626" strokeWidth="2.5" />
              <line x1="47" y1="52" x2="53" y2="52" stroke="#dc2626" strokeWidth="3" />
            </g>
          )}

          {equipped.glasses === "acc-g3" && (
            <g className="animate-pulse">
              {/* Cyber laser visor */}
              <path d="M26 47 H74 L70 57 H30 Z" fill="rgba(6, 182, 212, 0.4)" stroke="#06b6d4" strokeWidth="2" />
              <line x1="28" y1="52" x2="72" y2="52" stroke="#e0f2fe" strokeWidth="1" className="opacity-80" />
              <text x="50" y="53" fill="#06b6d4" fontSize="4.5" fontWeight="black" textAnchor="middle" className="font-mono">
                BUY
              </text>
            </g>
          )}

          {/* Hat Layer */}
          {equipped.hat === "acc-h1" && (
            <g>
              {/* Snapback hat reverse */}
              <ellipse cx="50" cy="30" rx="20" ry="10" fill="#dc2626" stroke="#991b1b" strokeWidth="1.5" />
              <rect x="30" y="27" width="40" height="6" fill="#1e293b" rx="2" />
              {/* Back strap details */}
              <rect x="42" y="31" width="16" height="3" fill="#ffffff" rx="0.5" />
            </g>
          )}

          {equipped.hat === "acc-h2" && (
            <g>
              {/* Graduation Cap */}
              <polygon points="50,15 80,24 50,33 20,24" fill="#1e293b" stroke="#000" strokeWidth="1" />
              {/* Crown base */}
              <path d="M35 24 v10 Q50 38 65 34 V24" fill="#0f172a" />
              {/* Yellow dangle tassel */}
              <path d="M50 24 L74 24 V34 L77 34 L74 40 L71 34 L74 34" stroke="#facc15" strokeWidth="1.5" fill="#eab308" />
            </g>
          )}

          {equipped.hat === "acc-h3" && (
            <g>
              {/* Detective Sherlock Hat */}
              <path d="M22 36 Q50 20 78 36 Z" fill="#78350f" stroke="#451a03" strokeWidth="1.5" />
              <path d="M18 36 C18 36 30 33 50 33 C70 33 82 36 82 36 C82 36 84 39 74 38 C64 37 50 37 36 37 C22 37 18 36 18 36 Z" fill="#a16207" />
              {/* Sherlock bow */}
              <rect x="46" y="28" width="8" height="4" fill="#451a03" rx="1" />
            </g>
          )}
        </svg>
      </div>

      {/* Pet interactives / Name plate */}
      {showStats && (
        <div className="relative z-10 w-full text-center bg-slate-950/75 backdrop-blur-md px-3 py-2 rounded-xl border border-slate-800 text-sm">
          <div className="font-bold text-slate-100 flex items-center justify-center gap-1.5 font-display text-base">
            ✨ {name}
          </div>
          <div className="text-slate-400 text-xs mt-1 flex justify-center gap-2 items-center">
            <span>👕 {equipped.clothing ? "Đã mặc áo" : "Chưa chọn áo"}</span>
            <span>•</span>
            <span>👓 {equipped.glasses ? "Đeo kính" : "Mắt trần"}</span>
            <span>•</span>
            <span>🎩 {equipped.hat ? "Mũ đẹp" : "Không mũ"}</span>
          </div>
        </div>
      )}
    </div>
  );
}
