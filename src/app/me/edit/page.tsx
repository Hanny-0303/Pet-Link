"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check } from "lucide-react";
import { useAppStore } from "@/components/store";
import { pets } from "@/lib/data";
import Avatar from "@/components/avatar";
import SubPageHeader from "@/components/sub-header";

export default function EditProfilePage() {
  const router = useRouter();
  const { profile, setProfile, showToast } = useAppStore();

  const [name, setName] = useState(profile.name);
  const [bio, setBio] = useState(profile.bio);
  const [district, setDistrict] = useState(profile.district);
  const districts = Array.from(new Set(pets.map((p) => p.district)));

  function save() {
    if (!name.trim()) return showToast("昵称不能为空");
    setProfile({ name: name.trim(), bio: bio.trim(), district });
    showToast("资料已保存");
    router.back();
  }

  return (
    <div className="min-h-dvh bg-cream pb-16">
      <SubPageHeader title="编辑资料" subtitle="改完立刻生效，刷新会还原" />

      <div className="mt-3 px-5">
        <div className="flex flex-col items-center rounded-[20px] bg-white py-6 shadow-[0_2px_12px_rgba(80,60,40,0.05)]">
          <Avatar name={name || "我"} tint="#ffb4a2" size={64} />
          <p className="mt-2.5 text-[13px] font-semibold">{name || "未命名"}</p>
          <p className="mt-0.5 text-[10.5px] text-ink-mute">
            演示版：头像暂不支持上传
          </p>
        </div>

        <Field label="昵称">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={12}
            className="w-full bg-transparent text-[14px] outline-none"
          />
        </Field>

        <Field label="一句话介绍">
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={3}
            maxLength={60}
            className="w-full resize-none bg-transparent text-[13px] leading-relaxed outline-none"
          />
          <span className="mt-1 block text-right text-[10px] text-ink-mute">
            {bio.length}/60
          </span>
        </Field>

        <div className="mt-4">
          <p className="mb-2 text-[12px] font-medium text-ink-soft">常驻区域</p>
          <div className="flex flex-wrap gap-2">
            {districts.map((d) => {
              const on = district === d;
              return (
                <button
                  key={d}
                  onClick={() => setDistrict(d)}
                  className={`flex items-center gap-1 rounded-full px-3 py-2 text-[12px] font-medium transition ${
                    on
                      ? "bg-brand text-white"
                      : "bg-white text-ink-soft shadow-[0_1px_6px_rgba(80,60,40,0.06)]"
                  }`}
                >
                  {on && <Check size={11} strokeWidth={3} />}
                  {d}
                </button>
              );
            })}
          </div>
        </div>

        <button
          onClick={save}
          className="mt-6 h-[50px] w-full rounded-full bg-brand text-[15px] font-semibold text-white shadow-[0_8px_24px_rgba(255,107,74,0.3)] active:scale-[0.98]"
        >
          保存
        </button>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="mt-4 block rounded-[18px] bg-white px-4 py-3 shadow-[0_2px_12px_rgba(80,60,40,0.05)]">
      <span className="mb-1.5 block text-[11px] font-medium text-ink-mute">
        {label}
      </span>
      {children}
    </label>
  );
}
