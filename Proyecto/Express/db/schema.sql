-- Esquema de la API Final (PostgreSQL / Supabase)

create table if not exists alumnos (
    id              serial primary key,
    nombre          text         not null check (char_length(nombre) >= 4),
    numero_control  varchar(10)  not null unique check (char_length(numero_control) between 6 and 10),
    edad            smallint     not null check (edad between 17 and 60),
    carrera         text         not null,
    created_at      timestamptz  not null default now()
);

alter table alumnos enable row level security;

-- Datos de ejemplo 
insert into alumnos (nombre, numero_control, edad, carrera)
values ('Valeria Segovia', '23100211', 21, 'Ingeniería en Sistemas Computacionales')
on conflict (numero_control) do nothing;
