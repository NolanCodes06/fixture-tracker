"""
Generates the sample fixture data this project ships with.

Every vessel name, charterer name and rate in assets/hist_data_*.js is invented
by this script. Nothing here comes from a real fixture list. Cargo grades, port
and region codes and status codes are standard industry shorthand, so those are
kept as-is to make the demo behave like the real thing.

Run:  python tools/generate_sample_data.py
Seeded, so it produces the same output every time.
"""

import random
import os

random.seed(20260831)

OUT = os.path.join(os.path.dirname(__file__), "..", "assets")

# ---------------------------------------------------------------- invented names

# Coined words, so a generated vessel name is very unlikely to collide with a
# real ship. The check in tools/check_no_real_names.py enforces that.
BOW = ["ORVANE", "KELMAR", "VANTIS", "BRELDIN", "CASTIQ", "DRUVEN", "ELMARIS",
       "GALTOR", "HALVEN", "IRSEN", "KYNTHE", "LOVARN", "MERTHOL", "NOVREN",
       "OSKAVI", "PELDRA", "QUENVAR", "RISKEL", "SOLVANE", "TERVIK", "ULDREN",
       "VESPARA", "WYNDOR", "XELVAR", "ZERVIN", "ANDRIL", "BALVEN", "CORVEK",
       "DELMARIS", "ESKAVI", "FYRDEN", "GORVANE", "HELVEN", "ITHRAN", "JUNVAR",
       "KORVETH", "MOVREN", "NILVAR", "ORSETH", "PYRVAN", "QUELDOR", "RAVKEN",
       "SYLDOR", "THRAVEN", "VORNIK", "WESKAR", "XANTHOR", "YELVAN", "ZOTHIR",
       "ARVELLE", "BRYNTOR", "CALDRIN"]

STERN = ["VOYAGER", "HARMONY", "PIONEER", "SPIRIT", "TRADER", "PHOENIX", "CROWN",
         "LEGACY", "BREEZE", "SUMMIT", "BEACON", "COMPASS", "HORIZON", "LANTERN",
         "QUEST", "RIDGE", "SENTINEL", "TIDE", "VISTA", "AURELIA", "MERIDIAN",
         "CIRRUS", "DAWN", "ECHO", "FALCON", "GALE", "HAVEN", "ISLE"]

SERIES = ["OKV", "HMX", "TRN", "BLQ", "CDR", "PVN"]

TRADERS = ["VANTOR", "KELDRIC", "ORVEX", "BRAMWELL", "CASTALIA", "DUNMORE",
           "ELDRIN", "FAIRMONT PETRO", "GRANTHAM OIL", "HALVERD", "INGERSOL",
           "JARRAH ENERGY", "KOVAREN", "LINDHOLM", "MERIDAN TRADING", "NAVERRE",
           "OSTLUND", "PELLWORTH", "QUARRAN", "ROSEMARK", "SELVIG", "TARRANT",
           "ULVERTON", "VESKARD", "WYNDHAM FUELS", "XANTHE", "YELVERTON",
           "ZORAN PETRO", "ASHWORTH", "BELLMORE", "CRENSHAW", "DELACROIX",
           "EASTVALE", "FENWICK", "GALLOWAY", "HOLLINGER", "ISBARN", "JOVANIC",
           "KESTREL TRADING", "LANDRY OIL", "MARCHETTI", "NORDVIK", "OAKHAVEN",
           "PRESTON FUELS", "QUILLON", "RAVENNA", "STORMONT", "THALBERG",
           "UNDERWOOD", "VARENNE", "WESTBROOK", "YARROW", "ZELLWEGER"]


def make_vessels(n):
    """Every BOW+STERN pair, plus a numbered series, trimmed to n names."""
    names = ["%s %s" % (a, b) for a in BOW for b in STERN]
    names += ["%s %d" % (s, i) for s in SERIES for i in range(1, 41)]
    random.shuffle(names)
    return names[:n]


VESSELS = make_vessels(1200)

# --------------------------------------------------- industry shorthand, kept

CARGO = (["UMS"] * 44 + ["CPP"] * 17 + ["NAP"] * 11 + ["ULSD"] * 9 + [""] * 4 +
         ["GO"] * 3 + ["JET"] * 3 + ["GAS"] * 2 + ["MOGAS"] * 2 + ["REN ULSD"] +
         ["HSD"] + ["FAME"] + ["ETH"])

LOADS = (["ARA"] * 24 + ["USG"] * 11 + [""] * 4 + ["PEMBROKE"] * 3 +
         ["SINES"] * 3 + ["MONGSTAD"] * 3 + ["ROTTERDAM"] * 3 + ["ANTWERP"] * 2 +
         ["HOUSTON"] * 2 + ["PORT ARTHUR"] * 2 + ["FUJAIRAH"] * 2 + ["SIKKA"] +
         ["YANBU"] + ["AUGUSTA"] + ["MILAZZO"] + ["BILBAO"] + ["LAVERA"] +
         ["TUAPSE"] + ["VENTSPILS"] + ["IMMINGHAM"] + ["MADERO"] + ["COATZA"])

