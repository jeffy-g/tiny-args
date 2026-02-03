#!/bin/bash
# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
#  Copyright (C) 2022 jeffy-g <hirotom1107@gmail.com>
#  Released under the MIT license
#  https://opensource.org/licenses/mit-license.php
# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

export reset="\033[0m"
export red="\033[31m"
export green="\033[32m"
export yellow="\033[33m"
export blue="\033[34m"
export purple="\033[35m"
export cyan="\033[36m"
export white="\033[37m"

SCRIPT_DIR=$(cd $(dirname "$0") || exit; pwd)
cpxopt=$([ -z $CI ] && echo "-v" || echo "")


declare -r NPM_NAME="tin-args"
declare -r PUB_VER_JSON="./package.json"

# cat "./package.json" | grep -oP "([0-9]+\.[0-9]+\.[0-9]+(-\w+)?)" # 複数 version string が列挙...
# grep -m 1 -oP "([0-9]+\.[0-9]+\.[0-9]+(-\w+)?)" package.json # OK
#
# scripts/tool.sh get_publish_version
#
get_publish_version() {
  # "version": "1.0.0"
  # cat $PUB_VER_JSON | sed -zE 's/"version": "([0-9]+\.[0-9]+\.[0-9]+(-\w+)?)"/\1/' # これでは...
  # cat $PUB_VER_JSON | sed -nE 's/"version": "([0-9]+\.[0-9]+\.[0-9]+(-\w+)?)"/\1/p' # `-n` + `/.../p` でマッチした行だけ出力！
  # cat $PUB_VER_JSON | sed -nE 's/"version": "([^"]+)".*/\1/p' # token 確定ならこの shot version で OK
  # local pub_version=$(cat $PUB_VER_JSON | grep -oP "([0-9]+\.[0-9]+\.[0-9]+(-\w+)?)"); # grep は `o` を足すだけ
  local pub_version=$(grep -m 1 -oP "([0-9]+\.[0-9]+\.[0-9]+(-\w+)?)" package.json); # grep は `o` を足すだけ
  echo "$pub_version"
}
# `prepublishOnly`
prepublish() {
  # local publish_version=$(get_publish_version)
  # save origin packag.json
  cat package.json > package.json.bak
  orgpkg -p
  # restore origin package.json
  cat dist/package.json > package.json
}
postpublish() {
  # clean up project root package.json
  cat package.json.bak > package.json
  rm package.json.bak
}
#
# scripts/tool.sh fire_publish publish --dry-run
# scripts/tool.sh fire_publish publish --access=public
# scripts/tool.sh fire_publish pack
#
fire_publish() {
  prepublish
  # npm publish --dry-run
  # npm pack
  npm "$@"
  postpublish
}
#
# scripts/tool.sh trim_and_publish test
#
trim_and_publish() {

  local publish_version=$(get_publish_version)
  local tgz_name="$NPM_NAME-${publish_version}.tgz"
  local publish_tmp=$(mktemp -d)
  # local publish_tmp="temp"

  fire_publish pack
  # if [ ! -d tmp ]; then
  #   mkdir tmp
  # fi

  tar -xzf "$tgz_name" -C "$publish_tmp"
  pushd "$publish_tmp/package"

  # needless this project
  # jstool -cmd rmc -rmc4ts -root . -test "re/\\.(js|d\\.ts)$/"

  if [ "$1" == "test" ]; then
    npm publish --dry-run
  else
    npm publish
  fi

  popd

  if [ "$1" != "test" ]; then
    rimraf "$publish_tmp" "$tgz_name"
  fi
}


if [ ! -z "$1" ]; then
  fname=$1
  shift
  # echo "$@"
  $fname "$@"
else
  echo "[${0}]: no parameters..."
fi
