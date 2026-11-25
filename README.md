# sirijiji.github.io

Portfolio et CV en ligne d'Alexandre Sirisak Boungnarith, Tech Lead Java/TypeScript.

Site public : https://sirijiji.github.io/

## Contenu

- Présentation, expérience, compétences, certifications, publications et contact.
- Thème clair/sombre, mise en page responsive, animations au scroll.
- SEO : canonical, Open Graph, Twitter Card, données structurées JSON-LD, sitemap et robots.txt.

## Stack

- HTML5, CSS3 et JavaScript vanilla.
- Aucun framework, aucun build, aucune dépendance npm.
- Google Fonts (Inter et Fraunces).
- GitHub Pages depuis la branche `master`, racine du dépôt.

## Structure

```text
index.html                  Page principale
styles.css                  Styles, thèmes, responsive
main.js                     Thème, navigation, animations, année
profile.jpg                 Portrait (460 x 460)
favicon.ico / favicon.png   Icônes
sitemap.xml                 Plan de site
robots.txt                  Directives pour les crawlers
legacy/index.html           Archive de l'ancienne version
weight-weather-privacy.html Politique de confidentialité (autre projet)
```

## Développement local

Le site ne nécessite pas de build. Ouvrir `index.html` directement ou servir le dossier :

```bash
python -m http.server 8000
```

Puis ouvrir http://localhost:8000.

## Mise à jour du contenu

- Les sections se trouvent dans `index.html` : À propos, Expérience, Compétences, Certifications, Publications et Contact.
- Mettre à jour le titre, la description, les balises Open Graph/Twitter et le JSON-LD si le poste ou les spécialités changent.
- Mettre à jour `lastmod` dans `sitemap.xml` après une modification de contenu.
- `legacy/index.html` est une archive en `noindex` : ne pas l'utiliser pour le contenu courant.

## Déploiement

```bash
git add .
git commit -m "Description du changement"
git push origin master
```

GitHub Pages republie automatiquement le site depuis `master`.

## SEO

- URL canonique : https://sirijiji.github.io/
- Données structurées : `ProfilePage` avec entité `Person`.
- `sitemap.xml` et `robots.txt` à la racine.
- Après un changement important, soumettre le sitemap dans Google Search Console si nécessaire.

## Droits

© Alexandre Sirisak Boungnarith. Contenu personnel, tous droits réservés.
