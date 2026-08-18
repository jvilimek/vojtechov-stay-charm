# Integrace self-hosted hero videa

## Cíl
Nahradit statický hero obrázek na hlavní stránce krátkým, ztlumeným, smyčkovaným videem hostovaným přímo v repozitáři, aby první dojem stránky působil živě a "lákal k návštěvě".

## Požadavky (potvrzeno)
- **Umístění:** hero pozadí pod hlavním nadpisem.
- **Hosting:** self-hosted MP4 v `public/videos/`.
- **Autoplay:** automatické přehrávání bez zvuku.

## Současný stav
- Hlavní stránka je v `src/routes/index.tsx`.
- Hero sekce používá statický obrázek z `public/images/photos.json` s rolí `hero`.
- Galerie je dynamická, ale video do ní neintegrujeme — bude samostatně v hero.
- Statický export v `scripts/export-static.mjs` kopíruje pouze obrázky z `public/images/` do `docs/images/`; video musíme přidat do exportu.

## Navrhované řešení

### 1. Příprava videa
- Uživatel vloží MP4 soubor do `public/videos/hero.mp4` (doporučené jméno).
- Délka: ideálně 10–20 s, smyčka (`loop`), bez zvuku.
- Rozlišení: 1080p nebo 720p, komprimované pro web (cíl pod 10 MB).

### 2. Poster / fallback
- Vytvořit jeden statický frame z videa jako `public/images/hero-video-poster.jpg`.
- Slouží jako:
  - `poster` atribut `<video>` před načtením videa.
  - fallback na mobilech nebo při `prefers-reduced-motion`.
  - záloha, pokud prohlížeč autoplay blokuje.

### 3. Komponenta hero sekce
- Upravit hero v `src/routes/index.tsx`:
  - Přidat `<video>` jako absolutně pozicované pozadí.
  - Atributy: `autoPlay`, `muted`, `loop`, `playsInline`, `preload="auto"`, `poster`.
  - Ponechat stávající gradientní overlay, aby text zůstal čitelný.
  - Ponechat pomalý zoom? — u videa není potřeba, případně jemný fade-in při načtení.
- Responzivně:
  - Na mobilních zařízeních zobrazit raději statický poster (šetření dat a výdrž baterie), video nechat na větších obrazovkách.
  - Respektovat `prefers-reduced-motion: reduce` — zobrazit jen poster.

### 4. Manifest / metadata
- Rozšířit `public/images/photos.json` o volitelný klíč `poster` nebo `video` není nutné, protože video je samostatný asset.
- Přidat případně novou roli `hero-video-poster` pro fallback obrázek, pokud se má fallback dynamicky načítat z JSONu.

### 5. Statický export
- Rozšířit `scripts/export-static.mjs`:
  - Vytvořit výstupní adresář `docs/videos`.
  - Kopírovat `public/videos/hero.mp4` do `docs/videos/hero.mp4`.
  - Zajistit, že HTML reference na `/videos/hero.mp4` budou přepsány na `videos/hero.mp4`.
  - Ponechat poster v `docs/images/` jako dosud.

### 6. GitHub Actions
- Žádná změna není nutná; workflow už spouští `export:static`, takže nový adresář `docs/videos` se automaticky dostane do artifactu.

### 7. SEO / performance
- Upravit head meta tagy, pokud je v nich odkaz na hero obrázek — nahradit posterem nebo ponechat statický hero obrázek pro OG/Twitter.
- Zvážit `loading="lazy"` u posteru není nutné, protože je v první části stránky.

## Implementační kroky
1. Uživatel přidá `public/videos/hero.mp4` a `public/images/hero-video-poster.jpg`.
2. Upravit `src/routes/index.tsx` — hero sekce s `<video>` a fallback/poster logikou.
3. Upravit `scripts/export-static.mjs` — kopírovat videa do `docs/videos/` a přepisovat cesty.
4. Otestovat lokálně: `bun run dev`, pak `bun run export:static` a ověřit `docs/videos/hero.mp4`.
5. Ověřit na mobilním viewportu a při `prefers-reduced-motion`.

## Co potřebuji od uživatele
- MP4 soubor (nebo jeho přesný název, pokud ho uživatel vloží sám).
- Potvrzení, zda chce statický poster vytvořit ze stávajícího hero obrázku, nebo dodá vlastní frame z videa.
