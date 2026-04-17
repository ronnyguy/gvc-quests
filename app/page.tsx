"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import toast from "react-hot-toast";
import { CheckCircle, Clock, ExternalLink, Lock, Trophy } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

type QuestStatus = "open" | "pending" | "verified";

interface UrlField {
  key: string;
  label: string;
  placeholder: string;
}

interface WeekQuest {
  id: string;
  title: string;
  description: string;
  hint?: string;
  urlFields: UrlField[];
}

interface QuestState {
  status: QuestStatus;
  urls: Record<string, string>;
  submittedAt?: number;
}

interface SetupState {
  x: boolean;
  discord: boolean;
}

// ─── Quest Definitions ────────────────────────────────────────────────────────

const WEEK1_QUESTS: WeekQuest[] = [
  {
    id: "rt-space",
    title: "RT the GV&C Space",
    description:
      "RT the weekly Thursday Space post from @GoodVibesClub. Submit the URL of your retweet to verify.",
    hint: "Find the Space post on @GoodVibesClub and hit Retweet.",
    urlFields: [
      {
        key: "tweet",
        label: "Your retweet URL",
        placeholder: "https://x.com/yourhandle/status/...",
      },
    ],
  },
  {
    id: "weekly-activation",
    title: "Weekly Activation",
    description:
      "Participate in the team's weekly prompt. Details revealed each week. Submit the URL of your post.",
    hint: "Check @GoodVibesClub for this week's prompt.",
    urlFields: [
      {
        key: "post",
        label: "Your post URL",
        placeholder: "https://x.com/yourhandle/status/...",
      },
    ],
  },
  {
    id: "rt-comment-2",
    title: "RT + Comment on 2 GVC Posts",
    description:
      "RT and leave a comment on 2 separate posts from @GoodVibesClub. Submit both tweet URLs.",
    urlFields: [
      {
        key: "tweet1",
        label: "First tweet URL",
        placeholder: "https://x.com/yourhandle/status/...",
      },
      {
        key: "tweet2",
        label: "Second tweet URL",
        placeholder: "https://x.com/yourhandle/status/...",
      },
    ],
  },
  {
    id: "full-body-pose",
    title: "Full Body Pose",
    description:
      "Get your GVC Citizen into the weekly scene. Post it on X tagging @GoodVibesClub and submit your post URL.",
    hint: "Tag @GoodVibesClub in your post so it gets seen.",
    urlFields: [
      {
        key: "post",
        label: "Your post URL",
        placeholder: "https://x.com/yourhandle/status/...",
      },
    ],
  },
];

// ─── Mock Leaderboard ─────────────────────────────────────────────────────────

const MOCK_LEADERBOARD = [
  { rank: 1, name: "vibemaxx.eth", time: "2h 14m", quests: 4 },
  { rank: 2, name: "0x3f…9d2a", time: "3h 55m", quests: 4 },
  { rank: 3, name: "cryptoshaka", time: "5h 02m", quests: 4 },
  { rank: 4, name: "gvchead.eth", time: "6h 30m", quests: 4 },
  { rank: 5, name: "0xd8…11fe", time: "9h 47m", quests: 4 },
];

// ─── Storage Keys ─────────────────────────────────────────────────────────────

const SETUP_KEY = "gvc-setup";
const QUEST_KEY = "gvc-week1-quests";
const WALLET_KEY = "gvc-wallet";
const START_KEY = "gvc-week1-start";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatElapsed(ms: number): string {
  const h = Math.floor(ms / 3600000);
  const m = Math.floor((ms % 3600000) / 60000);
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: QuestStatus }) {
  if (status === "verified")
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-body font-semibold bg-gvc-green/10 text-gvc-green border border-gvc-green/20">
        <CheckCircle className="w-3 h-3" /> Verified
      </span>
    );
  if (status === "pending")
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-body font-semibold bg-gvc-gold/10 text-gvc-gold border border-gvc-gold/20">
        <Clock className="w-3 h-3" /> Pending Review
      </span>
    );
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-body font-semibold bg-white/5 text-white/40 border border-white/[0.08]">
      Open
    </span>
  );
}

