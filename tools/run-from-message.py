#!/usr/bin/env python3
import re, subprocess, sys
def extract(text):
    return [b.strip() for b in re.findall(r'```bash\n(.*?)```', text, re.DOTALL) if b.strip()]
def main():
    run = '--run' in sys.argv
    blocks = extract(sys.stdin.read())
    if not blocks:
        print("❌ Aucun bloc bash.")
        return 0
    print(f"📦 {len(blocks)} bloc(s) détecté(s)\n")
    if not run:
        print("🔍 DRY-RUN (--run pour exécuter)\n")
        for i, b in enumerate(blocks, 1):
            print(f"─── Bloc {i} ───\n{b}\n")
        return 0
    for i, b in enumerate(blocks, 1):
        print(f"🚀 Bloc {i}/{len(blocks)}\n")
        r = subprocess.run(b, shell=True)
        if r.returncode != 0:
            print(f"⚠️ Bloc {i} exit {r.returncode}")
            return r.returncode
    print(f"✅ {len(blocks)} bloc(s) OK.")
    return 0
sys.exit(main())
