#!/bin/bash
# Thanks to https://thesearemyramblings.com/1337/vercel-submodules-workaround/
# repo paths (supplied without the protocol prefix)
MAIN_REPO=github.com/hmsk/aza.git
SUBMODULE_REPO=github.com/geolonia/japanese-addresses.git

# the path of the submodule in .gitmodules
SUBMODULE_PATH=packages/meta/src/vendor/japanese-addresses

# the reference of the submodule in .gitmodules (usually the path)
SUBMODULE_REF=packages/meta/src/vendor/japanese-addresses

if [ "$VERCEL_GITHUB_COMMIT_SHA" == "" ]; then
  echo "Error: VERCEL_GITHUB_COMMIT_SHA is empty"
  exit 1
fi

if [ "$GITHUB_ACCESS_TOKEN" == "" ]; then
  echo "Error: GITHUB_ACCESS_TOKEN is empty"
  exit 1
fi

# stop script execution on error
set -e

# set up an empty temporary work directory
rm -rf vercel-tmp || true
mkdir vercel-tmp
cd vercel-tmp

# checkout the current commit
git init
git remote add origin https://$GITHUB_ACCESS_TOKEN@$MAIN_REPO
git fetch --depth=1 origin $VERCEL_GITHUB_COMMIT_SHA
git checkout $VERCEL_GITHUB_COMMIT_SHA

# set the submodule repo path to one that vercel can access
git config --file=.gitmodules "submodule.$SUBMODULE_REF.url" https://$GITHUB_ACCESS_TOKEN@$SUBMODULE_REPO

# checkout the submodule
git submodule sync
git submodule update --init --recursive --remote

# move the submodule to where it should have been if vercel had supported submodules
cd ..
rm -rf vercel-tmp/$SUBMODULE_PATH/.git
mv vercel-tmp/$SUBMODULE_PATH/ $SUBMODULE_PATH

# clean up
rm -rf vercel-tmp
