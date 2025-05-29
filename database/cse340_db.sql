-- Type: cse340_project

-- DROP TYPE IF EXISTS public.cse340_project;

CREATE TYPE public.cse340_project AS ENUM
    ('Client', 'Employee', 'Admin');

ALTER TYPE public.cse340_project
    OWNER TO cse340_db_1rob_user;
