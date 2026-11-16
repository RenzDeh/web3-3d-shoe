# 3D Shoe

Een interactieve 3D-viewer met Three.js en Vite.

## Lokaal starten

Gebruik een Node.js-versie die Vite 8 ondersteunt (20.19+ of 22.12+).

```sh
npm ci
npm run dev
```

Open de lokale URL die Vite toont. Maak een productiebuild met `npm run build`
en bekijk die lokaal met `npm run preview`.

## Schoenmodel

Plaats een zelfstandig GLB-bestand in `public/models/shoe.glb`. De viewer
schaalt en centreert het model automatisch. Zonder dit bestand verschijnt een
demomodel en vermeldt de status dat het schoenmodel niet beschikbaar is.
Gebruik alleen modellen die je mag delen.

## Bediening

- Sleep om rond het model te draaien; scroll of knijp om te zoomen.
- Gebruik **Pauzeer draaien / Automatisch draaien** om de camera automatisch te laten draaien.
- Gebruik **Herstel weergave** om de oorspronkelijke camerastand en zoom te herstellen.
- De knoppen werken met Tab en Enter/Spatie. Laadmeldingen worden via een statusregio aangekondigd.
- Automatisch draaien staat standaard uit wanneer het apparaat verminderde beweging vraagt.

## Handmatig controleren

1. Start zonder GLB: het demomodel en de bijbehorende status moeten verschijnen.
2. Pauzeer en hervat het draaien, wijzig de zoom en herstel de weergave.
3. Herhaal met een GLB: dezelfde bediening moet werken voor de schoen.
4. Controleer de knoppen met het toetsenbord en bij een smal venster.
5. Activeer verminderde beweging in het besturingssysteem: automatisch draaien moet stoppen.