DISCH = (["TA"] * 16 + ["WAFR"] * 8 + ["OPS"] * 7 + ["UKC"] * 5 +
         ["TA-UKC"] * 5 + [""] * 4 + ["MED"] * 4 + ["USAC"] * 3 + ["ECCA"] * 3 +
         ["BRAZIL"] * 3 + ["CBS"] * 2 + ["WCMEX"] * 2 + ["ECM"] * 2 +
         ["USG-USAC-CBS-ECCA"] * 2 + ["FEAST"] + ["SPORE"] + ["AUSTRALIA"] +
         ["CHILE"] + ["PERU"] + ["ARGENTINA"])

MT = ["37"] * 70 + ["38"] * 27 + ["60"] + ["35"] + ["90"] + ["40"]

STATUS = ["FXD"] * 51 + ["SUBS"] * 33 + ["FLD"] * 11 + [""] * 4 + ["HOLD"]

WINDOW_BLANK_ODDS = 0.78
WINDOW_TOKENS = ["FAILED"] * 6 + ["CHEMS"] * 5

MONTHS = ["JAN", "FEB", "MARCH", "APRIL", "MAY", "JUNE", "JULY", "AUG",
          "SEPT", "OCT", "NOV", "DEC"]


def charterer():
    # mirrors the real shape, where a large share is "charterer not reported"
    if random.random() < 0.13:
        return "CNR"
    return random.choice(TRADERS)


def vessel():
    if random.random() < 0.007:
        return "TBN"          # to be named, standard placeholder
    return random.choice(VESSELS)


def laycan(month_hint):
    if random.random() < 0.11:
        return "N/A"
    m = MONTHS[month_hint % 12]
    d = random.randint(1, 26)
    if random.random() < 0.55:
        return "%d-%d %s" % (d, d + random.randint(1, 3), m)
    return "%d %s" % (d, m)


def rate():
    r = random.random()
    if r < 0.22:
        return "RNR"          # rate not reported
    if r < 0.27:
        return "PROG"
    if r < 0.33:
        return "%.2f / %dK" % (random.uniform(0.85, 1.65), random.choice([30, 45, 60]))
    return str(random.choice(range(85, 245, 5)))


def window():
    if random.random() < WINDOW_BLANK_ODDS:
        return ""
    if random.random() < 0.25:
        return random.choice(WINDOW_TOKENS)
    d = random.randint(1, 24)
    return "%02d-%02d" % (d, d + 6)


def row(week_label, month_hint):
    return [week_label, window(), vessel(), charterer(), random.choice(MT),
            random.choice(CARGO), laycan(month_hint), random.choice(LOADS),
            random.choice(DISCH), rate(), random.choice(STATUS), "",
            1 if random.random() < 0.054 else 0]


def js_row(r):
    cells = ",".join('"%s"' % str(c).replace('"', "'") for c in r[:12])
    return "[%s,%d]," % (cells, r[12])


def build(year, weeks, var_name, header, big_week=None):
    lines = [header,
             "// 0:week 1:window 2:vessel 3:charterer 4:mt 5:cargo 6:laycan "
             "7:load 8:discharge 9:rate 10:status 11:notes 12:tnc",
             "// Generated by tools/generate_sample_data.py. Not real fixtures.",
             "const %s = [" % var_name]
    total = 0
    for w in range(1, weeks + 1):
        label = "WEEK %02d %d" % (w, year)
        n = big_week if (big_week and w == weeks) else random.randint(252, 296)
        lines.append("// %s" % label)
        month_hint = (w - 1) // 4
        for _ in range(n):
            lines.append(js_row(row(label, month_hint)))
        total += n
    lines.append("];")
    lines.append("")
    return "\n".join(lines), total


if __name__ == "__main__":
    a, n1 = build(2025, 52, "HIST_2025",
                  "// Sample fixture data - 2025, all 52 weeks")
    b, n2 = build(2026, 22, "HIST_2026",
                  "// Sample fixture data - 2026, weeks 01-22",
                  big_week=2900)
    with open(os.path.join(OUT, "hist_data_2025.js"), "w", newline="\n") as f:
        f.write(a)
    with open(os.path.join(OUT, "hist_data_2026.js"), "w", newline="\n") as f:
        f.write(b)
    print("hist_data_2025.js: %d rows" % n1)
    print("hist_data_2026.js: %d rows" % n2)

    # 30 seed rows for the editable live week
    seed = [row("WEEK 23 2026", 5) for _ in range(30)]
    print("\nLIVE_SEED replacement:\n")
    print("const LIVE_SEED = [")
    for r in seed:
        print("  " + js_row(r))
    print("];")
