alter table courses add column if not exists topic text not null default 'Disaster Management';
alter table lessons add column if not exists video_url text;

update courses set topic = 'GIS & Mapping' where slug = 'arcgis-dss';
update courses set topic = 'Fire Safety' where slug = 'gis-fire-safety';
