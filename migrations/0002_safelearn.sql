create table if not exists courses (
  id            serial primary key,
  slug          text not null unique,
  title         text not null,
  subtitle      text not null,
  description   text not null,
  audience      text not null,
  price_ghs     integer not null,
  duration_label text not null,
  lesson_count  integer not null,
  is_published  boolean not null default true,
  coming_soon   boolean not null default false
);

create table if not exists lessons (
  id            serial primary key,
  course_id     integer not null references courses(id) on delete cascade,
  slug          text not null,
  title         text not null,
  summary       text not null,
  duration_min  integer not null,
  sort_order    integer not null,
  content       text not null,
  unique (course_id, slug)
);

create table if not exists enrollments (
  id            serial primary key,
  user_id       text not null,
  course_id     integer not null references courses(id) on delete cascade,
  status        text not null default 'pending',
  created_at    timestamptz not null default now(),
  approved_at   timestamptz,
  unique (user_id, course_id)
);
create index if not exists enrollments_user_id_idx on enrollments (user_id);

create table if not exists payments (
  id            serial primary key,
  user_id       text not null,
  course_id     integer not null references courses(id) on delete cascade,
  enrollment_id integer not null references enrollments(id) on delete cascade,
  network       text not null,
  sender_name   text not null,
  momo_number   text not null,
  txn_id        text not null,
  notes         text,
  status        text not null default 'pending',
  created_at    timestamptz not null default now()
);
create index if not exists payments_user_id_idx on payments (user_id);
create index if not exists payments_status_idx on payments (status);

create table if not exists lesson_progress (
  user_id       text not null,
  lesson_id     integer not null references lessons(id) on delete cascade,
  completed_at  timestamptz,
  last_viewed_at timestamptz not null default now(),
  primary key (user_id, lesson_id)
);

create table if not exists admin_emails (
  email text primary key
);

insert into admin_emails (email)
values ('latifbright123@gmail.com')
on conflict (email) do nothing;

insert into courses (slug, title, subtitle, description, audience, price_ghs, duration_label, lesson_count, is_published, coming_soon)
values
(
  'arcgis-dss',
  'Decision Support with ArcGIS',
  'Turn spatial data into clear choices during disasters.',
  'A practical course for Fire Safety and Disaster Management students. You will learn how ArcGIS is used as a decision support system: prepare hazard and exposure layers, run suitability and network analysis, and present results that a command team can actually use.',
  'UENR · Fire Safety & Disaster Management · Level 200',
  50,
  '5 lessons',
  5,
  true,
  false
),
(
  'gis-fire-safety',
  'GIS for Fire Safety Planning',
  'Hydrants, access routes, and station coverage.',
  'A follow-on course covering fire-station coverage, hydrant mapping, and building-risk layers. Opening after the first ArcGIS DSS cohort.',
  'UENR · Fire Safety & Disaster Management · Level 300',
  50,
  'Coming later',
  0,
  true,
  true
)
on conflict (slug) do nothing;

