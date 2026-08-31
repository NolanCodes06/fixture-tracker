"""
Checks that no name from a private reference list appears anywhere in this repo.

The reference file is never committed. Point it at a JSON file shaped like
{"vessels": [...], "charterers": [...]} built from whatever real data you are
keeping out, then run:

    python tools/check_no_real_names.py path/to/private_names.json

Exits non-zero and prints every hit if anything leaks through.
"""

import json
import os
import re
import sys

# Words that show up in both real fixture lists and ordinary UI copy. Matching
# on these produces noise, not leaks.
IGNORE = {
    "TOTAL", "SUBS", "FXD", "FLD", "COA", "CNR", "TBN", "CHIP", "SUCCESS",
    "PLACEHOLDER", "ON HOLD", "HOLD", "TRAF", "N/A", "PROG", "RNR",
}

SKIP_DIRS = {".git", "node_modules"}


def main():
    if len(sys.argv) != 2:
        print(__doc__)
        return 2

    ref = json.load(open(sys.argv[1], encoding="utf-8"))
    names = set()
    for key in ("vessels", "charterers"):
        for n in ref.get(key, []):
            n = str(n).strip().upper()
            if len(n) > 3 and n not in IGNORE:
                names.add(n)

    root = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")
    hits = {}
    for dirpath, dirnames, filenames in os.walk(root):
        dirnames[:] = [d for d in dirnames if d not in SKIP_DIRS]
        for fn in filenames:
            path = os.path.join(dirpath, fn)
            if os.path.abspath(path) == os.path.abspath(sys.argv[1]):
                continue
            try:
                text = open(path, encoding="utf-8", errors="replace").read().upper()
            except OSError:
                continue
            found = [n for n in names
                     if re.search(r"(?<![A-Z0-9])" + re.escape(n) + r"(?![A-Z0-9])", text)]
            if found:
                hits[os.path.relpath(path, root)] = sorted(found)

    if hits:
        print("FAIL: real names found")
        for path, found in sorted(hits.items()):
            print("  %s: %s" % (path, ", ".join(found[:10])))
        return 1

    print("OK: checked %d names, none present" % len(names))
    return 0


if __name__ == "__main__":
    sys.exit(main())
