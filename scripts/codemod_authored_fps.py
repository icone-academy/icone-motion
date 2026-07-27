"""Codemod: scenes use authored-frame timing (30fps base) while project runs at 60fps."""
from pathlib import Path
import re

scenes = Path(r"c:\Users\Meneses\Trabalho\icone-academy\icone-motion\src\scenes")

for path in sorted(scenes.glob("*.tsx")):
    text = path.read_text(encoding="utf-8")
    original = text

    # Ensure timeline import
    if "useAuthoredFrame" not in text:
        if "from '../timeline'" in text:
            text = text.replace(
                "from '../timeline'",
                "from '../timeline'",
            )
        else:
            # add after remotion import block
            m = re.search(r"from 'remotion';\n", text)
            if m:
                insert_at = m.end()
                text = (
                    text[:insert_at]
                    + "import {AUTHOR_FPS, T, useAuthoredFrame} from '../timeline';\n"
                    + text[insert_at:]
                )
            else:
                print("SKIP no remotion import", path.name)
                continue
    else:
        # ensure AUTHOR_FPS and T are imported
        text = re.sub(
            r"import \{([^}]+)\} from '\.\./timeline';",
            lambda m: (
                "import {"
                + ", ".join(
                    sorted(
                        set(
                            [p.strip() for p in m.group(1).split(",") if p.strip()]
                            + ["AUTHOR_FPS", "T", "useAuthoredFrame"]
                        )
                    )
                )
                + "} from '../timeline';"
            ),
            text,
            count=1,
        )

    # Replace useCurrentFrame() with useAuthoredFrame()
    text = text.replace("const frame = useCurrentFrame();", "const frame = useAuthoredFrame();")

    # Replace fps from useVideoConfig when used for springs — common pattern
    # const {fps} = useVideoConfig(); → const fps = AUTHOR_FPS;
    # Keep useVideoConfig if other fields used
    text = re.sub(
        r"const \{fps\} = useVideoConfig\(\);",
        "const fps = AUTHOR_FPS;",
        text,
    )
    text = re.sub(
        r"const \{fps, (\w+)\} = useVideoConfig\(\);",
        r"const fps = AUTHOR_FPS;\n  const {\1} = useVideoConfig();",
        text,
    )
    text = re.sub(
        r"const \{(\w+), fps\} = useVideoConfig\(\);",
        r"const fps = AUTHOR_FPS;\n  const {\1} = useVideoConfig();",
        text,
    )

    # Clean unused useCurrentFrame from remotion imports if no longer used
    if "useCurrentFrame" in text and "useCurrentFrame(" not in text.replace(
        "useCurrentFrame,", ""
    ):
        # remove from import list
        text = re.sub(r",\s*useCurrentFrame", "", text)
        text = re.sub(r"useCurrentFrame,\s*", "", text)

    # Sequence durationInFrames={BEAT.x} → T(BEAT.x) for multi-beat scenes
    if path.name in {"Scene03.tsx", "Scene05.tsx"}:
        text = re.sub(
            r"durationInFrames=\{BEAT\.(\w+)\}",
            r"durationInFrames={T(BEAT.\1)}",
            text,
        )
        # from={... + BEAT.x} patterns — from offsets need T()
        # fromGeral = BEAT.list → fromGeral = T(BEAT.list)
        text = re.sub(
            r"const from(\w+) = BEAT\.(\w+);",
            r"const from\1 = T(BEAT.\2);",
            text,
        )
        text = re.sub(
            r"const from(\w+) = from(\w+) \+ BEAT\.(\w+);",
            r"const from\1 = from\2 + T(BEAT.\3);",
            text,
        )
        text = re.sub(
            r"durationInFrames=\{BEAT\.(\w+)\}",
            r"durationInFrames={T(BEAT.\1)}",
            text,
        )

    if text != original:
        path.write_text(text, encoding="utf-8")
        print("updated", path.name)
    else:
        print("unchanged", path.name)
