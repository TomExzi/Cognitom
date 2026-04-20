import { StoreProvider } from '@/store';
import { HudBar } from '@/components/HudBar';
import { Chat } from '@/components/Chat';

export default function App() {
  return (
    <StoreProvider>
      <div className="h-screen flex flex-col bg-[var(--color-base)]">
        <HudBar />
        <main className="flex-1 overflow-hidden">
          <Chat />
        </main>
      </div>
    </StoreProvider>
  );
}
