"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, Loader, Sparkles } from "lucide-react";

const CATEGORIES = [
  "AI & ML", "Technology", "Programming", "Robotics", "Research",
  "Sports", "Cultural", "Entrepreneurship", "Academic",
];

const STEPS = ["Basic Info", "Branding", "Settings", "Review"];

const defaultForm = {
  name: "",
  tagline: "",
  description: "",
  category: "Technology",
  logo: null,
  banner: null,
  themeColor: "#6366F1",
  visibility: "Public",
  postPermission: "All Members",
  uploadPermission: "All Members",
  declarationPermission: "Moderators",
  aiModeration: true,
  aiThreshold: 0.55,
};

export default function CommunityWizard({ open, onClose, onCreate }) {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState(defaultForm);
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  const update = (key, val) => setForm((p) => ({ ...p, [key]: val }));

  const canNext = () => {
    if (step === 0) return form.name.length >= 3 && form.description.length >= 20;
    return true;
  };

  const handlePublish = async () => {
    setLoading(true);
    try {
      const tags = [form.category, ...form.tagline.split(" ").filter(Boolean)].slice(0, 5);
      await onCreate({
        name: form.name,
        description: `${form.tagline}\n\n${form.description}`,
        tags: tags.length >= 3 ? tags : [...tags, "campus", "community"].slice(0, 3),
      });
      setForm(defaultForm);
      setStep(0);
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="relative z-10 w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl"
        style={{ background: "var(--cn-card)", border: "1px solid var(--cn-border)", boxShadow: "var(--cn-shadow-lg)" }}
      >
        <div className="sticky top-0 flex items-center justify-between p-5 border-b" style={{ borderColor: "var(--cn-border)", background: "var(--cn-card)" }}>
          <div>
            <h2 className="text-lg font-bold" style={{ color: "var(--cn-text)" }}>Create Community</h2>
            <p className="text-xs mt-0.5" style={{ color: "var(--cn-text-4)" }}>Step {step + 1} of {STEPS.length} — {STEPS[step]}</p>
          </div>
          <button onClick={onClose} className="cursor-pointer p-1 rounded-lg" style={{ color: "var(--cn-text-4)" }}>
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress */}
        <div className="flex gap-1 px-5 pt-4">
          {STEPS.map((_, i) => (
            <div
              key={i}
              className="h-1 flex-1 rounded-full transition-all"
              style={{ background: i <= step ? "var(--cn-primary)" : "var(--cn-border)" }}
            />
          ))}
        </div>

        <div className="p-5">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
            >
              {step === 0 && (
                <div className="space-y-4">
                  <div>
                    <label className="cn-label">Community Name *</label>
                    <input className="cn-input" value={form.name} onChange={(e) => update("name", e.target.value)} placeholder="AI Research Club" />
                  </div>
                  <div>
                    <label className="cn-label">Tagline</label>
                    <input className="cn-input" value={form.tagline} onChange={(e) => update("tagline", e.target.value)} placeholder="Explore the frontiers of AI together" />
                  </div>
                  <div>
                    <label className="cn-label">Description * (min 20 chars)</label>
                    <textarea className="cn-input resize-none" rows={4} value={form.description} onChange={(e) => update("description", e.target.value)} placeholder="Describe your community's purpose..." />
                  </div>
                  <div>
                    <label className="cn-label">Category</label>
                    <select className="cn-input" value={form.category} onChange={(e) => update("category", e.target.value)}>
                      {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                </div>
              )}

              {step === 1 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-4">
                    <div>
                      <label className="cn-label">Community Logo</label>
                      <input type="file" accept="image/*" className="cn-input text-xs" onChange={(e) => update("logo", e.target.files?.[0] || null)} />
                    </div>
                    <div>
                      <label className="cn-label">Banner / Cover Image</label>
                      <input type="file" accept="image/*" className="cn-input text-xs" onChange={(e) => update("banner", e.target.files?.[0] || null)} />
                    </div>
                    <div>
                      <label className="cn-label">Theme Color</label>
                      <input type="color" value={form.themeColor} onChange={(e) => update("themeColor", e.target.value)} className="h-10 w-full rounded-lg cursor-pointer" />
                    </div>
                  </div>
                  <div
                    className="rounded-2xl overflow-hidden"
                    style={{ border: "1px solid var(--cn-border)" }}
                  >
                    <div className="h-24" style={{ background: `linear-gradient(135deg, ${form.themeColor}, #818CF8)` }} />
                    <div className="p-4 -mt-8">
                      <div
                        className="w-14 h-14 rounded-xl flex items-center justify-center text-xl font-bold text-white mb-3"
                        style={{ background: form.themeColor, border: "3px solid var(--cn-card)" }}
                      >
                        {form.name?.[0]?.toUpperCase() || "C"}
                      </div>
                      <p className="font-bold text-sm" style={{ color: "var(--cn-text)" }}>{form.name || "Community Name"}</p>
                      <p className="text-xs mt-1" style={{ color: "var(--cn-text-3)" }}>{form.tagline || "Your tagline here"}</p>
                    </div>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-4">
                  <div>
                    <label className="cn-label">Visibility</label>
                    <select className="cn-input" value={form.visibility} onChange={(e) => update("visibility", e.target.value)}>
                      {["Public", "Private", "Invite Only"].map((v) => <option key={v}>{v}</option>)}
                    </select>
                  </div>
                  {[
                    { key: "postPermission", label: "Who can post" },
                    { key: "uploadPermission", label: "Who can upload resources" },
                    { key: "declarationPermission", label: "Who can create declarations" },
                  ].map(({ key, label }) => (
                    <div key={key}>
                      <label className="cn-label">{label}</label>
                      <select className="cn-input" value={form[key]} onChange={(e) => update(key, e.target.value)}>
                        {["All Members", "Moderators", "Admins"].map((v) => <option key={v}>{v}</option>)}
                      </select>
                    </div>
                  ))}
                  <div className="flex items-center justify-between p-4 rounded-xl" style={{ background: "var(--cn-surface)", border: "1px solid var(--cn-border)" }}>
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4" style={{ color: "var(--cn-primary)" }} />
                      <span className="text-sm font-medium" style={{ color: "var(--cn-text)" }}>Enable AI Moderation</span>
                    </div>
                    <input type="checkbox" checked={form.aiModeration} onChange={(e) => update("aiModeration", e.target.checked)} className="w-4 h-4" style={{ accentColor: "var(--cn-primary)" }} />
                  </div>
                  {form.aiModeration && (
                    <div>
                      <label className="cn-label">AI Threshold: {form.aiThreshold.toFixed(2)}</label>
                      <input type="range" min="0.3" max="0.9" step="0.05" value={form.aiThreshold} onChange={(e) => update("aiThreshold", parseFloat(e.target.value))} className="w-full" />
                    </div>
                  )}
                </div>
              )}

              {step === 3 && (
                <div className="space-y-4">
                  <div className="rounded-2xl p-5" style={{ background: "var(--cn-surface)", border: "1px solid var(--cn-border)" }}>
                    <h3 className="font-bold text-lg" style={{ color: "var(--cn-text)" }}>{form.name}</h3>
                    <p className="text-sm mt-1" style={{ color: "var(--cn-text-3)" }}>{form.tagline}</p>
                    <p className="text-xs mt-3 leading-relaxed" style={{ color: "var(--cn-text-2)" }}>{form.description}</p>
                    <div className="flex flex-wrap gap-2 mt-4">
                      <span className="px-2 py-1 rounded-full text-[10px] font-semibold" style={{ background: "var(--cn-primary-l)", color: "var(--cn-primary)" }}>{form.category}</span>
                      <span className="px-2 py-1 rounded-full text-[10px] font-semibold" style={{ background: "var(--cn-surface-2)", color: "var(--cn-text-3)" }}>{form.visibility}</span>
                      {form.aiModeration && (
                        <span className="px-2 py-1 rounded-full text-[10px] font-semibold" style={{ background: "rgba(16,185,129,0.1)", color: "var(--cn-success)" }}>
                          AI Mod · {form.aiThreshold.toFixed(2)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="flex justify-between p-5 border-t" style={{ borderColor: "var(--cn-border)" }}>
          <button
            onClick={() => (step > 0 ? setStep(step - 1) : onClose())}
            className="flex items-center gap-1 px-4 py-2.5 rounded-xl text-sm font-semibold cursor-pointer"
            style={{ background: "var(--cn-surface)", border: "1px solid var(--cn-border)", color: "var(--cn-text-2)" }}
          >
            <ChevronLeft className="w-4 h-4" /> {step === 0 ? "Cancel" : "Back"}
          </button>
          <div className="flex gap-2">
            {step === 3 ? (
              <>
                <button
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-xl text-sm font-semibold cursor-pointer"
                  style={{ background: "var(--cn-surface)", border: "1px solid var(--cn-border)", color: "var(--cn-text-2)" }}
                >
                  Save Draft
                </button>
                <button
                  onClick={handlePublish}
                  disabled={loading}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white cursor-pointer disabled:opacity-60"
                  style={{ background: "linear-gradient(135deg, var(--cn-primary), #818CF8)" }}
                >
                  {loading && <Loader className="w-4 h-4 cn-animate-spin" />}
                  Publish Community
                </button>
              </>
            ) : (
              <button
                onClick={() => setStep(step + 1)}
                disabled={!canNext()}
                className="flex items-center gap-1 px-5 py-2.5 rounded-xl text-sm font-semibold text-white cursor-pointer disabled:opacity-50"
                style={{ background: "linear-gradient(135deg, var(--cn-primary), #818CF8)" }}
              >
                Continue <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
