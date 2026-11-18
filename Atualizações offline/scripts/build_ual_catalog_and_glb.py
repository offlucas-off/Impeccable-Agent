#!/usr/bin/env python3
"""
REA / GLB Inspector & Compiler for Quaternius Universal Animation Library 1 & 2.
Generates:
  1. src/data/ualSkeletonSpec.json     (65-bone canonical hierarchy, M/F transforms, capsules, sockets)
  2. src/data/ualAnimationCatalog.json (All 85 playable Standard clips + 260 AnimViewer taxonomy entries)
  3. public/animations/ual_master_library.glb (Pure 65-bone Armature + 85 unique deduplicated clips, compacted)
  4. public/animations/ATTRIBUTION.md
"""
import json
import math
import os
import struct
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
UAL1_GLB = Path("/tmp/ual_refs/UAL1/Universal Animation Library[Standard]/Unreal-Godot/UAL1_Standard.glb")
UAL2_GLB = Path("/tmp/ual_refs/UAL2/Universal Animation Library 2[Standard]/Unreal-Godot/UAL2_Standard.glb")
MANNEQUIN_F_GLB = Path("/tmp/ual_refs/UAL2/Universal Animation Library 2[Standard]/Female Mannequin/Unreal-Godot/Mannequin_F.glb")
ANIMTAGS_JSON = Path("/tmp/ual_refs/animviewer/animtags_extracted.json")

OUT_SKELETON_SPEC = ROOT / "src" / "data" / "ualSkeletonSpec.json"
OUT_ANIM_CATALOG = ROOT / "src" / "data" / "ualAnimationCatalog.json"
OUT_MASTER_GLB = ROOT / "public" / "animations" / "ual_master_library.glb"
OUT_ATTR = ROOT / "public" / "animations" / "ATTRIBUTION.md"


def read_glb(path: Path):
    data = path.read_bytes()
    magic, version, length = struct.unpack("<III", data[:12])
    assert magic == 0x46546C67 and version == 2, f"Invalid GLB: {path}"
    offset = 12
    gltf = None
    bin_chunk = b""
    while offset < len(data):
        clen, ctype = struct.unpack("<II", data[offset:offset + 8])
        payload = data[offset + 8:offset + 8 + clen]
        if ctype == 0x4E4F534A:
            gltf = json.loads(payload.decode("utf-8"))
        elif ctype == 0x004E4942:
            bin_chunk = payload
        offset += 8 + clen
    return gltf, bin_chunk


def read_accessor_floats(gltf, bin_chunk: bytes, acc_idx: int):
    acc = gltf["accessors"][acc_idx]
    bv = gltf["bufferViews"][acc["bufferView"]]
    comp_type = acc["componentType"]
    type_str = acc["type"]
    n_comp = {"SCALAR": 1, "VEC2": 2, "VEC3": 3, "VEC4": 4, "MAT4": 16}[type_str]
    fmt_char = {5126: "f", 5123: "H", 5125: "I"}[comp_type]
    comp_size = {"f": 4, "H": 2, "I": 4}[fmt_char]
    base = bv.get("byteOffset", 0) + acc.get("byteOffset", 0)
    stride = bv.get("byteStride", n_comp * comp_size)
    out = []
    for i in range(acc["count"]):
        pos = base + i * stride
        vals = struct.unpack(f"<{n_comp}{fmt_char}", bin_chunk[pos:pos + n_comp * comp_size])
        out.append(vals[0] if n_comp == 1 else list(vals))
    return out