insert into lessons (course_id, slug, title, summary, duration_min, sort_order, content)
select c.id, v.slug, v.title, v.summary, v.duration_min, v.sort_order, v.content
from courses c
join (values
  (
    'arcgis-dss',
    'gis-as-dss',
    'GIS as a decision support system',
    'What a DSS actually does in an emergency operations room, and where ArcGIS sits in that workflow.',
    28,
    1,
    E'A decision support system (DSS) does not replace the incident commander. It organises evidence so a team can choose faster and explain why.\n\nIn disaster management the typical questions are spatial: Which communities flood first? Which clinic is still reachable? Where should we pre-position water tankers?\n\nArcGIS is useful here because it can hold many layers in one place — hazard, population, roads, facilities — and show them at the scale a briefing needs.\n\n## What you will be able to do\n\n- Name the three inputs every DSS map needs: hazard, exposure, and capacity.\n- Separate data layers from the decision the map is meant to support.\n- Set a simple map purpose before you open ArcGIS.\n\n## The DSS loop\n\n1. Frame the decision in one sentence (example: “Where do we open two extra shelters tonight?”).\n2. List the layers that change that decision.\n3. Clean and project those layers to a shared coordinate system.\n4. Analyse (overlay, buffer, network, suitability).\n5. Brief: one map, one table, one recommendation.\n\nIf a layer does not change the decision, leave it off the map. Clutter is the enemy of an operations brief.\n\n## Practice\n\nWrite a one-sentence decision for a flood in your home district. Then list five layers you would load first. Keep this list — later lessons will use it.'
  ),
  (
    'arcgis-dss',
    'prepare-layers',
    'Prepare hazard and exposure layers',
    'Projections, clipping, and field hygiene so analysis does not fail at the last hour.',
    36,
    2,
    E'Most GIS failures in class are not “the tool is hard”. They are messy data: mixed projections, unnamed fields, and layers that cover the whole country when you only need one district.\n\n## Before analysis\n\n- Confirm the coordinate system. For Ghana work, a projected system in metres is usually easier for buffers and distances than a geographic (lat/long) system.\n- Clip to the study area (district, catchment, or campus).\n- Check geometry (repair if needed) and delete empty records.\n- Give fields human names: `pop_2021` is better than `F12`.\n\n## Hazard vs exposure\n\nHazard describes the event (flood depth, fire weather, landslide susceptibility). Exposure describes what can be harmed (buildings, people, roads, water points). Keep them as separate layers. Mixing them too early hides the logic of your DSS.\n\n## A clean geodatabase habit\n\nCreate a file geodatabase for the course project with three feature datasets in your mind, even if you store them as feature classes:\n\n- `hazard`\n- `exposure`\n- `capacity` (fire stations, clinics, warehouses, hydrants)\n\nSave intermediate layers with dates in the name so you can roll back.\n\n## Practice\n\nIn ArcGIS: add a district boundary, clip a roads layer to it, and export a new feature class named `roads_study_area`. Screenshot your Contents pane — that is your first portfolio piece.'
  ),
  (
    'arcgis-dss',
    'suitability',
    'Suitability analysis for emergency sites',
    'Weighted overlay thinking for shelters, water points, and incident command posts.',
    40,
    3,
    E'Suitability analysis answers: “Of all the land we can use, which places are good enough for this function?”\n\nFor a temporary shelter you might want: dry ground, gentle slope, away from river buffers, close to a passable road, and not on a school exam block.\n\n## The method in plain language\n\n1. List criteria (must-have vs nice-to-have).\n2. Turn each criterion into a raster or scored polygon (0–1 or 1–5).\n3. Invert scales so “higher is always better”.\n4. Weight the criteria (they will not be equal — say so).\n5. Combine (weighted sum / overlay).\n6. Mask out no-go areas (floodway, fuel depot, steep cut).\n7. Rank the remaining sites and visit the top three if you can.\n\nArcGIS tools you will meet: Buffer, Erase/Difference, Overlay, Reclassify, Weighted Overlay or Raster Calculator, and Zonal Statistics.\n\n## Weights are a decision, not a secret\n\nIf slope is 40% of the score, write that in your report. A DSS that hides weights cannot be audited after a bad night.\n\n## Practice\n\nDesign a shelter suitability model with four criteria and weights that add to 100%. You do not need perfect data yet — the model design is the assignment.'
  ),
  (
    'arcgis-dss',
    'evacuation-network',
    'Network analysis for evacuation and access',
    'How road networks, barriers, and facilities change response time.',
    38,
    4,
    E'When a road floods, Euclidean “as the crow flies” buffers lie. Evacuation and fire access are network problems.\n\n## Build a usable network\n\n- Roads must connect (no dangling junctions where two lines almost touch).\n- One-way streets and bridges matter in towns.\n- Add a cost: length is the default; better is travel time.\n- Barriers: flooded segments, collapsed culverts, police cordons.\n\nIn ArcGIS this is the Network Analyst / routing family: closest facility, service area, origin-destination cost matrix.\n\n## Questions this lesson answers\n\n- Which communities are more than 30 minutes from a fire station on tonight’s network?\n- If the main bridge is closed, how does coverage change?\n- What is the ordered stop list for a water-tanker run?\n\n## Briefing tip\n\nShow two maps: “normal network” and “with barriers”. Decision makers understand a before/after pair faster than a single clever map.\n\n## Practice\n\nSketch (on paper or in GIS) a 15-minute service area around one fire station. Then remove one major road and redraw. Write two sentences on who loses coverage.'
  ),
  (
    'arcgis-dss',
    'ops-brief',
    'From analysis to an operations brief',
    'Package maps, a short table, and a recommendation a command team can use.',
    24,
    5,
    E'The last mile of a DSS is communication. A beautiful map that needs a ten-minute explanation will lose the room.\n\n## The one-page brief\n\n- Title that states the decision, not the software.\n- One locator map plus one analysis map.\n- A table of the top sites or communities (rank, name, population, access).\n- Assumptions and data date.\n- A single recommended action, and a fallback if the top site is unavailable.\n\n## Cartography that helps under stress\n\n- Fewer colours. Sequential for magnitude, not a rainbow.\n- Label only what the decision needs.\n- North arrow and scale — still required in class and in the field.\n- Export PDF and a PNG; do not rely on a live project file in the briefing tent.\n\n## After this course\n\nYou should be able to sit in ArcGIS, run a small analysis, and defend the result. That is the skill Level 200 needs — not memorising every ribbon button.\n\n## Practice\n\nBuild a one-page brief for your flood-shelter decision from Lesson 1. If you have paid access, mark each lesson complete as you finish the practice.'
  )
) as v(course_slug, slug, title, summary, duration_min, sort_order, content)
on c.slug = v.course_slug
on conflict do nothing;
