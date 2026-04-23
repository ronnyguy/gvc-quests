"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import {
  Users, Zap, Search, X, Copy, Check, ChevronDown,
  Bell, Twitter, Hash, Crown, Smile
} from "lucide-react";

// ─── GIF Library ─────────────────────────────────────────────────────────────

const GIF_LIBRARY = [
  { id: "2F9NoLzsg9RgBSE10X", label: "Buzzd",       url: "https://media.giphy.com/media/2F9NoLzsg9RgBSE10X/giphy.gif" },
  { id: "ygxlakNTPSHgV3k7m0", label: "Love",        url: "https://media.giphy.com/media/ygxlakNTPSHgV3k7m0/giphy.gif" },
  { id: "slaDyEARpzHLFt1pbl", label: "GVC",         url: "https://media.giphy.com/media/slaDyEARpzHLFt1pbl/giphy.gif" },
  { id: "JElPMiBMkozSxn1ZY4", label: "Sunshine",    url: "https://media.giphy.com/media/JElPMiBMkozSxn1ZY4/giphy.gif" },
  { id: "yeac8qwFZFQxTkgJDn", label: "Buzzd 2",     url: "https://media.giphy.com/media/yeac8qwFZFQxTkgJDn/giphy.gif" },
  { id: "WAJ9lDsrZcpZOfQ0nT", label: "Smart",       url: "https://media.giphy.com/media/WAJ9lDsrZcpZOfQ0nT/giphy.gif" },
  { id: "M8OObCJn10limG2uNx", label: "Welcome",     url: "https://media.giphy.com/media/M8OObCJn10limG2uNx/giphy.gif" },
  { id: "2ATcJnbpzboIq4ZFNo", label: "Sup",         url: "https://media.giphy.com/media/2ATcJnbpzboIq4ZFNo/giphy.gif" },
  { id: "Uq9Bb6BcFRGFjfFwbd", label: "Tendy",       url: "https://media.giphy.com/media/Uq9Bb6BcFRGFjfFwbd/giphy.gif" },
  { id: "yZCUdGSEOi0CC4HM9k", label: "Finger Guns", url: "https://media.giphy.com/media/yZCUdGSEOi0CC4HM9k/giphy.gif" },
];

// ─── Team Config ──────────────────────────────────────────────────────────────

type TeamMember = "chris" | "ty" | "ronnie" | "maison";

const TEAM: { id: TeamMember; name: string; avatar: string }[] = [
  { id: "chris",  name: "Chris",  avatar: "🎯" },
  { id: "ty",     name: "Ty",     avatar: "🌊" },
  { id: "ronnie", name: "Ronnie", avatar: "⚡" },
  { id: "maison", name: "Maison", avatar: "🎨" },
];

// ─── Templates ───────────────────────────────────────────────────────────────

interface TeamTemplate {
  id: string;
  name: string;
  category: string;
  emoji: string;
  color: string;
  bodies: Record<TeamMember, string>;
}

const TEMPLATES: TeamTemplate[] = [
  {
    id: "welcome",
    name: "Welcome",
    category: "welcome",
    emoji: "👋",
    color: "#2EFF2E",
    bodies: {
      chris:  "yo @{twitter} welcome to vibetown 🏙️ let's get it",
      ty:     "welcome to the city @{twitter} 🏙️ vibetown is different",
      ronnie: "@{twitter} in. welcome to vibetown 🏙️",
      maison: "@{twitter} welcome to the culture 🏙️ vibetown is alive",
    },
  },
  {
    id: "thankyou",
    name: "Thank You",
    category: "thankyou",
    emoji: "🙏",
    color: "#FFE048",
    bodies: {
      chris:  "@{twitter} real ones don't go unnoticed 💛 appreciate you fr",
      ty:     "@{twitter} — real talk, we appreciate you. always 💛",
      ronnie: "@{twitter} straight up — thank you. means everything 💛",
      maison: "grateful for you @{twitter} — you make this real 💛",
    },
  },
  {
    id: "reactivate",
    name: "Re-activate",
    category: "reactivate",
    emoji: "📡",
    color: "#FF6B9D",
    bodies: {
      chris:  "@{twitter} vibetown's calling 📡 we ain't forgot about you",
      ty:     "@{twitter} where you been? the vibes are still here 🌊",
      ronnie: "@{twitter} it's been a minute. what's good?",
      maison: "@{twitter} the energy is still here. come back to the vibe 🌊",
    },
  },
  {
    id: "praise",
    name: "On Fire",
    category: "praise",
    emoji: "🔥",
    color: "#FF5F1F",
    bodies: {
      chris:  "@{twitter} bro your vibe score is legit insane rn 🔥",
      ty:     "can't deny the numbers @{twitter} — top tier energy 🔥",
      ronnie: "@{twitter} vibe score {vibeScore}. that speaks for itself 🔥",
      maison: "@{twitter} your energy is literally moving the whole community 🔥",
    },
  },
  {
    id: "whale",
    name: "Whale Appreciation",
    category: "gift",
    emoji: "🐋",
    color: "#7C3AED",
    bodies: {
      chris:  "@{twitter} {gvcCount} GVCs. absolute conviction. we see you 👑",
      ty:     "@{twitter} {gvcCount} strong. the foundation fr 🐋",
      ronnie: "{gvcCount} GVCs @{twitter}. no cap, that's legendary 👑",
      maison: "@{twitter} holding {gvcCount} like it's nothing 🐋 you're the backbone",
    },
  },
  {
    id: "gift",
    name: "Gift Drop",
    category: "gift",
    emoji: "🎁",
    color: "#06B6D4",
    bodies: {
      chris:  "@{twitter} 👀 check your mentions. something's moving",
      ty:     "@{twitter} stay close. something good coming your way 🎁",
      ronnie: "@{twitter} 🎁 keep your eyes open",
      maison: "@{twitter} something special is headed your way 👀 stay tuned 🎁",
    },
  },
];

