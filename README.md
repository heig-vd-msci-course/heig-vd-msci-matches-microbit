# HEIG-VD MSCI Course - micro:bit

Implémentation micro:bit du jeu des allumettes (projet fil rouge du cours
MSCI), écrite avec [MakeCode](https://makecode.microbit.org) en JavaScript/TS
et versionnée avec git (au lieu de rester uniquement dans l'éditeur en ligne).

## 🛠️ Environnement de développement

Ce dépôt fournit un **dev container** (VS Code Dev Containers / Codespaces)
avec [`mkc`](https://microsoft.github.io/pxt-mkc/) (CLI officielle de
MakeCode) préinstallé, pour coder, compiler et simuler le projet en local,
sans passer par l'éditeur web.

### Prérequis

- [Docker](https://www.docker.com/)
- VS Code + l'extension
  [Dev Containers](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers)
  (déjà recommandée dans `.vscode/extensions.json`)

### Démarrage

1. Ouvrir ce dossier dans VS Code, puis **"Reopen in Container"** quand
   VS Code le propose (ou via la palette de commandes).
2. Au premier démarrage du conteneur, `npm install -g makecode` s'exécute
   automatiquement (voir `postCreateCommand` dans
   `.devcontainer/devcontainer.json`).
3. **Première initialisation seulement** — si le dépôt ne contient pas encore
   de `pxt.json`, créer le projet micro:bit :

   ```bash
   mkc init microbit
   ```

4. Compiler le projet :

   ```bash
   mkc build
   ```

   Le fichier `.hex` généré se trouve dans `built/` (dossier ignoré par git,
   voir `.gitignore`) — il suffit de le glisser-déposer sur le lecteur
   `MICROBIT` monté sur la machine hôte pour flasher la carte.

5. Développer avec rebuild automatique + simulateur dans le navigateur :

   ```bash
   mkc serve
   ```

   VS Code propose d'ouvrir un aperçu sur le port `7000` (voir
   `portsAttributes` dans `devcontainer.json`).

### Versionnement

Seuls les fichiers sources du projet MakeCode (`pxt.json`, `*.ts`, assets,
etc.) sont commités — les dossiers `built/`, `.pxt/` et `node_modules/` sont
générés localement et ignorés par git.

> ⚠️ Cette configuration n'a pas encore été testée de bout en bout dans un
> conteneur réellement démarré (accès réseau indisponible lors de sa mise en
> place). À valider : build de l'image, `npm install -g makecode`, et
> `mkc init microbit` / `mkc build` / `mkc serve`.

## 🌐 Simulateur en ligne (GitHub Pages)

À chaque push, le workflow `.github/workflows/makecode.yml` compile le projet
et publie un simulateur jouable dans le navigateur :

<https://heig-vd-msci-course.github.io/heig-vd-msci-matches-microbit/>

Le fichier `.hex` y est aussi disponible
([`binary.hex`](https://heig-vd-msci-course.github.io/heig-vd-msci-matches-microbit/binary.hex)).

Mise en place (une seule fois) : dans les réglages du dépôt sur GitHub,
**Settings → Pages → Source : GitHub Actions**.

Le site montre le **dernier push, quelle que soit la branche** (pratique pour
tester une PR avant de la fusionner). Une branche ne peut déployer que si elle
est autorisée dans **Settings → Environments → github-pages → Deployment
branches and tags** (par défaut, seulement `main`).

## 📜 Licence

Ce travail est sous licence
[Creative Commons Attribution-ShareAlike 4.0 International](./LICENSE.md).
