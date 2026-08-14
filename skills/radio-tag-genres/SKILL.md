---
name: radio-tag-genres
description: Analyze and tag radio AutoDJ playlist tracks with musical genres. Given a playlist name or ID, fetches all tracks, infers the genre of each (metal, rock, orchestral, ambient, folk, dark, etc.) from title and artist, and adds the genre as a VOD label via the Infomaniak API. Preserves existing labels.
---

# Radio Tag Genres

Analyze and automatically tag all tracks in a radio AutoDJ playlist with musical genre labels using the Infomaniak API.

## Version: 1.0.0

## Prerequisites

- A valid Infomaniak API token in `~/.config/opencode/.env` (`INFOMANIAK_API_TOKEN=...`)
- Access to the Infomaniak Radio API (`/1/radios`) and VOD API (`/3/vod/media`)
- The radio product ID, station ID, and playlist ID to process

## Input

The user provides one of:
- **Playlist name** (e.g. "Final Fantasy XIV") — the skill resolves it to a playlist ID by listing all playlists
- **Playlist ID** directly (e.g. `1jijk03ul41za`)

Optionally:
- **Radio product ID** (default: auto-detect from the user's radios)
- **Station ID** (default: auto-detect from the radio's stations)

If the radio or station is not specified, the skill asks the user to choose.

## Process

### Step 1: Resolve IDs

If the user provides a playlist name, resolve it:

```bash
TOKEN=$(grep INFOMANIAK_API_TOKEN ~/.config/opencode/.env | cut -d= -f2)

# If radio_product_id not known, list all radios to find it
curl -s -H "Authorization: Bearer ${TOKEN}" \
  "https://api.infomaniak.com/1/radios?account_id={account_id}&with=stations"

# List all playlists for the station
curl -s -H "Authorization: Bearer ${TOKEN}" \
  "https://api.infomaniak.com/1/radios/{radio_product_id}/stations/{station_id}/autodj/playlists"
```

Match the playlist name to get the playlist ID.

### Step 2: Fetch all tracks

```bash
curl -s -H "Authorization: Bearer ${TOKEN}" \
  "https://api.infomaniak.com/1/radios/{radio_product_id}/stations/{station_id}/autodj/playlists/{playlist_id}/medias"
```

Each track has:
- `id` — VOD media ID (used for the label update)
- `title` — track title
- `artists` — list of artists
- `tags` — existing tags (to preserve)

### Step 3: Analyze and assign genres

For each track, infer the musical genre from the **title** and **artists**. Use the genre classification below as a reference, but adapt based on the actual content of the playlist.

#### Genre Taxonomy

| Genre | Description | Typical markers |
|-------|-------------|-----------------|
| `metal` | Heavy metal, progressive metal, symphonic metal | "Metal", aggressive boss themes, raid themes, distorted guitars, rapid tempo |
| `rock` | Rock, hard rock, alternative rock | Rock instruments, moderate energy, battle themes |
| `orchestral` | Orchestral, symphonic, epic | Full orchestra, strings, choir, majestic themes, title screens, story themes |
| `ambient` | Ambient, atmospheric, landscape | Field/zone themes, exploration, calm, atmospheric pads, nature sounds |
| `folk` | Folk, tribal, ethnic | Beast tribes, villages, acoustic, traditional instruments, cultural themes |
| `dark` | Dark, dungeon, atmospheric horror | Dungeons, ruins, horror, minor keys, dissonance, underground |
| `electronic` | Electronic, synth, EDM | Synthesizers, electronic beats, futuristic |
| `jazz` | Jazz, fusion | Brass, swing, improvisation |
| `classical` | Classical, baroque | Piano, strings, classical structure |
| `vocal` | Vocal, ballad, lyrical | Sung lyrics, emotional, ballad |
| `chiptune` | Chiptune, 8-bit, retro | Retro game music, NES-era, pixel art |

#### Inference Heuristics

Prioritize **artists** over **title** for genre detection — the same artist tends to produce consistent genres.

When the title contains keywords like:
- "Battle", "Boss", "Fight", "Combat" → likely `metal` or `rock` (check artist)
- "Theme", "Day", "Night", "Cave", "Forest", "Sea" → likely `ambient`
- "Dungeon", "Dark", "Void", "Shadow", "Dead", "Horror" → likely `dark`
- "Title Screen", "Intro", "Trailer", "Opening" → likely `orchestral`
- "Tribe", "Village", "Folk" → likely `folk`
- "Metal", "Steel", "Fiend", "Chaos" → likely `metal`

When multiple genres apply (e.g. "Dark orchestral"), assign the most dominant one. If truly ambiguous, assign up to 2 genres maximum.

**Context matters**: if the playlist is from a video game OST (e.g. Final Fantasy), the genres should reflect the actual musical style of each track, not just the surface-level title keywords. A track titled "Battle Theme" by an orchestral composer might still be `orchestral` if it uses orchestral instruments.

### Step 4: Apply tags via VOD API

For each track, PUT the full label set (existing + new genre):

```bash
curl -s -X PUT \
  -H "Authorization: Bearer ${TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{"labels":[{"name":"FFXIV"},{"name":"metal"}]}' \
  "https://api.infomaniak.com/3/vod/media/{media_id}/labels"
```

**Critical rules**:
- Always **preserve existing labels** (e.g. `FFXIV`, `FFRebirth`) — include them in the PUT body
- **Add** the new genre label(s) — do not replace existing ones
- If a genre label already exists on the media, **do not duplicate** it
- Rate limit: **1 request per second** (60 req/min) to respect API limits
- The PUT **replaces** the entire label set, so you must send ALL labels (existing + new)

### Step 5: Report

After processing, display a summary:

```
=== Playlist: {playlist_name} ===
Total tracks: {N}
Success: {X} | Errors: {Y}

| Genre | Tracks | % |
|-------|--------|---|
| metal | 14 | 17% |
| rock | 8 | 10% |
| ...

Tags added:
1. Track title -> genre1, genre2
2. ...
```

## Error Handling

- If a track's genre cannot be determined, default to the most common genre in the playlist
- If the VOD API returns an error for a specific media, log it and continue with the next track
- If the radio/station/playlist cannot be found, ask the user to clarify
- If the token is missing or invalid, direct the user to https://manager.infomaniak.com/v3/ng/accounts/token/list

## Example Usage

```
User: "Tag les genres de la playlist Final Fantasy XIV"
User: "Ajoute les tags de genre sur la playlist 1jijk03ul41za"
User: "Analyse et tag la playlist 'Final Fantasy VII' sur HimuraStream"
```

## API Reference

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/1/radios?account_id={id}&with=stations` | GET | List radios and stations |
| `/1/radios/{radio_id}/stations/{station_id}/autodj/playlists` | GET | List playlists |
| `/1/radios/{radio_id}/stations/{station_id}/autodj/playlists/{playlist_id}/medias` | GET | List tracks in playlist |
| `/3/vod/media/{media_id}/labels` | PUT | Update labels (tags) on a media |