def compute_world_positions(gltf, joints):
    nodes = gltf["nodes"]
    parent_of = {}
    for idx, n in enumerate(nodes):
        for c in n.get("children", []):
            parent_of[c] = idx

    # Build 4x4 local matrices
    def quat_to_mat(q, t, s):
        x, y, z, w = q
        sx, sy, sz = s
        xx, yy, zz = x * x, y * y, z * z
        xy, xz, yz = x * y, x * z, y * z
        wx, wy, wz = w * x, w * y, w * z
        return [
            [(1 - 2 * (yy + zz)) * sx, 2 * (xy - wz) * sy, 2 * (xz + wy) * sz, t[0]],
            [2 * (xy + wz) * sx, (1 - 2 * (xx + zz)) * sy, 2 * (yz - wx) * sz, t[1]],
            [2 * (xz - wy) * sx, 2 * (yz + wx) * sy, (1 - 2 * (xx + yy)) * sz, t[2]],
            [0.0, 0.0, 0.0, 1.0],
        ]

    def mul4(a, b):
        return [[sum(a[i][k] * b[k][j] for k in range(4)) for j in range(4)] for i in range(4)]

    cache = {}

    def world_mat(idx):
        if idx in cache:
            return cache[idx]
        n = nodes[idx]
        m = quat_to_mat(
            n.get("rotation", [0.0, 0.0, 0.0, 1.0]),
            n.get("translation", [0.0, 0.0, 0.0]),
            n.get("scale", [1.0, 1.0, 1.0]),
        )
        if idx in parent_of:
            m = mul4(world_mat(parent_of[idx]), m)
        cache[idx] = m
        return m

    positions = {}
    for j in joints:
        wm = world_mat(j)
        positions[nodes[j]["name"]] = [round(wm[0][3], 5), round(wm[1][3], 5), round(wm[2][3], 5)]
    return positions


def classify_category(name: str, tags: list[str]) -> str:
    tset = set(tags)
    nl = name.lower()
    if "zombie" in nl or "zombie" in tset or "undead" in tset:
        return "Zombie"
    if any(k in tset for k in ("parkour", "climbing", "flip", "vault", "slide", "wallrun", "ninja")) or "ninjajump" in nl or "slide" in nl or "climb" in nl or "roll" in nl:
        return "Parkour & Traversal"
    if any(k in tset for k in ("combat", "melee", "sword", "pistol", "ranged", "spell", "shield", "block", "parry", "hit", "death", "damage", "knockback")) or any(k in nl for k in ("sword", "pistol", "punch", "melee", "shield", "hit", "death", "spell")):
        return "Combat & Combos"
    if any(k in tset for k in ("farming", "fishing", "woodcutting", "mining", "work", "repair", "chest", "interact")) or any(k in nl for k in ("farm_", "treechopping", "chest_open", "fixing", "pickup", "interact", "consume")):
        return "Work & Interaction"
    if any(k in tset for k in ("locomotion", "walk", "run", "jog", "sprint", "jump", "swim", "crawl", "crouch", "push")) or any(k in nl for k in ("walk", "jog", "sprint", "jump", "swim", "crawl", "crouch", "push", "driving")):
        return "Locomotion"
    return "Emotes & Stances"


