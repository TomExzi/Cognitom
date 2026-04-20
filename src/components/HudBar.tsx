import { useStore } from '@/store';
import { xpForLevel } from '@/data/user';

export function HudBar() {
  const { state } = useStore();
  const { user } = state;
  const currentLevelFloor = (user.level - 1) * 100;
  const progress = ((user.xp - currentLevelFloor) / (xpForLevel(user.level) - currentLevelFloor)) * 100;

  return (
    <header className="h-14 px-6 flex items-center justify-between border-b border-[var(--color-border-soft)] bg-[var(--color-surface)]">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-xl bg-[var(--color-accent)] flex items-center justify-center text-white font-bold">
          C
        </div>
        <span className="font-semibold tracking-tight">CognitoChat</span>
      </div>

      <div className="flex items-center gap-5 text-sm">
        <div className="flex items-center gap-2">
          <span className="text-[var(--color-ink-soft)]">Niveau</span>
          <span className="font-semibold">{user.level}</span>
          <div className="w-28 h-2 rounded-full bg-[var(--color-surface-muted)] overflow-hidden">
            <div
              className="h-full bg-[var(--color-accent)] transition-all"
              style={{ width: `${Math.min(100, progress)}%` }}
            />
          </div>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--color-reward-soft)] text-[var(--color-reward)] font-medium">
          <span>⚡</span>
          <span>{user.xp} XP</span>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--color-reward-soft)] text-[var(--color-reward)] font-medium">
          <span>🔥</span>
          <span>{user.streakDays}</span>
        </div>
      </div>
    </header>
  );
}
