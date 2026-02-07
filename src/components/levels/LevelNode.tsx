"use client";

import Link from "next/link";
import { useT } from "@/lib/copy";

/** Background images for level nodes (unlocked state). Gradient used if missing. */
const LEVEL_NODE_IMAGES: Record<string, string> = {
  "1":
    "https://lh3.googleusercontent.com/aida-public/AB6AXuDT_oXcrWLsjUFjFCPh9jwGw_wybJNAUbsuisJ4kZERjbsWem_rj69hSRneU8gs5ZBJ7MUCPvreq1eEnFtm92nXJitSv7T9lntdJp0XNHJ_6UUhDk_u5u_MpO2LWjHyLHJr_ILTqU5fy8tXv0PVN-tr_AXtje7fiZbQcxoevxRhslMyU1sMC6Uk_hbcmFEHqJRZco0yGJUggvGHXInRS7hySAtZYKvAJKlu4ycHj7eeG5l1CfZwz25qNYHvwtokvHl2muL1ArMDCkA",
  "2":
    "https://lh3.googleusercontent.com/aida-public/AB6AXuAwsGdQlM99WQRzj3-8Wbfld2k3aSBq94tFUmxFclsTf_xhz_lpwdq9t57gPT1sTIaHiKqC4nwxoLXGPTwwv2cWT01jjylfS2cMsxy5Yg-ZoevOAzZ5EwJrKep6saaE94H0xoiLqAzgKpPdbO2AWOKSK0lJ3A3yPe5s5Iek-4_liJmgIFZmajJFC6AE5OwtaMeUGz9kcrj78-QPs-MHjl0X0qLoD-gIs9RB-rr8on8HU_VGobT1nJDqipOIh8XZK_xstl1z0QLUgfY",
  "3":
    "https://lh3.googleusercontent.com/aida-public/AB6AXuBIZmvLQ3e8brCJZ4G_vvuXbu12SqunSNvdI6mcR-L4eTKBAZVFJ8s_bDLpRP2QoPhFW0077xT0CCZRf_YTMIiGRECB0DH1jAWXGQIeHOaLZBpBA53Vgk6dzA6GgH0Yqa4EcNazRSYqimjulICcuoaquUc5giI3s3cvEghPbA8ImFKM2NnWyaEu_hmQUXiNyTjMo84_fv81HW5KKGsveKIDlJnsG5LELq2LZSChdJ6H8ky9GG01K0VpdauHn68CNbkaorVMDRQ_MA4",
};

export interface LevelNodeProps {
  levelId: string;
  labelKey: string;
  unlocked: boolean;
  completed: boolean;
  isCurrent: boolean;
  onSelect: () => void;
  className?: string;
}

export function LevelNode({
  levelId,
  labelKey,
  unlocked,
  completed,
  isCurrent,
  onSelect,
  className = "",
}: LevelNodeProps) {
  const t = useT();
  const imageUrl = LEVEL_NODE_IMAGES[levelId];
  const backgroundStyle = imageUrl
    ? {
        backgroundImage: unlocked
          ? `linear-gradient(to bottom right, rgba(37, 140, 244, 0.2), rgba(30, 58, 138, 0.3)), url("${imageUrl}")`
          : `url("${imageUrl}")`,
      }
    : unlocked
      ? {
          backgroundImage:
            "linear-gradient(to bottom right, rgba(37, 140, 244, 0.3), rgba(30, 58, 138, 0.4))",
        }
      : undefined;

  const content = (
    <div className={`group ${className}`}>
      <div className="absolute -top-14 left-1/2 -translate-x-1/2 opacity-100 group-hover:scale-110 transition-transform whitespace-nowrap z-20">
        <span
          className={`arcade-text font-bold text-xs sm:text-sm px-3 py-1 rounded border bg-black/60 ${
            unlocked ? "border-white/20" : "border-white/20 opacity-50"
          }`}
        >
          {t(labelKey)}
        </span>
      </div>
      <div
        className={`relative size-32 sm:size-40 rounded-2xl sm:rounded-3xl bg-contain bg-no-repeat bg-center drop-shadow-[0_0_20px_rgba(37,140,244,0.3)] ${
          unlocked
            ? "border-2 border-primary/50"
            : "grayscale contrast-125 opacity-40 border border-white/10"
        }`}
        style={backgroundStyle}
      >
        {unlocked && isCurrent && (
          <div className="absolute -top-10 left-1/2 -translate-x-1/2 flex flex-col items-center">
            <div className="size-10 sm:size-12 rounded-full bg-primary/90 border-2 border-white flex items-center justify-center text-lg">
              🦊
            </div>
            <div className="size-2 bg-primary rounded-full animate-ping mt-1" />
          </div>
        )}
        {!unlocked && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="material-symbols-outlined text-red-500 text-4xl sm:text-5xl drop-shadow-[0_0_10px_rgba(239,68,68,0.5)">
              lock
            </span>
          </div>
        )}
      </div>
      <div className="absolute -bottom-6 left-1/2 -translate-x-1/2">
        {unlocked ? (
          <span
            className="material-symbols-outlined text-primary text-2xl sm:text-3xl block"
            aria-label={completed ? t("levels.completed") : t("levels.play")}
          >
            {completed ? "check_circle" : "play_circle"}
          </span>
        ) : (
          <p className="text-[10px] font-bold uppercase text-white/30 tracking-widest">
            {t("levels.locked")}
          </p>
        )}
      </div>
    </div>
  );

  if (unlocked) {
    return (
      <Link href="/play" onClick={onSelect} className="block">
        {content}
      </Link>
    );
  }
  return content;
}