def main():
    OUT_SKELETON_SPEC.parent.mkdir(parents=True, exist_ok=True)
    OUT_MASTER_GLB.parent.mkdir(parents=True, exist_ok=True)

    u1, u1_bin = read_glb(UAL1_GLB)
    u2, u2_bin = read_glb(UAL2_GLB)
    mf, _ = read_glb(MANNEQUIN_F_GLB)
    animtags = json.loads(ANIMTAGS_JSON.read_text(encoding="utf-8")) if ANIMTAGS_JSON.exists() else {}

    # 1. Build canonical skeleton spec
    joints_u1 = u1["skins"][0]["joints"]
    nodes_u1 = u1["nodes"]
    nodes_mf = mf["nodes"]

    parent_by_name = {}
    for idx, n in enumerate(nodes_u1):
        for c in n.get("children", []):
            if c in joints_u1:
                parent_by_name[nodes_u1[c]["name"]] = n["name"]

    finger_tokens = ("index_", "middle_", "pinky_", "ring_", "thumb_")
    world_pos_m = compute_world_positions(u1, joints_u1)
    world_pos_f = compute_world_positions(mf, mf["skins"][0]["joints"])

    bones_spec = []
    for order_idx, j_idx in enumerate(joints_u1):
        nm = nodes_u1[j_idx]["name"]
        nf = nodes_mf[mf["skins"][0]["joints"][order_idx]]
        is_finger = any(tok in nm for tok in finger_tokens)
        is_structural = not is_finger and nm not in ("root", "ball_leaf_l", "ball_leaf_r")
        bones_spec.append({
            "order": order_idx,
            "name": nm,
            "parent": parent_by_name.get(nm, "Armature"),
            "isStructural": is_structural,
            "isFingerOptional": is_finger,
            "male": {
                "translation": [round(x, 6) for x in nodes_u1[j_idx].get("translation", [0.0, 0.0, 0.0])],
                "rotation": [round(x, 6) for x in nodes_u1[j_idx].get("rotation", [0.0, 0.0, 0.0, 1.0])],
                "worldPos": world_pos_m[nm],
            },
            "female": {
                "translation": [round(x, 6) for x in nf.get("translation", [0.0, 0.0, 0.0])],
                "rotation": [round(x, 6) for x in nf.get("rotation", [0.0, 0.0, 0.0, 1.0])],
                "worldPos": world_pos_f[nm],
            },
            "children": [nodes_u1[c]["name"] for c in nodes_u1[j_idx].get("children", [])],
        })

    # Capsule segments for automatic SkinnedMesh weight binding across the 17 core structural bones
    structural_capsules = [
        {"bone": "pelvis", "endBone": "spine_01", "radius": 0.14},
        {"bone": "spine_01", "endBone": "spine_02", "radius": 0.145},
        {"bone": "spine_02", "endBone": "spine_03", "radius": 0.16},
        {"bone": "spine_03", "endBone": "neck_01", "radius": 0.155},
        {"bone": "neck_01", "endBone": "Head", "radius": 0.08},
        {"bone": "Head", "endOffsetLocalY": 0.22, "radius": 0.14},
        {"bone": "clavicle_l", "endBone": "upperarm_l", "radius": 0.075},
        {"bone": "upperarm_l", "endBone": "lowerarm_l", "radius": 0.068},
        {"bone": "lowerarm_l", "endBone": "hand_l", "radius": 0.058},
        {"bone": "hand_l", "endOffsetLocalY": 0.14, "radius": 0.06},
        {"bone": "clavicle_r", "endBone": "upperarm_r", "radius": 0.075},
        {"bone": "upperarm_r", "endBone": "lowerarm_r", "radius": 0.068},
        {"bone": "lowerarm_r", "endBone": "hand_r", "radius": 0.058},
        {"bone": "hand_r", "endOffsetLocalY": 0.14, "radius": 0.06},
        {"bone": "thigh_l", "endBone": "calf_l", "radius": 0.105},
        {"bone": "calf_l", "endBone": "foot_l", "radius": 0.078},
        {"bone": "foot_l", "endBone": "ball_l", "radius": 0.07},
        {"bone": "thigh_r", "endBone": "calf_r", "radius": 0.105},
        {"bone": "calf_r", "endBone": "foot_r", "radius": 0.078},
        {"bone": "foot_r", "endBone": "ball_r", "radius": 0.07},
    ]

    skeleton_spec = {
        "schemaVersion": "1.0.0",
        "source": "Quaternius Universal Animation Library 1 & 2 [Standard] (CC0 1.0)",
        "boneCount": len(bones_spec),
        "structuralBoneCount": sum(1 for b in bones_spec if b["isStructural"]),
        "fingerOptionalBoneCount": sum(1 for b in bones_spec if b["isFingerOptional"]),
        "upAxis": "+Y",
        "forwardAxis": "+Z",
        "limbLongAxisLocal": "+Y",
        "weaponForwardAxisLocal": "+Z",
        "heights": {
            "maleMeters": 1.829,
            "femaleMeters": 1.808,
        },
        "sockets": {
            "hand_r": {"bone": "hand_r", "offset": [0.0, 0.1, 0.02], "bladeAxis": "+Z", "role": "Primary weapon / tool"},
            "hand_l": {"bone": "hand_l", "offset": [0.0, 0.1, 0.02], "bladeAxis": "+Z", "role": "Shield / offhand / lantern"},
            "head": {"bone": "Head", "offset": [0.0, 0.14, 0.0], "bladeAxis": "+Y", "role": "Helmet / hat / hair"},
            "back": {"bone": "spine_03", "offset": [0.0, 0.08, -0.14], "bladeAxis": "+Y", "role": "Cape / quiver / backpack"},
        },
        "bones": bones_spec,
        "structuralCapsules": structural_capsules,
    }
    OUT_SKELETON_SPEC.write_text(json.dumps(skeleton_spec, indent=2), encoding="utf-8")

    # 2. Build merged pure skeleton + compacted 85 clips GLB & full Animation Catalog
    # Start clean GLB node list with only the 65 joints in exact UAL order (0..64) + Armature root (65)
    old_to_new_node = {}
    new_nodes = []
    for i, old_idx in enumerate(joints_u1):
        old_to_new_node[old_idx] = i

    for i, old_idx in enumerate(joints_u1):
        on = nodes_u1[old_idx]
        nd = {"name": on["name"]}
        if "translation" in on:
            nd["translation"] = on["translation"]
        if "rotation" in on:
            nd["rotation"] = on["rotation"]
        if "scale" in on:
            nd["scale"] = on["scale"]
        ch = [old_to_new_node[c] for c in on.get("children", []) if c in old_to_new_node]
        if ch:
            nd["children"] = ch
        new_nodes.append(nd)

    armature_idx = len(new_nodes)
    root_new_idx = old_to_new_node[64]  # 'root' node
    new_nodes.append({"name": "Armature", "children": [root_new_idx]})

    new_bin = bytearray()
    new_buffer_views = []
    new_accessors = []

    def append_accessor(floats_flat, count, acc_type, calc_minmax=False):
        while len(new_bin) % 4 != 0:
            new_bin.append(0)
        byte_offset = len(new_bin)
        raw = struct.pack(f"<{len(floats_flat)}f", *floats_flat)
        new_bin.extend(raw)
        bv_idx = len(new_buffer_views)
        new_buffer_views.append({
            "buffer": 0,
            "byteOffset": byte_offset,
            "byteLength": len(raw),
        })
        acc = {
            "bufferView": bv_idx,
            "componentType": 5126,
            "count": count,
            "type": acc_type,
        }
        if calc_minmax and acc_type == "SCALAR" and count > 0:
            acc["min"] = [min(floats_flat)]
            acc["max"] = [max(floats_flat)]
        acc_idx = len(new_accessors)
        new_accessors.append(acc)
        return acc_idx

    def is_constant_sequence(vals, eps=1e-4):
        if len(vals) <= 2:
            return True
        first = vals[0]
        if isinstance(first, list):
            for v in vals[1:]:
                if max(abs(a - b) for a, b in zip(first, v)) > eps:
                    return False
        else:
            for v in vals[1:]:
                if abs(first - v) > eps:
                    return False
        return True

    tag_by_clip = {}
    for full_k, tags in animtags.items():
        lib_src, clip_nm = full_k.split("/", 1)
        tag_by_clip[(lib_src.replace("_Source", ""), clip_nm)] = tags
        tag_by_clip.setdefault(clip_nm, tags)

    catalog_clips = []
    new_animations = []
    seen_names = set()
    time_accessor_cache = {}

    for lib_name, src_gltf, src_bin in [("UAL1", u1, u1_bin), ("UAL2", u2, u2_bin)]:
        src_nodes = src_gltf["nodes"]
        name_to_new_idx = {new_nodes[i]["name"]: i for i in range(65)}

        for anim in src_gltf.get("animations", []):
            aname = anim["name"]
            if aname in seen_names:
                continue
            seen_names.add(aname)

            # Group channels by node + path
            anim_samplers = anim["samplers"]
            new_samplers = []
            new_channels = []
            max_dur = 0.0
            tracks_kept = 0
            tracks_dropped_const_scale = 0

            for ch in anim["channels"]:
                target_node_old = ch["target"].get("node")
                if target_node_old is None:
                    continue
                bname = src_nodes[target_node_old]["name"]
                if bname not in name_to_new_idx:
                    continue
                path = ch["target"]["path"]
                smp = anim_samplers[ch["sampler"]]
                times = read_accessor_floats(src_gltf, src_bin, smp["input"])
                values = read_accessor_floats(src_gltf, src_bin, smp["output"])
                if not times or not values:
                    continue
                max_dur = max(max_dur, float(times[-1]))

                # Drop redundant constant identity scale tracks (saves ~33% of file size safely)
                if path == "scale" and is_constant_sequence(values) and all(abs(c - 1.0) < 1e-3 for c in values[0]):
                    tracks_dropped_const_scale += 1
                    continue

                # Compact constant tracks (e.g., static finger curls) to 2 keyframes [t0, tEnd]
                if is_constant_sequence(values) and len(times) > 2:
                    times = [times[0], times[-1]]
                    values = [values[0], values[-1]]

                tkey = tuple(round(float(t), 5) for t in times)
                if tkey not in time_accessor_cache:
                    time_accessor_cache[tkey] = append_accessor([float(t) for t in times], len(times), "SCALAR", True)
                in_acc = time_accessor_cache[tkey]

                flat_vals = []
                for v in values:
                    flat_vals.extend(v if isinstance(v, list) else [v])
                acc_type = {"translation": "VEC3", "rotation": "VEC4", "scale": "VEC3"}.get(path, "SCALAR")
                out_acc = append_accessor(flat_vals, len(values), acc_type, False)

                smp_idx = len(new_samplers)
                new_samplers.append({
                    "input": in_acc,
                    "interpolation": smp.get("interpolation", "LINEAR"),
                    "output": out_acc,
                })
                new_channels.append({
                    "sampler": smp_idx,
                    "target": {"node": name_to_new_idx[bname], "path": path},
                })
                tracks_kept += 1

            new_animations.append({
                "name": aname,
                "samplers": new_samplers,
                "channels": new_channels,
            })

            clip_tags = tag_by_clip.get((lib_name, aname)) or tag_by_clip.get(aname) or []
            if aname == "A_TPose":
                clip_tags = ["tpose", "bind", "reference"]
            elif aname == "ClimbUp_1m":
                clip_tags = ["climbing", "parkour", "ledge", "1meter", "traverse", "movement"]
            elif aname == "Shield_Dash":
                clip_tags = ["combat", "shield", "dash", "attack", "movement"]
            elif aname == "Sword_Dash":
                clip_tags = ["combat", "sword", "dash", "attack", "movement"]

            is_loop = aname.endswith("_Loop") or aname in ("Sword_Idle", "Driving_Loop", "Fixing_Kneeling")
            catalog_clips.append({
                "name": aname,
                "library": lib_name,
                "category": classify_category(aname, clip_tags),
                "durationSec": round(max_dur, 4),
                "loop": is_loop,
                "playable": True,
                "rootMotionAvailable": True,
                "tags": clip_tags,
                "tracks": tracks_kept,
            })

    # Include full AnimViewer 260-clip taxonomy index (marking Standard playable vs Source-tier)
    animviewer_all = []
    for full_k, tags in sorted(animtags.items()):
        lib_src, cname = full_k.split("/", 1)
        lib_short = lib_src.replace("_Source", "")
        if cname.endswith("_RM"):
            continue
        animviewer_all.append({
            "name": cname,
            "library": lib_short,
            "category": classify_category(cname, tags),
            "tags": tags,
            "includedInStandard": cname in seen_names,
        })

    catalog_doc = {
        "schemaVersion": "1.0.0",
        "source": "Quaternius UAL 1 & UAL 2 [Standard] + quaternius.com/animviewer.html",
        "playableCount": len(catalog_clips),
        "animViewerTotalTaxonomy": len(animviewer_all),
        "categories": [
            "All",
            "Locomotion",
            "Combat & Combos",
            "Parkour & Traversal",
            "Work & Interaction",
            "Zombie",
            "Emotes & Stances",
        ],
        "presets": {
            "rpg_core": ["Idle_Loop", "Walk_Loop", "Jog_Fwd_Loop", "Sprint_Loop", "Jump_Start", "Jump_Loop", "Jump_Land", "Sword_Idle", "Sword_Regular_A", "Sword_Regular_B", "Sword_Regular_Combo", "Sword_Block", "Hit_Chest", "Death01"],
            "parkour": ["Idle_Loop", "Jog_Fwd_Loop", "Sprint_Loop", "Roll", "ClimbUp_1m", "Slide_Start", "Slide_Loop", "Slide_Exit", "NinjaJump_Start", "NinjaJump_Idle_Loop", "NinjaJump_Land"],
            "npc_work": ["Idle_Loop", "Idle_Talking_Loop", "Walk_Carry_Loop", "Farm_PlantSeed", "Farm_Watering", "Farm_Harvest", "TreeChopping_Loop", "Fixing_Kneeling", "Sitting_Enter", "Sitting_Idle_Loop", "Chest_Open"],
            "zombie": ["Zombie_Idle_Loop", "Zombie_Walk_Fwd_Loop", "Zombie_Scratch", "Hit_Knockback", "Death01"],
        },
        "playableClips": catalog_clips,
        "animViewerCatalog": animviewer_all,
    }
    OUT_ANIM_CATALOG.write_text(json.dumps(catalog_doc, indent=2), encoding="utf-8")

    # Assemble binary GLB
    out_gltf = {
        "asset": {"version": "2.0", "generator": "Pixelizer3D-UAL-MasterCompiler"},
        "scene": 0,
        "scenes": [{"name": "UAL_Master_Scene", "nodes": [armature_idx]}],
        "nodes": new_nodes,
        "buffers": [{"byteLength": len(new_bin)}],
        "bufferViews": new_buffer_views,
        "accessors": new_accessors,
        "animations": new_animations,
    }
    json_bytes = json.dumps(out_gltf, separators=(",", ":")).encode("utf-8")
    while len(json_bytes) % 4 != 0:
        json_bytes += b" "
    while len(new_bin) % 4 != 0:
        new_bin.append(0)

    total_len = 12 + 8 + len(json_bytes) + 8 + len(new_bin)
    glb_bytes = bytearray()
    glb_bytes.extend(struct.pack("<III", 0x46546C67, 2, total_len))
    glb_bytes.extend(struct.pack("<II", len(json_bytes), 0x4E4F534A))
    glb_bytes.extend(json_bytes)
    glb_bytes.extend(struct.pack("<II", len(new_bin), 0x004E4942))
    glb_bytes.extend(new_bin)

    OUT_MASTER_GLB.write_bytes(bytes(glb_bytes))
    OUT_ATTR.write_text(
        "# Universal Animation Library 1 & 2 (CC0 1.0)\n\n"
        "- **Author:** Quaternius (Tomás Laulhé) — [quaternius.com](https://quaternius.com/animviewer.html)\n"
        "- **License:** Creative Commons Zero v1.0 Universal (CC0 1.0 Public Domain)\n"
        "- **Asset:** `ual_master_library.glb` combines the 65-bone canonical Quaternius Universal Humanoid Armature with all 85 unique clips from `UAL1_Standard.glb` (43) + `UAL2_Standard.glb` (42 extras).\n",
        encoding="utf-8",
    )

    print(f"Generated {OUT_SKELETON_SPEC}: {len(bones_spec)} bones")
    print(f"Generated {OUT_ANIM_CATALOG}: {len(catalog_clips)} playable clips, {len(animviewer_all)} viewer taxonomy entries")
    print(f"Generated {OUT_MASTER_GLB}: {len(glb_bytes) / 1024 / 1024:.2f} MB")


if __name__ == "__main__":
    main()