interface QuestCardProps {
  quest: WeekQuest;
  state: QuestState;
  locked: boolean;
  index: number;
  onSubmit: (id: string, urls: Record<string, string>) => void;
}

function QuestCard({ quest, state, locked, index, onSubmit }: QuestCardProps) {
  const [urls, setUrls] = useState<Record<string, string>>(state.urls ?? {});
  const [expanded, setExpanded] = useState(false);

  const allFilled = quest.urlFields.every((f) => urls[f.key]?.trim());
  const isSubmitted = state.status === "pending" || state.status === "verified";

  function handleSubmit() {
    if (!allFilled) {
      toast.error("Fill in all URL fields before submitting.");
      return;
    }
    for (const f of quest.urlFields) {
      const v = urls[f.key]?.trim();
      if (!v.startsWith("https://x.com/") && !v.startsWith("https://twitter.com/")) {
        toast.error("Enter a valid X/Twitter URL.");
        return;
      }
    }
    onSubmit(quest.id, urls);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07 }}
      className={`rounded-2xl border transition-all duration-300
        ${locked ? "opacity-50 pointer-events-none" : ""}
        ${
          state.status === "verified"
            ? "bg-gvc-dark border-gvc-gold/25 card-glow"
            : state.status === "pending"
            ? "bg-gvc-dark border-gvc-gold/15"
            : "bg-gvc-dark border-white/[0.08] hover:border-white/15"
        }`}
    >
      {/* Card header */}
      <button
        className="w-full text-left p-5 flex items-start justify-between gap-4"
        onClick={() => !isSubmitted && setExpanded((v) => !v)}
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span className="text-white/30 font-body text-xs font-semibold uppercase tracking-wider">
              Quest {index + 1}
            </span>
            <StatusBadge status={state.status} />
          </div>
          <h3
            className={`font-display font-bold text-lg leading-snug
              ${state.status === "verified" ? "text-gvc-gold" : "text-white"}`}
          >
            {quest.title}
          </h3>
          <p className="text-white/50 font-body text-sm leading-relaxed mt-1.5">
            {quest.description}
          </p>
          {quest.hint && !isSubmitted && (
            <p className="text-white/25 font-body text-xs mt-2 italic">
              Tip: {quest.hint}
            </p>
          )}
        </div>
        {locked && <Lock className="w-4 h-4 text-white/20 shrink-0 mt-1" />}
        {!locked && !isSubmitted && (
          <span className="text-white/20 text-sm shrink-0 mt-1">
            {expanded ? "▲" : "▼"}
          </span>
        )}
        {state.status === "verified" && (
          <CheckCircle className="w-5 h-5 text-gvc-green shrink-0 mt-1" />
        )}
      </button>

      {/* URL submission form */}
      <AnimatePresence>
        {(expanded || isSubmitted) && !locked && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 space-y-3">
              <div className="w-full h-px bg-white/[0.06]" />
              {quest.urlFields.map((field) => (
                <div key={field.key}>
                  <label className="text-white/40 font-body text-xs mb-1.5 block">
                    {field.label}
                  </label>
                  {isSubmitted ? (
                    <a
                      href={state.urls[field.key]}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 font-mono text-sm text-gvc-gold/70 hover:text-gvc-gold transition-colors truncate"
                    >
                      <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">{state.urls[field.key]}</span>
                    </a>
                  ) : (
                    <input
                      type="url"
                      value={urls[field.key] ?? ""}
                      onChange={(e) =>
                        setUrls((p) => ({ ...p, [field.key]: e.target.value }))
                      }
                      placeholder={field.placeholder}
                      className="w-full bg-black/40 border border-white/[0.10] rounded-xl px-4 py-2.5 font-mono text-sm text-white placeholder-white/20 focus:outline-none focus:border-gvc-gold/40 transition-colors"
                    />
                  )}
                </div>
              ))}

              {!isSubmitted && (
                <button
                  onClick={handleSubmit}
                  disabled={!allFilled}
                  className="w-full py-3 rounded-xl bg-gvc-gold text-gvc-black font-display font-bold text-sm mt-1 hover:shadow-[0_0_20px_rgba(255,224,72,0.3)] transition-all disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:shadow-none"
                >
                  Submit for Review
                </button>
              )}

              {state.status === "pending" && (
                <p className="text-center text-white/30 font-body text-xs">
                  Submitted — our team will verify within 24h
                </p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function Home() {
  const [setup, setSetup] = useState<SetupState>({ x: false, discord: false });
  const [twitterHandle, setTwitterHandle] = useState<string>("");
  const [questStates, setQuestStates] = useState<Record<string, QuestState>>({});
  const [walletAddress, setWalletAddress] = useState("");
  const [walletInput, setWalletInput] = useState("");
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [stats, setStats] = useState<Record<string, number> | null>(null);
  const [weekStartTime, setWeekStartTime] = useState<number | null>(null);

  useEffect(() => {
    const s = localStorage.getItem(SETUP_KEY);
    if (s) setSetup(JSON.parse(s));
    const q = localStorage.getItem(QUEST_KEY);
    if (q) setQuestStates(JSON.parse(q));
    const w = localStorage.getItem(WALLET_KEY);
    if (w) { setWalletAddress(w); setWalletInput(w); }
    const t = localStorage.getItem(START_KEY);
    if (t) setWeekStartTime(Number(t));
  }, []);

  useEffect(() => {
    fetch("https://api-hazel-pi-72.vercel.app/api/stats")
      .then((r) => r.json())
      .then(setStats)
      .catch(() => {});
  }, []);

  const setupComplete = setup.x && setup.discord;

  function completeSetup(key: "x" | "discord") {
    const next = { ...setup, [key]: true };
    setSetup(next);
    localStorage.setItem(SETUP_KEY, JSON.stringify(next));
    if (next.x && next.discord && !weekStartTime) {
      const now = Date.now();
      setWeekStartTime(now);
      localStorage.setItem(START_KEY, String(now));
      toast.success("Setup complete! Week 1 quests are now unlocked.", { duration: 4000 });
    }
  }

  function submitQuest(id: string, urls: Record<string, string>) {
    const next: Record<string, QuestState> = {
      ...questStates,
      [id]: { status: "pending", urls, submittedAt: Date.now() },
    };
    setQuestStates(next);
    localStorage.setItem(QUEST_KEY, JSON.stringify(next));
    toast.success("Submitted for review!", {
      style: {
        background: "#1a1400",
        border: "1px solid rgba(255,224,72,0.3)",
        color: "#FFE048",
      },
    });
  }

  function handleConnectWallet() {
    const addr = walletInput.trim();
    if (!addr.match(/^0x[a-fA-F0-9]{40}$/)) {
      toast.error("Enter a valid 0x wallet address");
      return;
    }
    setWalletAddress(addr);
    localStorage.setItem(WALLET_KEY, addr);
    setShowWalletModal(false);
    toast.success("Wallet connected!");
  }

  const pendingCount = Object.values(questStates).filter((s) => s.status === "pending").length;
  const verifiedCount = Object.values(questStates).filter((s) => s.status === "verified").length;
  const allSubmitted =
    setupComplete &&
    WEEK1_QUESTS.every(
      (q) =>
        questStates[q.id]?.status === "pending" ||
        questStates[q.id]?.status === "verified"
    );

  const elapsed =
    weekStartTime && allSubmitted
      ? formatElapsed(
          Math.max(...Object.values(questStates).map((s) => s.submittedAt ?? 0)) - weekStartTime
        )
      : null;

  return (
    <main className="min-h-screen bg-gvc-black relative overflow-x-hidden">
      {/* Background grid */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.15]">
        <Image src="/grid.svg" alt="" fill className="object-cover" />
      </div>

      {/* Embers */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {[...Array(10)].map((_, i) => (
          <div
            key={i}
            className="ember"
            style={{
              left: `${8 + i * 9}%`,
              top: `${10 + (i % 5) * 18}%`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: `${5 + i * 0.35}s`,
            }}
          />
        ))}
      </div>

      {/* ── Header ─────────────────────────────────────────────────────── */}
      <header className="relative z-20 border-b border-white/[0.06] bg-gvc-black/80 backdrop-blur-md sticky top-0">
        <div className="max-w-3xl mx-auto px-5 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Image
              src="/shaka.png"
              alt="GVC"
              width={28}
              height={28}
              className="drop-shadow-[0_0_10px_rgba(255,224,72,0.5)]"
            />
            <Image src="/gvc-logotype.svg" alt="Good Vibes Club" width={108} height={22} />
          </div>

          <div className="flex items-center gap-3 flex-wrap justify-end">
            {/* Live floor */}
            {stats?.floorPrice && (
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.07]">
                <span className="text-white/30 font-body text-xs">Floor</span>
                <span className="text-gvc-gold font-display font-bold text-sm">
                  {stats.floorPrice.toFixed(3)} ETH
                </span>
              </div>
            )}

            {/* Wallet */}
            <button
              onClick={() => setShowWalletModal(true)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-body transition-all
                ${
                  walletAddress
                    ? "bg-gvc-gold/10 border border-gvc-gold/25 text-gvc-gold"
                    : "bg-white/[0.04] border border-white/[0.08] text-white/40 hover:text-white/70"
                }`}
            >
              {walletAddress ? (
                <>
                  <div className="w-1.5 h-1.5 rounded-full bg-gvc-green" />
                  {walletAddress.slice(0, 6)}…{walletAddress.slice(-4)}
                </>
              ) : (
                "Connect Wallet"
              )}
            </button>
          </div>
        </div>

        {/* Stats ribbon */}
        {stats && (
          <div className="border-t border-white/[0.04] bg-gvc-dark/40">
            <div className="max-w-3xl mx-auto px-5 py-2 flex items-center gap-5 overflow-x-auto">
              {[
                { label: "Floor", value: `${stats.floorPrice?.toFixed(3)} ETH`, color: "text-gvc-gold" },
                { label: "Owners", value: stats.numOwners?.toLocaleString(), color: "text-white" },
                { label: "24h Vol", value: `${stats.volume24h?.toFixed(2)} ETH`, color: "text-white" },
                stats.vibestrPrice && { label: "VIBESTR", value: `$${stats.vibestrPrice?.toFixed(6)}`, color: "text-[#FF6B9D]" },
              ]
                .filter(Boolean)
                .map((item: any, i, arr) => (
                  <div key={item.label} className="flex items-center gap-4 shrink-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-white/25 font-body text-xs">{item.label}</span>
                      <span className={`${item.color} font-display font-bold text-xs`}>{item.value}</span>
                    </div>
                    {i < arr.length - 1 && <div className="w-px h-3 bg-white/10" />}
                  </div>
                ))}
              <div className="ml-auto flex items-center gap-1.5 shrink-0">
                <div className="w-1.5 h-1.5 rounded-full bg-gvc-green animate-pulse" />
                <span className="text-white/20 font-body text-xs">Live</span>
              </div>
            </div>
          </div>
        )}
      </header>

      <div className="relative z-10 max-w-3xl mx-auto px-5 py-12 space-y-14">

        {/* ── Hero ─────────────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gvc-gold/10 border border-gvc-gold/20 mb-6">
            <div className="w-1.5 h-1.5 rounded-full bg-gvc-gold animate-pulse" />
            <span className="text-gvc-gold font-body text-sm font-semibold">Season 1 — Week 1</span>
          </div>
          <h1 className="text-5xl sm:text-7xl font-display font-black text-shimmer leading-none mb-4">
            WEEKLY QUESTS
          </h1>
          <p className="text-white/50 font-body text-base max-w-md mx-auto leading-relaxed">
            Complete all 4 quests each week. Every 2-week window = 1 raffle
            entry. Three prizes drawn live.
          </p>
        </motion.div>

        {/* ── Quest 0: Setup ───────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center gap-3 mb-4">
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-display font-black shrink-0
                ${setupComplete ? "bg-gvc-green text-gvc-black" : "bg-gvc-gold text-gvc-black"}`}
            >
              {setupComplete ? "✓" : "0"}
            </div>
            <h2 className="font-display font-black text-xl text-white">
              One-time Setup
            </h2>
            {setupComplete && (
              <span className="text-gvc-green font-body text-sm">Complete</span>
            )}
          </div>

          <div
            className={`rounded-2xl border p-5 space-y-3
              ${setupComplete
                ? "bg-gvc-dark border-gvc-green/20"
                : "bg-gvc-dark border-gvc-gold/30 card-glow"
              }`}
          >
            {!setupComplete && (
              <p className="text-white/50 font-body text-sm pb-1">
                Complete both steps to unlock Week 1 quests.
              </p>
            )}

            {/* Connect X */}
            <div
              className={`flex items-center justify-between px-4 py-3.5 rounded-xl border transition-all
                ${setup.x
                  ? "bg-gvc-green/5 border-gvc-green/15"
                  : "bg-black/30 border-white/[0.08] hover:border-white/15"
                }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-white font-body text-base leading-none">𝕏</span>
                <div>
                  <div className="text-white font-body text-sm font-semibold">
                    Connect X Account
                  </div>
                  <div className="text-white/30 font-body text-xs">
                    Required to verify your posts
                  </div>
                </div>
              </div>
              {setup.x ? (
                <span className="flex items-center gap-1.5 text-gvc-green text-xs font-semibold font-body">
                  <CheckCircle className="w-3.5 h-3.5" /> Connected
                </span>
              ) : (
                <button
                  onClick={() => completeSetup("x"); setTwitterHandle(walletInput.replace("@","").trim())}
                  className="px-4 py-2 rounded-xl bg-gvc-gold text-gvc-black font-display font-bold text-xs hover:shadow-[0_0_16px_rgba(255,224,72,0.3)] transition-all"
                >
                  Connect
                </button>
              )}
            </div>

            {/* Connect Discord */}
            <div
              className={`flex items-center justify-between px-4 py-3.5 rounded-xl border transition-all
                ${setup.discord
                  ? "bg-gvc-green/5 border-gvc-green/15"
                  : "bg-black/30 border-white/[0.08] hover:border-white/15"
                }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-[#5865F2] font-bold text-base">D</span>
                <div>
                  <div className="text-white font-body text-sm font-semibold">
                    Connect Discord Account
                  </div>
                  <div className="text-white/30 font-body text-xs">
                    Required for community verification
                  </div>
                </div>
              </div>
              {setup.discord ? (
                <span className="flex items-center gap-1.5 text-gvc-green text-xs font-semibold font-body">
                  <CheckCircle className="w-3.5 h-3.5" /> Connected
                </span>
              ) : (
                <button
                  onClick={() => completeSetup("discord")}
                  className="px-4 py-2 rounded-xl bg-[#5865F2] text-white font-display font-bold text-xs hover:shadow-[0_0_16px_rgba(88,101,242,0.4)] transition-all"
                >
                  Connect
                </button>
              )}
            </div>
          </div>
        </motion.div>

        {/* ── Week 1 Quests ────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <div className="flex items-center gap-3 mb-4">
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-display font-black shrink-0
                ${!setupComplete ? "bg-white/10 text-white/30" : verifiedCount === 4 ? "bg-gvc-green text-gvc-black" : "bg-gvc-gold text-gvc-black"}`}
            >
              {verifiedCount === 4 ? "✓" : "1"}
            </div>
            <h2 className={`font-display font-black text-xl ${!setupComplete ? "text-white/30" : "text-white"}`}>
              Week 1 Quests
            </h2>
            {!setupComplete && (
              <div className="flex items-center gap-1.5 text-white/20">
                <Lock className="w-3.5 h-3.5" />
                <span className="font-body text-sm">Locked — complete setup first</span>
              </div>
            )}
            {setupComplete && (
              <span className="text-white/30 font-body text-sm ml-auto">
                {verifiedCount + pendingCount}/4 submitted
              </span>
            )}
          </div>

          {allSubmitted && elapsed && (
            <div className="mb-4 px-4 py-3 rounded-xl bg-gvc-gold/10 border border-gvc-gold/20 flex items-center gap-3">
              <Trophy className="w-4 h-4 text-gvc-gold shrink-0" />
              <span className="text-gvc-gold font-body text-sm">
                All 4 quests submitted in <strong>{elapsed}</strong> — pending final verification.
              </span>
            </div>
          )}

          <div className="space-y-3">
            {WEEK1_QUESTS.map((quest, i) => (
              <QuestCard
                key={quest.id}
                quest={quest}
                state={questStates[quest.id] ?? { status: "open", urls: {} }}
                locked={!setupComplete}
                index={i}
                onSubmit={submitQuest}
              />
            ))}
          </div>
        </motion.div>

        {/* ── Speed Leaderboard ─────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center gap-3 mb-4">
            <Trophy className="w-5 h-5 text-gvc-gold" />
            <h2 className="font-display font-black text-xl text-white">
              Speed Leaderboard
            </h2>
            <span className="text-white/25 font-body text-sm">Week 1</span>
          </div>
          <p className="text-white/40 font-body text-sm mb-5">
            Ranked by time to complete all 4 quests. Bragging rights only.
          </p>

          <div className="rounded-2xl bg-gvc-dark border border-white/[0.08] overflow-hidden">
            {/* Table header */}
            <div className="grid grid-cols-[2rem_1fr_6rem_4rem] gap-4 px-5 py-3 border-b border-white/[0.06]">
              <span className="text-white/25 font-body text-xs">#</span>
              <span className="text-white/25 font-body text-xs">Wallet / Handle</span>
              <span className="text-white/25 font-body text-xs text-right">Time</span>
              <span className="text-white/25 font-body text-xs text-right">Quests</span>
            </div>

            {MOCK_LEADERBOARD.map((entry, i) => (
              <div
                key={entry.rank}
                className={`grid grid-cols-[2rem_1fr_6rem_4rem] gap-4 px-5 py-3.5 items-center border-b border-white/[0.04] last:border-0
                  ${i === 0 ? "bg-gvc-gold/[0.04]" : ""}`}
              >
                <span
                  className={`font-display font-black text-sm
                    ${i === 0 ? "text-gvc-gold" : i === 1 ? "text-white/60" : i === 2 ? "text-[#CD7F32]" : "text-white/30"}`}
                >
                  {entry.rank}
                </span>
                <span className="font-body text-sm text-white truncate">{entry.name}</span>
                <span className="font-body text-sm text-white/60 text-right tabular-nums">{entry.time}</span>
                <span className="font-body text-sm text-white/40 text-right">{entry.quests}/4</span>
              </div>
            ))}

            {/* User row (if submitted) */}
            {allSubmitted && elapsed && (
              <div className="grid grid-cols-[2rem_1fr_6rem_4rem] gap-4 px-5 py-3.5 items-center bg-gvc-gold/[0.06] border-t border-gvc-gold/10">
                <span className="font-display font-black text-sm text-gvc-gold">—</span>
                <span className="font-body text-sm text-gvc-gold">
                  You {walletAddress ? `(${walletAddress.slice(0, 6)}…)` : ""}
                </span>
                <span className="font-body text-sm text-gvc-gold/70 text-right tabular-nums">{elapsed}</span>
                <span className="font-body text-sm text-gvc-gold/50 text-right">4/4</span>
              </div>
            )}

            {!allSubmitted && (
              <div className="px-5 py-4 text-center text-white/20 font-body text-sm border-t border-white/[0.04]">
                Complete all 4 quests to appear on the leaderboard
              </div>
            )}
          </div>
        </motion.div>

        {/* ── Raffle Section ────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="rounded-2xl bg-gvc-dark border border-gvc-gold/20 card-glow p-8"
        >
          <div className="text-4xl mb-4 text-center">🎟️</div>
          <h2 className="text-2xl font-display font-black text-shimmer text-center mb-3">
            Raffle Eligibility
          </h2>
          <p className="text-white/50 font-body text-sm text-center max-w-md mx-auto mb-8 leading-relaxed">
            Every 2-week window is one raffle. Complete all quest weeks in the
            window to earn 1 entry. Winners are drawn live.
          </p>

          {/* Prizes */}
          <div className="grid grid-cols-3 gap-3 mb-8">
            {[
              { icon: "🏛️", label: "1 GVC NFT", sub: "Citizen of Vibetown" },
              { icon: "💎", label: "1 VIBESTR", sub: "Token prize" },
              { icon: "👕", label: "1 Merch", sub: "Official GVC drop" },
            ].map((prize) => (
              <div
                key={prize.label}
                className="rounded-xl bg-black/30 border border-white/[0.06] p-4 text-center"
              >
                <div className="text-3xl mb-2">{prize.icon}</div>
                <div className="text-white font-display font-bold text-sm">{prize.label}</div>
                <div className="text-white/30 font-body text-xs mt-0.5">{prize.sub}</div>
              </div>
            ))}
          </div>

          {/* Rules */}
          <div className="space-y-2.5">
            {[
              "Complete all 4 quests in a week = eligible for that week",
              "Complete both weeks in a 2-week window = 1 raffle entry",
              "Draw happens live at the end of each 2-week window",
              "3 prizes per draw: 1 GVC, 1 VIBESTR, 1 Merch",
            ].map((rule, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-gvc-gold/60 mt-1.5 shrink-0" />
                <p className="text-white/40 font-body text-sm">{rule}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Footer */}
        <div className="text-center pb-4">
          <div className="flex items-center justify-center gap-2 mb-1">
            <Image src="/shaka.png" alt="" width={18} height={18} className="opacity-25" />
            <span className="text-white/20 font-body text-sm">Good Vibes Club — Season 1</span>
          </div>
          <p className="text-white/10 font-body text-xs">
            Quests reset weekly · Draws happen live every 2 weeks
          </p>
        </div>
      </div>

      {/* ── Wallet Modal ──────────────────────────────────────────────────── */}
      <AnimatePresence>
        {showWalletModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-6"
            onClick={(e) => e.target === e.currentTarget && setShowWalletModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.93, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.93, y: 12 }}
              className="w-full max-w-md rounded-2xl bg-gvc-dark border border-gvc-gold/20 card-glow p-8"
            >
              <h3 className="text-xl font-display font-black text-white mb-2">
                Connect Wallet
              </h3>
              <p className="text-white/40 font-body text-sm mb-6">
                Enter your Ethereum address for leaderboard identity.
              </p>

              <input
                type="text"
                value={walletInput}
                onChange={(e) => setWalletInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleConnectWallet()}
                placeholder="0x..."
                className="w-full bg-black/40 border border-white/[0.10] rounded-xl px-4 py-3 font-mono text-sm text-white placeholder-white/20 focus:outline-none focus:border-gvc-gold/40 transition-colors mb-4"
              />

              {walletAddress && (
                <button
                  onClick={() => {
                    setWalletAddress("");
                    setWalletInput("");
                    localStorage.removeItem(WALLET_KEY);
                    setShowWalletModal(false);
                    toast("Wallet disconnected");
                  }}
                  className="w-full py-2 mb-2 text-white/30 font-body text-xs hover:text-white/50 transition-colors"
                >
                  Disconnect current wallet
                </button>
              )}

              <div className="flex gap-3">
                <button
                  onClick={() => setShowWalletModal(false)}
                  className="flex-1 py-3 rounded-xl border border-white/[0.08] text-white/40 font-body text-sm hover:text-white/70 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConnectWallet}
                  className="flex-1 py-3 rounded-xl bg-gvc-gold text-gvc-black font-display font-bold text-sm hover:shadow-[0_0_20px_rgba(255,224,72,0.3)] transition-all"
                >
                  Connect
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
