name: Auto Version + Changelog

on:
  push:
    branches: [ main ]

jobs:
  version:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout
        uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: Bump version
        id: bump
        uses: anothrNick/github-tag-action@1.67.0
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          WITH_V: false
          DEFAULT_BUMP: patch

      - name: Generate changelog
        id: changelog
        uses: metcalfc/changelog-generator@v4
        with:
          token: ${{ secrets.GITHUB_TOKEN }}

      - name: Update CHANGELOG.md
        run: |
          echo "## Version ${{ steps.bump.outputs.new_tag }}" >> CHANGELOG.md
          echo "${{ steps.changelog.outputs.changelog }}" >> CHANGELOG.md
          echo "" >> CHANGELOG.md

      - name: Commit updated changelog
        run: |
          git config user.name "github-actions"
          git config user.email "github-actions@github.com"
          git add CHANGELOG.md
          git commit -m "docs: update changelog for version ${{ steps.bump.outputs.new_tag }}" || echo "No changes to commit"

      - name: Push changes
        run: git push

      - name: Create GitHub Release
        uses: softprops/action-gh-release@v2
        with:
          tag_name: ${{ steps.bump.outputs.new_tag }}
          name: Release ${{ steps.bump.outputs.new_tag }}
          body: ${{ steps.changelog.outputs.changelog }}