// ─── Tier Config ──────────────────────────────────────────────────────────────

const TIER_CONFIG = {
  "whale-active":      { label: "Whale Active",     color: "#FFE048", bg: "rgba(255,224,72,0.12)",  icon: "🐋🔥", priority: "HIGH" },
  "whale-passive":     { label: "Whale Passive",     color: "#FF6B9D", bg: "rgba(255,107,157,0.12)", icon: "🐋💤", priority: "RE-ENGAGE" },
  "community-active":  { label: "Community Active",  color: "#2EFF2E", bg: "rgba(46,255,46,0.10)",   icon: "⚡",    priority: "GROWING" },
  "community-passive": { label: "Community Passive", color: "#888",    bg: "rgba(136,136,136,0.10)", icon: "😴",    priority: "DORMANT" },
};

type HolderTier = keyof typeof TIER_CONFIG;

// ─── Types ───────────────────────────────────────────────────────────────────

interface Holder {
  wallet: string;
  gvcCount: number;
  twitter: string;
  discord: string;
  vibeScore: number;
  tier: HolderTier;
  lastActivity: string;
  joined: string;
  totalVolume: number;
  recentBuys: number;
  recentSells: number;
  isNew: boolean;
  tags: string[];
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const TWITTER_HANDLES = [
  "vibechad_eth","gvcmaxi","nftpulse","cryptovibe","holdergmc",
  "wagmivibes","degenlife","ethereal_nft","vibetownresident","gvcog",
  "nftwhale88","vibecheck_eth","cryptopunk_fan","blockchainbro","holderlife",
  "web3wizard","nftcollector","vibemaximalist","gvcfam","ethereumgmc",
  "alphavibes","nftguru","cryptomaxi","vibetownholder","gvclegend",
  "defivibes","nftflipmaster","vibecommunity","gvcdiamondhand","cryptovibez",
];

const DISCORD_HANDLES = [
  "vibechad#1234","gvcmaxi#5678","holder.eth#9012","cryptovibe#3456",
  "wagmi_vibes#7890","degen_life#2345","ethereal#6789","vibetown#0123",
  "nft_whale#4567","vibecheck#8901","blockbro#2346","web3wiz#6780",
  "collector#0124","vibemaxi#4568","gvcfam#8902","alpha#2347",
  "nftguru#6781","cryptomax#0125","vibeholder#4569","legend#8903",
  "defivibe#2348","flipmaster#6782","vibecomm#0126","diamond#4570",
  "cryptovibez#8904","og_holder#2349","gvcking#6783","vibequeen#0127",
  "nftdegen#4571","whalewatch#8905",
];

function hashCode(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    const c = str.charCodeAt(i);
    h = (h << 5) - h + c;
    h = h & h;
  }
  return Math.abs(h);
}

function buildHolder(wallet: string, buys: number, sells: number, volume: number, gvcCount: number): Holder {
  const h = hashCode(wallet);
  const social = {
    twitter: TWITTER_HANDLES[h % TWITTER_HANDLES.length],
    discord: DISCORD_HANDLES[h % DISCORD_HANDLES.length],
    joined: new Date(Date.now() - (h % 700) * 86400000).toLocaleDateString("en-US", { month: "short", year: "numeric" }),
    isNew: h % 10 === 0,
    totalVolume: volume || parseFloat(((h % 500) / 10).toFixed(2)),
  };
  const tags: string[] = [];
  if (h % 5 === 0) tags.push("OG Holder");
  if (h % 7 === 0) tags.push("Diamond Hands");
  if (h % 3 === 0) tags.push("Active Trader");
  if (h % 11 === 0) tags.push("Community Voice");

  const holdScore = Math.min(40, gvcCount >= 100 ? 40 : gvcCount >= 30 ? 30 : gvcCount >= 10 ? 20 : 10);
  const actScore = Math.min(35, buys * 8 + Math.max(0, 15 - sells * 3));
  const vibeScore = Math.min(100, Math.max(10, holdScore + actScore + (h % 25) + 5));
  const isWhale = gvcCount >= 20;
  const isActive = buys > 0;
  const tier: HolderTier = isWhale && isActive ? "whale-active" : isWhale ? "whale-passive" : isActive ? "community-active" : "community-passive";
  const lastActivity = (buys > 0 || sells > 0) ? `${(h % 28) + 1}d ago` : `${(h % 60) + 30}d ago`;

  return {
    wallet, gvcCount, twitter: social.twitter, discord: social.discord,
    vibeScore, tier, lastActivity, joined: social.joined,
    totalVolume: social.totalVolume, recentBuys: buys, recentSells: sells,
    isNew: social.isNew, tags: tags.slice(0, 3),
  };
}

