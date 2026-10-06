# Portfolio Website

This is a static portfolio site for Navalta Femar M.

## Publish to GitHub Pages

1. Push this folder to a GitHub repository.
2. In the repository, go to Settings > Pages.
3. Set Source to GitHub Actions.
4. Commit and push the workflow file in `.github/workflows/deploy.yml`.
5. GitHub will deploy the site automatically.

The site is ready to be served as a static site without any build step.

## Alternative publish: Netlify

1. Push the same repository to GitHub.
2. Go to https://app.netlify.com and sign in.
3. Click Add new site > Import an existing project.
4. Connect the repository and keep the default deploy settings.
5. Netlify will detect the static site automatically and publish it.

This project already includes a `netlify.toml` config for the static deployment.
