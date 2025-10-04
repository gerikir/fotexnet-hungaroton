# Git Hooks

Ez a mappa tartalmazza a Git hooks-okat a projekthez.

## 🎯 Hooks

### **pre-commit**

-   ESLint futtatása
-   TypeScript típus ellenőrzés
-   Commit blokkolása, ha hibák vannak

### **pre-push**

-   Build ellenőrzés
-   Push blokkolása, ha a build sikertelen

## 🚀 Használat

### **Automatikus (Git hooks):**

```bash
git commit -m "message"  # Automatikusan futtatja a pre-commit-et
git push                 # Automatikusan futtatja a pre-push-t
```

### **Manuális:**

```bash
npm run precommit        # Pre-commit ellenőrzések
npm run prepush          # Pre-push ellenőrzések
npm run check-all        # Minden ellenőrzés
```

## 🔧 Beállítás

A hooks automatikusan be vannak állítva:

```bash
git config core.hooksPath .githooks
```

## 📝 Scripts

-   `npm run precommit` - Pre-commit ellenőrzések
-   `npm run prepush` - Pre-push ellenőrzések
-   `npm run type-check` - TypeScript típus ellenőrzés
-   `npm run check-all` - Minden ellenőrzés egyszerre