function fillTemplate(body: string, holder: Holder): string {
  return body
    .replace(/{twitter}/g, holder.twitter)
    .replace(/{gvcCount}/g, String(holder.gvcCount))
    .replace(/{vibeScore}/g, String(holder.vibeScore))
    .replace(/{discord}/g, holder.discord);
}

function truncate(addr: string) { return addr.slice(0, 6) + "..." + addr.slice(-4); }

// ─── Shared Components ────────────────────────────────────────────────────────

function VibeBar({ score }: { score: number }) {
  const color = score >= 75 ? "#2EFF2E" : score >= 50 ? "#FFE048" : score >= 30 ? "#FF5F1F" : "#FF6B9D";
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 rounded-full bg-[#1F1F1F] overflow-hidden">
        <motion.div className="h-full rounded-full" style={{ background: color }}
          initial={{ width: 0 }} animate={{ width: `${score}%` }} transition={{ duration: 0.8, ease: "easeOut" }} />
      </div>
      <span className="text-xs font-bold" style={{ color }}>{score}</span>
    </div>
  );
}

function TierBadge({ tier }: { tier: HolderTier }) {
  const cfg = TIER_CONFIG[tier];
  return (
    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap"
      style={{ color: cfg.color, background: cfg.bg }}>
      {cfg.icon} {cfg.label}
    </span>
  );
}

// ─── Team Dropdown ────────────────────────────────────────────────────────────

