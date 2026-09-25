#!/usr/bin/env bash
#
# Build a signed release APK locally, with NO Expo account and NO Expo token.
#
# EAS Build is a paid cloud service that requires an authenticated Expo account.
# It is optional. This script uses the fully local path instead:
#
#   expo prebuild --platform android   generate the native project
#   ./gradlew assembleRelease          compile with the local Android SDK
#
# The only network use is downloading the public Android SDK and Gradle
# dependencies from Google and Maven Central. Nothing contacts EAS.
#
# Prerequisites:
#   - A full JDK with `javac` (OpenJDK 17 is the Android-recommended version).
#     A JRE alone is not enough: Gradle needs a compiler for native modules.
#   - ANDROID_HOME pointing at an SDK with platform-tools, a platform,
#     build-tools, an NDK, and cmake.
#
# Usage:
#   ANDROID_HOME=/path/to/sdk ./scripts/build-apk-local.sh
#
set -euo pipefail

PROJECT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
OUTPUT="$PROJECT/iching-light-community-release.apk"

: "${ANDROID_HOME:?Set ANDROID_HOME to your Android SDK path}"

# Prefer JDK 17 if it is present, since it is what Android's toolchain targets.
if [ -d /usr/lib/jvm/java-17-openjdk-amd64 ]; then
  export JAVA_HOME="${JAVA_HOME:-/usr/lib/jvm/java-17-openjdk-amd64}"
fi

echo "==> Verifying toolchain"
if [ -n "${JAVA_HOME:-}" ]; then
  "$JAVA_HOME/bin/javac" -version
else
  javac -version
fi
echo "ANDROID_HOME=$ANDROID_HOME"

echo "==> Generating the native Android project"
cd "$PROJECT"
npx expo prebuild --platform android --clean --no-install

echo "==> Preparing release signing"
KS="$PROJECT/android/app/release.keystore"
if [ ! -f "$KS" ]; then
  # Generate a throwaway keystore for local builds. Replace this with your own
  # key, and keep it safe, if you intend to publish updates that must install
  # over an existing install.
  keytool -genkeypair -v \
    -keystore "$KS" \
    -alias ichinglight \
    -keyalg RSA -keysize 2048 -validity 10000 \
    -storepass ichinglight2026 -keypass ichinglight2026 \
    -dname "CN=I Ching Light Community, OU=Community, O=Knowmium, C=SG"
fi

echo "==> Wiring the signing config into Gradle"
if ! grep -q "ICHING_UPLOAD_STORE_FILE" "$PROJECT/android/gradle.properties"; then
  cat >> "$PROJECT/android/gradle.properties" <<'PROPS'

# Release signing for local APK builds. Not used by EAS.
ICHING_UPLOAD_STORE_FILE=release.keystore
ICHING_UPLOAD_KEY_ALIAS=ichinglight
ICHING_UPLOAD_STORE_PASSWORD=ichinglight2026
ICHING_UPLOAD_KEY_PASSWORD=ichinglight2026
PROPS
fi

python3 - "$PROJECT/android/app/build.gradle" <<'PY'
import re
import sys

path = sys.argv[1]
source = open(path).read()

if "ichingRelease" in source:
    print("build.gradle already patched")
    sys.exit(0)

source = source.replace(
    "signingConfigs {\n        debug {",
    """signingConfigs {
        ichingRelease {
            storeFile file(ICHING_UPLOAD_STORE_FILE)
            storePassword ICHING_UPLOAD_STORE_PASSWORD
            keyAlias ICHING_UPLOAD_KEY_ALIAS
            keyPassword ICHING_UPLOAD_KEY_PASSWORD
        }
        debug {""",
    1,
)
source = re.sub(
    r"(release\s*\{[^}]*?)signingConfig\s+signingConfigs\.debug",
    r"\1signingConfig signingConfigs.ichingRelease",
    source,
    count=1,
    flags=re.S,
)
open(path, "w").write(source)
print("patched build.gradle")
PY

echo "==> Compiling the release APK"
cd "$PROJECT/android"
chmod +x ./gradlew
./gradlew assembleRelease --no-daemon

APK=$(find "$PROJECT/android/app/build/outputs/apk/release" -name "*.apk" | head -1)
if [ -z "$APK" ]; then
  echo "Build finished but no APK was produced." >&2
  exit 1
fi

cp "$APK" "$OUTPUT"
echo
echo "APK: $OUTPUT"
ls -lh "$OUTPUT"
echo
echo "Verify the signature with:"
echo "  apksigner verify --print-certs \"$OUTPUT\""