function TeamDropdown({ active, onChange }: { active: TeamMember; onChange: (m: TeamMember) => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const member = TEAM.find(m => m.id === active)!;

  useEffect(() => {
    const fn = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button onClick={() => setOpen(o => !o)}
        className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#121212] border border-[#1F1F1F] hover:border-[#333] transition-all">
        <span className="text-base leading-none">{member.avatar}</span>
        <span className="text-sm font-bold text-white font-body">{member.name}</span>
        <ChevronDown size={12} className={`text-gray-500 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div className="absolute right-0 top-full mt-1.5 w-40 rounded-xl bg-[#0D0D0D] border border-[#1F1F1F] overflow-hidden z-50 shadow-2xl"
            initial={{ opacity: 0, y: -6, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }} transition={{ duration: 0.12 }}>
            {TEAM.map(m => (
              <button key={m.id} onClick={() => { onChange(m.id); setOpen(false); }}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 text-sm font-body transition-colors ${
                  m.id === active ? "bg-[rgba(255,224,72,0.08)] text-[#FFE048]" : "text-gray-300 hover:bg-[#1F1F1F]"
                }`}>
                <span>{m.avatar}</span>
                <span className="font-bold">{m.name}</span>
                {m.id === active && <Check size={12} className="ml-auto text-[#FFE048]" />}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── GIF Picker Component ─────────────────────────────────────────────────────

function GifPicker({ selected, onSelect }: {
  selected: string | null;
  onSelect: (url: string | null) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fn = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, []);

  const selectedGif = GIF_LIBRARY.find(g => g.url === selected);

  return (
    <div ref={ref} className="relative">
      <button onClick={() => setOpen(o => !o)}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold font-body border transition-all ${
          selected
            ? "border-[#FFE048]/40 text-[#FFE048] bg-[rgba(255,224,72,0.06)]"
            : "border-[#1F1F1F] text-gray-400 bg-[#121212] hover:border-[#333] hover:text-white"
        }`}>
        <Smile size={12} />
        {selected ? `GIF: ${selectedGif?.label}` : "Pick a GIF"}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            className="absolute bottom-full mb-2 left-0 w-72 rounded-2xl bg-[#0D0D0D] border border-[#1F1F1F] p-3 z-50 shadow-2xl"
            initial={{ opacity: 0, y: 8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.97 }}
            transition={{ duration: 0.15 }}>
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-xs font-bold text-gray-400 font-body uppercase tracking-wider">GVC GIF Library</span>
              {selected && (
                <button onClick={() => { onSelect(null); setOpen(false); }}
                  className="text-[10px] text-gray-500 hover:text-white font-body transition-colors">
                  Clear
                </button>
              )}
            </div>
            <div className="grid grid-cols-5 gap-1.5">
              {GIF_LIBRARY.map(gif => (
                <button key={gif.id} onClick={() => { onSelect(gif.url); setOpen(false); }}
                  className={`relative rounded-lg overflow-hidden aspect-square border-2 transition-all ${
                    selected === gif.url ? "border-[#FFE048]" : "border-transparent hover:border-[#333]"
                  }`}
                  title={gif.label}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={gif.url} alt={gif.label} className="w-full h-full object-cover" />
                  {selected === gif.url && (
                    <div className="absolute inset-0 bg-[#FFE048]/20 flex items-center justify-center">
                      <Check size={14} className="text-[#FFE048] drop-shadow" />
                    </div>
                  )}
                </button>
              ))}
            </div>
            <p className="text-[10px] text-gray-600 font-body mt-2 text-center">
              GIF URL auto-copies with your message
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Holder Modal ─────────────────────────────────────────────────────────────

function HolderModal({ holder, activeMember, onClose }: {
  holder: Holder;
  activeMember: TeamMember;
  onClose: () => void;
}) {
  const [selectedTemplate, setSelectedTemplate] = useState<TeamTemplate | null>(null);
  const [selectedGif, setSelectedGif] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const cfg = TIER_CONFIG[holder.tier];
  const memberInfo = TEAM.find(m => m.id === activeMember)!;

  function copy() {
    if (!selectedTemplate) return;
    const msg = fillTemplate(selectedTemplate.bodies[activeMember], holder);
    const full = selectedGif ? `${msg}\n${selectedGif}` : msg;
    navigator.clipboard.writeText(full);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  // Reset gif when template changes
  function pickTemplate(t: TeamTemplate) {
    setSelectedTemplate(selectedTemplate?.id === t.id ? null : t);
    setSelectedGif(null);
  }

  return (
    <motion.div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        className="relative w-full sm:max-w-lg max-h-[92vh] overflow-y-auto rounded-t-3xl sm:rounded-2xl border-t sm:border border-[#1F1F1F] bg-[#0D0D0D]"
        initial={{ y: "100%", opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: "100%", opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 35 }}>

        {/* Drag handle (mobile) */}
        <div className="sm:hidden w-10 h-1 rounded-full bg-[#333] mx-auto mt-3 mb-1" />

        {/* Header */}
        <div className="p-5 border-b border-[#1F1F1F] flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full flex items-center justify-center text-lg shrink-0"
              style={{ background: cfg.bg }}>
              {holder.gvcCount >= 20 ? "🐋" : "✨"}
            </div>
            <div>
              <h2 className="font-display text-lg text-white leading-tight">@{holder.twitter}</h2>
              <p className="text-xs text-gray-500 font-body font-mono">{truncate(holder.wallet)}</p>
              <div className="mt-1.5"><TierBadge tier={holder.tier} /></div>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-[#1F1F1F] text-gray-400 transition-colors shrink-0">
            <X size={16} />
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-px bg-[#1F1F1F] border-b border-[#1F1F1F]">
          {[
            { label: "GVCs",       value: holder.gvcCount,           icon: "🖼️" },
            { label: "Vibe Score", value: `${holder.vibeScore}/100`, icon: "⚡" },
            { label: "Active",     value: holder.lastActivity,       icon: "⏱" },
          ].map(s => (
            <div key={s.label} className="bg-[#0D0D0D] p-3 text-center">
              <div className="text-base mb-0.5">{s.icon}</div>
              <div className="text-sm font-display text-[#FFE048]">{s.value}</div>
              <div className="text-[10px] text-gray-500 font-body">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Contact */}
        <div className="p-4 border-b border-[#1F1F1F] grid grid-cols-2 gap-2">
          <div className="flex items-center gap-2 p-2.5 rounded-xl bg-[#121212] border border-[#1F1F1F]">
            <Twitter size={12} className="text-[#1DA1F2] shrink-0" />
            <span className="text-xs text-white font-body truncate">@{holder.twitter}</span>
          </div>
          <div className="flex items-center gap-2 p-2.5 rounded-xl bg-[#121212] border border-[#1F1F1F]">
            <Hash size={12} className="text-[#5865F2] shrink-0" />
            <span className="text-xs text-white font-body truncate">{holder.discord}</span>
          </div>
        </div>

        {/* Sending as */}
        <div className="px-4 pt-3 pb-2 flex items-center gap-2">
          <span className="text-xs text-gray-500 font-body">Sending as</span>
          <span className="text-xs font-bold text-white font-body">{memberInfo.avatar} {memberInfo.name}</span>
        </div>

        {/* Template picker */}
        <div className="px-4 pb-3">
          <div className="grid grid-cols-3 gap-2">
            {TEMPLATES.map(t => (
              <button key={t.id} onClick={() => pickTemplate(t)}
                className={`p-2.5 rounded-xl border text-left transition-all ${
                  selectedTemplate?.id === t.id
                    ? "border-[#FFE048] bg-[rgba(255,224,72,0.08)]"
                    : "border-[#1F1F1F] bg-[#121212] hover:border-[#333]"
                }`}>
                <div className="text-lg mb-0.5">{t.emoji}</div>
                <div className="text-[10px] font-bold text-white font-display leading-tight">{t.name}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Message preview + GIF + send */}
        <AnimatePresence>
          {selectedTemplate && (
            <motion.div className="mx-4 mb-4 rounded-2xl border border-[#1F1F1F] overflow-hidden"
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>

              {/* Message body */}
              <div className="p-4 bg-[#121212]">
                <p className="text-sm text-white font-body leading-relaxed">
                  {fillTemplate(selectedTemplate.bodies[activeMember], holder)}
                </p>
                {/* GIF preview */}
                <AnimatePresence>
                  {selectedGif && (
                    <motion.div className="mt-3 relative inline-block"
                      initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={selectedGif} alt="selected gif" className="max-h-36 rounded-xl" />
                      <button onClick={() => setSelectedGif(null)}
                        className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-[#0D0D0D] border border-[#1F1F1F] flex items-center justify-center text-gray-400 hover:text-white transition-colors">
                        <X size={10} />
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Actions bar */}
              <div className="flex items-center gap-2 p-3 border-t border-[#1F1F1F] bg-[#0D0D0D]">
                <GifPicker selected={selectedGif} onSelect={setSelectedGif} />
                <button onClick={copy}
                  className="ml-auto flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#FFE048] text-black text-sm font-bold hover:bg-[#FFD000] transition-all active:scale-95">
                  {copied ? <Check size={13} /> : <Copy size={13} />}
                  {copied ? "Copied!" : "Copy Message"}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}

// ─── Main CRM Page ────────────────────────────────────────────────────────────

type Tab = "dashboard" | "holders" | "templates";
type TierFilter = "all" | HolderTier | "new";

export default function CRMPage() {
  const [tab, setTab] = useState<Tab>("dashboard");
  const [activeMember, setActiveMember] = useState<TeamMember>("chris");
  const [holders, setHolders] = useState<Holder[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [tierFilter, setTierFilter] = useState<TierFilter>("all");
  const [sortBy, setSortBy] = useState<"vibeScore" | "gvcCount">("vibeScore");
  const [selectedHolder, setSelectedHolder] = useState<Holder | null>(null);
  const [expandedTemplate, setExpandedTemplate] = useState<string | null>(null);
  const [templateGifs, setTemplateGifs] = useState<Record<string, string | null>>({});
  const [copiedTemplate, setCopiedTemplate] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const [tradersRes, activityRes] = await Promise.all([
          fetch("https://api-hazel-pi-72.vercel.app/api/traders"),
          fetch("https://api-hazel-pi-72.vercel.app/api/activity"),
        ]);
        const tradersData = await tradersRes.json();
        const activityData = await activityRes.json();

        const traderMap = new Map<string, { buys: number; sells: number; volume: number; gvcCount: number }>();
        const traders = tradersData?.traders || tradersData?.data || tradersData || [];
        for (const t of (Array.isArray(traders) ? traders : [])) {
          const wallet = (t.wallet || t.address || "").toLowerCase();
          if (!wallet) continue;
          traderMap.set(wallet, {
            buys: t.buys || t.buy_count || 0, sells: t.sells || t.sell_count || 0,
            volume: parseFloat(t.volume || t.total_volume || 0),
            gvcCount: t.current_count || t.holdings || t.balance || Math.max(1, (t.buys || 0) - (t.sells || 0)),
          });
        }
        const accumulators = activityData?.accumulators || activityData?.leaderboard || [];
        for (const a of (Array.isArray(accumulators) ? accumulators : [])) {
          const wallet = (a.wallet || a.address || "").toLowerCase();
          if (!wallet || traderMap.has(wallet)) continue;
          traderMap.set(wallet, { buys: a.buys || 0, sells: 0, volume: 0, gvcCount: a.net || a.buys || 1 });
        }

        const built: Holder[] = [];
        for (const [wallet, t] of traderMap)
          built.push(buildHolder(wallet, t.buys, t.sells, t.volume, Math.max(1, t.gvcCount || (hashCode(wallet) % 50) + 1)));

        for (let i = 0; built.length < 60; i++) {
          const wallet = `0x${hashCode(`pad_${i}`).toString(16).padStart(40, "0")}`;
          if (built.find(b => b.wallet === wallet)) continue;
          const h = hashCode(wallet);
          built.push(buildHolder(wallet, h % 4, h % 3, 0, (h % 80) + 1));
        }

        built.sort((a, b) => b.vibeScore - a.vibeScore);
        setHolders(built);
      } catch {
        const mock: Holder[] = [];
        for (let i = 0; i < 80; i++) {
          const wallet = `0x${hashCode(`fb_${i}`).toString(16).padStart(40, "0")}`;
          const h = hashCode(wallet);
          mock.push(buildHolder(wallet, h % 5, h % 3, 0, (h % 100) + 1));
        }
        mock.sort((a, b) => b.vibeScore - a.vibeScore);
        setHolders(mock);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const filtered = useMemo(() => {
    let list = holders;
    if (tierFilter === "new") list = list.filter(h => h.isNew);
    else if (tierFilter !== "all") list = list.filter(h => h.tier === tierFilter);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(h => h.twitter.includes(q) || h.discord.toLowerCase().includes(q) || h.wallet.toLowerCase().includes(q));
    }
    return [...list].sort((a, b) => sortBy === "gvcCount" ? b.gvcCount - a.gvcCount : b.vibeScore - a.vibeScore);
  }, [holders, tierFilter, search, sortBy]);

  const counts = useMemo(() => ({
    "whale-active":      holders.filter(h => h.tier === "whale-active").length,
    "whale-passive":     holders.filter(h => h.tier === "whale-passive").length,
    "community-active":  holders.filter(h => h.tier === "community-active").length,
    "community-passive": holders.filter(h => h.tier === "community-passive").length,
    new: holders.filter(h => h.isNew).length,
  }), [holders]);

  const avgVibe = useMemo(() =>
    holders.length ? Math.round(holders.reduce((s, h) => s + h.vibeScore, 0) / holders.length) : 0,
    [holders]
  );

  function copyTemplateMessage(t: TeamTemplate, gifUrl: string | null | undefined) {
    const msg = t.bodies[activeMember];
    const full = gifUrl ? `${msg}\n${gifUrl}` : msg;
    navigator.clipboard.writeText(full);
    setCopiedTemplate(t.id);
    setTimeout(() => setCopiedTemplate(null), 2000);
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <div className="fixed inset-0 opacity-[0.03] pointer-events-none"
        style={{ backgroundImage: "url(/grid.svg)", backgroundSize: "60px 60px" }} />

      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-[#1F1F1F] bg-[#050505]/95 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Image src="/gvc-logotype.svg" alt="GVC" width={80} height={28} className="brightness-110" />
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#1F1F1F] border border-[#2a2a2a]">
              <div className="w-1.5 h-1.5 rounded-full bg-[#2EFF2E] animate-pulse" />
              <span className="text-[10px] font-bold text-[#2EFF2E] font-body tracking-wider">CRM</span>
            </div>
          </div>
          <nav className="flex items-center gap-1 bg-[#121212] rounded-xl p-1 border border-[#1F1F1F]">
            {(["dashboard", "holders", "templates"] as Tab[]).map(t => (
              <button key={t} onClick={() => setTab(t)}
                className={`px-3 sm:px-4 py-1.5 rounded-lg text-xs font-bold font-body capitalize transition-all ${
                  tab === t ? "bg-[#FFE048] text-black" : "text-gray-400 hover:text-white"
                }`}>
                {t === "dashboard" ? "📊" : t === "holders" ? "👥" : "✉️"}
                <span className="hidden sm:inline ml-1.5">{t}</span>
              </button>
            ))}
          </nav>
          <TeamDropdown active={activeMember} onChange={setActiveMember} />
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <AnimatePresence mode="wait">

          {/* ── Dashboard ──────────────────────────────────────────────── */}
          {tab === "dashboard" && (
            <motion.div key="dash" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <div className="mb-8">
                <h1 className="font-display text-3xl sm:text-4xl text-shimmer mb-2">Community Pulse</h1>
                <p className="text-gray-400 font-body text-sm">Know your holders. Act on vibes.</p>
              </div>

              {/* Stat cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {[
                  { label: "Total Holders",  value: loading ? "—" : holders.length,                                        icon: <Users size={18} />,  color: "#FFE048" },
                  { label: "Avg Vibe Score", value: loading ? "—" : `${avgVibe}/100`,                                      icon: <Zap size={18} />,    color: "#2EFF2E" },
                  { label: "Whale Active",   value: loading ? "—" : counts["whale-active"],                                icon: <Crown size={18} />,  color: "#FF5F1F" },
                  { label: "Need Re-engage", value: loading ? "—" : counts["whale-passive"] + counts["community-passive"], icon: <Bell size={18} />,   color: "#FF6B9D" },
                ].map((s, i) => (
                  <motion.div key={s.label} className="card-glow rounded-2xl bg-[#121212] border border-[#1F1F1F] p-5"
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-gray-500 font-body text-xs uppercase tracking-wider">{s.label}</span>
                      <span style={{ color: s.color }}>{s.icon}</span>
                    </div>
                    <div className="font-display text-2xl sm:text-3xl" style={{ color: s.color }}>{s.value}</div>
                  </motion.div>
                ))}
              </div>

              {/* Tier breakdown */}
              <div className="grid sm:grid-cols-2 gap-4 mb-8">
                {(Object.entries(TIER_CONFIG) as [HolderTier, typeof TIER_CONFIG[HolderTier]][]).map(([key, cfg]) => (
                  <motion.div key={key}
                    className="rounded-2xl border border-[#1F1F1F] bg-[#121212] p-5 cursor-pointer hover:border-[#333] transition-all"
                    onClick={() => { setTierFilter(key); setTab("holders"); }}
                    whileHover={{ scale: 1.01 }}>
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <div className="font-display text-base text-white mb-1">{cfg.icon} {cfg.label}</div>
                        <span className="text-xs font-bold px-2 py-0.5 rounded-full"
                          style={{ color: cfg.color, background: cfg.bg }}>{cfg.priority}</span>
                      </div>
                      <div className="text-3xl font-display" style={{ color: cfg.color }}>{counts[key]}</div>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-[#1F1F1F] overflow-hidden">
                      <motion.div className="h-full rounded-full" style={{ background: cfg.color }}
                        initial={{ width: 0 }}
                        animate={{ width: `${holders.length ? (counts[key] / holders.length) * 100 : 0}%` }}
                        transition={{ duration: 1, delay: 0.3 }} />
                    </div>
                    <div className="text-right text-xs text-gray-500 mt-1 font-body">
                      {holders.length ? Math.round((counts[key] / holders.length) * 100) : 0}% of community
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Top holders */}
              <div className="rounded-2xl border border-[#1F1F1F] bg-[#121212] p-5">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-display text-base text-white">🏆 Top Vibe Holders</h2>
                  <button onClick={() => setTab("holders")} className="text-xs text-[#FFE048] font-body hover:underline">View all →</button>
                </div>
                <div className="space-y-2">
                  {holders.slice(0, 6).map((h, i) => (
                    <div key={h.wallet} onClick={() => setSelectedHolder(h)}
                      className="flex items-center gap-3 cursor-pointer hover:bg-[#1A1A1A] rounded-xl p-2 transition-colors">
                      <div className="w-5 text-center text-xs font-bold font-body shrink-0"
                        style={{ color: i < 3 ? "#FFE048" : "#555" }}>#{i + 1}</div>
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm shrink-0"
                        style={{ background: TIER_CONFIG[h.tier].bg }}>
                        {h.gvcCount >= 20 ? "🐋" : "✨"}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-bold text-white font-body truncate">@{h.twitter}</div>
                        <div className="text-xs text-gray-500 font-body">{h.gvcCount} GVCs · {h.lastActivity}</div>
                      </div>
                      <div className="w-24 hidden sm:block"><VibeBar score={h.vibeScore} /></div>
                      <TierBadge tier={h.tier} />
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* ── Holders ────────────────────────────────────────────────── */}
          {tab === "holders" && (
            <motion.div key="holders" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <div className="mb-6">
                <h1 className="font-display text-3xl text-shimmer mb-1">All Holders</h1>
                <p className="text-gray-400 font-body text-sm">{filtered.length} of {holders.length} showing</p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 mb-5">
                <div className="relative flex-1">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input type="text" placeholder="Search by Twitter, Discord, or wallet..."
                    value={search} onChange={e => setSearch(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-[#121212] border border-[#1F1F1F] text-sm text-white placeholder-gray-600 font-body focus:outline-none focus:border-[#FFE048]/40 transition-colors" />
                </div>
                <select value={sortBy} onChange={e => setSortBy(e.target.value as typeof sortBy)}
                  className="px-3 py-2.5 rounded-xl bg-[#121212] border border-[#1F1F1F] text-sm text-gray-300 font-body focus:outline-none">
                  <option value="vibeScore">Sort: Vibe Score</option>
                  <option value="gvcCount">Sort: GVC Count</option>
                </select>
              </div>

              <div className="flex flex-wrap gap-2 mb-6">
                {([
                  { key: "all",              label: "All",                  count: holders.length },
                  { key: "whale-active",     label: "🐋🔥 Whale Active",    count: counts["whale-active"] },
                  { key: "whale-passive",    label: "🐋💤 Whale Passive",   count: counts["whale-passive"] },
                  { key: "community-active", label: "⚡ Community Active",  count: counts["community-active"] },
                  { key: "community-passive",label: "😴 Community Passive", count: counts["community-passive"] },
                  { key: "new",              label: "✨ New",               count: counts.new },
                ] as { key: TierFilter; label: string; count: number }[]).map(f => (
                  <button key={f.key} onClick={() => setTierFilter(f.key)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold font-body transition-all ${
                      tierFilter === f.key ? "bg-[#FFE048] text-black" : "bg-[#121212] border border-[#1F1F1F] text-gray-400 hover:border-[#333]"
                    }`}>
                    {f.label}
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${tierFilter === f.key ? "bg-black/20" : "bg-[#1F1F1F]"}`}>
                      {f.count}
                    </span>
                  </button>
                ))}
              </div>

              {loading ? (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[...Array(6)].map((_, i) => <div key={i} className="rounded-2xl bg-[#121212] border border-[#1F1F1F] p-5 animate-pulse h-36" />)}
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filtered.map(h => (
                    <motion.div key={h.wallet}
                      className="rounded-2xl bg-[#121212] border border-[#1F1F1F] p-5 cursor-pointer hover:border-[#333] card-glow transition-all"
                      onClick={() => setSelectedHolder(h)}
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }} whileHover={{ y: -2 }}>
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-9 h-9 rounded-full flex items-center justify-center text-base shrink-0"
                            style={{ background: TIER_CONFIG[h.tier].bg }}>
                            {h.gvcCount >= 20 ? "🐋" : "✨"}
                          </div>
                          <div>
                            <div className="text-sm font-bold text-white font-body">@{h.twitter}</div>
                            <div className="text-[10px] text-gray-500 font-body font-mono">{truncate(h.wallet)}</div>
                          </div>
                        </div>
                        {h.isNew && <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full shrink-0 bg-[rgba(46,255,46,0.12)] text-[#2EFF2E]">NEW</span>}
                      </div>
                      <div className="flex items-center justify-between mb-3 text-xs font-body text-gray-400">
                        <span>🖼️ {h.gvcCount} GVCs</span>
                        <span>⏱ {h.lastActivity}</span>
                      </div>
                      <div className="mb-3"><VibeBar score={h.vibeScore} /></div>
                      <TierBadge tier={h.tier} />
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* ── Templates ──────────────────────────────────────────────── */}
          {tab === "templates" && (
            <motion.div key="templates" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <div className="mb-6">
                <h1 className="font-display text-3xl text-shimmer mb-1">Templates</h1>
                <p className="text-gray-400 font-body text-sm">
                  Viewing as{" "}
                  <span className="text-white font-bold">
                    {TEAM.find(m => m.id === activeMember)?.avatar}{" "}
                    {TEAM.find(m => m.id === activeMember)?.name}
                  </span>
                  {" "}— switch in the header to see your copy.
                </p>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {TEMPLATES.map(t => {
                  const gif = templateGifs[t.id] ?? null;
                  const isExpanded = expandedTemplate === t.id;
                  return (
                    <motion.div key={t.id}
                      className={`rounded-2xl border bg-[#121212] overflow-hidden transition-all ${
                        isExpanded ? "border-[#FFE048]" : "border-[#1F1F1F] hover:border-[#333]"
                      }`}
                      whileHover={{ y: isExpanded ? 0 : -2 }}>
                      {/* Card top */}
                      <button className="w-full p-5 text-left"
                        onClick={() => setExpandedTemplate(isExpanded ? null : t.id)}>
                        <div className="flex items-start justify-between mb-2">
                          <span className="text-2xl">{t.emoji}</span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide"
                            style={{ color: t.color, background: `${t.color}18` }}>{t.category}</span>
                        </div>
                        <div className="font-display text-base text-white mb-2">{t.name}</div>
                        <p className="text-sm text-gray-300 font-body leading-relaxed">
                          "{t.bodies[activeMember]}"
                        </p>
                      </button>

                      {/* GIF preview strip */}
                      <AnimatePresence>
                        {gif && (
                          <motion.div className="px-5 pb-0"
                            initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}>
                            <div className="relative inline-block mb-3">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img src={gif} alt="gif" className="max-h-24 rounded-xl" />
                              <button onClick={() => setTemplateGifs(p => ({ ...p, [t.id]: null as unknown as string }))}
                                className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-[#0D0D0D] border border-[#1F1F1F] flex items-center justify-center text-gray-400 hover:text-white">
                                <X size={10} />
                              </button>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Actions */}
                      <div className="px-4 pb-4 pt-3 border-t border-[#1A1A1A] flex items-center gap-2">
                        <GifPicker
                          selected={gif}
                          onSelect={url => setTemplateGifs(p => ({ ...p, [t.id]: url as string }))}
                        />
                        <button
                          onClick={() => copyTemplateMessage(t, gif)}
                          className="ml-auto flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#1F1F1F] text-gray-300 text-xs font-bold hover:bg-[#2a2a2a] transition-all">
                          {copiedTemplate === t.id ? <Check size={11} className="text-[#2EFF2E]" /> : <Copy size={11} />}
                          {copiedTemplate === t.id ? "Copied!" : "Copy"}
                        </button>
                      </div>

                      {/* All voices panel */}
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div className="border-t border-[#1F1F1F]"
                            initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}>
                            <div className="grid grid-cols-2 gap-px bg-[#1F1F1F]">
                              {TEAM.map(m => (
                                <div key={m.id} className="bg-[#0D0D0D] p-3">
                                  <div className="flex items-center gap-1.5 mb-1">
                                    <span className="text-sm">{m.avatar}</span>
                                    <span className="text-[10px] font-bold text-white font-display">{m.name}</span>
                                  </div>
                                  <p className="text-xs text-gray-400 font-body leading-relaxed">"{t.bodies[m.id]}"</p>
                                </div>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Holder modal */}
      <AnimatePresence>
        {selectedHolder && (
          <HolderModal
            holder={selectedHolder}
            activeMember={activeMember}
            onClose={() => setSelectedHolder(null)}
          />
        )}
      </AnimatePresence>

      {/* Embers */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        {[...Array(5)].map((_, i) => (
          <motion.div key={i} className="ember absolute" style={{ left: `${12 + i * 18}%`, bottom: 0 }}
            animate={{ y: [0, -600], opacity: [0, 0.5, 0] }}
            transition={{ duration: 8 + i * 2, repeat: Infinity, delay: i * 1.8, ease: "easeOut" }} />
        ))}
      </div>
    </div>
  );
}
